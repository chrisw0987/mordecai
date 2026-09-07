import React from "react";

import {
  ArrowUpRight,
  Mail,
  Phone,
} from "lucide-react";

function Footer() {
  const currentYear =
    new Date().getFullYear();

  return (
    <footer
      className="
        bg-[#17151A]
        px-5
        pb-8
        pt-20
        text-white
        lg:px-8
      "
    >
      <div className="mx-auto max-w-7xl">

        {/* Top */}
        <div
          className="
            grid
            gap-14
            border-b
            border-white/10
            pb-16
            lg:grid-cols-[1.15fr_0.85fr]
          "
        >
          {/* Brand */}
          <div>
            <a
              href="/"
              className="
                text-3xl
                font-bold
                tracking-[-0.04em]
                text-white
              "
            >
              Mordecai
            </a>

            <h2
              className="
                mt-8
                max-w-2xl
                text-4xl
                font-bold
                leading-[1]
                tracking-[-0.05em]
                sm:text-5xl
              "
            >
              Make your business easier to find

              <span className="text-[#F4F0A3]">
                {" "}
                and harder to forget.
              </span>
            </h2>

            <p
              className="
                mt-7
                max-w-xl
                leading-7
                text-white/50
              "
            >
              Websites, reviews, local presence,
              and digital tools for businesses
              that deserve to be noticed.
            </p>

            <div
              className="
                mt-8
                flex
                flex-wrap
                gap-x-7
                gap-y-4
              "
            >
              <a
                href="/business-check"
                className="
                  inline-flex
                  items-center
                  gap-2
                  font-semibold
                  text-[#F4F0A3]
                  transition
                  hover:text-white
                "
              >
                Check My Business
                <ArrowUpRight size={17} />
              </a>

              <a
                href="/contact"
                className="
                  inline-flex
                  items-center
                  gap-2
                  font-semibold
                  text-white/65
                  transition
                  hover:text-white
                "
              >
                Contact Us
                <ArrowUpRight size={17} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div
            className="
              grid
              gap-10
              sm:grid-cols-2
              lg:justify-self-end
              lg:gap-20
            "
          >
            <div>
              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-white/30
                "
              >
                Explore
              </p>

              <div
                className="
                  mt-5
                  flex
                  flex-col
                  gap-4
                "
              >
                <a
                  href="/#services"
                  className="
                    text-white/65
                    transition
                    hover:text-white
                  "
                >
                  Services
                </a>

                <a
                  href="/#work"
                  className="
                    text-white/65
                    transition
                    hover:text-white
                  "
                >
                  Our Work
                </a>

                <a
                  href="/#why-us"
                  className="
                    text-white/65
                    transition
                    hover:text-white
                  "
                >
                  Why Us
                </a>

                <a
                  href="/business-check"
                  className="
                    text-white/65
                    transition
                    hover:text-white
                  "
                >
                  Free Online Business Check
                </a>

                <a
                  href="/contact"
                  className="
                    text-white/65
                    transition
                    hover:text-white
                  "
                >
                  Contact Us
                </a>
              </div>
            </div>

            <div>
              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-white/30
                "
              >
                Contact
              </p>

              <div
                className="
                  mt-5
                  flex
                  flex-col
                  gap-4
                "
              >
                <a
                  href="mailto:mordecaiteam@gmail.com"
                  className="
                    flex
                    items-center
                    gap-3
                    text-white/65
                    transition
                    hover:text-white
                  "
                >
                  <Mail size={16} />

                  mordecaiteam@gmail.com
                </a>

                <a
                  href="tel:+13479256580"
                  className="
                    flex
                    items-center
                    gap-3
                    text-white/65
                    transition
                    hover:text-white
                  "
                >
                  <Phone size={16} />

                  347-925-6580
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="
            flex
            flex-col
            gap-5
            py-7
            text-sm
            text-white/35
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <p>
            © {currentYear} Mordecai. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;