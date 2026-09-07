import React from "react";

import {
  ArrowRight,
  Eye,
  Search,
  Sparkles,
  Heart,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Discover",
    description:
      "A customer searches for a business like yours.",
    icon: Search,
  },
  {
    number: "02",
    title: "Explore",
    description:
      "They check your website, Google profile, photos and information.",
    icon: Eye,
  },
  {
    number: "03",
    title: "Trust",
    description:
      "Your presentation and reviews give them confidence.",
    icon: Sparkles,
  },
  {
    number: "04",
    title: "Choose",
    description:
      "They call, visit, book, order or become a customer.",
    icon: Heart,
  },
];

function WhyPresenceMatter() {
  return (
    <section
      id="why-presence-matter"
      className="
        bg-[#17151A]
        px-5 py-24
        text-white
        lg:px-8
        lg:py-32
      "
    >
      <div
        className="
          mx-auto
          max-w-7xl
        "
      >
        <div
          className="
            grid
            gap-12
            lg:grid-cols-[0.9fr_1.1fr]
            lg:gap-20
          "
        >
          <div>
            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.2em]
                text-[#F4F0A3]
              "
            >
              Why your presence matters
            </p>

            <h2
              className="
                mt-5
                max-w-xl
                text-4xl
                font-bold
                leading-[1.02]
                tracking-[-0.045em]
                sm:text-5xl
                lg:text-6xl
              "
            >
              Being great at what
              you do isn't enough
              if nobody notices.
            </h2>

            <p
              className="
                mt-7
                max-w-lg
                text-lg
                leading-8
                text-white/60
              "
            >
              Customers form an
              opinion about your
              business long before
              they walk through the
              door. Mordecai helps
              make sure what they
              find earns their
              attention and trust.
            </p>
          </div>

          <div>
            <div
              className="
                grid
                gap-3
                sm:grid-cols-2
              "
            >
              {steps.map(
                ({
                  number,
                  title,
                  description,
                  icon: Icon,
                }) => (
                  <div
                    key={title}
                    className="
                      group
                      rounded-[1.75rem]
                      border
                      border-white/10
                      bg-white/[0.04]
                      p-6
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-[#7547B8]
                      hover:bg-white/[0.07]
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        justify-between
                      "
                    >
                      <span
                        className="
                          text-xs
                          font-bold
                          tracking-[0.18em]
                          text-white/35
                        "
                      >
                        {number}
                      </span>

                      <div
                        className="
                          flex
                          h-10 w-10
                          items-center
                          justify-center
                          rounded-full
                          bg-[#7547B8]
                          text-white
                        "
                      >
                        <Icon
                          size={18}
                        />
                      </div>
                    </div>

                    <h3
                      className="
                        mt-10
                        text-2xl
                        font-semibold
                        tracking-tight
                      "
                    >
                      {title}
                    </h3>

                    <p
                      className="
                        mt-3
                        leading-7
                        text-white/50
                      "
                    >
                      {description}
                    </p>
                  </div>
                )
              )}
            </div>

            <div
              className="
                mt-7
                flex
                items-center
                gap-3
                text-sm
                font-semibold
                text-[#F4F0A3]
              "
            >
              Discovery

              <ArrowRight
                size={16}
              />

              Trust

              <ArrowRight
                size={16}
              />

              Customer
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyPresenceMatter;