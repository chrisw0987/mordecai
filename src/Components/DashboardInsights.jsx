import SearchConsoleReports from "./SearchConsoleReports";

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const panel = "rounded-xl border border-zinc-800 bg-zinc-950 p-4";

export default function DashboardInsights({ clients, pipeline, serviceOptions, client }) {
  const websiteRevenue = clients.reduce((sum, record) => sum + Number(record.websiteCost || 0), 0);
  const reviewRevenue = clients.reduce((sum, record) => sum + Number(record.reviewCardCost || 0), 0);
  const careClients = clients.filter((record) => record.services.includes("Monthly Website Care"));
  const recurring = clients.reduce((sum, record) => sum + Number(record.monthly || 0), 0);
  const industries = Object.entries(clients.reduce((counts, record) => {
    const type = record.businessType.trim() || "Unspecified";
    counts[type] = (counts[type] || 0) + 1;
    return counts;
  }, {})).sort((a, b) => b[1] - a[1]);
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - 5 + index);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    return { label: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }), count: clients.filter((record) => record.dateAcquired.startsWith(key)).length };
  });
  const stages = ["New Lead", "Researching", "Pitching", "Waiting for Response Back", "Rejected"];

  function bars(items, maximum) {
    return <ul className="mt-4 space-y-3">{items.map(({ label, count }) => <li key={label}>
      <div className="mb-1 flex justify-between gap-3 text-sm"><span>{label}</span><span className="text-white">{count}</span></div>
      <div className="h-2 overflow-hidden rounded-full bg-zinc-800" aria-hidden="true"><div className="h-full rounded-full bg-violet-400" style={{ width: `${maximum ? count / maximum * 100 : 0}%` }} /></div>
    </li>)}</ul>;
  }

  return <section aria-labelledby="insights-title" className="mt-5 space-y-4">
    <SearchConsoleReports client={client} />
    <div><h2 id="insights-title" className="text-xl font-semibold text-white">Business insights</h2><p className="mt-1 text-sm text-zinc-400">Across all saved records. Client charts use current clients; pipeline uses leads.</p></div>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <section className={panel} data-scroll-reveal="slide">
        <h3 className="font-semibold text-white">Revenue breakdown</h3>
        <dl className="mt-4 space-y-3 text-sm">
          {[["Website charges", usd.format(websiteRevenue)], ["Review card charges", usd.format(reviewRevenue)], ["Monthly recurring", `${usd.format(recurring)} / month`], ["Average one-time charges per client", clients.length ? usd.format((websiteRevenue + reviewRevenue) / clients.length) : "—"]].map(([label, value]) => <div key={label} className="flex justify-between gap-3"><dt className="text-zinc-400">{label}</dt><dd className="text-right text-white">{value}</dd></div>)}
        </dl>
        <p className="mt-4 text-xs text-zinc-500">Recorded charges, not payment history. Monthly fees are separate; custom tool charges are not tracked yet.</p>
      </section>
      <section className={panel} data-scroll-reveal="slide"><h3 className="font-semibold text-white">Services clients use</h3>{bars(serviceOptions.map((label) => ({ label, count: clients.filter((record) => record.services.includes(label)).length })), clients.length)}<p className="mt-3 text-xs text-zinc-500">Clients can use more than one service.</p></section>
      <section className={panel} data-scroll-reveal="slide"><h3 className="font-semibold text-white">Clients acquired</h3><p className="mt-1 text-xs text-zinc-500">Last six months · Date Acquired</p>{bars(months, Math.max(...months.map((month) => month.count), 1))}<p className="mt-3 text-xs text-zinc-500">{clients.filter((record) => !record.dateAcquired).length} clients have no acquisition date.</p></section>
      <section className={panel} data-scroll-reveal="slide"><h3 className="font-semibold text-white">Business types</h3>{industries.length ? bars(industries.map(([label, count]) => ({ label, count })), clients.length) : <p className="mt-4 text-sm text-zinc-500">Add clients and business types to see the breakdown.</p>}</section>
      <section className={panel} data-scroll-reveal="slide"><h3 className="font-semibold text-white">Lead pipeline</h3>{bars(stages.map((label) => ({ label, count: pipeline.filter((record) => record.status === label).length })), pipeline.length)}<p className="mt-3 text-xs text-zinc-500">{pipeline.filter((record) => record.status !== "Rejected").length} open leads and projects</p></section>
      <section className={panel} data-scroll-reveal="slide"><h3 className="font-semibold text-white">Website care adoption</h3><p className="mt-4 text-3xl font-semibold text-violet-300">{clients.length ? `${Math.round(careClients.length / clients.length * 100)}%` : "—"}</p><p className="mt-2 text-sm text-zinc-400">{careClients.length} of {clients.length} clients use Monthly Website Care.</p><p className="mt-4 text-xs text-zinc-500">A starting point for reviewing recurring service opportunities.</p></section>
    </div>
  </section>;
}
