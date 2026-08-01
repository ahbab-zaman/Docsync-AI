import { Server } from "@hocuspocus/server";
import { logger } from "../src/lib/logger";

const HOCUSPOCUS_PORT = parseInt(process.env.HOCUSPOCUS_PORT ?? "3001", 10);

const server = new Server({
  port: HOCUSPOCUS_PORT,
  name: "pulseboard-collaboration",
  timeout: 30000,

  async onConnect() {
    logger.info("[Hocuspocus] Document connected", {
      action: "hocuspocus:connect",
      status: "success",
    });
    return {};
  },

  async onDisconnect() {
    logger.info("[Hocuspocus] Document disconnected", {
      action: "hocuspocus:disconnect",
      status: "success",
    });
  },

  async onStoreDocument() {
    logger.info("[Hocuspocus] Document stored", {
      action: "hocuspocus:store",
      status: "success",
    });
  },

  async onLoadDocument() {
    logger.info("[Hocuspocus] Document loaded", {
      action: "hocuspocus:load",
      status: "success",
    });
    return {};
  },
});

server.listen().then(() => {
  logger.info("[Hocuspocus] Server listening", {
    action: "hocuspocus:listen",
    status: "success",
  });
});
