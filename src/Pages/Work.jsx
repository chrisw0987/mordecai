import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import Portfolio from "../Components/Portfolio";

export default function Work() {
  return (
    <main className="dark-pattern text-white">
      <Portfolio detailed />
      <section className="px-5 pb-8 lg:px-8 lg:pb-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/15 bg-[#242128] p-4 sm:p-5">
          <h2 className="text-xl font-bold tracking-tight">Have a project in mind?</h2>
          <Link to="/contact" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#F4F0A3] px-5 py-2.5 text-sm font-bold text-[#17151A] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F4F0A3]">
            Contact Us <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
