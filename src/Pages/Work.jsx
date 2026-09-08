import {
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  MapPin,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

const projects = [
  {
    number: "01",
    type: "Restaurant Website",
    name: "Jardin De China",
    location: "Queens, New York",
    url: "https://jardindechina.com/",
    displayUrl: "jardindechina.com",
    description:
      "A refreshed digital home for a neighborhood Chinese-Latin restaurant, designed to make menus, hours, location, and essential business information easy to find.",
    services: [
      "Website Design",
      "Mobile Experience",
      "Local SEO",
    ],
  },
  {
    number: "02",
    type: "Restaurant Website",
    name: "Tokyo Cafe",
    location: "Newington, Connecticut",
    url: "https://tokyo-cafe.netlify.app/",
    displayUrl: "tokyo-cafe.netlify.app",
    description:
      "A clean, approachable restaurant website built to help customers quickly explore the menu, learn about the business, and plan their visit.",
    services: [
      "Website Design",
      "Mobile Experience",
      "Customer Experience",
    ],
  },
  {
    number: "03",
    type: "Event Website",
    name: "Brooklyn TCG Show",
    location: "Brooklyn, New York",
    url: "https://bktcgshow.com/",
    displayUrl: "bktcgshow.com",
    description:
      "A focused event experience built to give attendees and vendors a clear place to discover show information, tickets, venue details, and floor plans.",
    services: [
      "Website Design",
      "Event Discovery",
      "Mobile Experience",
    ],
  },
  {
    number: "04",
    type: "Digital Product",
    name: "Vendly",
    location: "Trading Card Community",
    url: "https://vendlytcg.com/",
    displayUrl: "vendlytcg.com",
    description:
      "A digital product designed around card-show discovery, vendor inventory, and helping collectors find the cards they are looking for.",
    services: [
      "Product Design",
      "Inventory",
      "Discovery",
    ],
  },
];

function Work() {
  return (
    <main className="min-h-screen bg-[#17151A] text-white">
      <section className="border-b border-white/10 px-5 pb-14 pt-16 lg:px-8 lg:pb-20 lg:pt-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F4F0A3]">
            Our Work
          </p>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.65fr] lg:items-end">
            <h1 className="max-w-4xl text-5xl font-bold leading-[0.96] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              Work built to help businesses{" "}
              <span className="text-white/35">
                get noticed.
              </span>
            </h1>

            <p className="max-w-lg text-lg leading-8 text-white/55 lg:justify-self-end">
              Websites and digital experiences built
              around real businesses, real customers,
              and the problems they actually need to
              solve.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 py-14 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl space-y-8">
          {projects.map((project) => (
            <ProjectCard
              key={project.name}
              project={project}
            />
          ))}
        </div>
      </section>

      <section className="px-5 pb-16 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-[#F4F0A3] p-8 text-[#17151A] sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:p-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7547B8]">
              Your business could be next
            </p>

            <h2 className="mt-4 max-w-2xl text-4xl font-bold leading-[1.02] tracking-[-0.045em] sm:text-5xl">
              Let&apos;s build a stronger online presence.
            </h2>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:mt-0 lg:flex-col">
            <Link
              to="/business-check"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#7547B8] px-7 py-4 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#6439A5]"
            >
              Check My Business
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-black/15 px-7 py-4 font-semibold text-[#17151A] transition hover:bg-black/5"
            >
              Talk to Mordecai
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function ProjectCard({
  project,
}) {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045]">
      <div className="grid lg:grid-cols-[0.78fr_1.22fr]">
        <div className="flex flex-col p-7 sm:p-9 lg:p-10">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#F4F0A3]">
                {project.type}
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
                {project.name}
              </h2>
            </div>

            <span className="text-xs font-semibold text-white/30">
              {project.number}
            </span>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-white/45">
            <MapPin size={15} />
            {project.location}
          </div>

          <p className="mt-8 max-w-xl text-base leading-7 text-white/55">
            {project.description}
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            {project.services.map(
              (service) => (
                <span
                  key={service}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white/65"
                >
                  {service}
                </span>
              )
            )}
          </div>

          <div className="mt-auto pt-10">
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-[#F4F0A3]"
            >
              View live project
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>

        <div className="p-5 sm:p-7 lg:p-8">
          <div className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#F7F5EF] shadow-2xl">
            <div className="flex h-11 items-center gap-2 border-b border-black/10 bg-[#EFEDE7] px-4">
              <span className="h-2.5 w-2.5 rounded-full bg-black/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-black/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-black/10" />

              <div className="ml-3 flex min-w-0 flex-1 items-center rounded-full bg-white px-3 py-1.5">
                <span className="truncate text-[11px] font-medium text-black/45">
                  {project.displayUrl}
                </span>
              </div>

              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${project.name}`}
                className="ml-2 text-black/45 transition hover:text-[#7547B8]"
              >
                <ExternalLink size={15} />
              </a>
            </div>

            <div className="relative h-[420px] bg-white sm:h-[500px] lg:h-[560px]">
              <iframe
                src={project.url}
                title={`${project.name} live website preview`}
                loading="lazy"
                className="h-full w-full border-0 bg-white"
              />

              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-[#17151A] px-4 py-2.5 text-xs font-semibold text-white shadow-xl transition hover:bg-[#7547B8]"
              >
                Open Site
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>

          <p className="mt-3 text-right text-xs text-white/30">
            Live website preview
          </p>
        </div>
      </div>
    </article>
  );
}

export default Work;
