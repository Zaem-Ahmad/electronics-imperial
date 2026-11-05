import "server-only";
import { cache } from "react";
import { connection } from "next/server";
import { cooker } from "./product-data";
import { catalogMode } from "./catalog-mode";
import type { Product } from "./types";

export const getProducts = cache(async (): Promise<Product[]> => {
  // Resolve the mode per request so a build made in demo mode cannot cache demo
  // products after the deployment is switched to database mode.
  await connection();
  if (catalogMode(process.env.CATALOG_SOURCE) === "demo") return [cooker];
  // Database mode reads at request time, never at build time or from a demo fallback.
  const { getDb } = await import("./db");
  return getDb().product.findMany({
    where: { active: true },
    orderBy: { title: "asc" },
  });
});

export const getProduct = cache(async (slug: string) => {
  const products = await getProducts();
  return products.find((product) => product.slug === slug) ?? null;
});
