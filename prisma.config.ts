import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node --import tsx prisma/seed.ts",
  },
  // Generation and local demo builds do not need a live database.
  // Migration/seed commands require a real DIRECT_URL.
  datasource: {
    url:
      process.env.DIRECT_URL ||
      "postgresql://unconfigured:unconfigured@localhost:5432/imperial",
  },
});
