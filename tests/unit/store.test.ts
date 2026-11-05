import assert from "node:assert/strict";
import test from "node:test";
import {
  cartTotal,
  money,
  parseCart,
  resolveCart,
  validQuantity,
  whatsappOrderUrl,
} from "../../src/lib/cart";
import { catalogMode } from "../../src/lib/catalog-mode";
import { cooker } from "../../src/lib/product-data";
import { reviewError } from "../../src/lib/reviews";

test("cart storage tolerates malformed and unrelated input", () => {
  for (const raw of [
    null,
    "not JSON",
    "{}",
    "null",
    '[{"id":"x","quantity":-3}]',
  ])
    assert.deepEqual(parseCart(raw), []);
});

test("cart normalizes duplicate IDs and rejects invalid quantities", () => {
  assert.deepEqual(
    parseCart(
      JSON.stringify([
        { id: cooker.id, quantity: 80 },
        { id: cooker.id, quantity: 40 },
        { id: "bad", quantity: 1.5 },
        { id: "bad", quantity: "3" },
      ]),
    ),
    [{ id: cooker.id, quantity: 99 }],
  );
  for (const quantity of [0, -1, 100, 1.2, NaN, Infinity, "2"])
    assert.equal(validQuantity(quantity), false);
  for (const quantity of [1, 2, 99])
    assert.equal(validQuantity(quantity), true);
});

test("retired products are excluded and totals use current catalog prices", () => {
  const lines = resolveCart(
    [
      { id: cooker.id, quantity: 2 },
      { id: "old-headphones", quantity: 8 },
    ],
    [cooker],
  );
  assert.equal(lines.length, 1);
  assert.equal(cartTotal(lines), 20000);
  assert.equal(money(cartTotal(lines)), "Rs 20,000");
  assert.deepEqual(
    resolveCart(
      [{ id: cooker.id, quantity: 1 }],
      [{ ...cooker, active: false }],
    ),
    [],
  );
});

test("WhatsApp ordering requires a real destination and formats product/quantity/total", () => {
  const lines = resolveCart([{ id: cooker.id, quantity: 3 }], [cooker]);
  assert.equal(whatsappOrderUrl("", lines), null);
  assert.equal(whatsappOrderUrl("not-a-number", lines), null);
  assert.equal(whatsappOrderUrl("923339777207", []), null);
  const url = new URL(whatsappOrderUrl("923339777207", lines)!);
  assert.equal(url.hostname, "wa.me");
  assert.equal(url.pathname, "/923339777207");
  const message = url.searchParams.get("text")!;
  assert.match(message, /Electronics Imperial/);
  assert.match(message, /Electric Ceramic Cooker/);
  assert.match(message, /Quantity: 3/);
  assert.match(message, /3 items selected/);
  assert.match(message, /Unit price: Rs 10,000/);
  assert.match(message, /account number and order details/);
  assert.match(message, /Order total: Rs 30,000/);
});

test("catalog mode is explicit and rejects configuration typos", () => {
  assert.equal(catalogMode(undefined), "demo");
  assert.equal(catalogMode("database"), "database");
  assert.throws(() => catalogMode("databse"));
});

test("reviews validate rating, whitespace, and bounded text", () => {
  assert.ok(reviewError(" ", 5, "Works well for me."));
  assert.ok(reviewError("Ali", 0, "Works well for me."));
  assert.ok(reviewError("Ali", 4.5, "Works well for me."));
  assert.ok(reviewError("Ali", 5, "short"));
  assert.ok(reviewError("Ali", 5, "x".repeat(1501)));
  assert.equal(reviewError("Ali", 5, "Works well for me."), null);
});
