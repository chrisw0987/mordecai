import test from "node:test";
import assert from "node:assert/strict";
import { domainRenewals, expirationReminderStart, newestAcquiredFirst } from "../src/utils/domainRenewals.js";

test("expiration reminders work without a domain name and include overdue clients", () => {
  const rows = [
    { id: 1, status: "Active client", services: ["Website"], domainName: "", domainExpiresOn: "2026-11-19" },
    { id: 2, status: "Active client", services: ["Website"], domainExpiresOn: "2026-11-21" },
    { id: 3, status: "New Lead", domainExpiresOn: "2026-11-21" },
    { id: 4, status: "Active client", services: ["Website"], domainExpiresOn: "2027-11-21" },
    { id: 5, status: "Active client", services: ["Website"], domainExpiresOn: "" },
  ];
  assert.deepEqual(domainRenewals(rows, "2026-11-20").map(({ record, days }) => [record.id, days]), [[1, -1], [2, 1]]);
});

test("expiration window starts one calendar month before, including month-end boundaries", () => {
  assert.equal(expirationReminderStart("2027-03-31"), "2027-02-28");
  assert.equal(expirationReminderStart("2028-03-31"), "2028-02-29");
  const website = { status: "Active client", services: ["Website"], domainExpiresOn: "2026-12-21" };
  assert.equal(domainRenewals([website], "2026-11-20").length, 0);
  assert.equal(domainRenewals([website], "2026-11-21").length, 1);
  assert.equal(domainRenewals([{ ...website, services: ["Review Cards"] }], "2026-12-20").length, 0);
});

test("acquisition date takes precedence over creation date and missing dates sort last", () => {
  const records = [{ id: 1, dateAcquired: "2026-01-01", created_at: "2026-11-20" }, { id: 2, dateAcquired: "2026-11-01", created_at: "2026-01-01" }, { id: 3, dateAcquired: "", created_at: "2026-11-21" }];
  assert.deepEqual(records.sort(newestAcquiredFirst).map(r => r.id), [2, 1, 3]);
});
