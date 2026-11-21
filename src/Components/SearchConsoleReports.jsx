import { useEffect, useState } from "react";

const number = new Intl.NumberFormat("en-US");
const percent = (value) => `${(value * 100).toFixed(1)}%`;
const control = "rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white disabled:opacity-50";

async function invoke(client, body) {
  const { data, error } = await client.functions.invoke("search-console", { body });
  if (error) {
    let details;
    try { details = await error.context?.json(); } catch { /* Network errors have no JSON body. */ }
    if (error.context?.status === 404) throw new Error("Deploy the search-console Edge Function in Supabase to connect your reports.");
    throw new Error(details?.error || "Could not reach the Search Console function. Check that it is deployed and try again.");
  }
  return data;
}

function ResultsTable({ title, rows }) {
  return <section className="min-w-0 rounded-xl border border-zinc-800 bg-zinc-950 p-4" data-scroll-reveal="slide">
    <h3 className="font-semibold text-white">{title}</h3>
    {rows.length ? <div className="mt-3 overflow-x-auto"><table className="w-full text-left text-sm">
      <thead className="text-zinc-500"><tr>{[title === "Top searches" ? "Search term" : "Page", "Clicks", "Impressions", "CTR"].map((label) => <th key={label} scope="col" className="px-2 py-2 font-medium">{label}</th>)}</tr></thead>
      <tbody>{rows.map((row) => <tr key={row.label} className="border-t border-zinc-800"><th scope="row" className="max-w-72 break-words px-2 py-2 font-normal text-zinc-300">{row.label}</th><td className="px-2 py-2">{number.format(row.clicks)}</td><td className="px-2 py-2">{number.format(row.impressions)}</td><td className="px-2 py-2">{percent(row.ctr)}</td></tr>)}</tbody>
    </table></div> : <p className="mt-3 text-sm text-zinc-500">No results for this period.</p>}
  </section>;
}

export default function SearchConsoleReports({ client }) {
  const [sites, setSites] = useState([]);
  const [siteUrl, setSiteUrl] = useState("");
  const [days, setDays] = useState(28);
  const [report, setReport] = useState(null);
  const [listing, setListing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    invoke(client, { action: "sites" }).then((data) => {
      if (!active) return;
      setSites(data.sites); setSiteUrl((current) => data.sites.some((site) => site.siteUrl === current) ? current : data.sites[0]?.siteUrl || ""); setError("");
    }).catch((failure) => { if (active) setError(failure.message); }).finally(() => { if (active) setListing(false); });
    return () => { active = false; };
  }, [client, retry]);

  useEffect(() => {
    if (!siteUrl) return;
    let active = true;
    invoke(client, { action: "report", siteUrl, days }).then((data) => { if (active) { setReport(data); setError(""); } })
      .catch((failure) => { if (active) setError(failure.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [client, siteUrl, days, retry]);

  const currentReport = report?.siteUrl === siteUrl && report.daily.length === days ? report : null;
  const busy = listing || loading || Boolean(siteUrl && !currentReport && !error);
  const maxClicks = Math.max(...(currentReport?.daily.map((day) => day.clicks) || []), 1);

  return <section aria-labelledby="search-console-title" className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div><h2 id="search-console-title" className="text-xl font-semibold text-white">Google Search Console</h2><p className="mt-1 text-sm text-zinc-400">How people find your websites through Google Search.</p></div>
      <button type="button" disabled={busy} className={control} onClick={() => { setListing(true); setLoading(Boolean(siteUrl)); setError(""); setRetry((current) => current + 1); }}>Refresh</button>
    </div>
    <div className="flex flex-wrap gap-3">
      <label className="grid w-full max-w-md gap-1 text-sm text-zinc-400">Website
        <select className={control} value={siteUrl} disabled={listing || !sites.length} onChange={(event) => { setSiteUrl(event.target.value); setLoading(true); setError(""); }}>
          {!sites.length && <option value="">{listing ? "Finding connected websites..." : "No connected websites"}</option>}
          {sites.map((site) => <option key={site.siteUrl} value={site.siteUrl}>{site.siteUrl.replace(/^sc-domain:/, "")}</option>)}
        </select>
      </label>
      <label className="grid gap-1 text-sm text-zinc-400">Period
        <select className={control} disabled={!siteUrl} value={days} onChange={(event) => { setDays(Number(event.target.value)); setLoading(true); setError(""); }}>
          {[7, 28, 90].map((value) => <option key={value} value={value}>Last {value} days</option>)}
        </select>
      </label>
    </div>
    {error && <p role="alert" className="rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-200">{error}</p>}
    {busy ? <div role="status" className="grid gap-3 sm:grid-cols-4"><span className="sr-only">Loading search reports.</span>{[1, 2, 3, 4].map((key) => <div key={key} className="h-20 rounded-lg bg-zinc-800 motion-safe:animate-pulse" />)}</div> : !sites.length && !error ? <p className="text-sm text-zinc-400">Add the service account as a user in a website's Search Console settings, then refresh.</p> : null}
    {!busy && !error && currentReport && <>
      <p className="text-xs text-zinc-500">{currentReport.startDate} to {currentReport.endDate} · Final web search data, ending three days ago. Reports are cached for up to five minutes.</p>
      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[["Clicks", "clicks"], ["Impressions", "impressions"], ["Click-through rate", "ctr"], ["Average position", "position"]].map(([label, key]) => {
          const value = currentReport.totals[key];
          const previous = currentReport.previous[key];
          const change = key === "position" ? null : previous > 0 ? (value - previous) / previous : null;
          return <div key={key} className="rounded-lg border border-zinc-800 bg-zinc-950 p-3"><dt className="text-sm text-zinc-400">{label}</dt><dd className="mt-1 text-2xl font-semibold text-white">{key === "ctr" ? percent(value) : key === "position" ? value == null ? "-" : value.toFixed(1) : number.format(value)}</dd><p className="mt-1 text-xs text-zinc-500">{key === "position" ? "Lower is better" : change == null ? "No comparison baseline" : `${change >= 0 ? "+" : ""}${percent(change)} vs previous period`}</p></div>;
        })}
      </dl>
      <section className="rounded-lg border border-zinc-800 bg-zinc-950 p-4"><h3 className="font-semibold text-white">Daily search clicks</h3>
        <div className="mt-3 overflow-x-auto"><div className="flex h-36 min-w-80 items-end gap-1" role="img" aria-label={`Daily clicks from ${currentReport.startDate} through ${currentReport.endDate}. Total ${currentReport.totals.clicks}.`}>
          {currentReport.daily.map((day) => <div key={day.label} className="flex h-full min-w-1 flex-1 items-end"><div title={`${day.label}: ${day.clicks} clicks`} className="w-full rounded-t bg-violet-400" style={{ height: `${day.clicks / maxClicks * 100}%` }} /></div>)}
        </div></div><div className="mt-2 flex justify-between text-xs text-zinc-500"><span>{currentReport.startDate}</span><span>{currentReport.endDate}</span></div>
      </section>
      <div className="grid gap-4 xl:grid-cols-2"><ResultsTable title="Top searches" rows={currentReport.queries} /><ResultsTable title="Top pages" rows={currentReport.pages} /></div>
      <p className="text-xs text-zinc-500">Search clicks are not unique visitors. Google omits some queries for privacy; top-row totals may differ from overall totals. Updated {new Date(currentReport.fetchedAt).toLocaleString()}.</p>
    </>}
  </section>;
}
