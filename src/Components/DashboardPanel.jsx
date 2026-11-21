import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function DashboardPanel({ title, count, children, className = "mt-3", badge }) {
  const id = useId();
  const [expanded, setExpanded] = useState(null);
  const open = expanded ?? count > 0;
  return <section className={`${className} rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3`}>
    <h2 className="font-semibold text-white">
      <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setExpanded(!open)} className="flex w-full items-center gap-2 text-left">
        <span>{title} ({count})</span>
        {badge}
        <ChevronDown size={18} aria-hidden="true" className={`ml-auto shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
    </h2>
    <div id={id} hidden={!open}>{children}</div>
  </section>;
}
