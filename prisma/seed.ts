import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { seedCooker } from "./seed-product";

if (!process.env.DIRECT_URL)
  throw new Error("Set DIRECT_URL before seeding the catalog.");
const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DIRECT_URL }),
});
try {
  await seedCooker(db);
  console.log("Electric Ceramic Cooker seeded successfully.");
} finally {
  await db.$disconnect();
}
