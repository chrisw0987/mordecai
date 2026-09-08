import React from "react";

import {
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Smartphone,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

const projects = [
  {
    number: "01",
    name: "Jardin De China",
    type: "Restaurant Website",
    location: "Queens, New York",
    description:
      "A refreshed digital home for a neighborhood Chinese-Latin restaurant, designed to make menus, hours, location, and essential business information easy to find.",
    services: [
      "Website Design",
      "Mobile Experience",
      "Local SEO",
    ],
    theme: "dark",
  },
  {
    number: "02",
    name: "Tokyo Cafe",
    type: "Restaurant Website",
    location: "Newington, Connecticut",
    description:
      "A modern restaurant website focused on presenting the food, atmosphere, menu, and business information through a cleaner customer experience.",
    services: [
      "Website Design",
      "Responsive Design",
      "Business Presence",
    ],
    theme: "cream",
  },
  {
    number: "03",
    name: "BKTCG",
    type: "Event Website",
    location: "Brooklyn, New York",
    description:
      "A purpose-built event website that gives attendees one place to explore event information, tickets, venue details, and floor plans.",
    services: [
      "Website Design",
      "Event Experience",
      "Custom Development",
    ],
    theme: "purple",
  },
];

function Portfolio() {
  return (
    <section
      id="work"
      className="overflow-hidden bg-[#17151A] px-5 py-24 text-white lg:px-8 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.65fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F4F0A3]">
              Selected work
            </p>

            <h2 className="mt-5 max-w-3xl text-4xl font-bold leading-[1] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
              We don&apos;t just talk about better presence.
              <span className="text-white/35">
                {" "}
                We build it.
              </span>
            </h2>
          </div>

          <p className="max-w-lg text-lg leading-8 text-white/55 lg:justify-self-end">
            A few examples of websites and digital
            experiences we&apos;ve built around real
            businesses and real customer needs.
          </p>
        </div>

        <div className="mt-16 space-y-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.name}
              project={project}
            />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            to="/work"
            className="inline-flex items-center gap-2 rounded-full bg-[#F4F0A3] px-7 py-4 font-semibold text-[#17151A] transition hover:-translate-y-0.5"
          >
            See All Our Work
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }) {
  const themeClasses = {
    dark: {
      shell: "bg-[#242126]",
      preview: "bg-[#18302C]",
      accent: "bg-[#C6533D]",
      previewText: "text-[#F8F5F1]",
    },

    cream: {
      shell: "bg-[#F7F5EF] text-[#17151A]",
      preview: "bg-[#EFE9DC]",
      accent: "bg-[#7547B8]",
      previewText: "text-[#17151A]",
    },

    purple: {
      shell: "bg-[#7547B8]",
      preview: "bg-[#2A1E68]",
      accent: "bg-[#F4F0A3]",
      previewText: "text-white",
    },
  };

  const theme =
    themeClasses[project.theme];

  return (
    <article
      className={`
        group
        overflow-hidden
        rounded-[2rem]
        border
        border-white/10
        ${theme.shell}
      `}
    >
      <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col p-6 sm:p-8 lg:p-10">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p
                className={`
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  ${
                    project.theme === "cream"
                      ? "text-[#7547B8]"
                      : "text-[#F4F0A3]"
                  }
                `}
              >
                {project.type}
              </p>

              <h3 className="mt-3 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
                {project.name}
              </h3>
            </div>

            <span
              className={`
                text-xs
                font-semibold
                ${
                  project.theme === "cream"
                    ? "text-black/30"
                    : "text-white/35"
                }
              `}
            >
              {project.number}
            </span>
          </div>

          <div
            className={`
              mt-5
              flex
              items-center
              gap-2
              text-sm
              ${
                project.theme === "cream"
                  ? "text-black/45"
                  : "text-white/45"
              }
            `}
          >
            <MapPin size={15} />
            {project.location}
          </div>

          <p
            className={`
              mt-8
              max-w-xl
              leading-7
              ${
                project.theme === "cream"
                  ? "text-black/60"
                  : "text-white/60"
              }
            `}
          >
            {project.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {project.services.map(
              (service) => (
                <span
                  key={service}
                  className={`
                    rounded-full
                    border
                    px-3
                    py-1.5
                    text-xs
                    font-semibold

                    ${
                      project.theme === "cream"
                        ? "border-black/10 bg-white/50 text-black/55"
                        : "border-white/10 bg-white/[0.06] text-white/60"
                    }
                  `}
                >
                  {service}
                </span>
              )
            )}
          </div>

          <div className="mt-auto pt-10">
            <Link
              to="/work"
              className={`
                inline-flex
                items-center
                gap-2
                text-sm
                font-semibold
                transition-all

                ${
                  project.theme === "cream"
                    ? "text-[#17151A] hover:text-[#7547B8]"
                    : "text-white hover:text-[#F4F0A3]"
                }
              `}
            >
              View case study
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        <div className="relative min-h-[420px] overflow-hidden p-5 sm:p-8">
          <div
            className={`
              absolute
              inset-5
              overflow-hidden
              rounded-[1.75rem]
              ${theme.preview}
              sm:inset-8
            `}
          >
            <div className="flex h-11 items-center gap-2 border-b border-white/10 px-4">
              <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            </div>

            <div className="relative h-[calc(100%-44px)] overflow-hidden p-6 sm:p-8">
              <div
                className={`
                  absolute
                  right-[-60px]
                  top-[-60px]
                  h-52
                  w-52
                  rounded-full
                  opacity-25
                  ${theme.accent}
                `}
              />

              <div
                className={`
                  relative
                  ${theme.previewText}
                `}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">
                    {project.name}
                  </span>

                  <div className="hidden gap-5 text-[11px] opacity-50 sm:flex">
                    <span>Home</span>
                    <span>About</span>
                    <span>Contact</span>
                  </div>
                </div>

                <div className="mt-16 max-w-md">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-45">
                    Welcome
                  </p>

                  <p className="mt-4 text-4xl font-bold leading-[1.02] tracking-[-0.05em] sm:text-5xl">
                    Built to make a stronger first
                    impression.
                  </p>

                  <div
                    className={`
                      mt-7
                      inline-flex
                      items-center
                      gap-2
                      rounded-full
                      px-5
                      py-3
                      text-sm
                      font-semibold
                      ${theme.accent}

                      ${
                        project.theme === "dark"
                          ? "text-white"
                          : "text-[#17151A]"
                      }
                    `}
                  >
                    Explore
                    <ArrowUpRight size={15} />
                  </div>
                </div>
              </div>

              <div className="absolute bottom-[-55px] right-6 hidden w-[135px] rounded-[1.6rem] border-[5px] border-[#17151A] bg-white p-2 shadow-2xl sm:block">
                <div className="h-[225px] overflow-hidden rounded-[1.1rem] bg-[#F7F5EF]">
                  <div className="flex justify-center pt-3">
                    <Smartphone
                      size={18}
                      className="text-[#7547B8]"
                    />
                  </div>

                  <div className="px-3 pt-5">
                    <div className="h-2 w-12 rounded-full bg-black/15" />
                    <div className="mt-3 h-3 w-full rounded-full bg-black/75" />
                    <div className="mt-1 h-3 w-4/5 rounded-full bg-black/75" />
                    <div className="mt-5 h-20 rounded-xl bg-[#7547B8]/15" />

                    <div className="mt-4 flex gap-1">
                      <div className="h-2 flex-1 rounded-full bg-black/10" />
                      <div className="h-2 flex-1 rounded-full bg-black/10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default Portfolio;
