import React, { useState } from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  ArrowUpRight,
  Menu,
  X,
} from "lucide-react";

import logo from "../assets/MordecAI-logo.png";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId) => {
    setIsMenuOpen(false);

    const scroll = () => {
      const section =
        document.getElementById(sectionId);

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    };

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(scroll, 120);
      return;
    }

    scroll();
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-black/10 bg-ivory/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link
            to="/"
            className="flex items-center"
          >
            <img
              src={logo}
              alt="Mordecai"
              className="h-9 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <button
              type="button"
              onClick={() =>
                scrollToSection("services")
              }
              className="bg-transparent p-0 text-sm font-semibold text-[#17151A] shadow-none transition-colors hover:text-[#7547B8]"
            >
              Services
            </button>

            <Link
              to="/work"
              className="text-sm font-semibold text-[#17151A] transition-colors hover:text-[#7547B8]"
            >
              Our Work
            </Link>

            <Link
              to="/pricing"
              className="text-sm font-semibold text-[#17151A] transition-colors hover:text-[#7547B8]"
            >
              Pricing
            </Link>

            <button
              type="button"
              onClick={() =>
                scrollToSection("why-us")
              }
              className="bg-transparent p-0 text-sm font-semibold text-[#17151A] shadow-none transition-colors hover:text-[#7547B8]"
            >
              Why Us
            </button>

            <Link
              to="/contact"
              className="text-sm font-semibold text-[#17151A] transition-colors hover:text-[#7547B8]"
            >
              Contact
            </Link>
          </nav>

          <Link
            to="/business-check"
            className="hidden items-center gap-2 rounded-full bg-[#7547B8] px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#6439A5] md:inline-flex"
          >
            Check My Business
            <ArrowUpRight size={17} />
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() =>
              setIsMenuOpen(true)
            }
            aria-label="Open navigation"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            className="rounded-full bg-transparent p-2 text-[#17151A] shadow-none md:hidden"
          >
            <Menu size={26} />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <aside id="mobile-navigation"
        className={`
          fixed
          inset-0
          h-dvh
          z-[70]
          flex
          w-full
          flex-col overflow-y-auto overscroll-contain
          bg-ivory
          p-6
          transition-transform
          duration-300
          md:hidden

          ${
            isMenuOpen
              ? "visible translate-x-0"
              : "invisible translate-x-full"
          }
        `}
      >
        <div className="flex items-center justify-between">
          <Link
            to="/"
            onClick={() =>
              setIsMenuOpen(false)
            }
          >
            <img
              src={logo}
              alt="Mordecai"
              className="h-9 w-auto"
            />
          </Link>

          <button
            type="button"
            onClick={() =>
              setIsMenuOpen(false)
            }
            className="rounded-full bg-transparent p-2 text-[#17151A] shadow-none"
            aria-label="Close navigation"
          >
            <X size={26} />
          </button>
        </div>

        <nav className="mt-10 flex flex-col gap-7">
          <button
            type="button"
            onClick={() =>
              scrollToSection("services")
            }
            className="bg-transparent p-0 text-left text-xl font-semibold tracking-tight text-[#17151A] shadow-none"
          >
            Services
          </button>

          <Link
            to="/work"
            onClick={() =>
              setIsMenuOpen(false)
            }
            className="text-xl font-semibold tracking-tight text-[#17151A]"
          >
            Our Work
          </Link>

          <Link
            to="/pricing"
            onClick={() =>
              setIsMenuOpen(false)
            }
            className="text-xl font-semibold tracking-tight text-[#17151A]"
          >
            Pricing
          </Link>

          <button
            type="button"
            onClick={() =>
              scrollToSection("why-us")
            }
            className="bg-transparent p-0 text-left text-xl font-semibold tracking-tight text-[#17151A] shadow-none"
          >
            Why Us
          </button>

          <Link
            to="/contact"
            onClick={() =>
              setIsMenuOpen(false)
            }
            className="text-xl font-semibold tracking-tight text-[#17151A]"
          >
            Contact
          </Link>
        </nav>

        <Link
          to="/business-check"
          onClick={() =>
            setIsMenuOpen(false)
          }
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#7547B8] px-6 py-4 font-semibold text-white"
        >
          Check My Business
          <ArrowUpRight size={18} />
        </Link>
      </aside>
    </>
  );
}

export default Navbar;