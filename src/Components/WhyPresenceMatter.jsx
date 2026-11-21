import { MapPin, Smartphone, Star } from "lucide-react";

const steps = [
  {
    title: "Get discovered",
    description: "Customers search Google and Maps for a business like yours.",
    icon: MapPin,
    accent: "bg-[#7547B8] text-white",
  },
  {
    title: "Make a great impression",
    description: "A fast, mobile-friendly site makes it easy to find your hours, menu, and services.",
    icon: Smartphone,
    accent: "bg-[#F4F0A3] text-[#17151A]",
  },
  {
    title: "Build visible trust",
    description: "Recent reviews help people feel confident enough to call, book, order, or visit.",
    icon: Star,
    accent: "bg-[#AFCB83] text-[#17151A]",
  },
];

export default function WhyPresenceMatter() {
  return (
    <section id="why-presence-matter" className="dark-pattern px-5 py-8 text-white lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F4F0A3]">Why your presence matters</p>
        <h2 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="text-[#7547B8]">First impressions</span> happen before customers walk in.
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {steps.map(({ title, description, icon, accent }) => {
            const Icon = icon;
            return (
              <article key={title} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
                <div className="flex items-start gap-3">
                  <span className={`grid shrink-0 size-11 place-items-center rounded-xl ${accent}`}>
                    <Icon size={21} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold">{title}</h3>
                    <p className="mt-2 leading-7 text-white/65">{description}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
