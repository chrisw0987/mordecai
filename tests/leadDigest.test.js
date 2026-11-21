import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { stripTypeScriptTypes } from "node:module";
import vm from "node:vm";

const source = stripTypeScriptTypes(readFileSync(new URL("../supabase/functions/lead-digest/index.ts", import.meta.url), "utf8"));
function handler(fetch) {
  let callback;
  const secrets = { LEAD_DIGEST_CRON_SECRET: "test-only-secret", SUPABASE_URL: "https://example.test", SUPABASE_SERVICE_ROLE_KEY: "test-only-key", RESEND_API_KEY: "test-only-key", LEAD_DIGEST_FROM: "sender@example.test", LEAD_DIGEST_TO: "owner@example.test", LEAD_DIGEST_DASHBOARD_URL: "https://example.test/dashboard" };
  vm.runInNewContext(source, { Deno: { serve: fn => { callback = fn; }, env: { get: key => secrets[key] } }, fetch, Request, Response, URL, URLSearchParams, AbortSignal, Intl, Date });
  return callback;
}
const authorized = () => new Request("https://example.test", { method: "POST", headers: { "x-cron-secret": "test-only-secret" } });

test("digest rejects unauthenticated requests without fetching", async () => {
  const run = handler(() => { throw new Error("Should not fetch"); });
  assert.equal((await run(new Request("https://example.test", { method: "POST" }))).status, 401);
});
test("digest sends nothing with no due leads", async () => {
  let calls = 0;
  const run = handler(async () => { calls++; return Response.json([]); });
  assert.equal((await (await run(authorized())).json()).sent, false);
  assert.equal(calls, 1);
});
test("digest sends plain text to owner with per-day idempotency", async () => {
  let sent;
  const run = handler(async (url, options) => {
    if (String(url).includes("/rest/v1/")) {
      assert.equal(new URL(url).searchParams.get("status"), "not.in.(Rejected,Active client)");
      return Response.json([{ name: "<b>Test lead</b>", next_action: "Call", follow_up: "2000-01-01" }]);
    }
    sent = JSON.parse(options.body);
    assert.match(options.headers["Idempotency-Key"], /^lead-digest-\d{4}-\d{2}-\d{2}$/);
    return Response.json({ id: "sent" });
  });
  assert.equal((await run(authorized())).status, 200);
  assert.deepEqual(sent.to, ["owner@example.test"]);
  assert.equal(sent.html, undefined);
  assert.match(sent.text, /OVERDUE/);
});
