import React from "react";

import { Link } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileText,
  Mail,
  ShieldCheck,
} from "lucide-react";

const sections = [
  {
    number: "01",
    title: "Services & Project Scope",
    content: (
      <>
        <p>
          The services included in a website project are
          determined by the selected website package,
          approved add-ons, project agreement, proposal,
          and any other written project details agreed to
          by Mordecai and the Client.
        </p>

        <p>
          Requests outside the agreed project scope may
          require additional payment. This can include
          additional pages, new sections, major design
          changes, custom functionality, integrations,
          or other work not included in the original
          project.
        </p>

        <p>
          Mordecai will communicate with the Client and
          obtain approval before beginning chargeable
          additional work.
        </p>
      </>
    ),
  },
  {
    number: "02",
    title: "Website Packages & Revisions",
    content: (
      <>
        <p>
          Website packages include the number of pages,
          features, and revision rounds described on the
          Mordecai Pricing page or in the Client's
          individual project agreement.
        </p>

        <p>
          A revision round generally means a collection
          of reasonable changes requested by the Client
          after reviewing the website or project
          milestone.
        </p>

        <p>
          Requests beyond the included revision rounds,
          or requests that substantially change the
          previously approved direction or scope, may be
          considered Additional Website Work.
        </p>
      </>
    ),
  },
  {
    number: "03",
    title: "Payment",
    content: (
      <>
        <p>
          Unless otherwise agreed in writing, website
          projects require a 50% deposit before work
          begins. The remaining 50% is due when the
          agreed website is substantially complete and
          ready to launch.
        </p>

        <p>
          Mordecai may delay final launch, transfer,
          publication, or delivery of project materials
          while amounts currently due remain unpaid.
        </p>

        <p>
          Additional Website Work is currently billed at
          $40 per hour unless a different price is
          approved in writing before the work begins.
          Mordecai will obtain the Client's approval
          before performing chargeable additional work.
        </p>
      </>
    ),
  },
  {
    number: "04",
    title: "Client Content & Responsibilities",
    content: (
      <>
        <p>
          The Client is responsible for providing
          accurate business information and reasonably
          timely access to the materials, feedback, and
          approvals needed to complete the project.
        </p>

        <p>
          The Client is also responsible for having the
          right or permission to use any logos, photos,
          videos, text, trademarks, product information,
          or other materials supplied to Mordecai.
        </p>

        <p>
          Project timelines may change when Client
          materials, feedback, approvals, access, or
          payments are delayed.
        </p>
      </>
    ),
  },
  {
    number: "05",
    title: "Ownership",
    content: (
      <>
        <p>
          After full payment of the applicable project
          fees, the Client may use the completed
          Client-specific website and Client-specific
          content created for the project.
        </p>

        <p>
          Mordecai retains ownership of its reusable
          code, components, templates, systems, tools,
          methods, processes, know-how, and other
          materials that are not unique to a particular
          Client.
        </p>

        <p>
          Unless the Client requests otherwise in
          writing, Mordecai may identify the Client as a
          customer and display the completed project,
          business name, logo, or screenshots of the
          website in Mordecai's portfolio and marketing
          materials.
        </p>
      </>
    ),
  },
  {
    number: "06",
    title: "Domains & Hosting",
    content: (
      <>
        <p>
          Mordecai may purchase, configure, or manage a
          Client-specific domain and hosting services on
          the Client's behalf when those services are
          included in the project or a monthly plan.
        </p>

        <p>
          Standard domain renewal of up to $30 per year
          is included while an eligible monthly plan
          remains active. Premium domains, unusually
          expensive renewals, specialty domains, or
          additional domain purchases are not included
          unless otherwise agreed.
        </p>

        <p>
          If a monthly plan ends, future domain and
          hosting expenses become the Client's
          responsibility. Mordecai will reasonably
          assist with transferring Client-specific
          domains, website files, or applicable account
          access after outstanding amounts are paid.
        </p>
      </>
    ),
  },
  {
    number: "07",
    title: "Website Care",
    content: (
      <>
        <p>
          For new enrollments, Website Care is $50 per month.
          It includes hosting or hosting management, standard
          domain renewal as described above, basic technical
          upkeep and monitoring, and up to one hour of minor
          content updates each month. Website Care is optional
          and month-to-month. Existing clients keep the rate
          and scope in their agreements.
        </p>

        <p>
          Minor updates can include reasonable changes
          to existing text, business hours, dates,
          prices, photos, event information, sponsor
          logos, and similar existing website content.
        </p>

        <p>
          Unused update time does not roll over into
          future months. New pages, new sections, major
          redesigns, new features, custom functionality,
          and substantial development are not included
          in Website Care and may be billed as
          Additional Website Work.
        </p>
      </>
    ),
  },
  {
    number: "08",
    title: "Recurring Billing & Cancellation",
    content: (
      <>
        <p>
          Clients who affirmatively select a monthly plan
          authorize Mordecai and its payment processor
          to automatically charge the payment method
          provided at the recurring monthly rate shown
          when the Client enrolls.
        </p>

        <p>
          Website Care is month-to-month and may be
          canceled before the next billing period.
          Cancellation stops future recurring charges
          after the applicable paid billing period.
        </p>

        <p>
          Ending a monthly plan does not cancel or refund
          amounts already owed for website projects,
          Additional Website Work, third-party costs, or
          services already provided.
        </p>
      </>
    ),
  },
  {
    number: "09",
    title: "Third-Party Services",
    content: (
      <>
        <p>
          Websites may rely on third-party providers and
          platforms such as domain registrars, hosting
          companies, payment processors, booking
          platforms, map services, plugins, APIs, or
          other external services.
        </p>

        <p>
          Mordecai is not responsible for outages,
          service interruptions, price changes, policy
          changes, account restrictions, discontinued
          features, or failures primarily caused by
          third-party providers or circumstances outside
          Mordecai's reasonable control.
        </p>

        <p>
          Third-party products or services that require
          additional subscriptions, licenses, usage
          fees, transaction fees, or other charges may
          require separate Client approval and payment.
        </p>
      </>
    ),
  },
  {
    number: "10",
    title: "Business Results",
    content: (
      <>
        <p>
          Mordecai will use reasonable professional care
          in providing its services, but websites and
          digital services cannot guarantee particular
          business outcomes.
        </p>

        <p>
          Mordecai does not guarantee specific search
          engine rankings, website traffic, customer
          reviews, leads, conversions, revenue, sales,
          or other business results.
        </p>
      </>
    ),
  },
  {
    number: "11",
    title: "Project Cancellation",
    content: (
      <>
        <p>
          Either Mordecai or the Client may end an
          unfinished project by providing written
          notice.
        </p>

        <p>
          Payments attributable to work already
          performed and costs already incurred are
          generally non-refundable, subject to
          applicable law. Any unpaid amounts for
          completed work or approved expenses remain
          due.
        </p>

        <p>
          If a project ends before completion, Mordecai
          and the Client may discuss the reasonable
          transfer of completed Client-specific work
          based on the project's payment status and the
          circumstances of cancellation.
        </p>
      </>
    ),
  },
  {
    number: "12",
    title: "Website Operation & Maintenance",
    content: (
      <>
        <p>
          Mordecai will use reasonable professional care
          when designing, developing, maintaining, or
          managing a website.
        </p>

        <p>
          However, no website, hosting environment,
          third-party platform, security system, or
          internet service can be guaranteed to operate
          without interruption, vulnerability, error, or
          incompatibility in every circumstance.
        </p>

        <p>
          Clients without an active monthly plan are
          responsible for ongoing hosting, domain
          renewals, maintenance, updates, and management
          after the applicable project and transfer are
          complete, unless otherwise agreed in writing.
        </p>
      </>
    ),
  },
  {
    number: "13",
    title: "Changes to Services or Pricing",
    content: (
      <>
        <p>
          Mordecai may update its publicly offered
          services, package features, or pricing from
          time to time.
        </p>

        <p>
          Changes to public pricing do not retroactively
          change the price of an already approved
          one-time project unless Mordecai and the
          Client agree to a change in writing.
        </p>

        <p>
          If the recurring price or material terms of an
          active monthly plan are changed,
          Mordecai will provide notice as required by
          applicable law before the change takes effect.
        </p>
      </>
    ),
  },
];

