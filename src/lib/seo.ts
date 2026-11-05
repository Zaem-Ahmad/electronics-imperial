import type { Metadata } from "next";
import { siteConfig } from "./site-config";

export function publicSiteUrl(
  value = process.env.SITE_URL,
): string | undefined {
  if (!value?.trim()) return undefined;
  const url = new URL(value.trim());
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      "SITE_URL must be an HTTP(S) origin without credentials, a path, query, or fragment.",
    );
  }
  return url.origin;
}

// Vercel provides the stable production domain, including on preview builds.
// SITE_URL remains an explicit override for custom domains or other hosts.
export const siteUrl = publicSiteUrl(
  process.env.SITE_URL?.trim() ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined),
);
export const indexable =
  Boolean(siteUrl) &&
  process.env.SITE_INDEXABLE !== "false" &&
  process.env.VERCEL_ENV !== "preview";
export const defaultDescription =
  "Discover the Electric Ceramic Cooker from Electronics Imperial in Pakistan. Explore product photos, PKR pricing, and 1-year limited warranty coverage.";

export function absoluteUrl(path: string): string {
  return new URL(path, siteUrl || "http://localhost:3000").href;
}

export function pageMetadata(
  title: string,
  description: string,
  path: string,
  image = "/images/ecc_1.png",
): Metadata {
  const fullTitle = `${title} | ${siteConfig.name}`;
  return {
    title,
    description,
    alternates: siteUrl ? { canonical: absoluteUrl(path) } : undefined,
    openGraph: {
      title: fullTitle,
      description,
      siteName: siteConfig.name,
      type: "website",
      locale: "en_PK",
      url: siteUrl ? absoluteUrl(path) : undefined,
      images: [
        {
          url: image,
          alt: "Electric Ceramic Cooker from Electronics Imperial",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };
}

export function jsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
