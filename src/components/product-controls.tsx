"use client";

import { useState } from "react";
import {
  MAX_QUANTITY,
  validQuantity,
  whatsappOrderUrl,
  resolveCart,
} from "@/lib/cart";
import { siteConfig } from "@/lib/site-config";
import type { Product } from "@/lib/types";
import { useStore } from "./store-provider";
import { Icon } from "./icon";

function useWhatsAppPurchase(product: Product, quantity: number) {
  const store = useStore();
  const lines = resolveCart(store.entries, store.products);
  const existing = lines.find((line) => line.id === product.id);
  const nextQuantity = (existing?.quantity || 0) + quantity;
  const canOrder =
    store.ready &&
    !store.catalogError &&
    product.active &&
    validQuantity(quantity) &&
    validQuantity(nextQuantity);
  const nextLines = existing
    ? lines.map((line) =>
        line.id === product.id ? { ...line, quantity: nextQuantity } : line,
      )
    : [...lines, { id: product.id, quantity, product }];
  const url = canOrder
    ? whatsappOrderUrl(siteConfig.whatsappNumber, nextLines)
    : null;
  function purchase() {
    if (!url) return;
    store.add(product, quantity);
    window.open(url, "_blank", "noopener,noreferrer");
  }
  return { purchase, canOrder, nextQuantity };
}

export function QuickAdd({ product }: { product: Product }) {
  const { purchase, canOrder } = useWhatsAppPurchase(product, 1);
  return (
    <button
      type="button"
      className="button button-primary"
      disabled={!canOrder}
      onClick={purchase}
    >
      Quick add
      <Icon name="plus" />
    </button>
  );
}

export function ProductControls({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState("1");
  const amount = Number(quantity);
  const valid = validQuantity(amount);
  const { purchase, canOrder, nextQuantity } = useWhatsAppPurchase(
    product,
    amount,
  );
  const orderUrl = valid
    ? whatsappOrderUrl(siteConfig.whatsappNumber, [
        { id: product.id, quantity: amount, product },
      ])
    : null;
  return (
    <div className="product-controls">
      <label className="field-label" htmlFor="product-quantity">
        Quantity
      </label>
      <div className="purchase-row">
        <div className="quantity-control">
          <button
            type="button"
            aria-label="Decrease quantity"
            disabled={!valid || amount <= 1}
            onClick={() => setQuantity(String(amount - 1))}
          >
            <Icon name="minus" />
          </button>
          <input
            id="product-quantity"
            type="number"
            min="1"
            max={MAX_QUANTITY}
            step="1"
            inputMode="numeric"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            aria-invalid={!valid}
            aria-describedby={!valid ? "quantity-error" : undefined}
          />
          <button
            type="button"
            aria-label="Increase quantity"
            disabled={!valid || amount >= MAX_QUANTITY}
            onClick={() => setQuantity(String(amount + 1))}
          >
            <Icon name="plus" />
          </button>
        </div>
        <button
          type="button"
          className="button button-primary"
          disabled={!canOrder}
          onClick={purchase}
        >
          Add to bag
          <Icon name="bag" />
        </button>
      </div>
      {valid && nextQuantity > MAX_QUANTITY && (
        <p className="field-error">
          Your bag can contain up to {MAX_QUANTITY} of this item. Adjust the
          quantity in your bag before adding more.
        </p>
      )}
      {!valid && (
        <p className="field-error" id="quantity-error">
          Choose a whole number from 1 to {MAX_QUANTITY}.
        </p>
      )}
      {orderUrl ? (
        <a
          className="button button-outline button-full"
          href={orderUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Order on WhatsApp
          <Icon name="chat" />
        </a>
      ) : (
        <p className="ordering-note">
          <Icon name="chat" />
          {siteConfig.whatsappNumber
            ? "Choose a valid quantity to order."
            : "WhatsApp ordering coming soon."}
        </p>
      )}
    </div>
  );
}
