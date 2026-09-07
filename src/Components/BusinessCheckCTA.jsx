import React from "react";

import {
  ArrowRight,
  Check,
  Search,
} from "lucide-react";

function BusinessCheckCTA() {
  return (
    <section className="bg-[#F7F5EF] px-5 pb-24 pt-8 lg:px-8 lg:pb-32">
      <div className="mx-auto max-w-7xl">
        <div
          className="
            relative
            overflow-hidden
            rounded-[2.5rem]
            bg-[#7547B8]
            px-6
            py-16
            text-white
            sm:px-10
            lg:px-16
            lg:py-20
          "
        >
          {/* Background shapes */}
          <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-[#F4F0A3]/20" />

          <div className="absolute -bottom-32 left-[35%] h-80 w-80 rounded-full bg-white/[0.05]" />

          <div className="relative z-10 grid gap-14 lg:grid-cols-[1fr_0.72fr] lg:items-center">
            {/* Copy */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#F4F0A3]">
                <Search size={14} />
                Free Online Business Check
              </div>

              <h2 className="mt-6 max-w-3xl text-4xl font-bold leading-[0.98] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
                How does your business look online?
              </h2>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-white/65">
                Tell us about your business and we’ll take a look at the
                customer-facing parts of your online presence to identify
                opportunities to improve.
              </p>

              <a
                href="/business-check"
                className="
                  mt-9
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  bg-[#F4F0A3]
                  px-7
                  py-4
                  font-semibold
                  text-[#17151A]
                  transition-all
                  duration-200
                  hover:-translate-y-1
                "
              >
                Check My Business

                <ArrowRight size={18} />
              </a>
            </div>

            {/* Checklist */}
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 backdrop-blur-sm sm:p-8">
              <p className="text-sm font-semibold text-white/45">
                We can look at
              </p>

              <div className="mt-6 space-y-5">
                <CheckItem text="Your website and mobile experience" />

                <CheckItem text="Google Business Profile presence" />

                <CheckItem text="Reviews and customer trust signals" />

                <CheckItem text="How easy it is to contact or choose your business" />
              </div>

              <div className="mt-8 border-t border-white/10 pt-6">
                <p className="text-sm leading-6 text-white/45">
                  No complicated audit. Just useful observations about where
                  your business could show up better.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CheckItem({ text }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F4F0A3] text-[#17151A]">
        <Check size={14} strokeWidth={3} />
      </div>

      <p className="font-medium leading-6 text-white/80">
        {text}
      </p>
    </div>
  );
}

export default BusinessCheckCTA;