import { Link } from "react-router-dom";
import reviewCards from "../assets/google-review-cards.png";

import {
  ArrowUpRight,
  Globe2,
  MapPin,
  Star,
  Wrench,
} from "lucide-react";

const services = [
  {
    title: "Websites",
    cta: "Explore Website Plans",
    href: "/pricing",
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
    iconColor: "text-white",
  },
  {
    title: "Google Presence",
    cta: "Check My Google Presence",
    href: "/business-check",
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
    iconColor: "text-[#17151A]",
  },
  {
    title: "Reviews & Reputation",
    cta: "Get a Review Card",
    href: "/contact",
    eyebrow: "Turn great experiences into visible trust.",
    description:
      "Put a custom NFC card at your register or front desk. Customers tap with a compatible phone or scan the QR code to open your Google review page. No app needed.",
    icon: Star,
    points: [
      "Business-specific NFC and QR review cards",
      "Review landing pages",
      "Customer feedback flows",
      "Reputation tools",
    ],
    accent: "bg-[#AFCB83]",
    iconBg: "bg-[#AFCB83]",
    iconColor: "text-[#17151A]",
  },
  {
    title: "Digital Tools",
    cta: "Discuss a Digital Tool",
    href: "/contact",
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
    iconColor: "text-white",
  },
];

function ServicesOverview() {
  return (
    <section
      id="services"
      className="bg-ivory px-5 py-8 lg:px-8 lg:py-10"
    >
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7547B8]">What we do</p>
        <h2 className="mt-3 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Help customers find, trust, and choose <span className="text-[#7547B8]">your business.</span>
        </h2>

        <div className="mt-7 grid gap-4 md:grid-cols-2">
          {services.map((service) => {
            const Icon = service.icon;
            const isReviews = service.title === "Reviews & Reputation";

            return (
              <article key={service.title} className="flex flex-col rounded-3xl border border-black/10 bg-bone p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className={`grid size-12 shrink-0 place-items-center rounded-2xl ${service.iconBg} ${service.iconColor}`}>
                    <Icon size={22} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">{service.title}</h3>
                    <p className="mt-1 text-sm font-semibold text-[#7547B8]">{service.eyebrow}</p>
                  </div>
                </div>
                <p className="mt-3 leading-7 text-[#17151A]/70">{service.description}</p>
                <div className="mt-3 flex items-center gap-3">
                  <ul className="grid min-w-0 flex-1 gap-2">
                    {service.points.map((point) => (
                      <li key={point} className="flex items-center gap-2 text-sm text-[#17151A]/75">
                        <span aria-hidden="true" className={`size-2 shrink-0 rounded-full ${service.accent}`} />
                        {point}
                      </li>
                    ))}
                  </ul>
                  {isReviews && (
                    <img id="review-cards" src={reviewCards} alt="Google review cards with NFC and a QR code"
                      loading="lazy" className="h-24 w-20 shrink-0 scroll-mt-20 object-contain sm:w-28" />
                  )}
                </div>
                <div className="mt-auto pt-4">
                  <Link to={service.href} className="inline-flex items-center gap-2 text-sm font-bold text-[#7547B8] hover:underline">
                    {service.cta} <ArrowUpRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-7 overflow-hidden rounded-[2rem] bg-[#7547B8]">
          <div className="grid items-center gap-4 px-6 py-5 sm:px-8 lg:grid-cols-[1fr_auto] lg:px-12 lg:py-6">
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