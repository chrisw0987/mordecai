import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("./index.ts", import.meta.url), "utf8");
function fixture({ user = "owner", secrets = {}, noSites = false, googleFails = false } = {}) {
  const calls = [];
  const env = { DASHBOARD_OWNER_ID: "owner", SUPABASE_URL: "https://test.supabase.co", SUPABASE_ANON_KEY: "public-key",
    GSC_SERVICE_ACCOUNT_JSON: JSON.stringify({ client_email: "test@example.invalid", private_key: "-----BEGIN PRIVATE KEY-----\naGVsbG8=\n-----END PRIVATE KEY-----" }), ...secrets };
  let handler;
  vm.runInNewContext(source, {
    Deno: { env: { get: (key) => env[key] }, serve: (callback) => { handler = callback; } },
    TextEncoder, Request, Response, URLSearchParams, AbortSignal, atob, btoa,
    crypto: { subtle: { importKey: async () => ({}), sign: async () => new Uint8Array([1, 2, 3]).buffer } },
    fetch: async (url, options) => {
      calls.push({ url, options });
      if (url.endsWith("/auth/v1/user")) return Response.json({ id: user }, { status: user === null ? 401 : 200 });
      if (url.includes("oauth2.googleapis.com")) return Response.json({ access_token: "mock-google-token", expires_in: 3600 });
      if (googleFails) return Response.json({ secret: "never expose this" }, { status: 403 });
      if (url.endsWith("/sites")) return Response.json({ siteEntry: noSites ? [] : [{ siteUrl: "sc-domain:example.com", permissionLevel: "siteRestrictedUser" }] });
      const body = JSON.parse(options.body);
      if (body.dimensions.length) return Response.json({});
      return Response.json({ rows: [{ clicks: 12, impressions: 100, ctr: 0.12, position: 4.5 }] });
    },
  });
  return { calls, request: (body = { action: "sites" }, authenticated = true, origin = "http://localhost:5173") => handler(new Request("https://test/functions/v1/search-console", { method: "POST", headers: { origin, "Content-Type": "application/json", ...(authenticated ? { Authorization: "Bearer mock-session" } : {}) }, body: JSON.stringify(body) })) };
}

test("anonymous requests never contact Google or Supabase", async () => {
  const f = fixture(); assert.equal((await f.request(undefined, false)).status, 401); assert.equal(f.calls.length, 0);
});
test("authenticated non-owner cannot access Google reports", async () => {
  const f = fixture({ user: "someone-else" }); assert.equal((await f.request()).status, 403); assert.equal(f.calls.length, 1);
});
test("missing owner config fails closed", async () => {
  const f = fixture({ secrets: { DASHBOARD_OWNER_ID: "" } }); assert.equal((await f.request()).status, 503); assert.equal(f.calls.length, 0);
});
test("foreign browser origin is rejected", async () => {
  const f = fixture(); assert.equal((await f.request(undefined, true, "https://other.example")).status, 403); assert.equal(f.calls.length, 0);
});
test("owner sees properties without credential leakage and uses read-only Google scope", async () => {
  const f = fixture(); const response = await f.request(); const text = await response.text();
  assert.equal(response.status, 200); assert.ok(text.includes("sc-domain:example.com")); assert.ok(!text.includes("mock-google-token"));
  const assertion = f.calls.find((call) => call.url.includes("oauth2.googleapis.com")).options.body.get("assertion");
  const payload = JSON.parse(Buffer.from(assertion.split(".")[1], "base64url"));
  assert.equal(payload.scope, "https://www.googleapis.com/auth/webmasters.readonly");
});
test("arbitrary properties and unsupported ranges cannot trigger report calls", async () => {
  const f = fixture(); assert.equal((await f.request({ action: "report", siteUrl: "sc-domain:private.example", days: 28 })).status, 403);
  assert.equal((await f.request({ action: "report", siteUrl: "sc-domain:example.com", days: 500 })).status, 400);
  assert.ok(!f.calls.some((call) => call.url.includes("searchAnalytics")));
});
test("report uses independent totals, equal comparison periods, zero-filled days and caching", async () => {
  const f = fixture(); const body = { action: "report", siteUrl: "sc-domain:example.com", days: 28 };
  const response = await f.request(body); assert.equal(response.status, 200); const report = await response.json();
  assert.equal(report.totals.clicks, 12); assert.equal(report.daily.length, 28); assert.equal(report.daily[0].clicks, 0); assert.deepEqual(report.queries, []);
  assert.equal((Date.parse(report.endDate) - Date.parse(report.startDate)) / 86400000, 27);
  assert.equal((Date.parse(report.startDate) - Date.parse(report.previousEnd)) / 86400000, 1);
  assert.equal((Date.parse(report.previousEnd) - Date.parse(report.previousStart)) / 86400000, 27);
  const calls = f.calls.filter((call) => call.url.includes("googleapis.com")).length;
  await f.request(body); assert.equal(f.calls.filter((call) => call.url.includes("googleapis.com")).length, calls);
});
test("empty property list and upstream failures are actionable without raw error leakage", async () => {
  assert.deepEqual((await (await fixture({ noSites: true }).request()).json()).sites, []);
  const response = await fixture({ googleFails: true }).request(); assert.equal(response.status, 502);
  const text = await response.text(); assert.ok(text.includes("Google denied access")); assert.ok(!text.includes("never expose"));
});
