import { expect, test } from "@playwright/test";

test("only the theme button changes the theme, across clicks, navigation, and refresh", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("heading", { level: 1 }).click();
  await page.getByRole("button", { name: "Quick add" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Electric Ceramic Cooker × 1 added to cart — Rs 10,000.",
  );
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "Toggle color theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page
    .getByRole("navigation", { name: "Main navigation", exact: true })
    .getByRole("link", { name: "Our story" })
    .click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: /Open cart/ }).click();
  await expect(page.getByRole("dialog", { name: "Your bag" })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: /Open cart/ })).toBeFocused();
  expect(errors).toEqual([]);
});

test("cart quantity, price, persistence, removal, and WhatsApp checkout", async ({
  page,
}) => {
  await page.goto("/products/electric-ceramic-cooker");
  await page.getByRole("spinbutton", { name: "Quantity" }).fill("2");
  await page.getByRole("button", { name: "Add to bag", exact: true }).click();
  await expect(page.getByRole("status")).toContainText(
    "× 2 added to cart — Rs 20,000.",
  );
  await page.reload();
  await page.getByRole("button", { name: "Open cart, 2 items" }).click();
  const dialog = page.getByRole("dialog", { name: "Your bag" });
  await expect(dialog).toContainText("Rs 20,000");
  await dialog.getByRole("button", { name: /Increase Electric/ }).click();
  await expect(dialog).toContainText("Rs 30,000");
  await dialog.getByRole("button", { name: /Decrease Electric/ }).click();
  await expect(dialog).toContainText("Rs 20,000");
  const checkout = dialog.getByRole("link", { name: "Order on WhatsApp" });
  const order = new URL((await checkout.getAttribute("href"))!);
  expect(order.pathname).toBe("/923339777207");
  expect(order.searchParams.get("text")).toContain("2 items selected");
  expect(order.searchParams.get("text")).toContain("Order total: Rs 20,000");
  await dialog.getByRole("button", { name: "Remove" }).click();
  await expect(dialog).toContainText("Your bag is currently empty");
});

test("gallery keeps image zero first and product quantities are validated", async ({
  page,
}) => {
  await page.goto("/products/electric-ceramic-cooker");
  await expect(page.locator(".gallery-main img")).toHaveAttribute(
    "src",
    /ecc_0/,
  );
  for (const index of [1, 2, 3, 0]) {
    await page
      .getByRole("button", { name: `View product photo ${index + 1}` })
      .click();
    await expect(page.locator(".gallery-main img")).toHaveAttribute(
      "src",
      new RegExp(`ecc_${index}`),
    );
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  }
  for (const value of ["0", "1.5", "100", ""]) {
    await page.getByRole("spinbutton", { name: "Quantity" }).fill(value);
    await expect(
      page.getByRole("button", { name: "Add to bag", exact: true }),
    ).toBeDisabled();
  }
  await expect(page.locator("#warranty")).toContainText(
    "Broken or Cracked Glass",
  );
  await expect(page.locator("#warranty")).toContainText(
    "Please keep your proof of purchase",
  );
});

test("reviews are safe, unique, temporary and never written to browser storage", async ({
  page,
}) => {
  await page.goto("/products/electric-ceramic-cooker");
  await expect(page.getByText("Be the first to review.")).toBeVisible();
  await page.getByLabel("Your name").fill("Test customer");
  await page
    .getByLabel("Your review", { exact: true })
    .fill("<script>alert('test')</script> A useful cooker for everyday meals.");
  await page.getByRole("button", { name: "Post review" }).click();
  await expect(page.getByRole("alert")).toContainText("Choose a rating");
  await page.getByRole("radio", { name: "5 stars", exact: true }).check();
  await page.getByRole("button", { name: "Post review" }).click();
  await expect(page.locator(".review-list > .review")).toHaveCount(1);
  await expect(page.locator(".review-count")).toHaveText(
    "1 review · 5.0 average",
  );
  await expect(page.locator(".review-list > .review")).toContainText(
    "<script>alert('test')</script>",
  );
  await expect(page.locator(".review-list > .review script")).toHaveCount(0);
  await page.getByRole("button", { name: "Post review" }).click();
  await expect(page.locator(".review-list > .review")).toHaveCount(1);
  const stored = await page.evaluate(() =>
    JSON.stringify({
      local: { ...localStorage },
      session: { ...sessionStorage },
    }),
  );
  expect(stored).not.toContain("Test customer");
  await page.reload();
  await expect(page.locator(".review-list > .review")).toHaveCount(0);
  await expect(page.getByText("Be the first to review.")).toBeVisible();
});

test("extended homepage tabs, detail hotspots, FAQs and animation controls work", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.getByRole("button", { name: "Pause animations" }).click();
  await expect(page.locator(".home-experience")).toHaveAttribute(
    "data-paused",
    "true",
  );
  await page.getByRole("tab", { name: "13:00 The midday pause" }).click();
  await expect(page.getByRole("tabpanel")).toContainText("Good food.");
  await page
    .getByRole("tab", { name: "13:00 The midday pause" })
    .press("ArrowRight");
  await expect(page.getByRole("tabpanel")).toContainText("Come home");
  await page
    .getByRole("button", { name: "Explore control knob", exact: true })
    .click();
  await expect(page.locator("#cooker-detail-1")).toBeVisible();
  await page
    .getByText("Is the ceramic glass covered?", { exact: true })
    .click();
  await expect(page.locator(".faq-list details[open]")).toContainText(
    "not covered",
  );
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.locator(".home-experience section")).toHaveCount(9);
});

test("mobile menu has a focus trap and returns focus on dismissal", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.getByRole("dialog", { name: "Menu", exact: true });
  await expect(menu).toBeVisible();
  await page.keyboard.press("Tab");
  expect(
    await menu.evaluate((dialog) => dialog.contains(document.activeElement)),
  ).toBe(true);
  await menu.getByRole("link", { name: "Our story" }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(menu).not.toBeVisible();
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
});

for (const width of [360, 768, 1024, 1366, 1536, 1920]) {
  test(`all pages fit a ${width}px viewport without horizontal overflow`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/",
      "/products",
      "/products/electric-ceramic-cooker",
      "/about",
      "/contact",
    ]) {
      await page.goto(route);
      await expect(page.locator("h1")).toBeVisible();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      );
      expect(overflow, `${route} overflows at ${width}px`).toBe(false);
    }
  });
}

test("zoomed desktop content fits at 125% and 150%", async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/");
  for (const zoom of [1.25, 1.5]) {
    await page.evaluate((value) => {
      document.body.style.zoom = String(value);
    }, zoom);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
});

test("catalog has one real product, placeholder contacts, and unknown products return 404", async ({
  page,
}) => {
  await page.goto("/products");
  await expect(page.locator(".product-card")).toHaveCount(1);
  await expect(page.locator(".product-card")).toContainText(
    "Electric Ceramic Cooker",
  );
  await expect(page.locator(".product-card-image img")).toHaveAttribute(
    "src",
    /ecc_0/,
  );
  await expect(page.locator("footer a[href*='facebook.com']")).toHaveCount(0);
  const response = await page.goto("/products/no-such-product");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByText("This page or product isn’t part of our collection."),
  ).toBeVisible();
});
