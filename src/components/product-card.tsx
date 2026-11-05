import Image from "next/image";
import Link from "next/link";
import { money } from "@/lib/cart";
import type { Product } from "@/lib/types";
import { Icon } from "./icon";
import { QuickAdd } from "./product-controls";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <Link
        href={`/products/${product.slug}`}
        className="product-card-image"
        aria-label={`View ${product.title}`}
      >
        <span className="image-label">THE EVERYDAY EDIT</span>
        <Image
          src={product.images[0]}
          alt={product.title}
          width={1024}
          height={1024}
          sizes="(max-width: 700px) 90vw, 40vw"
        />
      </Link>
      <div className="product-card-body">
        <span className="eyebrow">A NEW KITCHEN ESSENTIAL</span>
        <Link href={`/products/${product.slug}`}>
          <h3>{product.title}</h3>
        </Link>
        <p className="product-card-description">
          From the first cup of tea to the last meal of the day. Make room for a
          simpler way to cook.
        </p>
        <p className="product-price">
          {money(product.pricePkr)}
          <span>PKR</span>
        </p>
        <p className="warranty-label">
          <Icon name="shield" />
          {product.shortDescription}
        </p>
        <div className="product-card-actions">
          <QuickAdd product={product} />
          <Link className="text-link" href={`/products/${product.slug}`}>
            Take a closer look
            <Icon name="arrow" />
          </Link>
        </div>
      </div>
    </article>
  );
}
