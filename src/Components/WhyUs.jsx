import { Handshake, Lightbulb, MapPin, MessagesSquare } from "lucide-react";

const reasons = [
  { title: "Built around your business", description: "We build around how you work and what your customers need.", icon: Handshake },
  { title: "Practical technology", description: "Every feature makes it easier to find you or do business with you.", icon: Lightbulb },
  { title: "Made for local businesses", description: "We focus on the calls, visits, and bookings that matter to you.", icon: MapPin },
  { title: "Clear communication", description: "We explain what we’re building and why, in plain language.", icon: MessagesSquare },
];

export default function WhyUs() {
  return (
    <section id="why-us" className="bg-ivory px-5 py-8 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-3xl font-bold tracking-tight text-[#7547B8] sm:text-4xl">Why Mordecai</h2>
        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {reasons.map(({ title, description, icon }) => {
            const Icon = icon;
            return (
              <article key={title} className="rounded-2xl border border-black/10 bg-bone p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="grid shrink-0 size-10 place-items-center rounded-xl bg-[#7547B8]/10 text-[#7547B8]">
                    <Icon size={20} aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-[#17151A]">{title}</h3>
                </div>
                <p className="mt-2 leading-relaxed text-[#17151A]/65">{description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
