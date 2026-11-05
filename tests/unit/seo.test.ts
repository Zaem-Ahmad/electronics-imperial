import assert from "node:assert/strict";
import test from "node:test";
import { publicSiteUrl, jsonLd } from "../../src/lib/seo";

test("SEO origin normalizes trailing slashes and rejects malformed deployment URLs", () => {
  assert.equal(
    publicSiteUrl("  https://example.com/  "),
    "https://example.com",
  );
  assert.equal(publicSiteUrl(""), undefined);
  for (const value of [
    "example.com",
    "ftp://example.com",
    "https://user:secret@example.com",
    "https://example.com/shop",
    "https://example.com?preview=1",
    "https://example.com/#section",
  ]) {
    assert.throws(() => publicSiteUrl(value));
  }
});

test("JSON-LD cannot break out of a script element", () => {
  const value = { name: '</script><script>alert("test")</script>' };
  assert.ok(!jsonLd(value).includes("<"));
  assert.deepEqual(JSON.parse(jsonLd(value)), value);
});
