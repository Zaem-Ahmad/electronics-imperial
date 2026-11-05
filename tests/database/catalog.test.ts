import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../src/generated/prisma/client";
import { cooker } from "../../src/lib/product-data";
import { seedCooker } from "../../prisma/seed-product";

const migration = await readFile(
  new URL(
    "../../prisma/migrations/20261026000000_product_catalog/migration.sql",
    import.meta.url,
  ),
  "utf8",
);

test("migration creates a usable catalog with price, slug, image-order, and RLS constraints", async () => {
  const db = await PGlite.create();
  try {
    await db.exec(migration);
    await db.query(
      'INSERT INTO "Product" (id, slug, title, "pricePkr", "shortDescription", description, images) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [
        cooker.id,
        cooker.slug,
        cooker.title,
        cooker.pricePkr,
        cooker.shortDescription,
        cooker.description,
        cooker.images,
      ],
    );
    const { rows } = await db.query<typeof cooker>(
      'SELECT * FROM "Product" WHERE active = true',
    );
    assert.equal(rows.length, 1);
    assert.equal(rows[0].pricePkr, 10000);
    assert.deepEqual(rows[0].images, cooker.images);
    assert.equal(rows[0].description, cooker.description);
    await assert.rejects(
      db.query('UPDATE "Product" SET "pricePkr" = -1'),
      /check constraint/,
    );
    await assert.rejects(
      db.query(
        'INSERT INTO "Product" SELECT \'duplicate\', slug, title, "pricePkr", "shortDescription", description, images, active FROM "Product"',
      ),
      /unique constraint/,
    );
    await db.exec(
      'CREATE ROLE storefront_visitor; GRANT USAGE ON SCHEMA public TO storefront_visitor; GRANT SELECT ON "Product" TO storefront_visitor; SET ROLE storefront_visitor;',
    );
    const anonymous = await db.query('SELECT * FROM "Product"');
    assert.deepEqual(anonymous.rows, []);
    await db.exec("RESET ROLE;");
  } finally {
    await db.close();
  }
});

test(
  "Prisma seed is repeatable through the PostgreSQL adapter",
  { skip: process.env.RUN_PRISMA_SOCKET_TESTS !== "true", timeout: 30000 },
  async () => {
    const db = await PGlite.create();
    await db.exec(migration);
    const server = new PGLiteSocketServer({ db, port: 0, host: "127.0.0.1" });
    await server.start();
    const client = new PrismaClient({
      adapter: new PrismaPg({
        connectionString: `postgresql://postgres:postgres@${server.getServerConn()}/postgres`,
        max: 1,
      }),
    });
    try {
      await seedCooker(client);
      await seedCooker(client);
      const products = await client.product.findMany({
        where: { active: true },
      });
      assert.equal(products.length, 1);
      assert.deepEqual(products[0], cooker);
      await client.product.update({
        where: { slug: cooker.slug },
        data: { pricePkr: 12000 },
      });
      await seedCooker(client);
      assert.equal(
        (
          await client.product.findUniqueOrThrow({
            where: { slug: cooker.slug },
          })
        ).pricePkr,
        10000,
      );
    } finally {
      await client.$disconnect();
      await server.stop();
      await db.close();
    }
  },
);
