import { Server } from "@hocuspocus/server";

const HOCUSPOCUS_PORT = parseInt(process.env.HOCUSPOCUS_PORT ?? "3001", 10);

const server = new Server({
  port: HOCUSPOCUS_PORT,
  name: "pulseboard-collaboration",
  timeout: 30000,

  async onConnect({ documentName }) {
    console.log(`[Hocuspocus] Connected to document: ${documentName}`);
    return {};
  },

  async onDisconnect({ documentName }) {
    console.log(`[Hocuspocus] Disconnected from document: ${documentName}`);
  },

  async onStoreDocument({ documentName }) {
    console.log(`[Hocuspocus] Storing document: ${documentName}`);
  },

  async onLoadDocument({ documentName }) {
    console.log(`[Hocuspocus] Loading document: ${documentName}`);
    return {};
  },
});

server.listen().then(() => {
  console.log(`[Hocuspocus] Server listening on port ${HOCUSPOCUS_PORT}`);
});
