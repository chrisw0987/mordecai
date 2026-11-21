import { useState } from "react";
import { ArrowUpRight, X, ZoomIn } from "lucide-react";
import { Link } from "react-router-dom";
import jardinPreview from "../assets/portfolio/jardindechina_website_preview.webp";
import jardinLogo from "../assets/portfolio/jardin_de_china_logo.webp";
import cactusPreview from "../assets/portfolio/greencactus_website_preview.webp";
import cactusLogo from "../assets/portfolio/green-cactus-logo.webp";
import bktcgPreview from "../assets/portfolio/bktcg_website_preview.webp";
import bktcgLogo from "../assets/portfolio/bktcg-logo.webp";
import ssambapPreview from "../assets/portfolio/ssambap_website_preview.webp";
import ssambapLogo from "../assets/portfolio/ssambapkbbq_logo_.webp";
import salonLogo from "../assets/portfolio/royal-nails-spa-logo.webp";
import salonCard from "../assets/portfolio/nfc_1.webp";
import salonDetail from "../assets/portfolio/nfc_1-detail.webp";
import restaurantCard from "../assets/portfolio/nfc_2.webp";
import restaurantDetail from "../assets/portfolio/nfc_2-detail.webp";
import menuTool from "../assets/portfolio/custom_tools_1.webp";
import menuDetail from "../assets/portfolio/custom_tools_1-detail.webp";
import "./Portfolio.css";

const websites = [
  { name: "Jardin De China", type: "Restaurant website", image: jardinPreview, logo: jardinLogo, href: "https://jardindechina.com/", description: "A digital home for a Queens Chinese-Latin restaurant, with its menu, gallery, hours, and directions easy to find from a phone." },
  { name: "Green Cactus", type: "Restaurant website", image: cactusPreview, logo: cactusLogo, href: "https://greencactusmexicangrill.com/", description: "A website that brings the menu, food gallery, and online ordering together so guests can decide what to order before they arrive." },
  { name: "Brooklyn TCG Show", type: "Event website", image: bktcgPreview, logo: bktcgLogo, href: "https://bktcgshow.com/", description: "An event hub with tickets, venue details, and floor plans for collectors and vendors planning their visit." },
  { name: "Ssambap Korean BBQ", type: "Restaurant website", image: ssambapPreview, logo: ssambapLogo, href: "https://www.ssambapkbbq.com/", description: "A restaurant website with a browsable Korean BBQ menu, food photography, and quick access to ordering and gift cards." },
];

const installations = [
  {
    name: "Royal Nails & Spa",
    type: "NFC Google review card",
    logo: salonLogo,
    image: salonCard,
    detail: salonDetail,
    description: "Clients can tap or scan the checkout card to open the salon’s Google review page.",
    alt: "Google review card next to the checkout screen at Royal Nails & Spa",
  },
  {
    name: "Green Cactus",
    type: "NFC Google review card",
    logo: cactusLogo,
    image: restaurantCard,
    detail: restaurantDetail,
    description: "A counter card gives diners a quick way to share their experience on Google.",
    alt: "Black NFC Google review card displayed at the Green Cactus counter",
  },
  {
    name: "Tap-to-Order Menu",
    type: "Custom tool for Green Cactus",
    logo: cactusLogo,
    image: menuTool,
    detail: menuDetail,
    description: "A tap or scan turns a tabletop sticker into a shortcut to the menu and online ordering.",
    alt: "Green Cactus tabletop stickers with NFC and QR codes for opening the menu",
  },
];

