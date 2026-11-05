import type { MetadataRoute } from "next";
import { siteUrl, indexable } from "@/lib/seo";
import { getProducts } from "@/lib/catalog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!indexable || !siteUrl) return [];
  const base = siteUrl;
  const products = await getProducts();
  return [
    "",
    "/products",
    "/about",
    "/contact",
    ...products.map((product) => `/products/${product.slug}`),
  ].map((path) => ({ url: `${base}${path}` }));
}
