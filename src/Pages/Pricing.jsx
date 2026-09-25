import React from "react";

import { Link } from "react-router-dom";

import {
  ArrowRight,
  Check,
  ChevronDown,
  Code2,
  Globe2,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";

const websitePlans = [
  {
    name: "Basic Website",
    price: "$400",
    description:
      "A clean, professional online presence for small businesses that need the essentials.",
    features: [
      "Up to 4 pages",
      "Mobile-friendly design",
      "Contact & location information",
      "Basic SEO setup",
      "2 revision rounds",
    ],
    featured: false,
  },
  {
    name: "Business Website",
    price: "$600",
    description:
      "A more customized website for businesses that need additional content and functionality.",
    features: [
      "Up to 6 pages",
      "Custom website design",
      "Forms, menus, or galleries",
      "Basic SEO setup",
      "3 revision rounds",
    ],
    featured: true,
  },
  {
    name: "Custom Website",
    price: "Let's Talk",
    description:
      "For larger websites, advanced features, or projects that need something more specific.",
    features: [
      "Larger website builds",
      "Special functionality",
      "Custom integrations",
      "Advanced project needs",
      "Scope & pricing quoted upfront",
    ],
    featured: false,
  },
];

const careFeatures = [
  "Hosting & hosting management",
  "Standard domain renewal",
  "Uptime & security monitoring",
  "SSL management",
  "Technical maintenance & bug fixes",
  "Up to 1 hour of minor website updates each month",
];

const extras = [
  {
    name: "Additional Page",
    price: "$75 / page",
  },
  {
    name: "Additional Website Work",
    price: "$50 / hour",
  },
  {
    name: "Booking / Ordering Integration",
    price: "Custom quote",
  },
  {
    name: "E-commerce / Custom Checkout",
    price: "Custom quote",
  },
];

const faqs = [
  {
    question: "What counts as a minor website update?",
    answer:
      "Minor updates include changes to existing text, business hours, dates, prices, photos, event information, sponsor logos, and similar existing content.",
  },
  {
    question: "What isn't included in Website Care?",
    answer:
      "New pages, new sections, major redesigns, new features, and substantial development are considered additional website work and are billed separately.",
  },
  {
    question: "Do unused Website Care hours roll over?",
    answer:
      "No. Website Care includes up to one hour of minor updates during each monthly billing period, and unused time does not roll over.",
  },
  {
    question: "Can I cancel Website Care?",
    answer:
      "Yes. Website Care is month-to-month and can be canceled before your next billing period.",
  },
  {
    question: "Do I have to purchase Website Care?",
    answer:
      "No. Website Care is completely optional. If you prefer to manage your website independently after launch, we'll help make that transition straightforward.",
  },
  {
    question: "What happens if my project needs something extra?",
    answer:
      "We'll discuss the request with you first. Any additional work and estimated cost will be approved by you before we begin, so there are no surprise charges.",
  },
];

function Pricing() {
  return (
    <main className="bg-[#F7F5EF] text-[#17151A]">

      {/* HERO */}
      <section className="relative overflow-hidden px-5 pb-24 pt-24 lg:px-8 lg:pb-28 lg:pt-28">
        <div className="absolute left-1/2 top-[-180px] h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[#7547B8]/10 blur-[110px]" />

        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="mt-7 text-5xl font-bold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
            A website built
            <br />
            <span className="text-[#7547B8]">
              around your business.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-[#17151A]/60 sm:text-lg">
            Professional websites for local businesses
            without complicated packages or agency-sized
            pricing. We handle the design, setup, launch,
            and technical side.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#website-plans"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#7547B8] px-7 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#6439A5] sm:w-auto"
            >
              View Website Plans
              <ArrowRight size={16} />
            </a>

            <Link
              to="/contact"
              className="inline-flex w-full items-center justify-center rounded-full border border-[#17151A]/15 bg-white/60 px-7 py-3.5 text-sm font-semibold transition hover:bg-white sm:w-auto"
            >
              Talk to Us
            </Link>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section
        id="website-plans"
        className="scroll-mt-24 px-5 py-20 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7547B8]">
              Website Services
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-[-0.045em] sm:text-5xl">
              Start with what your
              <br />
              business actually needs.
            </h2>

            <p className="mt-5 leading-7 text-[#17151A]/55">
              No oversized packages or unnecessary extras.
              Choose a starting point and we'll confirm
              everything with you before work begins.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {websitePlans.map((plan) => (
              <article
                key={plan.name}
                className={`
                  relative
                  flex
                  flex-col
                  rounded-[28px]
                  border
                  p-7
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-xl

                  ${
                    plan.featured
                      ? "border-[#7547B8] bg-[#7547B8] text-white shadow-xl shadow-[#7547B8]/15"
                      : "border-black/10 bg-white/65"
                  }
                `}
              >
                {plan.featured && (
                  <div className="absolute right-5 top-5 rounded-full bg-[#F4F0A3] px-3 py-1 text-xs font-bold text-[#17151A]">
                    Most Popular
                  </div>
                )}

                <p
                  className={`text-sm font-semibold ${
                    plan.featured
                      ? "text-white/70"
                      : "text-[#7547B8]"
                  }`}
                >
                  {plan.name}
                </p>

                <div className="mt-5">
                  <span className="text-4xl font-bold tracking-[-0.04em]">
                    {plan.price}
                  </span>

                  {plan.price.startsWith("$") && (
                    <span
                      className={`ml-2 text-sm ${
                        plan.featured
                          ? "text-white/55"
                          : "text-[#17151A]/45"
                      }`}
                    >
                      one-time
                    </span>
                  )}
                </div>

                <p
                  className={`mt-5 min-h-[72px] text-sm leading-6 ${
                    plan.featured
                      ? "text-white/70"
                      : "text-[#17151A]/55"
                  }`}
                >
                  {plan.description}
                </p>

                <div
                  className={`my-7 h-px ${
                    plan.featured
                      ? "bg-white/15"
                      : "bg-black/10"
                  }`}
                />

                <ul className="flex-1 space-y-4">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm"
                    >
                      <div
                        className={`
                          mt-0.5
                          flex
                          h-5
                          w-5
                          shrink-0
                          items-center
                          justify-center
                          rounded-full

                          ${
                            plan.featured
                              ? "bg-[#F4F0A3] text-[#17151A]"
                              : "bg-[#7547B8]/10 text-[#7547B8]"
                          }
                        `}
                      >
                        <Check
                          size={12}
                          strokeWidth={3}
                        />
                      </div>

                      <span
                        className={
                          plan.featured
                            ? "text-white/85"
                            : "text-[#17151A]/70"
                        }
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/contact"
                  className={`
                    mt-8
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-full
                    px-5
                    py-3.5
                    text-sm
                    font-semibold
                    transition

                    ${
                      plan.featured
                        ? "bg-white text-[#7547B8] hover:bg-[#F4F0A3] hover:text-[#17151A]"
                        : "bg-[#17151A] text-white hover:bg-[#7547B8]"
                    }
                  `}
                >
                  {plan.price === "Let's Talk"
                    ? "Get a Custom Quote"
                    : "Get Started"}

                  <ArrowRight size={15} />
                </Link>
              </article>
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-[#17151A]/40">
            Final project scope and pricing are
            confirmed before work begins.
          </p>
        </div>
      </section>

      {/* WEBSITE CARE */}
      <section className="px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-[#17151A] text-white">
          <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
            <div className="border-b border-white/10 p-8 sm:p-10 lg:border-b-0 lg:border-r">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7547B8]">
                <ShieldCheck size={23} />
              </div>

              <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-[#F4F0A3]">
                Optional Monthly Care
              </p>

              <h2 className="mt-3 text-4xl font-bold tracking-[-0.045em]">
                Website Care
              </h2>

              <div className="mt-6 flex items-end gap-2">
                <span className="text-5xl font-bold tracking-[-0.05em]">
                  $30
                </span>

                <span className="pb-1 text-white/40">
                  / month
                </span>
              </div>

              <p className="mt-6 max-w-sm leading-7 text-white/55">
                Keep the technical side off your plate.
                We'll handle the essentials and give you
                time every month for everyday website
                changes.
              </p>

              <div className="mt-7 inline-flex rounded-full border border-white/10 px-4 py-2 text-sm text-white/55">
                Month-to-month · Cancel anytime
              </div>
            </div>

            <div className="p-8 sm:p-10">
              <p className="font-semibold">
                Everything included:
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {careFeatures.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                  >
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#7547B8]">
                      <Check
                        size={12}
                        strokeWidth={3}
                      />
                    </div>

                    <span className="text-sm leading-6 text-white/70">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl bg-[#7547B8]/20 p-5">
                <p className="text-sm font-semibold text-[#F4F0A3]">
                  What can I use my update time for?
                </p>

                <p className="mt-2 text-sm leading-6 text-white/60">
                  Changes to existing text, hours,
                  dates, prices, photos, event
                  information, sponsor logos, and
                  similar existing website content.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ADDITIONAL WORK */}
      <section className="px-5 py-20 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7547B8]/10 text-[#7547B8]">
              <Wrench size={22} />
            </div>

            <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-[#7547B8]">
              Need Something Extra?
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-[-0.045em]">
              Add what your
              <br />
              business needs.
            </h2>

            <p className="mt-5 max-w-md leading-7 text-[#17151A]/55">
              Websites change as businesses grow. If you
              need something outside your original
              project or Website Care allowance, we can
              handle that too.
            </p>

            <div className="mt-7 flex gap-3 rounded-2xl border border-black/10 bg-white/60 p-5">
              <HeartHandshake
                size={20}
                className="mt-0.5 shrink-0 text-[#7547B8]"
              />

              <p className="text-sm leading-6 text-[#17151A]/60">
                <strong className="text-[#17151A]">
                  No surprise charges.
                </strong>{" "}
                Additional work and pricing are approved
                by you before we begin.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-black/10 bg-white/65">
            {extras.map((extra, index) => (
              <div
                key={extra.name}
                className={`
                  flex
                  items-center
                  justify-between
                  gap-5
                  p-6

                  ${
                    index !== extras.length - 1
                      ? "border-b border-black/10"
                      : ""
                  }
                `}
              >
                <span className="font-semibold">
                  {extra.name}
                </span>

                <span className="shrink-0 font-bold text-[#7547B8]">
                  {extra.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PAYMENT */}
      <section className="border-y border-black/10 bg-white/55 px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7547B8]">
              Simple From Start to Finish
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-[-0.045em] sm:text-5xl">
              How payment works.
            </h2>

            <p className="mt-5 leading-7 text-[#17151A]/55">
              You don't have to pay for the entire
              website before seeing the finished product.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Choose Your Website",
                text: "We'll confirm the package, project scope, and timeline with you.",
              },
              {
                number: "02",
                title: "50% to Get Started",
                text: "Approve your project agreement and pay the deposit so we can begin.",
              },
              {
                number: "03",
                title: "50% at Completion",
                text: "Pay the remaining balance when your website is substantially complete and ready to launch.",
              },
            ].map((step) => (
              <div
                key={step.number}
                className="rounded-[26px] border border-black/10 bg-[#F7F5EF] p-7"
              >
                <span className="text-sm font-bold text-[#7547B8]">
                  {step.number}
                </span>

                <h3 className="mt-5 text-lg font-bold">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#17151A]/55">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="px-5 py-20 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-3">
          {[
            {
              icon: Globe2,
              title: "Built for Local Business",
              text: "Practical websites designed around what your customers actually need to find.",
            },
            {
              icon: Code2,
              title: "Technical Side Handled",
              text: "From mobile responsiveness to domains and hosting, we make the technical side easier.",
            },
            {
              icon: HeartHandshake,
              title: "A Real Person to Contact",
              text: "When something needs changing, you know who to reach instead of dealing with a faceless platform.",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7547B8]/10 text-[#7547B8]">
                  <Icon size={22} />
                </div>

                <h3 className="mt-5 font-bold">
                  {item.title}
                </h3>

                <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-[#17151A]/55">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white/55 px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7547B8]">
              Questions
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-[-0.045em]">
              A few things you might
              be wondering.
            </h2>
          </div>

          <div className="divide-y divide-black/10 border-y border-black/10">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-semibold">
                  {faq.question}

                  <ChevronDown
                    size={18}
                    className="shrink-0 text-[#7547B8] transition-transform group-open:rotate-180"
                  />
                </summary>

                <p className="max-w-2xl pb-6 pr-10 text-sm leading-6 text-[#17151A]/55">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[32px] bg-[#7547B8] px-6 py-16 text-center text-white sm:px-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F4F0A3]">
            Ready When You Are
          </p>

          <h2 className="mx-auto mt-4 max-w-2xl text-4xl font-bold tracking-[-0.05em] sm:text-5xl">
            Let's build something
            your business can be proud of.
          </h2>

          <p className="mx-auto mt-6 max-w-xl leading-7 text-white/65">
            Tell us about your business and what you're
            looking for. We'll help you figure out the
            right next step.
          </p>

          <Link
            to="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#F4F0A3] px-7 py-3.5 text-sm font-bold text-[#17151A] transition hover:-translate-y-0.5 hover:bg-white"
          >
            Get Started
            <ArrowRight size={16} />
          </Link>

          <p className="mt-6 text-xs text-white/45">
            No obligation · Project pricing confirmed
            before work begins
          </p>
        </div>

        <div className="mx-auto mt-8 flex max-w-5xl flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-[#17151A]/40">
          <Link
            to="/contact"
            className="transition hover:text-[#7547B8]"
          >
            Contact Mordecai
          </Link>

          <span>•</span>

          <Link
            to="/terms"
            className="transition hover:text-[#7547B8]"
          >
            Website Service Terms
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Pricing;