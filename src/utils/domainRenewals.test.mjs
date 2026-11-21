import { test } from "node:test";
import assert from "node:assert/strict";
import { domainRenewals, normalizeDomain } from "./domainRenewals.js";

test("normalizes domains and rejects invalid or unsafe values", () => {
  assert.equal(normalizeDomain(" https://Example.com/menu "), "example.com");
  assert.equal(normalizeDomain("www.example.com"), "www.example.com");
  assert.equal(normalizeDomain(""), "");
  assert.equal(normalizeDomain("not a domain"), null);
  assert.equal(normalizeDomain("https://user:pass@example.com"), null);
  assert.equal(normalizeDomain("javascript:alert(1)"), null);
});
test("renewals include overdue, today and day 90, but not day 91, leads or missing dates", () => {
  const record = (domainExpiresOn, extra = {}) => ({ status: "Active client", domainName: "example.com", domainExpiresOn, ...extra });
  const records = [record("2026-03-10"), record("2025-12-09"), record("2025-12-10"), record("2026-03-11"), record(""), record("2025-12-11", { status: "New Lead" })];
  assert.deepEqual(domainRenewals(records, "2025-12-10").map(({ days }) => days), [-1, 0, 90]);
});
test("calendar-day comparisons stay stable over daylight saving changes", () => {
  assert.equal(domainRenewals([{ status: "Active client", domainName: "example.com", domainExpiresOn: "2026-03-09" }], "2026-03-07")[0].days, 2);
});
