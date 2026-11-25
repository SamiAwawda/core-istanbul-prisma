import { createApp } from "./app.ts";
import prisma from "./lib/prisma.ts";

const port = Number(process.env.PORT ?? 3000);
const server = createApp().listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});

async function shutdown() {
  server.close();
  await prisma.$disconnect();
  process.exit(0);
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
