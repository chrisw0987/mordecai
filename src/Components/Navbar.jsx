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

  const navItems = [
    {
      label: "Services",
      id: "services",
    },
    {
      label: "Our Work",
      id: "work",
    },
    {
      label: "Why Us",
      id: "why-us",
    },
  ];

  return (
    <>
      <header
        className="
          sticky
          top-0
          z-50
          border-b
          border-black/10
          bg-[#F7F5EF]/90
          backdrop-blur-xl
        "
      >
        <div
          className="
            mx-auto
            flex
            max-w-7xl
            items-center
            justify-between
            px-5
            py-4
            lg:px-8
          "
        >
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

          {/* Desktop navigation */}
          <nav
            className="
              hidden
              items-center
              gap-9
              md:flex
            "
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  scrollToSection(item.id)
                }
                className="
                  bg-transparent
                  p-0
                  text-sm
                  font-semibold
                  text-[#17151A]
                  shadow-none
                  transition-colors
                  hover:text-[#7547B8]
                "
              >
                {item.label}
              </button>
            ))}

            <Link
              to="/contact"
              className="
                text-sm
                font-semibold
                text-[#17151A]
                transition-colors
                hover:text-[#7547B8]
              "
            >
              Contact
            </Link>
          </nav>

          {/* Desktop CTA */}
          <Link
            to="/business-check"
            className="
              hidden
              items-center
              gap-2
              rounded-full
              bg-[#7547B8]
              px-5
              py-3
              text-sm
              font-semibold
              text-white
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:bg-[#6439A5]
              md:inline-flex
            "
          >
            Check My Business
            <ArrowUpRight size={17} />
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() =>
              setIsMenuOpen(true)
            }
            aria-label="Open navigation"
            className="
              rounded-full
              bg-transparent
              p-2
              text-[#17151A]
              shadow-none
              md:hidden
            "
          >
            <Menu size={26} />
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        onClick={() =>
          setIsMenuOpen(false)
        }
        className={`
          fixed
          inset-0
          z-[60]
          bg-black/40
          transition-opacity
          duration-300
          md:hidden

          ${
            isMenuOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
      />

      {/* Mobile drawer */}
      <aside
        className={`
          fixed
          right-0
          top-0
          z-[70]
          flex
          h-screen
          w-[88%]
          max-w-sm
          flex-col
          bg-[#F7F5EF]
          p-6
          shadow-2xl
          transition-transform
          duration-300
          md:hidden

          ${
            isMenuOpen
              ? "translate-x-0"
              : "translate-x-full"
          }
        `}
      >
        <div
          className="
            flex
            items-center
            justify-between
          "
        >
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
            className="
              rounded-full
              bg-transparent
              p-2
              text-[#17151A]
              shadow-none
            "
            aria-label="Close navigation"
          >
            <X size={26} />
          </button>
        </div>

        <nav
          className="
            mt-14
            flex
            flex-col
            gap-8
          "
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                scrollToSection(item.id)
              }
              className="
                bg-transparent
                p-0
                text-left
                text-3xl
                font-semibold
                tracking-tight
                text-[#17151A]
                shadow-none
              "
            >
              {item.label}
            </button>
          ))}

          <Link
            to="/contact"
            onClick={() =>
              setIsMenuOpen(false)
            }
            className="
              text-3xl
              font-semibold
              tracking-tight
              text-[#17151A]
            "
          >
            Contact
          </Link>
        </nav>

        <Link
          to="/business-check"
          onClick={() =>
            setIsMenuOpen(false)
          }
          className="
            mt-auto
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-full
            bg-[#7547B8]
            px-6
            py-4
            font-semibold
            text-white
          "
        >
          Check My Business
          <ArrowUpRight size={18} />
        </Link>
      </aside>
    </>
  );
}

export default Navbar;