import { Link } from "react-router-dom";
import { ArrowRight, Check, ChevronDown, Code2, Globe2, MapPin, ShieldCheck, Star, Wrench } from "lucide-react";

const websitePlans = [
  {
    name: "Basic Website",
    price: "$500",
    description: "The essentials for a local business that needs a professional site.",
    features: [
      "Up to 4 pages with a mobile-friendly layout",
      "Clear hours, location, and contact information",
      "Page titles and descriptions for Google",
      "2 rounds of changes before launch",
    ],
    icon: Globe2,
    cta: "Get Started",
  },
  {
    name: "Business Website",
    price: "$700",
    description: "More room for your services, menu, or work, with a design tailored to your business.",
    features: [
      "Up to 6 pages with a custom, mobile-friendly design",
      "A standard contact form, menu, or photo gallery",
      "Page titles and descriptions for Google",
      "3 rounds of changes before launch",
    ],
    icon: Globe2,
    cta: "Get Started",
    featured: true,
  },
  {
    name: "Custom Website",
    description: "For larger sites or projects that need something built around how you work.",
    features: [
      "More pages or custom features",
      "Booking, ordering, or online store setup",
      "A written quote based on your project",
    ],
    icon: Code2,
    cta: "Get a Custom Quote",
  },
];

const careFeatures = [
  "Hosting and basic upkeep for your website",
  "Checks that your site is online and its connection stays secure",
  "Standard domain renewal up to $30 per year",
  "Up to 1 hour of minor content edits each month for hours, text, prices, or photos",
];

const additionalServices = [
  {
    title: "Google Business Profile",
    price: "From $199 one time per location",
    icon: MapPin,
    description: "Update your hours, categories, services, website link, and supplied photos so customers find the right information on Google.",
    cta: "Get Started",
  },
  {
    title: "Google Review Cards",
    price: "$29 per card, one time",
    icon: Star,
    description: "A tap-and-scan card programmed and tested for your Google review link. Custom designs, stands, and multi-location orders are quoted separately.",
    cta: "Get Started",
  },
  {
    title: "Custom Tools & Integrations",
    price: "Custom quote",
    icon: Wrench,
    description: "Get a quote for booking or ordering setup, online checkout, review pages, or custom feedback forms. Any platform fees are listed separately.",
    cta: "Discuss a Custom Tool",
  },
];

const faqs = [
  ["Who supplies the website content?", "You supply your text, photos, and menu or service details. Tell us if you need help creating content so we can include it in your quote."],
  ["What counts as a minor edit?", "Changes to existing text, hours, prices, photos, and similar content count toward your monthly edit time. We quote new pages, redesigns, and new features separately."],
  ["Do unused edits roll over?", "The one-hour edit allowance resets each month."],
  ["Do I need a monthly plan?", "Website Care is optional. You can manage your site yourself after launch and pay your hosting and domain providers directly."],
  ["Can I cancel a monthly plan?", "Website Care is month-to-month. Cancel before your next billing period to stop future charges."],
];

const actionClass = "inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[#7547B8] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#6439A5]";
const cardClass = "flex flex-col rounded-2xl border border-black/10 bg-bone p-4 sm:p-5";

function IconHeading({ icon, children }) {
  const Icon = icon;
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#7547B8]/10 text-[#7547B8]">
        <Icon size={19} aria-hidden="true" />
      </span>
      {children}
    </div>
  );
}

