import React from "react";

import {
  Handshake,
  Lightbulb,
  MapPin,
} from "lucide-react";

const reasons = [
  {
    number: "01",
    title: "Built around your business",
    description:
      "We don’t force every business into the same template. We look at what you actually need and build around it.",
    icon: Handshake,
  },
  {
    number: "02",
    title: "Technology with a purpose",
    description:
      "No complicated tools just for the sake of having them. Everything we build should make your business easier to find, trust, or use.",
    icon: Lightbulb,
  },
  {
    number: "03",
    title: "Made for local businesses",
    description:
      "We understand that another call, visit, reservation, order, or repeat customer can make a real difference.",
    icon: MapPin,
  },
];

function WhyUs() {
  return (
    <section
      id="why-us"
      className="bg-[#F7F5EF] px-5 py-24 lg:px-8 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          {/* Left side */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7547B8]">
              Why Mordecai
            </p>

            <h2 className="mt-5 max-w-xl text-4xl font-bold leading-[1.02] tracking-[-0.05em] text-[#17151A] sm:text-5xl lg:text-6xl">
              Small business deserves better than one-size-fits-all.
            </h2>

            <p className="mt-7 max-w-lg text-lg leading-8 text-[#17151A]/60">
              We combine design, technology, and local-business thinking to
              strengthen the parts of your online presence that actually
              influence customers.
            </p>
          </div>

          {/* Right side */}
          <div className="space-y-4">
            {reasons.map((reason) => {
              const Icon = reason.icon;

              return (
                <article
                  key={reason.number}
                  className="
                    group
                    grid
                    gap-6
                    rounded-[2rem]
                    border
                    border-black/[0.07]
                    bg-white
                    p-6
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-[0_20px_60px_rgba(23,21,26,0.07)]
                    sm:grid-cols-[70px_1fr_auto]
                    sm:items-center
                    sm:p-7
                  "
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#7547B8]/10 text-[#7547B8]">
                    <Icon size={23} />
                  </div>

                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold tracking-[0.16em] text-[#17151A]/25">
                        {reason.number}
                      </span>

                      <h3 className="text-xl font-bold tracking-[-0.025em] text-[#17151A] sm:text-2xl">
                        {reason.title}
                      </h3>
                    </div>

                    <p className="mt-3 max-w-2xl leading-7 text-[#17151A]/55">
                      {reason.description}
                    </p>
                  </div>

                  <div className="hidden h-2 w-2 rounded-full bg-[#F4F0A3] sm:block" />
                </article>
              );
            })}
          </div>
        </div>

        {/* Brand statement */}
        <div className="mt-20 border-t border-black/10 pt-10">
          <div className="grid gap-6 md:grid-cols-[auto_1fr] md:items-center md:gap-10">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#7547B8]">
              Mordecai
            </p>

            <p className="max-w-4xl text-2xl font-semibold leading-snug tracking-[-0.035em] text-[#17151A] sm:text-3xl">
              We help local businesses get found, look better, and build the
              trust that turns attention into customers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyUs;