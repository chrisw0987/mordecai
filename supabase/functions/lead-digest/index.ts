// Server-only endpoint. Deploy with JWT verification disabled; this handler validates its own cron secret.
Deno.serve(async (request: Request) => {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const secret = Deno.env.get("LEAD_DIGEST_CRON_SECRET");
  if (!secret || request.headers.get("x-cron-secret") !== secret) return new Response("Unauthorized", { status: 401 });
  const env = (key: string) => Deno.env.get(key)?.trim() || "";
  const url = env("SUPABASE_URL"), key = env("SUPABASE_SERVICE_ROLE_KEY");
  const apiKey = env("RESEND_API_KEY"), from = env("LEAD_DIGEST_FROM"), to = env("LEAD_DIGEST_TO");
  const dashboard = env("LEAD_DIGEST_DASHBOARD_URL");
  if (!url || !key || !apiKey || !from || !to || !dashboard) return new Response("Digest configuration incomplete", { status: 503 });
  try {
    const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
    const headers = { apikey: key, Authorization: `Bearer ${key}` };
    // Paginate so the digest never silently omits reminders beyond PostgREST's row limit.
    const rows: { name: string; next_action: string; follow_up: string }[] = [];
    for (let offset = 0; ; offset += 500) {
      const query = new URL(`${url}/rest/v1/mordecai_dashboard_businesses`);
      query.search = new URLSearchParams({ select: "name,next_action,follow_up", status: "not.in.(Rejected,Active client)", follow_up: `lte.${today}`, order: "follow_up.asc,id.asc", limit: "500", offset: String(offset) }).toString();
      const response = await fetch(query, { headers, signal: AbortSignal.timeout(15000) });
      if (!response.ok) throw new Error("Database read failed");
      const page = await response.json();
      rows.push(...page);
      if (page.length < 500) break;
    }
    if (!rows.length) return Response.json({ sent: false, reason: "No due or overdue leads" });
    // Plain text avoids treating stored lead content as HTML.
    const text = [`Lead follow-ups for ${today}`, "", ...rows.map((row) => `${row.follow_up < today ? "OVERDUE" : "TODAY"} | ${row.name} | ${row.follow_up}\n${row.next_action || "Review this lead"}`), "", `Open dashboard: ${dashboard}`].join("\n\n");
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST", signal: AbortSignal.timeout(20000),
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": `lead-digest-${today}` },
      body: JSON.stringify({ from, to: [to], subject: `Lead follow-ups: ${rows.length} due or overdue`, text }),
    });
    if (!response.ok) throw new Error("Email send failed");
    return Response.json({ sent: true, count: rows.length });
  } catch {
    // Never log lead content, credentials, recipient addresses, or provider bodies.
    return new Response("Digest failed. Check configuration and provider delivery logs.", { status: 502 });
  }
});
