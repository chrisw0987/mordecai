import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function ClientServicesCell({ record, options, disabled, onSave }) {
  const [position, setPosition] = useState(null);
  const [selected, setSelected] = useState(record.services);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const trigger = useRef(null);
  const popup = useRef(null);
  const id = useId();
  function close() { if (!saving) { setPosition(null); trigger.current?.focus(); } }
  useEffect(() => {
    if (!position) return;
    popup.current?.querySelector("input")?.focus();
  }, [position]);
  async function save() {
    if (saving) return;
    setSaving(true); setError("");
    try { await onSave(selected); setPosition(null); trigger.current?.focus(); }
    catch { setError("Couldn't save services. Please try again."); }
    finally { setSaving(false); }
  }
  return <>
    <button ref={trigger} type="button" disabled={disabled} aria-label={`Edit services for ${record.name}`} aria-haspopup="dialog" aria-expanded={!!position} aria-controls={position ? id : undefined}
      className="w-full rounded py-1 text-left text-violet-300 underline decoration-dotted underline-offset-4 hover:text-violet-200 disabled:opacity-50" onClick={() => {
        const rect = trigger.current.getBoundingClientRect();
        setSelected(record.services); setError("");
        setPosition({ top: Math.max(8, Math.min(rect.bottom + 6, window.innerHeight - 420)), left: Math.max(8, Math.min(rect.left, window.innerWidth - 336)) });
      }}>{record.service || "Select services"}</button>
    {position && createPortal(<div className="fixed inset-0 z-50" onClick={(event) => { if (event.target === event.currentTarget) close(); }} onKeyDown={(event) => {
      if (event.key === "Escape") { event.preventDefault(); close(); }
      if (event.key === "Tab") {
        const controls = [...popup.current.querySelectorAll("input:not(:disabled),button:not(:disabled)")];
        const first = controls[0], last = controls.at(-1);
        if (!first) event.preventDefault();
        else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    }}>
      <section ref={popup} id={id} role="dialog" aria-modal="true" aria-labelledby={`${id}-title`} aria-busy={saving} style={position} className="fixed flex max-h-[calc(100dvh-16px)] w-80 max-w-[calc(100vw-16px)] flex-col rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-sm text-zinc-100 shadow-2xl">
        <h2 id={`${id}-title`} className="mb-2 font-semibold">Services — {record.name}</h2>
        <div className="min-h-0 overflow-y-auto">
          {[...new Set([...options, ...record.services])].map((service) => <label key={service} className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-2 hover:bg-zinc-800">
            <input type="checkbox" disabled={saving} checked={selected.includes(service)} className="accent-violet-400" onChange={(event) => {
              const checked = event.target.checked;
              setSelected((current) => checked ? [...new Set([...current, service])] : current.filter((item) => item !== service));
            }} />{service}
          </label>)}
        </div>
        {error && <p role="alert" className="mt-2 text-red-300">{error}</p>}
        <div className="mt-3 flex shrink-0 justify-end gap-2">
          <button type="button" disabled={saving} onClick={close} className="rounded-lg border border-zinc-700 px-3 py-2">Cancel</button>
          <button type="button" disabled={saving} onClick={() => { void save(); }} className="rounded-lg bg-violet-300 px-3 py-2 font-semibold text-zinc-950">{saving ? "Saving..." : "Save"}</button>
        </div>
      </section>
    </div>, document.body)}
  </>;
}
