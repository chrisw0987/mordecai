import { useEffect, useRef } from "react";

export default function DeleteBusinessDialog({ record, busy, error, onCancel, onConfirm }) {
  const cancelRef = useRef(null);
  const dialogRef = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    cancelRef.current?.focus();
    return () => { if (previous?.isConnected) previous.focus(); };
  }, []);

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4" onKeyDown={(event) => {
    if (event.key === "Escape") { event.preventDefault(); if (!busy) onCancel(); }
    if (event.key === "Tab") {
      const buttons = [...dialogRef.current.querySelectorAll("button:not(:disabled)")];
      const first = buttons[0], last = buttons.at(-1);
      if (!first) { event.preventDefault(); return; }
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  }}>
    <div ref={dialogRef} role="alertdialog" aria-modal="true" aria-labelledby="delete-title" aria-describedby="delete-description" aria-busy={busy} className="w-full max-w-md rounded-xl border border-zinc-700 bg-zinc-950 p-6 text-zinc-100 shadow-xl">
      <h2 id="delete-title" className="text-lg font-semibold">Are you sure you want to delete?</h2>
      <p id="delete-description" className="mt-3 text-sm text-zinc-400">This permanently deletes {record.name} from your dashboard.</p>
      {error && <p role="alert" className="mt-3 text-sm text-red-300">{error}</p>}
      <div className="mt-5 flex justify-end gap-3">
        <button ref={cancelRef} type="button" disabled={busy} onClick={onCancel} className="rounded-lg border border-zinc-700 px-4 py-2">Cancel</button>
        <button type="button" disabled={busy} onClick={onConfirm} className="rounded-lg bg-red-400 px-4 py-2 font-semibold text-zinc-950">{busy ? "Deleting..." : "Delete"}</button>
      </div>
    </div>
  </div>;
}
