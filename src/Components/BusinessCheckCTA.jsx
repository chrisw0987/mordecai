import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function BusinessCheckCTA() {
  return (
    <section className="bg-ivory px-5 pb-8 pt-2 lg:px-8 lg:pb-10">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 rounded-3xl bg-[#7547B8] px-5 py-5 text-white sm:px-7">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">How does your business look online?</h2>
          <p className="mt-1 text-sm text-white/85 sm:text-base">Get a free look at your website, Google listing, and reviews.</p>
        </div>
        <Link to="/business-check" className="inline-flex items-center gap-2 rounded-full bg-[#F4F0A3] px-5 py-3 text-sm font-bold text-[#17151A] hover:bg-bone">
          Check My Business <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
