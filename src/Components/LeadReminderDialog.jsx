import { useEffect, useRef, useState } from "react";
import { suggestedReminder } from "../utils/leadReminders";

export default function LeadReminderDialog({ record, status, today, onSave, onClose, statusOptions }) {
  const [selectedStatus, setSelectedStatus] = useState(status);
  const changed = record.status !== selectedStatus;
  const closed = ["Rejected", "Secured Client"].includes(selectedStatus);
  const suggestion = suggestedReminder(status, today);
  const [action, setAction] = useState(record.nextAction || suggestion.nextAction);
  const [date, setDate] = useState(record.followUp || suggestion.followUp);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const ref = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    ref.current.querySelector("button").focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = overflow; if (previous?.isConnected) previous.focus(); };
  }, []);
  async function save(skip) {
    if (busy) return;
    setBusy(true); setError("");
    try {
      await onSave({ status: selectedStatus === "Secured Client" ? "Active client" : selectedStatus, next_action: skip || closed ? "" : action.trim(), follow_up: skip || closed ? null : date || null });
      onClose();
    } catch { setError("Couldn't save. Run the latest reminder SQL migration if needed, then try again. Your changes are still here."); }
    finally { setBusy(false); }
  }
  const field = "mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white";
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4" onKeyDown={(event) => {
    if (event.key === "Escape") { event.preventDefault(); if (!busy) onClose(); }
    if (event.key === "Tab") {
      const controls = [...ref.current.querySelectorAll("button:not(:disabled), input:not(:disabled), select:not(:disabled)")];
      const first = controls[0], last = controls.at(-1);
      if (!first) event.preventDefault();
      else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  }}>
    <section ref={ref} role="dialog" aria-modal="true" aria-labelledby="reminder-title" aria-busy={busy} className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-xl border border-zinc-700 bg-zinc-950 p-6 text-zinc-100">
      <h2 id="reminder-title" className="text-lg font-semibold">{changed ? "Update status and next action" : "Plan next action"}</h2>
      <p className="mt-2 text-sm text-zinc-400">{record.name}{changed && ` — ${status === "Waiting for Response Back" ? "Awaiting Response" : status}`}</p>
      <fieldset disabled={busy} className="mt-4 space-y-4 text-sm">
        <label className="block">Status
          <select className={field} value={selectedStatus} onChange={(event) => {
            const nextStatus = event.target.value;
            setSelectedStatus(nextStatus);
            const next = suggestedReminder(nextStatus, today);
            if (!action || action === suggestedReminder(selectedStatus, today).nextAction) setAction(next.nextAction);
            if (!date || date === suggestedReminder(selectedStatus, today).followUp) setDate(next.followUp);
          }}>
            {statusOptions.map((option) => <option key={option} value={option}>{option === "Waiting for Response Back" ? "Awaiting Response" : option}</option>)}
          </select>
        </label>
        {!closed && <>
          <p className="text-zinc-400">Suggested dates use business days, excluding weekends. Keep your existing date, choose another, or skip the reminder.</p>
          <label className="block">Next action<input className={field} value={action} onChange={(event) => setAction(event.target.value)} /></label>
          <label className="block">Reminder date (optional)<input type="date" className={field} value={date} onChange={(event) => setDate(event.target.value)} /></label>
        </>}
        {closed && <p className="text-zinc-400">This clears the lead's pending reminder.{selectedStatus === "Secured Client" && " The lead will move to Current Clients."}</p>}
      </fieldset>
      {error && <p role="alert" className="mt-3 text-sm text-red-300">{error}</p>}
      <div className="mt-5 flex flex-wrap justify-end gap-3">
        <button type="button" disabled={busy} className="rounded-lg border border-zinc-700 px-3 py-2" onClick={onClose}>Cancel</button>
        {!closed && <button type="button" disabled={busy} className="rounded-lg border border-zinc-700 px-3 py-2" onClick={() => { void save(true); }}>Skip reminder</button>}
        <button type="button" disabled={busy} className="rounded-lg bg-violet-300 px-3 py-2 font-semibold text-zinc-950" onClick={() => { void save(false); }}>{busy ? "Saving..." : "Save"}</button>
      </div>
    </section>
  </div>;
}
