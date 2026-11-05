"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  cartTotal,
  MAX_QUANTITY,
  money,
  resolveCart,
  whatsappOrderUrl,
} from "@/lib/cart";
import { navigation, siteConfig } from "@/lib/site-config";
import { Icon } from "./icon";
import { Drawer } from "./dialog";
import { ThemeToggle } from "./theme-toggle";
import { useStore } from "./store-provider";

export function Brand() {
  return (
    <Link className="brand" href="/" aria-label="Electronics Imperial home">
      <span>
        ELECTRONICS<span className="brand-dot">.</span>
      </span>
      <small>IMPERIAL</small>
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const [panel, setPanel] = useState<"cart" | "menu" | null>(null);
  const store = useStore();
  const lines = resolveCart(store.entries, store.products);
  const count = lines.reduce((sum, item) => sum + item.quantity, 0);
  const orderUrl = whatsappOrderUrl(siteConfig.whatsappNumber, lines);
  const active = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <div className="announcement">
        <span>Good things start at home.</span>
        <span className="announcement-detail">
          Thoughtful essentials. Everyday confidence.
        </span>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <Brand />
          <nav className="desktop-nav" aria-label="Main navigation">
            {navigation.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active(link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
            {siteConfig.catalogNavigation && (
              <Link href="/products">All products</Link>
            )}
          </nav>
          <div className="header-actions">
            <ThemeToggle />
            <span className="header-divider" />
            <button
              type="button"
              className="cart-trigger"
              aria-label={`Open cart, ${count} items`}
              onClick={() => setPanel("cart")}
            >
              <Icon name="bag" />
              <span className="cart-label">Bag</span>
              <span className="cart-count">{count}</span>
            </button>
            <button
              type="button"
              className="icon-button mobile-menu-button"
              aria-label="Open menu"
              onClick={() => setPanel("menu")}
            >
              <Icon name="menu" />
            </button>
          </div>
        </div>
      </header>
      <Drawer
        open={panel === "menu"}
        onClose={() => setPanel(null)}
        title="Menu"
      >
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {navigation.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setPanel(null)}
              aria-current={active(link.href) ? "page" : undefined}
            >
              {link.label}
              <Icon name="arrow" />
            </Link>
          ))}
        </nav>
        <p className="muted">A little more ease. Every day.</p>
      </Drawer>
      <Drawer
        open={panel === "cart"}
        onClose={() => setPanel(null)}
        title="Your bag"
      >
        {store.catalogError ? (
          <div className="empty-cart">
            <h3>Your bag is temporarily unavailable.</h3>
            <p>
              We couldn’t load the latest product details. Please refresh and
              try again.
            </p>
          </div>
        ) : !lines.length ? (
          <div className="empty-cart">
            <Icon name="bag" width="48" height="48" />
            <h3>A little room for something good.</h3>
            <p>Your bag is currently empty.</p>
            <Link
              className="button button-primary"
              href="/products"
              onClick={() => setPanel(null)}
            >
              Explore our product
              <Icon name="arrow" />
            </Link>
          </div>
        ) : (
          <>
            <p className="eyebrow muted">
              {count} {count === 1 ? "item" : "items"} in your bag
            </p>
            <div className="cart-lines">
              {lines.map(({ product, quantity }) => (
                <article className="cart-line" key={product.id}>
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    width={100}
                    height={100}
                  />
                  <div>
                    <Link
                      href={`/products/${product.slug}`}
                      onClick={() => setPanel(null)}
                    >
                      {product.title}
                    </Link>
                    <p>{money(product.pricePkr)}</p>
                    <div className="cart-line-controls">
                      <div className="quantity-control">
                        <button
                          type="button"
                          aria-label={`Decrease ${product.title} quantity`}
                          disabled={quantity === 1}
                          onClick={() =>
                            store.setQuantity(product.id, quantity - 1)
                          }
                        >
                          <Icon name="minus" />
                        </button>
                        <span aria-label="Cart quantity">{quantity}</span>
                        <button
                          type="button"
                          aria-label={`Increase ${product.title} quantity`}
                          disabled={quantity === MAX_QUANTITY}
                          onClick={() =>
                            store.setQuantity(product.id, quantity + 1)
                          }
                        >
                          <Icon name="plus" />
                        </button>
                      </div>
                      <button
                        className="text-button muted"
                        type="button"
                        onClick={() => store.remove(product.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="cart-summary">
              <div>
                <span>Subtotal</span>
                <strong>{money(cartTotal(lines))}</strong>
              </div>
              <p>Delivery and payment details are confirmed when you order.</p>
              {orderUrl ? (
                <a
                  href={orderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button button-primary button-full"
                >
                  Order on WhatsApp
                  <Icon name="arrow" />
                </a>
              ) : (
                <>
                  <button
                    type="button"
                    className="button button-primary button-full"
                    disabled
                  >
                    WhatsApp ordering coming soon
                  </button>
                  <p className="small">
                    You can keep items in your bag while ordering becomes
                    available.
                  </p>
                </>
              )}
            </div>
          </>
        )}
      </Drawer>
    </>
  );
}
