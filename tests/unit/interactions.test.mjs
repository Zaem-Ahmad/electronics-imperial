import assert from "node:assert/strict";
import { after, afterEach, beforeEach, test } from "node:test";
import { JSDOM } from "jsdom";
import { act, createElement } from "react";
import { ThemeToggle } from "../../src/components/theme-toggle.tsx";
import { themeInitScript } from "../../src/lib/theme.ts";
import { Reviews } from "../../src/components/reviews.tsx";
import {
  StoreProvider,
  useStore,
} from "../../src/components/store-provider.tsx";
import { cooker } from "../../src/lib/product-data.ts";
import { CART_KEY } from "../../src/lib/cart.ts";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "https://imperial.test",
  runScripts: "outside-only",
});
for (const key of [
  "window",
  "document",
  "HTMLElement",
  "HTMLInputElement",
  "FormData",
  "localStorage",
  "sessionStorage",
  "Event",
  "MouseEvent",
]) {
  Object.defineProperty(globalThis, key, {
    configurable: true,
    value: key === "window" ? dom.window : dom.window[key],
  });
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
dom.window.matchMedia = () => ({ matches: false });
const { createRoot } = await import("react-dom/client");
let root;

beforeEach(() => {
  dom.window.localStorage.clear();
  dom.window.sessionStorage.clear();
  dom.window.document.body.innerHTML =
    '<div id="root"></div><button id="unrelated">Unrelated control</button>';
  dom.window.document.documentElement.dataset.theme = "light";
  root = createRoot(dom.window.document.getElementById("root"));
});
afterEach(async () => {
  await act(async () => root.unmount());
});
after(() => dom.window.close());

test("theme bootstrap and toggle stay independent of unrelated click events", async () => {
  dom.window.eval(themeInitScript);
  await act(async () => root.render(createElement(ThemeToggle)));
  const html = dom.window.document.documentElement;
  await act(async () =>
    dom.window.document.getElementById("unrelated").click(),
  );
  assert.equal(html.dataset.theme, "light");
  await act(async () =>
    dom.window.document.querySelector(".theme-toggle").click(),
  );
  assert.equal(html.dataset.theme, "dark");
  assert.equal(dom.window.localStorage.getItem("imperial-theme"), "dark");
  await act(async () => dom.window.document.body.click());
  assert.equal(html.dataset.theme, "dark");
  html.dataset.theme = "light";
  dom.window.eval(themeInitScript);
  assert.equal(html.dataset.theme, "dark");
});

function CartProbe() {
  const store = useStore();
  return createElement(
    "div",
    null,
    createElement(
      "button",
      {
        id: "add",
        disabled: !store.ready,
        onClick: () => store.add(cooker, 2),
      },
      "Add two",
    ),
    createElement(
      "button",
      { id: "remove", onClick: () => store.remove(cooker.id) },
      "Remove",
    ),
    createElement(
      "output",
      null,
      String(store.entries.reduce((sum, entry) => sum + entry.quantity, 0)),
    ),
  );
}

test("cart events update quantity, confirmation, storage, and restore after remount", async () => {
  const render = () =>
    createElement(
      StoreProvider,
      { catalog: [cooker], catalogError: false },
      createElement(CartProbe),
    );
  await act(async () => root.render(render()));
  await act(async () => dom.window.document.getElementById("add").click());
  assert.equal(dom.window.document.querySelector("output").textContent, "2");
  assert.match(
    dom.window.document.querySelector('[role="status"]').textContent,
    /Electric Ceramic Cooker × 2 added to cart — Rs 20,000/,
  );
  assert.deepEqual(JSON.parse(dom.window.localStorage.getItem(CART_KEY)), [
    { id: cooker.id, quantity: 2 },
  ]);
  assert.equal(dom.window.document.documentElement.dataset.theme, "light");
  await act(async () => root.unmount());
  root = createRoot(dom.window.document.getElementById("root"));
  await act(async () => root.render(render()));
  assert.equal(dom.window.document.querySelector("output").textContent, "2");
  await act(async () => dom.window.document.getElementById("remove").click());
  assert.equal(dom.window.document.querySelector("output").textContent, "0");
  assert.equal(dom.window.localStorage.getItem(CART_KEY), "[]");
});

test("review submit renders escaped text once and resets without persistence", async () => {
  await act(async () => root.render(createElement(Reviews)));
  dom.window.document.querySelector('[name="name"]').value = "Test customer";
  dom.window.document.querySelector('[name="review"]').value =
    '<script>alert("test")</script> Useful for my everyday meals.';
  const submit = () =>
    dom.window.document
      .querySelector("form")
      .dispatchEvent(
        new dom.window.Event("submit", { bubbles: true, cancelable: true }),
      );
  await act(async () => submit());
  assert.match(
    dom.window.document.querySelector('[role="alert"]').textContent,
    /Choose a rating/,
  );
  await act(async () =>
    dom.window.document
      .querySelector('input[name="rating"][value="5"]')
      .click(),
  );
  await act(async () => submit());
  assert.equal(
    dom.window.document.querySelectorAll(".review-list > .review").length,
    1,
  );
  assert.match(
    dom.window.document.querySelector(".review-list > .review").textContent,
    /<script>/,
  );
  assert.equal(
    dom.window.document.querySelectorAll(".review-list > .review script")
      .length,
    0,
  );
  assert.equal(
    dom.window.document.querySelector(".review-count").textContent,
    "1 review · 5.0 average",
  );
  await act(async () => submit());
  assert.equal(
    dom.window.document.querySelectorAll(".review-list > .review").length,
    1,
  );
  assert.equal(dom.window.localStorage.length, 0);
  assert.equal(dom.window.sessionStorage.length, 0);
  await act(async () => root.unmount());
  root = createRoot(dom.window.document.getElementById("root"));
  await act(async () => root.render(createElement(Reviews)));
  assert.equal(
    dom.window.document.querySelectorAll(".review-list > .review").length,
    0,
  );
});

test("buying CTAs open WhatsApp with the saved bag quantities and bill", async () => {
  const { QuickAdd, ProductControls } =
    await import("../../src/components/product-controls.tsx");
  const opened = [];
  const originalOpen = dom.window.open;
  dom.window.open = (url) => {
    opened.push(new URL(url));
    return null;
  };
  try {
    await act(async () =>
      root.render(
        createElement(
          StoreProvider,
          { catalog: [cooker], catalogError: false },
          createElement(QuickAdd, { product: cooker }),
          createElement(ProductControls, { product: cooker }),
        ),
      ),
    );
    await act(async () =>
      dom.window.document.querySelector(".button-primary").click(),
    );
    assert.equal(opened[0].pathname, "/923339777207");
    assert.match(opened[0].searchParams.get("text"), /1 item selected/);
    await act(async () =>
      dom.window.document
        .querySelector('[aria-label="Increase quantity"]')
        .click(),
    );
    await act(async () =>
      dom.window.document
        .querySelector(".purchase-row .button-primary")
        .click(),
    );
    assert.equal(opened.length, 2);
    assert.match(opened[1].searchParams.get("text"), /3 items selected/);
    assert.match(opened[1].searchParams.get("text"), /Order total: Rs 30,000/);
    assert.match(
      opened[1].searchParams.get("text"),
      /account number and order details/,
    );
    assert.deepEqual(JSON.parse(dom.window.localStorage.getItem(CART_KEY)), [
      { id: cooker.id, quantity: 3 },
    ]);
    const directOrder = new URL(
      dom.window.document.querySelector(".product-controls a").href,
    );
    assert.equal(directOrder.pathname, "/923339777207");
    assert.match(directOrder.searchParams.get("text"), /2 items selected/);
    assert.match(
      directOrder.searchParams.get("text"),
      /Order total: Rs 20,000/,
    );
  } finally {
    dom.window.open = originalOpen;
  }
});
