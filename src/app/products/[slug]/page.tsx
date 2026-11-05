import type { Metadata } from "next";
import { pageMetadata, siteUrl, absoluteUrl, jsonLd } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/catalog";
import { money } from "@/lib/cart";
import { Gallery } from "@/components/gallery";
import { Icon } from "@/components/icon";
import { ProductControls } from "@/components/product-controls";
import { Reviews } from "@/components/reviews";
import { Warranty } from "@/components/warranty";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product)
    return {
      title: "Product not found",
      robots: { index: false, follow: false },
    };
  return pageMetadata(
    product.title,
    `${product.title} in Pakistan — ${money(product.pricePkr)}. View product photos, 1-year limited warranty coverage, and ordering details.`,
    `/products/${product.slug}`,
    product.images[0],
  );
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.shortDescription,
    image: product.images.map(absoluteUrl),
    ...(siteUrl ? { url: absoluteUrl(`/products/${product.slug}`) } : {}),
    brand: { "@type": "Brand", name: "Electronics Imperial" },
    offers: {
      "@type": "Offer",
      priceCurrency: "PKR",
      price: product.pricePkr,
      ...(siteUrl
        ? {
            url: absoluteUrl(`/products/${product.slug}`),
            seller: { "@id": `${siteUrl}/#organization` },
          }
        : {}),
    },
  };
  return (
    <div className="container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(structuredData),
        }}
      />
      {siteUrl && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: absoluteUrl("/"),
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Our product",
                  item: absoluteUrl("/products"),
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: product.title,
                  item: absoluteUrl(`/products/${product.slug}`),
                },
              ],
            }),
          }}
        />
      )}
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/products">Our product</Link>
        <span>/</span>
        <span aria-current="page">{product.title}</span>
      </nav>
      <section className="product-detail">
        <Gallery images={product.images} title={product.title} />
        <div className="product-info">
          <p className="eyebrow">YOUR EVERYDAY KITCHEN COMPANION</p>
          <h1>{product.title}</h1>
          <p className="detail-description">
            A little heat for your daily rituals. A simple addition to your
            kitchen, with peace of mind built in.
          </p>
          <div className="detail-price">
            <strong>{money(product.pricePkr)}</strong>
            <span>PKR</span>
          </div>
          <p className="warranty-label">
            <Icon name="shield" />
            {product.shortDescription}
          </p>
          <ProductControls product={product} />
          <div className="product-facts">
            <div>
              <Icon name="shield" />
              <span>
                <strong>Support that stays with you</strong>1-year coverage for
                eligible manufacturing and functional defects.
              </span>
            </div>
            <div>
              <Icon name="chat" />
              <span>
                <strong>Know before you buy</strong>Read the full warranty,
                including glass and accidental-damage exclusions.
              </span>
            </div>
          </div>
          <a href="#warranty" className="text-link">
            Explore the warranty
            <Icon name="arrow" />
          </a>
        </div>
      </section>
      <Warranty description={product.description} />
      <Reviews key={product.id} />
    </div>
  );
}
