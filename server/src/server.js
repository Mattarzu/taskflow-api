import "dotenv/config";
import app from "./app.js";
import { prisma } from "../prisma/client.js";

const requiredEnv = ["DATABASE_URL", "JWT_SECRET"];
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Falta la variable de entorno ${key}`);
    process.exit(1);
  }
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`🟢 Server corriendo en puerto ${PORT}`);
});

// Graceful shutdown para cerrar server y Prisma
const shutdown = async (signal) => {
  console.log(`Recibido ${signal}, cerrando...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));


