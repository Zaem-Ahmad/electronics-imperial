import { pageMetadata } from "@/lib/seo";
import { getProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";
import { SupportBanner } from "@/components/support-banner";

export const metadata = pageMetadata(
  "Explore Our Electric Ceramic Cooker",
  "Explore the Electronics Imperial Electric Ceramic Cooker. View current prices in PKR, product photos, and details of the 1-year limited warranty.",
  "/products",
);

export default async function ProductsPage() {
  const products = await getProducts();
  return (
    <div className="container">
      <section className="page-intro">
        <p className="eyebrow">THE EVERYDAY COLLECTION</p>
        <h1>
          A good place
          <br />
          to <span>start.</span>
        </h1>
        <p>
          Thoughtfully chosen. Simply useful. Discover an essential
          <br className="desktop-break" /> that makes a little more room for
          everyday living.
        </p>
      </section>
      <section className="catalog-section" aria-label="Products">
        <div className="catalog-heading">
          <span>
            {products.length}{" "}
            {products.length === 1 ? "essential" : "essentials"}, thoughtfully
            selected
          </span>
          <span>PRICES IN PKR</span>
        </div>
        {products.length ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="empty-catalog">
            <h2>Our collection is being updated.</h2>
            <p>Please check back soon.</p>
          </div>
        )}
      </section>
      <SupportBanner />
    </div>
  );
}
