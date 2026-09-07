import React from "react";

import {
  ArrowUpRight,
  Globe2,
  MapPin,
  Sparkles,
  Wrench,
} from "lucide-react";

const services = [
  {
    number: "01",
    title: "Websites",
    eyebrow: "Make the first impression count.",
    description:
      "Modern, mobile-first websites designed to help customers understand your business, trust it, and take action.",
    icon: Globe2,
    points: [
      "New website builds",
      "Website redesigns",
      "Mobile optimization",
      "Landing pages",
    ],
    accent: "bg-[#7547B8]",
    iconBg: "bg-[#7547B8]",
  },
  {
    number: "02",
    title: "Google Presence",
    eyebrow: "Be there when customers are searching.",
    description:
      "We help strengthen how your business appears across Google and local search so customers can find the right information quickly.",
    icon: MapPin,
    points: [
      "Google Business Profile setup",
      "Profile optimization",
      "Local search improvements",
      "Business information cleanup",
    ],
    accent: "bg-[#F4F0A3]",
    iconBg: "bg-[#F4F0A3]",
  },
  {
    number: "03",
    title: "Reviews & Reputation",
    eyebrow: "Turn great experiences into visible trust.",
    description:
      "Make it easier for happy customers to share their experience and help future customers feel confident choosing you.",
    icon: Sparkles,
    points: [
      "NFC review cards",
      "Review landing pages",
      "Customer feedback flows",
      "Reputation tools",
    ],
    accent: "bg-[#AFCB83]",
    iconBg: "bg-[#AFCB83]",
  },
  {
    number: "04",
    title: "Digital Tools",
    eyebrow: "Make doing business with you easier.",
    description:
      "Useful custom tools and lightweight automation designed around how your business actually works.",
    icon: Wrench,
    points: [
      "Forms and lead capture",
      "Booking integrations",
      "Custom business tools",
      "Practical automation",
    ],
    accent: "bg-[#17151A]",
    iconBg: "bg-[#17151A]",
  },
];

function ServicesOverview() {
  return (
    <section
      id="services"
      className="bg-[#F7F5EF] px-5 py-24 lg:px-8 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7547B8]">
              What we do
            </p>

            <h2 className="mt-5 max-w-lg text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-[#17151A] sm:text-5xl lg:text-6xl">
              Everything you need to show up better.
            </h2>

            <p className="mt-7 max-w-md text-lg leading-8 text-[#17151A]/60">
              We focus on the parts of your online presence that influence
              whether someone finds your business, trusts it, and chooses it.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <article
                  key={service.number}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-[2rem]
                    border
                    border-black/[0.07]
                    bg-white
                    p-6
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-[0_20px_60px_rgba(23,21,26,0.08)]
                    sm:p-7
                  "
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-xs font-bold tracking-[0.18em] text-[#17151A]/30">
                      {service.number}
                    </span>

                    <div
                      className={`
                        flex
                        h-12 w-12
                        items-center
                        justify-center
                        rounded-2xl
                        ${service.iconBg}
                        ${
                          service.number === "02" ||
                          service.number === "03"
                            ? "text-[#17151A]"
                            : "text-white"
                        }
                      `}
                    >
                      <Icon size={21} />
                    </div>
                  </div>

                  <div className="mt-10">
                    <h3 className="text-2xl font-bold tracking-[-0.03em] text-[#17151A]">
                      {service.title}
                    </h3>

                    <p className="mt-2 font-semibold text-[#7547B8]">
                      {service.eyebrow}
                    </p>

                    <p className="mt-5 leading-7 text-[#17151A]/55">
                      {service.description}
                    </p>

                    <ul className="mt-6 space-y-3">
                      {service.points.map((point) => (
                        <li
                          key={point}
                          className="flex items-center gap-3 text-sm font-medium text-[#17151A]/70"
                        >
                          <span
                            className={`
                              h-2 w-2
                              rounded-full
                              ${service.accent}
                            `}
                          />

                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    className="
                      mt-8
                      inline-flex
                      items-center
                      gap-2
                      bg-transparent
                      p-0
                      text-sm
                      font-semibold
                      text-[#17151A]
                      shadow-none
                      transition-colors
                      hover:text-[#7547B8]
                    "
                  >
                    Learn more
                    <ArrowUpRight size={16} />
                  </button>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mt-20 overflow-hidden rounded-[2rem] bg-[#7547B8]">
          <div className="grid items-center gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1fr_auto] lg:px-12 lg:py-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F4F0A3]">
                Not sure where to start?
              </p>

              <h3 className="mt-3 max-w-2xl text-3xl font-bold tracking-[-0.035em] text-white sm:text-4xl">
                We’ll help you figure out what your business actually needs.
              </h3>

              <p className="mt-3 max-w-xl leading-7 text-white/65">
                Start with a free online business check and we'll show you where there's room to improve.
              </p>
            </div>

            <a
              href="/business-check"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-full
                bg-[#F4F0A3]
                px-6
                py-4
                font-semibold
                text-[#17151A]
                transition-all
                duration-200
                hover:-translate-y-0.5
              "
            >
              Check My Business
              <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ServicesOverview;