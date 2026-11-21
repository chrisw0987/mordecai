import { useEffect, useState } from "react";
import { Bell, SquarePen, StickyNote, Trash2 } from "lucide-react";
import LeadReminderDialog from "../Components/LeadReminderDialog";
import { daysBetween, localDay, reminderGroups } from "../utils/leadReminders";
import LeadNotesDialog from "../Components/LeadNotesDialog";
import DeleteBusinessDialog from "../Components/DeleteBusinessDialog";
import DashboardPanel from "../Components/DashboardPanel";
import DashboardSkeleton from "../Components/DashboardSkeleton";
import DashboardInsights from "../Components/DashboardInsights";
import ServicePicker from "../Components/ServicePicker";
import ClientServicesCell from "../Components/ClientServicesCell";
import { domainRenewals, newestAcquiredFirst } from "../utils/domainRenewals";

const table = "mordecai_dashboard_businesses";
const columns = "*";
const statuses = ["New Lead", "Researching", "Pitching", "Waiting for Response Back", "Rejected", "Secured Client"];
const statusLabel = (status) => status === "Waiting for Response Back" ? "Awaiting Response" : status;
const locations = ["Long Island", "Brooklyn", "Queens"];
const serviceOptions = ["Website", "Monthly Website Care", "Review Cards", "Google Analytics", "Custom Tool"];
const blank = { location: "", nextAction: "", lastContacted: "", name: "", businessType: "", service: "", services: [], customTool: "", reviewCardCost: "", contactPerson: "", website: "", status: "New Lead", notes: "", googleMaps: "", monthly: "", followUp: "", websiteCost: "", dateAcquired: "", domainExpiresOn: "" };
const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const field = "w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white focus:outline-2 focus:outline-violet-400";

function closeDropdownOnBlur(event) {
  const dropdown = event.currentTarget;
  const nextTarget = event.relatedTarget;
  // Focus can move to the browser window, which is an EventTarget but not a Node.
  if (!(nextTarget instanceof Node) || !dropdown.contains(nextTarget)) dropdown.open = false;
}

function websiteUrl(value) {
  if (!value?.trim()) return "";
  try {
    const url = new URL(value.trim());
    return ["https:", "http:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function toRecord(row) {
  const { follow_up, ...record } = row;
  const customTool = row.service?.match(/Custom Tool\s*\(([\s\S]*)\)$/)?.[1] ?? "";
  const services = (row.service ?? "").replace(/Custom Tool\s*\([\s\S]*\)$/, "Custom Tool")
    .split(/\s*&\s*/).map((service) => service.trim()).filter(Boolean);
  const status = ({ "New lead": "New Lead", Contacted: "Researching", "Proposal sent": "Pitching", "In progress": "Waiting for Response Back" })[row.status] ?? row.status;
  return { ...record, status, location: row.location ?? "", nextAction: row.next_action ?? "", lastContacted: row.last_contacted ?? "", domainExpiresOn: row.domain_expires_on ?? "", notes: row.notes ?? "", googleMaps: row.google_maps_url ?? "", monthly: row.monthly == null ? "" : String(row.monthly), followUp: follow_up ?? "",
    websiteCost: row.website_cost == null ? "" : String(row.website_cost), dateAcquired: row.date_acquired ?? "",
    contactPerson: row.contact_person ?? "", businessType: row.business_type ?? "", website: row.website ?? "", services, customTool,
    reviewCardCost: row.review_card_cost == null ? "" : String(row.review_card_cost) };
}

export default function Dashboard({ client, onSignOut, signOutError }) {
  const [tab, setTab] = useState("clients");
  const [records, setRecords] = useState(null);
  const [loadingError, setLoadingError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [notesTarget, setNotesTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [reminderTarget, setReminderTarget] = useState(null);
  const [today, setToday] = useState(localDay);
  useEffect(() => {
    const refresh = () => setToday(localDay());
    const timer = setInterval(refresh, 60000);
    window.addEventListener("focus", refresh);
    return () => { clearInterval(timer); window.removeEventListener("focus", refresh); };
  }, []);
  const [leadStage, setLeadStage] = useState("New Lead");
  const [leadSearch, setLeadSearch] = useState("");
  const busy = saving || deleting;
  const [formOpen, setFormOpen] = useState(false);
  const [locationFilter, setLocationFilter] = useState("");
  const [serviceFilters, setServiceFilters] = useState([]);

  useEffect(() => {
    let active = true;
    async function loadRecords() {
      const { data, error } = await client.from(table).select(columns).order("created_at");
      if (!active) return;
      if (error) {
        if (["PGRST205", "42P01"].includes(error.code)) {
          setLoadingError("Supabase could not find the dashboard table. Run the dashboard SQL migration in the project configured for this app.");
        } else if (error.code === "42501") {
          setLoadingError("Supabase denied access to the dashboard table. Check the migration's permissions and owner UUID.");
        } else {
          const code = /^[A-Z0-9]+$/.test(error.code ?? "") ? ` (error ${error.code})` : "";
          setLoadingError(`Couldn't load dashboard records${code}. Reload to try again.`);
        }
        return;
      }
      setRecords(data.map(toRecord));
    }
    void loadRecords();
    return () => { active = false; };
  }, [client]);
  const [draft, setDraft] = useState(blank);
  const [error, setError] = useState("");
  const isLeadForm = draft.id ? draft.status !== "Active client" : tab === "pipeline";
  const clients = (records ?? []).filter((record) => record.status === "Active client");
  const pipeline = (records ?? []).filter((record) => record.status !== "Active client");
  const filterOptions = [...new Set([...serviceOptions, ...(records ?? []).flatMap((record) => record.services)])];
  const searchTerm = leadSearch.trim().toLowerCase();
  const visible = (tab === "clients" ? clients : pipeline)
    .filter((record) => serviceFilters.length === 0 || serviceFilters.some((service) => record.services.includes(service)))
    .filter((record) => tab !== "pipeline" || (
      (record.status === leadStage)
      && (!locationFilter || record.location === locationFilter)
      && (!searchTerm || [record.name, record.contactPerson, record.businessType].some((value) => value.toLowerCase().includes(searchTerm)))
    ))
    .sort(newestAcquiredFirst);
  const followUpGroups = reminderGroups(pipeline, today);
  const due = pipeline.filter(({ followUp, status }) => status !== "Rejected" && followUp && followUp <= today).length;
  const upcoming = clients.filter((record) => record.status !== "Rejected" && record.followUp && record.followUp >= today).sort((a, b) => a.followUp.localeCompare(b.followUp));
  const renewalReminders = domainRenewals(records ?? [], today);
  const dueDates = [
    ...upcoming.map((record) => ({ key: `followup-${record.id}`, record, date: record.followUp, kind: "Follow-up" })),
    ...renewalReminders.map(({ record, days }) => ({ key: `domain-${record.id}`, record, date: record.domainExpiresOn, kind: "Domain expiration", days })),
  ].sort((a, b) => a.date.localeCompare(b.date));
  const monthly = clients.reduce((sum, record) => sum + Number(record.monthly || 0), 0);
  const totalRevenue = clients.reduce((sum, record) => sum + Number(record.websiteCost || 0) + Number(record.reviewCardCost || 0), 0);

  async function save(event) {
    event.preventDefault();
    if (busy || records === null) return;
    if (!draft.name.trim()) {
      setError("Enter a business name.");
      return;
    }
    if (!isLeadForm && draft.services.includes("Website") && draft.website.trim() && !websiteUrl(draft.website)) {
      setError("Enter a website starting with https:// or http://.");
      return;
    }

    if (isLeadForm && draft.googleMaps.trim() && !websiteUrl(draft.googleMaps)) {
      setError("Enter a Google Maps link starting with https:// or http://.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const values = {
        name: draft.name.trim(),
        service: [...draft.services.filter((service) => service !== "Custom Tool"), ...draft.services.filter((service) => service === "Custom Tool")].map((service) => service === "Custom Tool" && draft.customTool.trim()
          ? `Custom Tool (${draft.customTool.trim()})` : service).join(" & "),
        contact_person: draft.contactPerson.trim(),
        business_type: draft.businessType.trim(),
        location: draft.location || null,
        notes: draft.notes.trim(),
        google_maps_url: websiteUrl(draft.googleMaps),
        website: isLeadForm ? draft.website : draft.services.includes("Website") ? websiteUrl(draft.website) : "",
        status: isLeadForm ? draft.status === "Secured Client" ? "Active client" : draft.status : "Active client",
        monthly: (!isLeadForm && !draft.services.includes("Monthly Website Care")) || draft.monthly === "" ? null : Number(draft.monthly),
        follow_up: ["Rejected", "Secured Client"].includes(draft.status) ? null : draft.followUp || null,
        next_action: ["Rejected", "Secured Client"].includes(draft.status) ? "" : draft.nextAction.trim(),
        last_contacted: draft.lastContacted || null,
        website_cost: (!isLeadForm && !draft.services.includes("Website")) || draft.websiteCost === "" ? null : Number(draft.websiteCost),
        review_card_cost: (!isLeadForm && !draft.services.includes("Review Cards")) || draft.reviewCardCost === "" ? null : Number(draft.reviewCardCost),
        date_acquired: draft.dateAcquired || null,
        domain_expires_on: draft.domainExpiresOn || null,
      };
      const businesses = client.from(table);
      const write = draft.id ? businesses.update(values).eq("id", draft.id) : businesses.insert(values);
      const { data, error } = await write.select(columns).single();
      if (error) throw error;
      const record = toRecord(data);
      setRecords((current) => draft.id
        ? current.map((item) => item.id === record.id ? record : item)
        : [...current, record]);
      setDraft(blank);
      setFormOpen(false);
      setTab(record.status === "Active client" ? "clients" : "pipeline");
      setLeadStage(record.status === "Active client" ? "New Lead" : record.status);
      setLeadSearch("");
    } catch (saveError) {
      setError(["PGRST204", "42703", "23514"].includes(saveError.code)
        ? "Run the latest dashboard SQL migrations in Supabase, then try saving again. Your changes are still in the form."
        : "Couldn't save this business. Your changes are still in the form.");
    } finally {
      setSaving(false);
    }
  }

  async function saveLeadNotes(notes) {
    const { data, error } = await client.from(table).update({ notes }).eq("id", notesTarget.id).select(columns).single();
    if (error || data?.id !== notesTarget.id) throw error || new Error("Save was not confirmed");
    const updated = toRecord(data);
    setRecords((current) => current.map((record) => record.id === updated.id ? updated : record));
    if (draft.id === updated.id) setDraft((current) => ({ ...current, notes: updated.notes }));
  }

  function changeLeadStatus(record, status) {
    if (busy || status === record.status || !statuses.includes(status)) return;
    setReminderTarget({ record, status });
  }

  async function updateLeadReminder(record, values) {
    const { data, error } = await client.from(table).update(values).eq("id", record.id).select(columns).single();
    if (error || data?.id !== record.id) throw error || new Error("Update was not confirmed");
    const updated = toRecord(data);
    setRecords((current) => current.map((item) => item.id === updated.id ? updated : item));
    if (draft.id === updated.id) {
      if (updated.status === "Active client") { setDraft(blank); setFormOpen(false); }
      else setDraft((current) => ({ ...current, status: updated.status, followUp: updated.followUp, nextAction: updated.nextAction, lastContacted: updated.lastContacted }));
    }
  }

  async function deleteBusiness() {
    if (!deleteTarget || busy) return;
    setDeleting(true);
    setDeleteError("");
    try {
      const { data, error } = await client.from(table).delete().eq("id", deleteTarget.id).select("id").single();
      if (error || data?.id !== deleteTarget.id) throw error || new Error("Delete was not confirmed");
      setRecords((current) => current.filter((record) => record.id !== deleteTarget.id));
      if (draft.id === deleteTarget.id) { setDraft(blank); setFormOpen(false); setError(""); }
      setDeleteTarget(null);
    } catch (deleteFailure) {
      setDeleteError(deleteFailure.code === "42501"
        ? "Deletion is not enabled. Run the dashboard delete SQL migration in Supabase, then try again."
        : "Couldn't delete this business. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  if (records === null) {
    if (!loadingError) return <DashboardSkeleton />;
    return (
      <main className="min-h-screen dark-pattern px-4 py-[25px] text-white sm:px-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p role={loadingError ? "alert" : "status"} className="mt-3">{loadingError || "Loading records…"}</p>
        <button type="button" className="mt-3 underline" onClick={onSignOut}>Sign out</button>
        {signOutError && <p role="alert" className="mt-2 text-red-300">{signOutError}</p>}
      </main>
    );
  }
  return (
    <main className="min-h-screen dark-pattern px-4 py-[25px] text-zinc-100 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-4xl font-semibold tracking-tight text-white">Dashboard</h1>
          <button type="button" className="rounded-lg border border-zinc-700 px-4 py-2" onClick={onSignOut}>Sign out</button>
        </div>
        {signOutError && <p role="alert" className="mt-2 text-red-300">{signOutError}</p>}
        <p className="mt-2 text-sm text-zinc-400">Welcome Back, Boss</p>
        <dl className="mt-6 flex flex-wrap items-start gap-3">
          {[
            ["Active clients", clients.length],
            ["Monthly recurring revenue", usd.format(monthly)],
            ["Open leads and projects", pipeline.filter((record) => record.status !== "Rejected").length],
            ["Follow-ups due", due],
            ["Total Revenue", usd.format(totalRevenue)],
          ].map(([label, value]) => (
            <div key={label} className="max-w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2">
              <dt className="text-sm text-zinc-400">{label}</dt>
              <dd className="mt-1 text-2xl font-semibold text-white">{value}</dd>
            </div>
          ))}
        </dl>

        <DashboardPanel title="Lead Follow-ups" count={followUpGroups.reduce((sum, [, leads]) => sum + leads.length, 0)} className="mt-5" badge={<span className="text-amber-300">{due} due</span>}>
          <div className="mt-3 grid gap-4 md:grid-cols-3">
            {followUpGroups.map(([label, leads]) => <section key={label} aria-label={`${label} follow-ups`}>
              <h3 className={`text-sm font-semibold ${label === "Overdue" ? "text-red-300" : label === "Today" ? "text-amber-300" : "text-violet-300"}`}>{label} ({leads.length})</h3>
              {leads.length ? <ul className="mt-2 space-y-2">{leads.map((record) => <li key={record.id} className="rounded-lg border border-zinc-800 p-3 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="break-words font-medium">{record.name}</p>
                    <p className="mt-1 whitespace-pre-wrap break-words text-zinc-400">{record.nextAction || "Review this lead"}</p>
                    <time dateTime={record.followUp} className="mt-1 block text-xs text-zinc-400">{record.followUp}</time>
                  </div>
                  <button type="button" disabled={busy} className="shrink-0 text-xs text-violet-300 underline" onClick={() => setReminderTarget({ record, status: record.status })}>Update</button>
                </div>
              </li>)}</ul> : <p className="mt-2 text-sm text-zinc-500">Nothing scheduled.</p>}
            </section>)}
          </div>
        </DashboardPanel>

        <DashboardPanel title="To-Do List" count={0} className="mt-5">
          <p className="mt-2 text-sm text-zinc-500">No tasks yet.</p>
        </DashboardPanel>

        <DashboardPanel title="Upcoming Due Dates" count={dueDates.length}>
          {dueDates.length ? <ul className="mt-2 divide-y divide-zinc-800">{dueDates.map(({ key, record, date, kind, days }) => <li key={key} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
            <div><span>{record.name} <span className="text-zinc-500">- {kind}</span></span>
              {kind === "Domain expiration" && <p className="mt-1 text-xs text-zinc-400">{days < 0 ? `${Math.abs(days)} days overdue` : days === 0 ? "Due today" : `${days} days remaining`}</p>}
            </div>
            <div className="flex items-center gap-3"><time dateTime={date} className={days < 0 ? "text-red-300" : days <= 30 ? "text-amber-300" : "text-violet-300"}>{date}</time>
              {kind === "Domain expiration" && <a href="#record-form" className="text-violet-300 underline" onClick={(event) => { if (busy) { event.preventDefault(); return; } setTab("clients"); setDraft(record); setFormOpen(true); setError(""); }}>Update</a>}
            </div>
          </li>)}</ul> : <p className="mt-1 text-sm text-zinc-500">No upcoming due dates.</p>}
        </DashboardPanel>

        <div className="mt-8 flex gap-2 border-b border-zinc-800 pb-3" aria-label="Dashboard views">
          {[["clients", "Current Clients"], ["pipeline", "Leads"], ["insights", "Insights"]].map(([key, label]) => (
            <button key={key} type="button" disabled={busy} aria-pressed={tab === key} onClick={() => { if (tab !== key) { setFormOpen(false); setDraft(blank); setError(""); } setTab(key); }}
              className={tab === key ? "rounded-lg bg-violet-300 px-4 py-2 font-semibold text-zinc-950" : "rounded-lg px-4 py-2 text-zinc-300 hover:bg-zinc-900"}>
              {label}
            </button>
          ))}
        </div>

        {tab === "insights" ? <DashboardInsights client={client} clients={clients} pipeline={pipeline} serviceOptions={filterOptions} /> : <>
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <details className="relative z-20 w-full max-w-sm rounded-lg border border-zinc-700 bg-zinc-950 text-sm" onBlur={closeDropdownOnBlur} onKeyDown={(event) => {
            if (event.key === "Escape") { event.currentTarget.open = false; event.currentTarget.querySelector("summary").focus(); }
          }}>
            <summary className="cursor-pointer px-3 py-2">{tab === "pipeline" ? "Service That Can Be Provided" : "Service Provided"}: {serviceFilters.length ? `${serviceFilters.length} selected` : "All services"}</summary>
            <div className="absolute left-0 top-full z-20 mt-2 grid max-h-80 w-full gap-2 overflow-y-auto rounded-lg border border-zinc-700 bg-zinc-950 p-3 shadow-xl">
              <p className="text-xs text-zinc-400">Show businesses matching any selected service.</p>
              {filterOptions.map((service) => <label key={service} className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-2 hover:bg-zinc-800">
                <input type="checkbox" className="accent-violet-400" checked={serviceFilters.includes(service)} onChange={(event) => {
                  const checked = event.target.checked;
                  setServiceFilters((current) => checked ? [...current, service] : current.filter((item) => item !== service));
                }} />{service}
              </label>)}
              {serviceFilters.length > 0 && <button type="button" className="justify-self-start text-violet-300 underline" onClick={() => setServiceFilters([])}>Clear filters</button>}
            </div>
          </details>
          {tab === "pipeline" && <label className="relative w-full sm:w-48">
            <span className="sr-only">Filter by location</span>
            <select value={locationFilter} onChange={(event) => setLocationFilter(event.target.value)} className={`${field} text-sm`}>
              <option value="">All locations</option>
              {locations.map((location) => <option key={location} value={location}>{location}</option>)}
            </select>
          </label>}
          <button type="button" aria-expanded={formOpen} aria-controls="record-form" disabled={busy} className="rounded-lg bg-violet-300 px-4 py-2 font-semibold text-zinc-950" onClick={() => {
            setDraft(blank); setError(""); setFormOpen((current) => !current);
          }}>{formOpen ? "Close form" : tab === "clients" ? "+ Add Client" : "+ Add Lead"}</button>
        </div>

        {tab === "pipeline" && <div className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Lead status filters">
            {statuses.slice(0, -1).map((status) => (
              <button key={status} type="button" aria-pressed={leadStage === status} disabled={busy}
                onClick={() => { setLeadStage(status); }}
                className={`rounded-lg border px-3 py-2 text-sm transition-colors ${leadStage === status ? "border-violet-300 bg-violet-300/15 text-violet-200" : "border-zinc-700 bg-zinc-950 text-zinc-400 hover:text-white"}`}>
                {statusLabel(status)} <strong className="ml-1 text-white">{pipeline.filter((record) => record.status === status).length}</strong>
              </button>
            ))}
          </div>
          <label className="grid w-full gap-1 text-sm text-zinc-400 sm:max-w-sm">Search leads
            <input type="search" value={leadSearch} onChange={(event) => setLeadSearch(event.target.value)} placeholder="Business, contact, or business type" className={field} />
          </label>
          <p role="status" className="text-sm text-zinc-400">{`${visible.length} ${visible.length === 1 ? "lead" : "leads"} shown`}</p>
        </div>}

        {formOpen && <form id="record-form" onSubmit={save} className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950 p-5">
          <h2 className="text-lg font-semibold text-white">{draft.id ? "Edit business" : tab === "clients" ? "Add a client" : "Add a lead"}</h2>
          <fieldset disabled={busy} className="mt-4 flex flex-wrap items-start gap-4">
            <div aria-hidden="true" className="order-1 basis-full" />
            <label className="order-0 grid w-full min-w-0 gap-1 text-sm text-zinc-300 sm:w-72">
              Business name
              <input required className={field} value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
            </label>
            <div className="order-2 w-full min-w-0 text-sm text-zinc-300 sm:max-w-md sm:flex-1 sm:basis-72">
              <ServicePicker label={isLeadForm ? "Service That Can Be Provided" : "Service Provided"} options={serviceOptions} selected={draft.services} disabled={busy}
                onChange={(services) => setDraft((current) => ({ ...current, services }))} />
            </div>
            {[
              ["contactPerson", "Contact Person", "text"],
              ["businessType", "Business Type", "text"],
              ...(!isLeadForm ? [["dateAcquired", "Date Acquired", "date"]] : []),
              ...(isLeadForm ? [["googleMaps", "Google Map Link", "url"]] : []),
              ...(!isLeadForm && draft.services.includes("Website") ? [["website", "Website", "url"], ["websiteCost", "Website Cost ($)", "number"]] : []),
              ...(!isLeadForm && draft.services.includes("Monthly Website Care") ? [["monthly", "Monthly fee (USD)", "number"]] : []),
              ...(!isLeadForm && draft.services.includes("Review Cards") ? [["reviewCardCost", "Review Card Cost ($)", "number"]] : []),
              ...(draft.services.includes("Custom Tool") ? [["customTool", "Custom Tool", "text"]] : []),
            ].map(([key, label, type]) => (
              <label key={key} className={`grid w-full min-w-0 gap-1 text-sm text-zinc-300 ${["contactPerson", "businessType"].includes(key) ? "order-0" : key === "dateAcquired" ? "order-1" : "order-3"} ${type === "number" ? "max-w-36" : type === "date" ? "max-w-48" : ["website", "googleMaps", "customTool"].includes(key) ? "sm:w-80" : "sm:w-56"}`}>
                {label}
                <input type={type} required={key === "name"} min={type === "number" ? "0" : undefined}
                  step={type === "number" ? "0.01" : undefined} value={draft[key]} className={field}
                  placeholder={key === "website" ? "https://example.com" : undefined}
                  onChange={(event) => setDraft({ ...draft, [key]: event.target.value })} />
              </label>
            ))}
            {isLeadForm && <>
              <label className="order-0 grid w-full gap-1 text-sm text-zinc-300 sm:w-48">Location
                <select className={field} value={draft.location} onChange={(event) => setDraft({ ...draft, location: event.target.value })}>
                  <option value="">Select location</option>
                  {locations.map((location) => <option key={location} value={location}>{location}</option>)}
                </select>
              </label>
              <label className="order-3 grid w-full gap-1 text-sm text-zinc-300 sm:max-w-64">Status
                <select className={field} value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value })}>
                  {statuses.map((status) => <option key={status} value={status}>{statusLabel(status)}</option>)}
                </select>
              </label>
              <label className="order-4 grid w-full gap-1 text-sm text-zinc-300 sm:max-w-2xl">Notes
                <textarea rows={3} className={`${field} resize-y`} value={draft.notes} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} />
              </label>
            </>}
          </fieldset>
          {!isLeadForm && draft.services.includes("Website") && <fieldset disabled={busy} className="mt-4">
            <label className="grid w-full max-w-48 gap-1 text-sm text-zinc-300">Domain Expiration
              <input type="date" disabled={!draft.services.includes("Website")} className={`${field} disabled:cursor-not-allowed disabled:opacity-40`} value={draft.domainExpiresOn} onChange={(event) => setDraft({ ...draft, domainExpiresOn: event.target.value })} />
            </label>
          </fieldset>}
          {error && <p role="alert" className="mt-4 text-sm text-red-300">{error}</p>}
          <div className="mt-5 flex gap-3">
            <button type="submit" disabled={busy} className="rounded-lg bg-violet-300 px-4 py-2 font-semibold text-zinc-950">{saving ? "Saving..." : isLeadForm ? draft.id ? "Save Lead" : "Create Lead" : "Save business"}</button>
            <button type="button" disabled={busy} className="rounded-lg border border-zinc-700 px-4 py-2" onClick={() => { setDraft(blank); setError(""); setFormOpen(false); }}>Cancel</button>
          </div>
        </form>}

        <div className="mt-5 overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950">
          {visible.length === 0 ? (
            <p className="p-5 text-zinc-400">{tab === "pipeline" && (searchTerm || locationFilter || leadStage !== "New Lead" || serviceFilters.length) ? "No leads match your search and filters." : serviceFilters.length ? "No businesses match the selected services." : tab === "clients" ? "No active clients yet." : "No leads or projects yet."}</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="text-zinc-400">
                <tr>{["Business", "Contact Person", tab === "pipeline" ? "Service That Can Be Provided" : "Service Provided", "Business Type", ...(tab === "pipeline" ? ["Status"] : ["Monthly fee", "Website Cost", "Review Card Cost", "Date Acquired"]), "Actions"].map((label) => (
                  <th key={label} scope="col" className="whitespace-nowrap px-4 py-3 font-medium">{label}</th>
                ))}</tr>
              </thead>
              <tbody>
                {visible.map((record) => (
                  <tr key={record.id} className="border-t border-zinc-800">
                    <th scope="row" className="px-4 py-3 text-white">
                      {websiteUrl(tab === "pipeline" ? record.googleMaps || record.website : record.website || record.googleMaps) ? (
                        <a href={websiteUrl(tab === "pipeline" ? record.googleMaps || record.website : record.website || record.googleMaps)} target="_blank" rel="noopener noreferrer" className="text-violet-300 underline underline-offset-4 hover:text-violet-200">{record.name}</a>
                      ) : record.name}
                      {tab === "clients" && record.services.includes("Website") && record.domainExpiresOn && <div className="mt-1 text-xs font-normal text-zinc-400">Domain expires {record.domainExpiresOn}</div>}
                    </th>
                    <td className="px-4 py-3">{record.contactPerson || "-"}</td>
                    <td className="px-4 py-3">{tab === "clients" ? <ClientServicesCell record={record} options={serviceOptions} disabled={busy} onSave={async (services) => {
                      const service = [...services.filter((item) => item !== "Custom Tool"), ...services.filter((item) => item === "Custom Tool")]
                        .map((item) => item === "Custom Tool" && record.customTool ? `Custom Tool (${record.customTool})` : item).join(" & ");
                      const { data, error } = await client.from(table).update({ service }).eq("id", record.id).select(columns).single();
                      if (error || data?.id !== record.id) throw error || new Error("Save was not confirmed");
                      const updated = toRecord(data);
                      setRecords((current) => current.map((item) => item.id === updated.id ? updated : item));
                      if (draft.id === updated.id) setDraft((current) => ({ ...current, services: updated.services, service: updated.service, customTool: updated.customTool }));
                    }} /> : record.service || "-"}</td>
                    <td className="px-4 py-3">{record.businessType || "-"}</td>
                    {tab === "pipeline" && <td className="px-4 py-3">
                      <select aria-label={`Status for ${record.name}`} disabled={busy} value={record.status} className={`${field} min-w-44 text-sm`} onChange={(event) => { void changeLeadStatus(record, event.target.value); }}>
                        {statuses.map((status) => <option key={status} value={status}>{statusLabel(status)}</option>)}
                      </select>
                      <p className="mt-2 text-xs text-zinc-500">{record.status_changed_at ? `${daysBetween(localDay(new Date(record.status_changed_at)), today)} days in this stage` : "Stage date not yet tracked"}</p>
                      <p className="mt-1 text-xs text-zinc-500">Last contact: {record.lastContacted || "Not recorded"}</p>
                      <p className={`mt-1 text-xs ${record.followUp && record.followUp < today ? "text-red-300" : "text-zinc-400"}`}>{record.followUp ? `Next action due ${record.followUp}` : "No reminder set"}</p>
                    </td>}
                    {tab === "clients" && <>
                    <td className="px-4 py-3">{record.monthly === "" ? "—" : usd.format(record.monthly)}</td>
                    <td className="px-4 py-3">{record.websiteCost === "" ? "-" : usd.format(record.websiteCost)}</td>
                    <td className="px-4 py-3">{record.reviewCardCost === "" ? "-" : usd.format(record.reviewCardCost)}</td>
                    <td className="whitespace-nowrap px-4 py-3">{record.dateAcquired || "-"}</td>
                    </>}
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex flex-nowrap items-center gap-2">
                      {tab === "pipeline" && record.status !== "Rejected" && <button type="button" disabled={busy} aria-label={`Plan next action for ${record.name}`} title="Plan next action" className="inline-flex shrink-0 rounded p-1 text-violet-300 hover:bg-violet-300/10" onClick={() => setReminderTarget({ record, status: record.status })}><Bell size={18} aria-hidden="true" /></button>}
                      {tab === "pipeline" && <button type="button" disabled={busy} aria-label={`View notes for ${record.name}`} title={record.notes?.trim() ? "Edit notes" : "Add notes"} className={`inline-flex shrink-0 rounded p-1 hover:bg-yellow-200/10 hover:text-yellow-200 disabled:opacity-50 ${record.notes?.trim() ? "text-yellow-200" : "text-zinc-500"}`} onClick={() => setNotesTarget(record)}><StickyNote size={18} aria-hidden="true" /></button>}
                      <a href="#record-form" aria-label={`Edit ${record.name}`} title="Edit" className="inline-flex shrink-0 rounded p-1 text-violet-300 hover:bg-violet-300/10 hover:text-violet-200" onClick={(event) => { if (busy) { event.preventDefault(); return; } setDraft(record); setFormOpen(true); setError(""); }}><SquarePen size={18} aria-hidden="true" /></a>
                      <button type="button" disabled={busy} aria-label={`Delete ${record.name}`} title="Delete" className="inline-flex shrink-0 rounded p-1 text-zinc-400 hover:bg-red-400/10 hover:text-red-300 disabled:opacity-50" onClick={() => { setDeleteError(""); setDeleteTarget(record); }}><Trash2 size={18} aria-hidden="true" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>


        </>}
      </div>
      {deleteTarget && <DeleteBusinessDialog record={deleteTarget} busy={deleting} error={deleteError} onCancel={() => setDeleteTarget(null)} onConfirm={deleteBusiness} />}
      {reminderTarget && <LeadReminderDialog record={reminderTarget.record} statusOptions={statuses} status={reminderTarget.status} today={today} onClose={() => setReminderTarget(null)} onSave={async (values) => {
        await updateLeadReminder(reminderTarget.record, values);
      }} />}
      {notesTarget && <LeadNotesDialog record={notesTarget} onSave={saveLeadNotes} onClose={() => setNotesTarget(null)} />}
    </main>
  );
}
