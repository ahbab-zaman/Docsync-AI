import { readFileSync } from "fs";
import { join } from "path";
import { Pool, QueryResult, QueryResultRow } from "pg";

type QueryFn = <T extends QueryResultRow>(
  text: string,
  params?: unknown[]
) => Promise<QueryResult<T>>;

let pool: Pool | null = null;
let initPromise: Promise<void> | null = null;
let dbAvailable = true;

const MAX_RETRIES = 2;
const BASE_RETRY_MS = 1000;

function isRetryable(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const msg = error.message;
  return (
    msg.includes("timeout") ||
    msg.includes("Connection terminated") ||
    msg.includes("ECONNRESET") ||
    msg.includes("socket hang up") ||
    msg.includes("ETIMEDOUT") ||
    msg.includes("ENOTFOUND") ||
    msg.includes("EPIPE") ||
    msg.includes("password authentication failed")
  );
}

async function ensureSchema(p: Pool): Promise<void> {
  try {
    await p.query("SELECT 1 FROM users LIMIT 1");
  } catch {
    const schemaPath = join(process.cwd(), "src", "server", "schema.sql");
    const schema = readFileSync(schemaPath, "utf-8");
    await p.query(schema);
    console.log("[DB] Schema applied");
  }
}

function createPool(): Pool {
  const rawUrl = process.env.DATABASE_URL ?? "";
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    console.warn("[DB] Invalid DATABASE_URL, creating fallback pool");
    return new Pool({
      connectionString: rawUrl,
      max: 1,
      connectionTimeoutMillis: 5000,
    });
  }
  url.searchParams.delete("channel_binding");
  return new Pool({
    connectionString: url.toString(),
    max: 3,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 20000,
    ssl: { rejectUnauthorized: false },
  });
}

export async function ensureConnected(): Promise<boolean> {
  if (pool) return dbAvailable;

  const rawUrl = process.env.DATABASE_URL ?? "";
  if (!rawUrl) {
    console.warn("[DB] No DATABASE_URL configured, using mock/fallback data");
    dbAvailable = false;
    return false;
  }

  const probePool = new Pool({
    connectionString: rawUrl,
    max: 1,
    connectionTimeoutMillis: 3000,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await probePool.query("SELECT 1");
    console.log("[DB] Connection OK");
    await probePool.end();
    pool = createPool();
    pool.on("error", (err) => {
      console.error("[DB] Pool error:", err.message);
    });
    initPromise = ensureSchema(pool)
      .then(() => {
        dbAvailable = true;
        console.log("[DB] Database ready");
      })
      .catch((e) => {
        console.error("[DB] Schema init failed:", e.message);
        dbAvailable = false;
        initPromise = null;
      });
    return true;
  } catch {
    console.warn("[DB] Database unreachable (3s probe failed), using mock/fallback data");
    await probePool.end().catch(() => {});
    dbAvailable = false;
    return false;
  }
}

function getPool(): Pool {
  if (!pool) {
    pool = createPool();
    pool.on("error", (err) => {
      console.error("[DB] Pool error:", err.message);
    });
    initPromise = ensureSchema(pool)
      .then(() => {
        dbAvailable = true;
        console.log("[DB] Database ready");
      })
      .catch((e) => {
        console.error("[DB] Schema init failed:", e.message);
        console.warn("[DB] Database unavailable. App will use mock/fallback data.");
        dbAvailable = false;
        initPromise = null;
      });
  }
  return pool;
}

async function waitForInit(): Promise<void> {
  if (initPromise) {
    await initPromise;
  }
}

export function isDbAvailable(): boolean {
  return dbAvailable;
}

async function withRetry<T>(
  fn: () => Promise<T>,
  attempt = 1
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (isRetryable(error) && attempt < MAX_RETRIES) {
      const delay = BASE_RETRY_MS * Math.pow(2, attempt - 1);
      console.warn(`[DB] Retrying (attempt ${attempt + 1}/${MAX_RETRIES}) after ${delay}ms`);
      await new Promise((r) => setTimeout(r, delay));
      return withRetry(fn, attempt + 1);
    }
    throw error;
  }
}

export async function query<T extends QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  await waitForInit();
  if (!dbAvailable) {
    throw new Error("Database unavailable");
  }
  const client = getPool();
  return withRetry(async () => {
    return await client.query<T>(text, params);
  });
}

export async function transaction<T>(
  fn: (query: QueryFn) => Promise<T>
): Promise<T> {
  await waitForInit();
  if (!dbAvailable) {
    throw new Error("Database unavailable");
  }
  const client = getPool();
  return withRetry(async () => {
    const conn = await client.connect();
    try {
      await conn.query("BEGIN");
      const txQuery = async <R extends QueryResultRow>(
        text: string,
        params?: unknown[]
      ): Promise<QueryResult<R>> => {
        return conn.query<R>(text, params);
      };
      const result = await fn(txQuery);
      await conn.query("COMMIT");
      return result;
    } catch (error) {
      await conn.query("ROLLBACK").catch(() => {});
      throw error;
    } finally {
      conn.release();
    }
  });
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    initPromise = null;
  }
}

export async function healthCheck(): Promise<boolean> {
  try {
    await query("SELECT 1");
    return true;
  } catch {
    return false;
  }
}
