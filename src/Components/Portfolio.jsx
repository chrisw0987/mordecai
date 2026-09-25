import React from "react";

import {
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  MapPin,
} from "lucide-react";

import { Link } from "react-router-dom";

const projects = [
  {
    number: "01",
    type: "Restaurant Website",
    name: "Jardin De China",
    location: "Queens, New York",
    url: "https://jardindechina.com/",
    displayUrl: "jardindechina.com",
    description:
      "A refreshed digital home for a neighborhood Chinese-Latin restaurant, making the menu, hours, location, and essential information easier to discover.",
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
      "A cleaner digital experience designed around the food, atmosphere, menu, and information customers need before visiting.",
    services: [
      "Website Design",
      "Responsive Design",
      "Business Presence",
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
      "A purpose-built event website giving attendees one place to find tickets, venue information, event details, and floor plans.",
    services: [
      "Website Design",
      "Event Experience",
      "Custom Development",
    ],
  },
];

function Portfolio() {
  const featuredProject = projects[0];
  const secondaryProjects = projects.slice(1);

  return (
    <section
      id="work"
      className="overflow-hidden bg-[#17151A] px-5 py-24 text-white lg:px-8 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="grid gap-8 lg:grid-cols-[1fr_0.55fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F4F0A3]">
              Selected Work
            </p>

            <h2 className="mt-5 max-w-4xl text-4xl font-bold leading-[0.98] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
              Things we&apos;ve actually{" "}
              <span className="text-white/35">
                put into the world.
              </span>
            </h2>
          </div>

          <div className="lg:justify-self-end">
            <p className="max-w-md text-base leading-7 text-white/50">
              Websites and digital experiences built
              around real businesses and the customers
              they serve.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <span className="text-3xl font-bold tracking-[-0.04em] text-[#F4F0A3]">
                03
              </span>

              <span className="text-xs font-bold uppercase tracking-[0.16em] text-white/35">
                Selected
                <br />
                Projects
              </span>
            </div>
          </div>
        </div>

        {/* Featured Project */}
        <div className="mt-16">
          <FeaturedProject
            project={featuredProject}
          />
        </div>

        {/* Secondary Projects */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {secondaryProjects.map(
            (project) => (
              <SecondaryProject
                key={project.name}
                project={project}
              />
            )
          )}
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-9 sm:flex-row">
          <p className="text-sm text-white/35">
            More projects, products, and local-business
            work inside.
          </p>

          <Link
            to="/work"
            className="group inline-flex items-center gap-3 rounded-full bg-[#F4F0A3] px-7 py-4 font-semibold text-[#17151A] transition duration-300 hover:-translate-y-1"
          >
            See All Our Work

            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

function FeaturedProject({
  project,
}) {
  return (
    <article className="group relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-[#242126]">

      {/* Number */}
      <div className="pointer-events-none absolute right-4 top-0 z-0 select-none text-[9rem] font-bold leading-none tracking-[-0.08em] text-white/[0.025] sm:right-8 sm:text-[13rem]">
        {project.number}
      </div>

      <div className="relative z-10 grid lg:grid-cols-[0.72fr_1.28fr]">

        {/* Copy */}
        <div className="flex flex-col p-7 sm:p-9 lg:p-11">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold tracking-[0.18em] text-white/30">
                {project.number}
              </span>

              <span className="h-px w-8 bg-white/15" />

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#F4F0A3]">
                {project.type}
              </p>
            </div>

            <h3 className="mt-7 text-4xl font-bold tracking-[-0.05em] sm:text-5xl">
              {project.name}
            </h3>

            <div className="mt-4 flex items-center gap-2 text-sm text-white/40">
              <MapPin size={15} />
              {project.location}
            </div>

            <p className="mt-8 max-w-md text-base leading-7 text-white/55">
              {project.description}
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {project.services.map(
                (service) => (
                  <span
                    key={service}
                    className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-semibold text-white/55"
                  >
                    {service}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="mt-auto pt-10">
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="group/link inline-flex items-center gap-3 font-semibold text-white transition hover:text-[#F4F0A3]"
            >
              View Live Site

              <ArrowUpRight
                size={18}
                className="transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
              />
            </a>
          </div>
        </div>

        {/* Live Website */}
        <div className="relative min-h-[480px] overflow-hidden bg-[#7547B8] p-5 sm:p-7 lg:min-h-[590px] lg:p-9">

          {/* Decoration */}
          <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-[#F4F0A3]/20 blur-2xl" />

          <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          {/* Browser */}
          <div className="relative h-full min-h-[440px] transition duration-500 ease-out group-hover:-translate-y-2 lg:min-h-[520px]">
            <BrowserPreview
              project={project}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

function SecondaryProject({
  project,
}) {
  return (
    <article className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] transition duration-300 hover:border-white/20">

      {/* Preview */}
      <div className="relative h-[380px] overflow-hidden bg-[#F7F5EF] p-4 sm:h-[430px] sm:p-6">
        <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#7547B8]/15 blur-3xl" />

        <div className="relative h-full transition duration-500 ease-out group-hover:-translate-y-1.5 group-hover:scale-[1.01]">
          <BrowserPreview
            project={project}
            compact
          />
        </div>

        {/* Project Number */}
        <div className="pointer-events-none absolute bottom-1 right-4 select-none text-[5.5rem] font-bold leading-none tracking-[-0.08em] text-[#17151A]/[0.04]">
          {project.number}
        </div>
      </div>

      {/* Information */}
      <div className="p-7 sm:p-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold tracking-[0.16em] text-white/25">
                {project.number}
              </span>

              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F4F0A3]">
                {project.type}
              </p>
            </div>

            <h3 className="mt-4 text-3xl font-bold tracking-[-0.04em]">
              {project.name}
            </h3>
          </div>

          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${project.name}`}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white transition duration-300 group-hover:rotate-45 group-hover:bg-[#F4F0A3] group-hover:text-[#17151A]"
          >
            <ArrowUpRight size={18} />
          </a>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-white/35">
          <MapPin size={14} />
          {project.location}
        </div>

        <p className="mt-6 max-w-xl leading-7 text-white/50">
          {project.description}
        </p>

        <div className="mt-7 flex flex-wrap gap-2">
          {project.services.map(
            (service) => (
              <span
                key={service}
                className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/45"
              >
                {service}
              </span>
            )
          )}
        </div>
      </div>
    </article>
  );
}

function BrowserPreview({
  project,
  compact = false,
}) {
  return (
    <div className="h-full overflow-hidden rounded-[1.4rem] border border-black/10 bg-white shadow-[0_25px_70px_rgba(0,0,0,0.22)]">

      {/* Browser Bar */}
      <div className="flex h-11 items-center gap-2 border-b border-black/10 bg-[#EFEDE7] px-4">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-black/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-black/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-black/10" />
        </div>

        <div className="ml-2 flex min-w-0 flex-1 items-center rounded-full bg-white px-3 py-1.5">
          <span className="truncate text-[10px] font-medium text-black/40">
            {project.displayUrl}
          </span>
        </div>

        <ExternalLink
          size={13}
          className="shrink-0 text-black/30"
        />
      </div>

      {/* Website */}
      <div className="relative h-[calc(100%-44px)] overflow-hidden bg-white">
        <iframe
          src={project.url}
          title={`${project.name} website preview`}
          loading="lazy"
          tabIndex="-1"
          className={`
            h-full
            w-full
            border-0
            bg-white
            pointer-events-none

            ${
              compact
                ? "origin-top scale-[1.001]"
                : ""
            }
          `}
        />

        {/* Clickable overlay */}
        <a
          href={project.url}
          target="_blank"
          rel="noreferrer"
          aria-label={`View ${project.name} live website`}
          className="absolute inset-0 z-10"
        />

        {/* Hover Button */}
        <div className="pointer-events-none absolute bottom-4 right-4 z-20 translate-y-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#17151A] px-4 py-2.5 text-xs font-semibold text-white shadow-xl">
            View Site
            <ArrowUpRight size={14} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Portfolio;