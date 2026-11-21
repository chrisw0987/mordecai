import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

export default function LeadNotesDialog({ record, onClose, onSave }) {
  const [notes, setNotes] = useState(record.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      if (previous?.isConnected) previous.focus();
    };
  }, []);

  async function save() {
    if (saving) return;
    setSaving(true);
    setError("");
    try {
      await onSave(notes);
      onClose();
    } catch {
      setError("Couldn't save notes. Your changes are still here. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4" onClick={(event) => {
    if (!saving && event.target === event.currentTarget) onClose();
  }} onKeyDown={(event) => {
    if (event.key === "Escape") { event.preventDefault(); if (!saving) onClose(); }
    if (event.key === "Tab") {
      const controls = [...dialogRef.current.querySelectorAll("button:not(:disabled), textarea:not(:disabled)")];
      const first = controls[0], last = controls.at(-1);
      if (!first) { event.preventDefault(); return; }
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  }}>
    <section ref={dialogRef} aria-busy={saving} role="dialog" aria-modal="true" aria-labelledby="lead-notes-title" className="relative flex max-h-[80dvh] w-full max-w-lg flex-col rounded-sm border border-yellow-200 bg-yellow-100 p-6 text-zinc-900 shadow-2xl sm:p-8">
      <div aria-hidden="true" className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-3 bg-yellow-200/80" />
      <div className="flex items-start justify-between gap-4 border-b border-yellow-300 pb-3">
        <h2 id="lead-notes-title" className="min-w-0 break-words text-lg font-semibold">Notes — {record.name}</h2>
        <button ref={closeRef} disabled={saving} type="button" aria-label="Close notes" onClick={onClose} className="shrink-0 rounded p-1 hover:bg-yellow-200 focus-visible:outline-2 focus-visible:outline-zinc-800"><X size={20} aria-hidden="true" /></button>
      </div>
      <textarea aria-label="Lead notes" disabled={saving} value={notes} onChange={(event) => setNotes(event.target.value)} rows={8} placeholder="Write your notes here..." className="mt-4 min-h-24 w-full flex-1 resize-y overflow-y-auto rounded border border-yellow-300 bg-yellow-50/50 p-3 text-sm leading-7 text-zinc-900 placeholder:text-zinc-500 focus:outline-2 focus:outline-yellow-600" />
      {error && <p role="alert" className="mt-3 text-sm text-red-800">{error}</p>}
      <div className="mt-4 flex shrink-0 justify-end gap-3">
        <button type="button" disabled={saving} onClick={onClose} className="rounded-lg border border-yellow-400 px-4 py-2 text-sm">Cancel</button>
        <button type="button" disabled={saving} onClick={() => { void save(); }} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-yellow-100 disabled:opacity-50">{saving ? "Saving..." : "Save notes"}</button>
      </div>
    </section>
  </div>;
}
