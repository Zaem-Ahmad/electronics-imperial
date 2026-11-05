import type { CartEntry, CartLine, Product } from "./types";

export const MAX_QUANTITY = 99;
export const CART_KEY = "imperial-cart-v1";

export function validQuantity(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= MAX_QUANTITY
  );
}

export function parseCart(value: string | null): CartEntry[] {
  try {
    const data: unknown = JSON.parse(value || "[]");
    if (!Array.isArray(data)) return [];
    const entries = new Map<string, number>();
    for (const item of data) {
      if (item && typeof item.id === "string" && validQuantity(item.quantity)) {
        entries.set(
          item.id,
          Math.min(MAX_QUANTITY, (entries.get(item.id) || 0) + item.quantity),
        );
      }
    }
    return Array.from(entries, ([id, quantity]) => ({ id, quantity }));
  } catch {
    return [];
  }
}

export function resolveCart(
  entries: CartEntry[],
  products: Product[],
): CartLine[] {
  return entries.flatMap((entry) => {
    const product = products.find(
      (item) => item.id === entry.id && item.active,
    );
    return product && validQuantity(entry.quantity)
      ? [{ ...entry, product }]
      : [];
  });
}

export function money(amount: number) {
  return `Rs ${amount.toLocaleString("en-PK")}`;
}

export function cartTotal(lines: CartLine[]) {
  return lines.reduce(
    (total, line) => total + line.product.pricePkr * line.quantity,
    0,
  );
}

export function whatsappOrderUrl(number: string, lines: CartLine[]) {
  if (!/^[1-9]\d{6,14}$/.test(number) || !lines.length) return null;
  const details = lines
    .map(
      ({ product, quantity }) =>
        `${product.title}\nQuantity: ${quantity}\nUnit price: ${money(product.pricePkr)}\nTotal: ${money(product.pricePkr * quantity)}`,
    )
    .join("\n\n");
  const count = lines.reduce((total, line) => total + line.quantity, 0);
  const message = `Hello Electronics Imperial! I’d like to order. ${count} ${count === 1 ? "item" : "items"} selected:\n\n${details}\n\nOrder total: ${money(cartTotal(lines))}\n\nPlease share your account number and order details, including delivery charges and payment instructions. Thank you!`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
