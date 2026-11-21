import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";
import logo from "../assets/MordecAI-logo-box.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const linkClass = "hover:text-white";

  return (
    <footer className="dark-pattern px-5 py-5 text-sm text-white/75 lg:px-8">
      <div className="mx-auto max-w-7xl" data-scroll-reveal>
        <div className="grid gap-5 border-b border-white/15 pb-4 lg:grid-cols-[1fr_auto] lg:gap-10">
          <Link to="/" className="inline-flex h-fit w-fit items-center gap-2.5 text-2xl font-bold tracking-tight text-white">
            <img src={logo} alt="" className="size-10 rounded-lg object-contain" />
            Mordecai
          </Link>

          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-3 sm:gap-8">
            <nav aria-label="Explore" className="grid content-start gap-1.5">
              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-white/80">Explore</p>
              <a href="/#services" className={linkClass}>Services</a>
              <Link to="/work" className={linkClass}>Our Work</Link>
              <Link to="/pricing" className={linkClass}>Pricing</Link>
              <a href="/#why-us" className={linkClass}>Why Us</a>
              <Link to="/business-check" className={linkClass}>Free Business Checker</Link>
              <Link to="/contact" className={linkClass}>Contact Us</Link>
            </nav>
            <div className="min-w-0">
              <p className="mb-2.5 text-xs font-bold uppercase tracking-wider text-white/80">Contact</p>
              <div className="grid gap-2 text-xs sm:text-sm">
                <a href="mailto:mordecaiteam@gmail.com" className={`flex min-w-0 items-start gap-1.5 ${linkClass}`}>
                  <Mail size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
                  <span className="[overflow-wrap:anywhere]">mordecaiteam@gmail.com</span>
                </a>
                <a href="tel:+13479256580" className={`flex items-center gap-1.5 ${linkClass}`}>
                  <Phone size={14} className="shrink-0" aria-hidden="true" /> 347-925-6580
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pt-3 text-xs text-white/65">
          <p>© {currentYear} Mordecai. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className={linkClass}>Privacy</Link>
            <Link to="/terms" className={linkClass}>Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
