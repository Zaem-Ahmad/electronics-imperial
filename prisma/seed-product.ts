import type { PrismaClient } from "../src/generated/prisma/client";
import { cooker } from "../src/lib/product-data";

export async function seedCooker(db: PrismaClient) {
  const { id, ...data } = cooker;
  return db.product.upsert({
    where: { slug: cooker.slug },
    update: data,
    create: { id, ...data },
  });
}