function Terms() {
  return (
    <main className="bg-ivory text-[#17151A]">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-black/10 px-5 pb-14 pt-14 lg:px-8 lg:pb-16 lg:pt-16">
        <div className="absolute left-1/2 top-[-260px] h-[560px] w-[800px] -translate-x-1/2 rounded-full bg-[#7547B8]/10 blur-[110px]" />

        <div className="page-hero-content relative mx-auto max-w-4xl">
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#7547B8] transition hover:text-[#6439A5]"
          >
            <ArrowLeft size={16} />
            Back to Pricing
          </Link>

          <div className="mt-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7547B8] text-white">
            <FileText size={22} />
          </div>

          <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-[#7547B8]">
            Mordecai
          </p>

          <h1 className="mt-3 text-5xl font-bold tracking-[-0.055em] sm:text-6xl">
            Website Service Terms
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-[#17151A]/60 sm:text-lg">
            These terms explain how Mordecai website
            projects, Website Care, payments, ownership,
            domains, and additional services work.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <div className="rounded-full border border-black/10 bg-bone/60 px-4 py-2 text-xs font-semibold text-[#17151A]/55">
              Website Projects
            </div>

            <div className="rounded-full border border-black/10 bg-bone/60 px-4 py-2 text-xs font-semibold text-[#17151A]/55">
              Website Care
            </div>

            <div className="rounded-full border border-black/10 bg-bone/60 px-4 py-2 text-xs font-semibold text-[#17151A]/55">
              Additional Website Work
            </div>
          </div>

          <p className="mt-8 text-xs text-[#17151A]/40">
            Last updated: September 2026
          </p>
        </div>
      </section>

      {/* INTRO */}
      <section className="px-5 py-10 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[28px] border border-[#7547B8]/15 bg-[#7547B8]/[0.06] p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7547B8] text-white">
                <ShieldCheck size={19} />
              </div>

              <div>
                <h2 className="font-bold">
                  About these terms
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#17151A]/60">
                  These Website Service Terms apply to
                  website-related services provided by
                  Mordecai when they are incorporated
                  into a project agreement, proposal,
                  order, or other written agreement with
                  a Client. If an individual written
                  agreement expressly conflicts with
                  these terms, the individually agreed
                  written terms control for that
                  particular project.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TERMS */}
      <section className="px-5 pb-16 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="divide-y divide-black/10 border-y border-black/10">
            {sections.map((section) => (
              <article
                key={section.number}
                className="grid gap-5 py-10 sm:grid-cols-[70px_1fr] sm:gap-8"
              >
                <div>
                  <span className="text-sm font-bold text-[#7547B8]">
                    {section.number}
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl font-bold tracking-[-0.025em]">
                    {section.title}
                  </h2>

                  <div className="mt-5 space-y-4 text-sm leading-7 text-[#17151A]/65">
                    {section.content}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WEBSITE CARE SUMMARY */}
      <section className="dark-pattern px-5 py-14 text-white lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F4F0A3]">
            Quick Reference
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
            Website Care at a glance.
          </h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[

              "Website Care: $50 per month",
              "Month-to-month",
              "Website Care includes up to 1 hour of minor content updates",
              "Unused update time does not roll over",
              "Standard domain renewal up to $30 per year",
              "Hosting & technical maintenance",
              "Cancel before the next billing period",
              "Additional development billed separately",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
              >
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#7547B8]">
                  <Check
                    size={12}
                    strokeWidth={3}
                  />
                </div>

                <span className="text-sm leading-6 text-white/70">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUESTIONS */}
      <section className="px-5 py-14 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[30px] bg-[#7547B8] p-8 text-white sm:p-10">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
              <Mail size={20} />
            </div>

            <h2 className="mt-7 text-3xl font-bold tracking-[-0.04em]">
              Have a question about your project?
            </h2>

            <p className="mt-4 max-w-xl leading-7 text-white/65">
              If something about your project, Website
              Care, billing, or these terms isn't clear,
              reach out before approving your project.
              We're happy to explain it.
            </p>

            <Link
              to="/contact"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#F4F0A3] px-6 py-3.5 text-sm font-bold text-[#17151A] transition hover:-translate-y-0.5 hover:bg-white"
            >
              Contact Mordecai
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/pricing"
              className="text-sm font-semibold text-[#7547B8] transition hover:text-[#6439A5]"
            >
              View Website Pricing
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Terms;