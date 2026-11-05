import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { imperialDb?: PrismaClient };

export function getDb() {
  if (globalForPrisma.imperialDb) return globalForPrisma.imperialDb;
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "Database catalog requires DATABASE_URL. Configure Supabase or select demo mode.",
    );
  }
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
    max: 5,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
  });
  const db = new PrismaClient({ adapter });
  globalForPrisma.imperialDb = db;
  return db;
}
