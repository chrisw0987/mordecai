export default function DashboardSkeleton() {
  return (
    <main aria-busy="true" aria-label="Loading dashboard" className="min-h-screen dark-pattern px-4 py-[25px] sm:px-8">
      <span role="status" className="sr-only">Loading dashboard.</span>
      <div aria-hidden="true" className="mx-auto max-w-6xl space-y-6 motion-safe:animate-pulse">
        <div className="h-10 w-52 rounded-lg bg-zinc-800" />
        <div className="h-4 w-40 rounded bg-zinc-800" />
        <div className="flex flex-wrap gap-3">{Array.from({ length: 5 }, (_, index) => <div key={index} className="h-24 w-44 rounded-xl bg-zinc-900" />)}</div>
        <div className="h-10 w-72 rounded-lg bg-zinc-800" />
        <div className="rounded-xl bg-zinc-950 p-4">{Array.from({ length: 6 }, (_, index) => <div key={index} className="my-4 h-8 rounded bg-zinc-900" />)}</div>
      </div>
    </main>
  );
}
