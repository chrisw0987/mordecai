import React from "react";

import { Link } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  Database,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

const sections = [
  {
    number: "01",
    title: "Information We Collect",
    content: (
      <>
        <p>
          Mordecai may collect information that you
          voluntarily provide when you contact us,
          request information, submit a business check,
          inquire about services, or otherwise
          communicate with us.
        </p>

        <p>
          Depending on how you interact with our
          website, this information may include your
          name, business name, email address, phone
          number, business website, business information,
          project details, and information included in
          messages you send to us.
        </p>

        <p>
          Our website and service providers may also
          receive basic technical information associated
          with visits to the website, such as browser
          type, device type, IP address, referring pages,
          and similar technical or usage information.
        </p>
      </>
    ),
  },
  {
    number: "02",
    title: "How We Use Information",
    content: (
      <>
        <p>
          We use information we receive to operate
          Mordecai, communicate with prospective and
          existing clients, respond to inquiries, provide
          requested services, evaluate a business's
          online presence when requested, and manage
          website projects.
        </p>

        <p>
          Information may also be used to maintain and
          improve our website, troubleshoot technical
          issues, protect our services, maintain business
          records, and understand how people interact
          with Mordecai.
        </p>

        <p>
          We may use contact information to follow up
          about an inquiry, project, requested service,
          or existing business relationship.
        </p>
      </>
    ),
  },
  {
    number: "03",
    title: "Business Check Information",
    content: (
      <>
        <p>
          If you use Mordecai's business check feature,
          we may use the information you provide,
          together with publicly available information
          about the business, to review aspects of its
          online presence.
        </p>

        <p>
          Information submitted through the business
          check may also be used to respond to your
          request and discuss Mordecai services that may
          be relevant to the business.
        </p>
      </>
    ),
  },
  {
    number: "04",
    title: "Service Providers",
    content: (
      <>
        <p>
          Mordecai may use third-party service providers
          to help operate our website and business. These
          may include website hosting providers, domain
          providers, form or email services, payment
          processors, analytics providers, and other
          technology services.
        </p>

        <p>
          These providers may process information as
          necessary to perform services for Mordecai and
          may have their own privacy practices and
          policies.
        </p>

        <p>
          Payment information submitted through a
          third-party payment processor is processed by
          that provider. Mordecai does not need to
          directly receive your complete payment card
          number in order to accept payments through
          such services.
        </p>
      </>
    ),
  },
  {
    number: "05",
    title: "Cookies & Website Technology",
    content: (
      <>
        <p>
          Our website and the technology providers that
          support it may use cookies, local storage, or
          similar technologies that are necessary for
          website functionality, security, performance,
          or remembering certain website preferences.
        </p>

        <p>
          If Mordecai adds analytics, advertising, or
          other optional tracking technologies in the
          future, this Privacy Policy may be updated to
          describe those practices.
        </p>

        <p>
          Your browser may allow you to control or
          delete cookies and other locally stored
          website data.
        </p>
      </>
    ),
  },
  {
    number: "06",
    title: "How We Share Information",
    content: (
      <>
        <p>
          Mordecai does not sell personal information
          as part of its ordinary business operations.
        </p>

        <p>
          Information may be shared with service
          providers that help us operate the website,
          communicate with clients, process payments,
          host websites, or provide other services
          necessary to run Mordecai.
        </p>

        <p>
          We may also disclose information when
          reasonably necessary to comply with applicable
          law, respond to valid legal requests, protect
          our rights or services, investigate fraud or
          misuse, or protect the safety and security of
          Mordecai, our clients, or others.
        </p>
      </>
    ),
  },
  {
    number: "07",
    title: "Data Retention",
    content: (
      <>
        <p>
          We may retain information for as long as
          reasonably necessary for the purposes for
          which it was collected, to maintain business
          and project records, provide services, resolve
          disputes, enforce agreements, and satisfy
          applicable legal or accounting obligations.
        </p>

        <p>
          Retention periods may vary depending on the
          type of information and the reason it was
          collected.
        </p>
      </>
    ),
  },
  {
    number: "08",
    title: "Data Security",
    content: (
      <>
        <p>
          Mordecai takes reasonable measures intended to
          protect information from unauthorized access,
          loss, misuse, or disclosure.
        </p>

        <p>
          However, no website, email system, internet
          transmission, hosting provider, or electronic
          storage method can be guaranteed to be
          completely secure.
        </p>
      </>
    ),
  },
  {
    number: "09",
    title: "Third-Party Websites",
    content: (
      <>
        <p>
          The Mordecai website may contain links to
          websites or services operated by third
          parties.
        </p>

        <p>
          Mordecai does not control the privacy
          practices of those third parties. When you
          leave our website, the privacy policy and
          terms of the third-party service generally
          govern your interaction with that service.
        </p>
      </>
    ),
  },
  {
    number: "10",
    title: "Your Choices",
    content: (
      <>
        <p>
          You may contact Mordecai if you have questions
          about information you previously provided to
          us or would like to request that we correct or
          delete information in our records.
        </p>

        <p>
          We will review reasonable requests and respond
          as appropriate, subject to information we may
          need to retain for legitimate business,
          contractual, security, accounting, or legal
          purposes.
        </p>
      </>
    ),
  },
  {
    number: "11",
    title: "Children's Privacy",
    content: (
      <>
        <p>
          Mordecai's website and services are intended
          for businesses and individuals seeking
          business-related services. They are not
          directed toward children.
        </p>

        <p>
          We do not knowingly seek to collect personal
          information from children through our website.
        </p>
      </>
    ),
  },
  {
    number: "12",
    title: "Changes to This Policy",
    content: (
      <>
        <p>
          Mordecai may update this Privacy Policy as our
          website, services, technology, or privacy
          practices change.
        </p>

        <p>
          When the policy is updated, the revised
          version will be posted on this page and the
          "Last updated" date may be changed
          accordingly.
        </p>
      </>
    ),
  },
];

