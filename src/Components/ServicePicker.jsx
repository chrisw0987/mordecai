import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function ServicePicker({ label, options, selected, onChange, disabled = false }) {
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  const choices = useRef(null);
  const [position, setPosition] = useState(null);
  const trigger = useRef(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    function closeOutside(event) {
      if (!root.current?.contains(event.target) && !choices.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return;
    function place() {
      const rect = trigger.current.getBoundingClientRect();
      const below = window.innerHeight - rect.bottom - 16;
      const above = rect.top - 16;
      const up = below < 260 && above > below;
      setPosition({
        position: "fixed", left: Math.max(8, Math.min(rect.left, window.innerWidth - Math.min(rect.width, window.innerWidth - 16) - 8)),
        width: Math.min(rect.width, window.innerWidth - 16),
        maxHeight: Math.max(80, Math.min(288, up ? above : below)),
        ...(up ? { bottom: window.innerHeight - rect.top + 6 } : { top: rect.bottom + 6 }),
      });
    }
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => { window.removeEventListener("resize", place); window.removeEventListener("scroll", place, true); };
  }, [open, selected.length]);

  return <div ref={root} className={`relative text-sm text-zinc-300 ${open ? "z-30" : ""}`} onKeyDown={(event) => {
    if (event.key === "Escape") { setOpen(false); trigger.current?.focus(); }
  }} onBlur={(event) => {
    const next = event.relatedTarget;
    // Label clicks can temporarily report no relatedTarget before the checkbox receives focus.
    // Pointer-down outside handles that case without removing the option before its click.
    if (next instanceof Node && !event.currentTarget.contains(next) && !choices.current?.contains(next)) setOpen(false);
  }}>
    <span id={`${id}-label`}>{label}</span>
    <button ref={trigger} type="button" disabled={disabled} aria-expanded={open} aria-controls={`${id}-choices`} aria-labelledby={`${id}-label ${id}-selection`}
      className="mt-1 flex w-full items-center justify-between gap-2 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-left focus:outline-2 focus:outline-violet-400 disabled:opacity-50"
      onClick={() => setOpen((current) => !current)}>
      <span id={`${id}-selection`}>{selected.length ? selected.join(", ") : "Select services"}</span><span aria-hidden="true">{open ? "−" : "+"}</span>
    </button>
    {open && position && createPortal(<div ref={choices} style={position} id={`${id}-choices`} role="group" aria-labelledby={`${id}-label`} className="z-[100] grid gap-2 overflow-y-auto rounded-lg border border-zinc-700 bg-zinc-950 p-3 text-sm text-zinc-300 shadow-xl">
      {[...new Set([...options, ...selected])].map((service) => <label key={service} className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-2 hover:bg-zinc-800">
        <input type="checkbox" disabled={disabled} className="accent-violet-400" checked={selected.includes(service)} onChange={(event) => {
          const checked = event.target.checked;
          onChange(checked ? [...new Set([...selected, service])] : selected.filter((item) => item !== service));
        }} />{service}
      </label>)}
    </div>, document.body)}
  </div>;
}
