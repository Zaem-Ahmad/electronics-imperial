import type { Metadata } from "next";
import { siteUrl, indexable, defaultDescription, jsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { unstable_rethrow } from "next/navigation";
import { getProducts } from "@/lib/catalog";
import type { Product } from "@/lib/types";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { StoreProvider } from "@/components/store-provider";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";
import "./home.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl || "http://localhost:3000"),
  title: {
    default: "Electronics Imperial | Electric Ceramic Cooker in Pakistan",
    template: "%s | Electronics Imperial",
  },
  description: defaultDescription,
  robots: { index: indexable, follow: indexable },
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION || undefined },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let products: Product[] = [];
  let catalogError = false;
  try {
    products = await getProducts();
  } catch (error) {
    unstable_rethrow(error);
    // Keep informational pages and the shell available without inventing catalog data.
    catalogError = true;
    console.error(
      "Imperial catalog unavailable. Check server database configuration and connectivity.",
    );
  }
  return (
    <html lang="en-PK" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        {siteUrl && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: jsonLd({
                "@context": "https://schema.org",
                "@graph": [
                  {
                    "@type": "Organization",
                    "@id": `${siteUrl}/#organization`,
                    name: siteConfig.name,
                    url: siteUrl,
                  },
                  {
                    "@type": "WebSite",
                    "@id": `${siteUrl}/#website`,
                    name: siteConfig.name,
                    url: siteUrl,
                    inLanguage: "en-PK",
                    publisher: { "@id": `${siteUrl}/#organization` },
                  },
                ],
              }),
            }}
          />
        )}

        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <StoreProvider catalog={products} catalogError={catalogError}>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