function Privacy() {
  return (
    <main className="bg-[#F7F5EF] text-[#17151A]">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-black/10 px-5 pb-20 pt-20 lg:px-8 lg:pb-24 lg:pt-24">
        <div className="absolute left-1/2 top-[-260px] h-[560px] w-[800px] -translate-x-1/2 rounded-full bg-[#7547B8]/10 blur-[110px]" />

        <div className="relative mx-auto max-w-4xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#7547B8] transition hover:text-[#6439A5]"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <div className="mt-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7547B8] text-white">
            <ShieldCheck size={22} />
          </div>

          <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-[#7547B8]">
            Mordecai
          </p>

          <h1 className="mt-3 text-5xl font-bold tracking-[-0.055em] sm:text-6xl">
            Privacy Policy
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-[#17151A]/60 sm:text-lg">
            This policy explains what information
            Mordecai may collect through our website,
            why we use it, and how we handle it.
          </p>

          <p className="mt-8 text-xs text-[#17151A]/40">
            Last updated: September 2026
          </p>
        </div>
      </section>

      {/* SIMPLE SUMMARY */}
      <section className="px-5 py-14 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[24px] border border-black/10 bg-white/60 p-6">
              <Database
                size={21}
                className="text-[#7547B8]"
              />

              <h2 className="mt-5 font-bold">
                What we collect
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#17151A]/55">
                Information you submit to us and basic
                information generated when our website
                is used.
              </p>
            </div>

            <div className="rounded-[24px] border border-black/10 bg-white/60 p-6">
              <LockKeyhole
                size={21}
                className="text-[#7547B8]"
              />

              <h2 className="mt-5 font-bold">
                Why we use it
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#17151A]/55">
                To respond to you, provide our services,
                operate the website, and run Mordecai.
              </p>
            </div>

            <div className="rounded-[24px] border border-black/10 bg-white/60 p-6">
              <ShieldCheck
                size={21}
                className="text-[#7547B8]"
              />

              <h2 className="mt-5 font-bold">
                How we handle it
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#17151A]/55">
                We use reasonable safeguards and limit
                sharing to legitimate business needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* POLICY SECTIONS */}
      <section className="px-5 pb-24 lg:px-8">
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

      {/* CONTACT */}
      <section className="bg-[#17151A] px-5 py-20 text-white lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="grid items-center gap-10 md:grid-cols-[1fr_auto]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F4F0A3]">
                Privacy Questions
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
                Want to contact us about your information?
              </h2>

              <p className="mt-5 max-w-xl leading-7 text-white/55">
                If you have a question about this policy
                or information you've provided to
                Mordecai, you can contact us directly.
              </p>

              <a
                href="mailto:mordecaiteam@gmail.com"
                className="mt-6 inline-flex items-center gap-2 font-semibold text-[#F4F0A3] transition hover:text-white"
              >
                <Mail size={17} />
                mordecaiteam@gmail.com
              </a>
            </div>

            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#7547B8] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#6439A5]"
            >
              Contact Us
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Privacy;