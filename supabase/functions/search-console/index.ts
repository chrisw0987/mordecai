const origins = new Set(["http://localhost:5173", "http://localhost:8888", "https://getmordecai.com", "https://www.getmordecai.com"]);
const encoder = new TextEncoder();
const cache = new Map();
let tokenCache = null;

class RequestError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

function base64url(bytes) {
  return btoa(String.fromCharCode(...bytes)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

async function googleToken() {
  if (tokenCache && tokenCache.until > Date.now()) return tokenCache.value;
  let credentials;
  try { credentials = JSON.parse(Deno.env.get("GSC_SERVICE_ACCOUNT_JSON") || ""); }
  catch { throw new RequestError(503, "Add a valid GSC_SERVICE_ACCOUNT_JSON secret in Supabase Edge Functions."); }
  if (!credentials.client_email || !credentials.private_key) throw new RequestError(503, "The Google service account secret is incomplete.");
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(encoder.encode(JSON.stringify({ alg: "RS256", typ: "JWT" })));
  const payload = base64url(encoder.encode(JSON.stringify({ iss: credentials.client_email, scope: "https://www.googleapis.com/auth/webmasters.readonly", aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 })));
  const pem = credentials.private_key.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\s/g, "");
  const key = await crypto.subtle.importKey("pkcs8", Uint8Array.from(atob(pem), (char) => char.charCodeAt(0)), { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, encoder.encode(`${header}.${payload}`));
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", signal: AbortSignal.timeout(20000),
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${header}.${payload}.${base64url(new Uint8Array(signature))}` }),
  });
  if (!response.ok) throw new RequestError(502, "Google could not authenticate the service account. Check that its key is still active and the saved JSON is correct.");
  const data = await response.json();
  if (!data.access_token) throw new RequestError(502, "Google did not return an access token.");
  tokenCache = { value: data.access_token, until: Date.now() + (Number(data.expires_in || 3600) - 60) * 1000 };
  return tokenCache.value;
}

async function google(path, body) {
  const token = await googleToken();
  const response = await fetch(`https://www.googleapis.com/webmasters/v3/${path}`, {
    method: body ? "POST" : "GET", signal: AbortSignal.timeout(20000),
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!response.ok) {
    if (response.status === 401) tokenCache = null;
    throw new RequestError(response.status === 429 ? 429 : 502, response.status === 403
      ? "Google denied access. Enable the Search Console API and add the service account to this property in Search Console."
      : response.status === 429 ? "Google's request limit was reached. Wait a few minutes and try again." : "Search Console is unavailable right now. Try again shortly.");
  }
  return response.json();
}

async function cached(key, task) {
  const entry = cache.get(key);
  if (entry && entry.until > Date.now()) return entry.value;
  const value = await task();
  if (cache.size >= 100) cache.delete(cache.keys().next().value);
  cache.set(key, { value, until: Date.now() + 5 * 60 * 1000 });
  return value;
}

function dateShift(date, days) {
  const shifted = new Date(`${date}T12:00:00Z`);
  shifted.setUTCDate(shifted.getUTCDate() + days);
  return shifted.toISOString().slice(0, 10);
}

function totals(report) {
  const row = report.rows?.[0];
  return { clicks: row?.clicks ?? 0, impressions: row?.impressions ?? 0, ctr: row?.ctr ?? 0, position: row?.position ?? null };
}

function rows(report) {
  return (report.rows || []).map((row) => ({ label: row.keys[0], clicks: row.clicks, impressions: row.impressions, ctr: row.ctr, position: row.position }));
}

async function handle(request) {
  const origin = request.headers.get("origin");
  const headers = { "Content-Type": "application/json", "Cache-Control": "no-store", Vary: "Origin",
    "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info", "Access-Control-Allow-Methods": "POST, OPTIONS",
    ...(origins.has(origin) ? { "Access-Control-Allow-Origin": origin } : {}) };
  const reply = (status, data) => new Response(JSON.stringify(data), { status, headers });
  if (origin && !origins.has(origin)) return reply(403, { error: "This origin is not allowed." });
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (request.method !== "POST") return reply(405, { error: "Use POST." });
  try {
    const authorization = request.headers.get("authorization") || "";
    if (!authorization.startsWith("Bearer ")) throw new RequestError(401, "Sign in to view Search Console reports.");
    const owner = Deno.env.get("DASHBOARD_OWNER_ID")?.trim().toLowerCase();
    if (!owner) throw new RequestError(503, "Add the DASHBOARD_OWNER_ID secret in Supabase Edge Functions.");
    const auth = await fetch(`${Deno.env.get("SUPABASE_URL")}/auth/v1/user`, {
      headers: { Authorization: authorization, apikey: Deno.env.get("SUPABASE_ANON_KEY") || "" }, signal: AbortSignal.timeout(15000),
    });
    if (!auth.ok) throw new RequestError(401, "Your session expired. Sign out and sign in again.");
    const user = await auth.json();
    if (user.id?.toLowerCase() !== owner) throw new RequestError(403, "Only the dashboard owner can view these reports.");
    let input;
    try { input = await request.json(); } catch { throw new RequestError(400, "Send a valid JSON request."); }
    if (!["sites", "report"].includes(input?.action)) throw new RequestError(400, "Unknown report action.");
    const sites = await cached("sites", async () => {
      const data = await google("sites");
      return (data.siteEntry || []).filter((site) => site.permissionLevel !== "siteUnverifiedUser").map((site) => ({ siteUrl: site.siteUrl, permissionLevel: site.permissionLevel }));
    });
    if (input.action === "sites") return reply(200, { sites });
    const days = input.days ?? 28;
    if (![7, 28, 90].includes(days) || typeof input.siteUrl !== "string") throw new RequestError(400, "Choose a website and a supported date range.");
    if (!sites.some((site) => site.siteUrl === input.siteUrl)) throw new RequestError(403, "The service account does not have access to that property.");
    const report = await cached(`report:${input.siteUrl}:${days}`, async () => {
      const today = new Date().toLocaleDateString("sv-SE", { timeZone: "America/Los_Angeles" });
      const endDate = dateShift(today, -3);
      const startDate = dateShift(endDate, 1 - days);
      const previousEnd = dateShift(startDate, -1);
      const previousStart = dateShift(previousEnd, 1 - days);
      const path = `sites/${encodeURIComponent(input.siteUrl)}/searchAnalytics/query`;
      const query = (start, end, dimensions = [], rowLimit = 1) => google(path, { startDate: start, endDate: end, dimensions, rowLimit, type: "web", dataState: "final" });
      const [current, previous, daily, queries, pages] = await Promise.all([
        query(startDate, endDate), query(previousStart, previousEnd), query(startDate, endDate, ["date"], 100),
        query(startDate, endDate, ["query"], 10), query(startDate, endDate, ["page"], 10),
      ]);
      const dailyRows = new Map(rows(daily).map((row) => [row.label, row]));
      return { siteUrl: input.siteUrl, startDate, endDate, previousStart, previousEnd, totals: totals(current), previous: totals(previous),
        daily: Array.from({ length: days }, (_, index) => { const label = dateShift(startDate, index); return dailyRows.get(label) || { label, clicks: 0, impressions: 0, ctr: 0, position: null }; }),
        queries: rows(queries), pages: rows(pages), fetchedAt: new Date().toISOString() };
    });
    return reply(200, report);
  } catch (error) {
    return reply(error instanceof RequestError ? error.status : 502, { error: error instanceof RequestError ? error.message : "The Search Console connection failed. Check the saved service account JSON and try again." });
  }
}

Deno.serve(handle);
