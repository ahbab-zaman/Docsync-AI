import { Pool, QueryResult, QueryResultRow } from "pg";

type QueryFn = <T extends QueryResultRow>(
  text: string,
  params?: unknown[]
) => Promise<QueryResult<T>>;

let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
  }
  return pool;
}

export async function query<T extends QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  const client = getPool();
  try {
    return await client.query<T>(text, params);
  } catch (error) {
    console.error("[DB] Query failed:", error);
    throw new Error("Database query failed");
  }
}

export async function transaction<T>(
  fn: (query: QueryFn) => Promise<T>
): Promise<T> {
  const client = getPool();
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
    await conn.query("ROLLBACK");
    console.error("[DB] Transaction failed:", error);
    throw new Error("Database transaction failed");
  } finally {
    conn.release();
  }
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