function PortfolioCard({ project, duplicate, onPreview, detailed = false }) {
  const { name, type, image, logo, href, description } = project;
  const ActionIcon = href ? ArrowUpRight : ZoomIn;
  const className = (detailed ? "w-full h-full" : "portfolio-card") + " block overflow-hidden rounded-xl border border-white/15 bg-[#242128] text-left transition-colors hover:border-white/55 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#F4F0A3]";
  const content = (
    <>
      {image && <img src={image} alt="" loading="lazy" decoding="async"
        className={`aspect-video w-full bg-[#292530] object-cover ${href ? "object-top" : "object-center"}`} />}
      <span className="flex items-center gap-2.5 px-3 py-2">
        {logo && <img src={logo} alt="" loading="lazy" decoding="async"
            className="size-10 shrink-0 rounded-full bg-bone object-contain p-1" />}
        <span className="min-w-0 flex-1">
          <span className="block font-semibold leading-tight">{name}</span>
          <span className="block text-xs text-white/70">{type}</span>
          {detailed && <span className="mt-2 block text-sm leading-6 text-white/80">{description}</span>}
        </span>
        <ActionIcon size={16} className="shrink-0 text-[#F4F0A3]" aria-hidden="true" />
      </span>
    </>
  );

  if (href) {
    return <a href={href} target="_blank" rel="noopener noreferrer" tabIndex={duplicate ? -1 : undefined} className={className}>{content}</a>;
  }

  return (
    <button type="button" aria-haspopup="dialog" tabIndex={duplicate ? -1 : undefined}
      onClick={() => onPreview(project)} className={`cursor-zoom-in ${className}`}>
      {content}
    </button>
  );
}

function Conveyor({ direction, items, onPreview }) {
  return (
    <div className="portfolio-conveyor">
      <div className="portfolio-track" data-direction={direction}>
        {[false, true].map((duplicate) => (
          <div key={String(duplicate)} className="portfolio-group" aria-hidden={duplicate || undefined}>
            {items.map((project) => (
              <PortfolioCard key={project.name} project={project} duplicate={duplicate} onPreview={onPreview} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectGrid({ title, projects, onPreview }) {
  return (
    <section className="mt-6">
      <h2 className="mb-3 text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <li key={project.name} className="min-w-0" data-scroll-reveal="slide">
            <PortfolioCard project={project} detailed onPreview={onPreview} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Portfolio({ detailed = false }) {
  const [preview, setPreview] = useState(null);
  const Heading = detailed ? "h1" : "h2";

  return (
    <section id="work" className="dark-pattern overflow-hidden px-5 py-8 text-white lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <div className={`mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-white/15 pb-4 ${detailed ? "page-hero-content" : ""}`}>
          <Heading className="text-5xl font-bold leading-none tracking-tight text-[#7547B8] sm:text-6xl lg:text-7xl">Our work</Heading>
          {!detailed && <Link to="/work" className="inline-flex items-center gap-2 text-sm font-semibold text-[#F4F0A3] hover:underline">
            View all work <ArrowUpRight size={16} aria-hidden="true" />
          </Link>}
        </div>
        {detailed ? (
          <>
            <ProjectGrid title="Websites" projects={websites} onPreview={setPreview} />
            <ProjectGrid title="Review cards and custom tools" projects={installations} onPreview={setPreview} />
          </>
        ) : (
          <div className="grid gap-3">
            <Conveyor direction="right" items={websites} onPreview={setPreview} />
            <Conveyor direction="left" items={installations} onPreview={setPreview} />
          </div>
        )}
      </div>

      {preview && (
        <dialog
          ref={(node) => { if (node && !node.open) node.showModal(); }}
          aria-labelledby="portfolio-preview-title"
          onClose={() => setPreview(null)}
          onClick={(event) => { if (event.target === event.currentTarget) event.currentTarget.close(); }}
          className="portfolio-dialog m-auto max-h-[92dvh] w-[min(92vw,48rem)] max-w-none overflow-auto rounded-2xl bg-[#242128] text-white shadow-2xl"
        >
          <div className="relative grid gap-3 p-4">
            <button type="button" autoFocus aria-label="Close image preview"
              onClick={(event) => event.currentTarget.closest("dialog").close()}
              className="absolute right-3 top-3 grid size-10 cursor-pointer place-items-center rounded-full bg-black/80 text-white hover:bg-black">
              <X size={21} aria-hidden="true" />
            </button>
            <img src={preview.detail} alt={preview.alt} className="max-h-[65dvh] w-full rounded-xl object-contain" />
            <div className="px-1">
              <h3 id="portfolio-preview-title" className="text-xl font-bold">{preview.name}</h3>
              <p className="mt-1 text-sm text-white/75">{preview.description}</p>
            </div>
          </div>
        </dialog>
      )}
    </section>
  );
}