function FeatureList({ items }) {
  return (
    <ul className="mt-3 space-y-2 text-sm leading-relaxed">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <Check size={16} className="mt-0.5 shrink-0 text-[#7547B8]" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function Pricing() {
  return (
    <main className="bg-ivory text-[#17151A]">
      <section className="grid min-h-[calc(100svh-75px)] place-items-center border-b border-black/10 bg-gradient-to-b from-[#7547B8]/10 to-ivory px-5 py-10 md:min-h-[calc(100svh-77px)]">
        <div className="page-hero-content mx-auto max-w-4xl text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-6xl">A website built around <span className="text-[#7547B8]">your business.</span></h1>
          <p className="mx-auto mt-3 max-w-xl text-[#17151A]/75">We design and launch websites for local businesses and can keep yours up to date after it goes live.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <a href="#website-plans" className={actionClass}>View Website Plans <ArrowRight size={16} aria-hidden="true" /></a>
            <a href="#other-services" className="inline-flex items-center rounded-full border border-black/20 px-4 py-2 text-sm font-bold hover:bg-bone">View Other Services</a>
          </div>
        </div>
      </section>

      <section id="website-plans" className="mx-auto max-w-7xl px-5 py-6 lg:px-8">
        <IconHeading icon={Globe2}>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Website plans</h2>
        </IconHeading>
        <p className="mt-2 text-sm text-[#17151A]/75">Your website is a one-time purchase. Monthly care is optional.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {websitePlans.map(({ name, price, description, features, icon, cta, featured }) => (
            <article key={name} className={featured ? cardClass + " border-[#7547B8]/55" : cardClass}>
              <IconHeading icon={icon}><h3 className="text-xl font-bold tracking-tight">{name}</h3></IconHeading>
              {price && <p className="mt-3 text-3xl font-bold text-[#7547B8]">{price} <span className="text-sm font-medium text-[#17151A]/75">one time</span></p>}
              <p className="mt-2 text-sm leading-relaxed text-[#17151A]/75">{description}</p>
              <FeatureList items={features} />
              <div className="mt-auto pt-4"><Link to="/contact" className={actionClass}>{cta}</Link></div>
            </article>
          ))}
        </div>
        <p className="mt-3 text-sm text-[#17151A]/75">Pay 50% to start and the remaining 50% when your site is substantially complete and ready to launch.</p>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-6 lg:px-8">
        <IconHeading icon={ShieldCheck}><h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Hosting and Website Care</h2></IconHeading>
        <article className={cardClass + " mt-4 border-[#7547B8]/55"}>
          <p className="text-2xl font-bold text-[#7547B8]">$50<span className="text-sm font-medium text-[#17151A]/75">/month</span></p>
          <FeatureList items={careFeatures} />
        </article>
        <p className="mt-3 text-sm text-[#17151A]/75">Extra pages are $75 each using an existing layout and your supplied content. Routine updates outside a plan are $40/hour. Larger changes are quoted upfront.</p>
      </section>

      <section id="other-services" className="mx-auto max-w-7xl px-5 py-6 lg:px-8">
        <IconHeading icon={Wrench}><h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Other services</h2></IconHeading>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {additionalServices.map(({ title, price, icon, description, cta }) => (
            <article key={title} className={cardClass}>
              <IconHeading icon={icon}><h3 className="text-lg font-bold">{title}</h3></IconHeading>
              <p className="mt-2 font-semibold">{price}</p>
              <p className="mt-2 text-sm leading-relaxed text-[#17151A]/75">{description}</p>
              <div className="mt-auto pt-4"><Link to="/contact" className={actionClass}>{cta}</Link></div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight">Common questions</h2>
        <div className="mt-3 divide-y divide-black/10 rounded-2xl border border-black/10 bg-bone px-4">
          {faqs.map(([question, answer]) => (
            <details key={question} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-3 text-sm font-semibold">
                {question} <ChevronDown size={16} className="shrink-0 group-open:rotate-180" aria-hidden="true" />
              </summary>
              <p className="pb-3 text-sm leading-relaxed text-[#17151A]/75">{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-7 pt-2 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#6439A5] p-4 text-white sm:p-5">
          <h2 className="text-xl font-bold">Ready to get started?</h2>
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-[#F4F0A3] px-4 py-2.5 text-sm font-bold text-[#17151A] hover:bg-bone">
            Contact Us <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <Link to="/terms" className="mt-3 inline-block text-sm underline">Website Service Terms</Link>
      </section>
    </main>
  );
}
