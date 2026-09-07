import React from "react";

import {
  ArrowRight,
  Globe2,
  MapPin,
  Smartphone,
  Star,
} from "lucide-react";

function Hero() {
  const scrollToServices = () => {
    const section =
      document.getElementById(
        "services"
      );

    section?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[#F7F5EF]
      "
    >
      <div
        className="
          mx-auto grid
          min-h-[calc(100vh-74px)]
          max-w-7xl
          items-center
          gap-16
          px-5 py-20
          lg:grid-cols-[1.05fr_0.95fr]
          lg:px-8
          lg:py-28
        "
      >
        <div className="relative z-10">
          <div
            className="
              mb-7
              inline-flex
              rounded-full
              border
              border-[#7547B8]/20
              bg-white/60
              px-4 py-2
              text-xs
              font-bold
              uppercase
              tracking-[0.18em]
              text-[#7547B8]
            "
          >
            Digital presence for local businesses
          </div>

          <h1
            className="
              max-w-3xl
              text-5xl
              font-bold
              leading-[0.95]
              tracking-[-0.055em]
              text-[#17151A]
              sm:text-6xl
              lg:text-7xl
              xl:text-[5.5rem]
            "
          >
            Get found.
            <br />

            Look good.
            <br />

            <span
              className="
                text-[#7547B8]
              "
            >
              Build trust.
            </span>
          </h1>

          <p
            className="
              mt-8
              max-w-xl
              text-lg
              leading-8
              text-[#17151A]/65
              sm:text-xl
            "
          >
            Mordecai helps local
            businesses stand out
            online with better
            websites, stronger
            reviews, and digital
            tools built to turn
            attention into
            customers.
          </p>

          <div
            className="
              mt-10
              flex
              flex-col
              gap-4
              sm:flex-row
            "
          >
            <button
              type="button"
              onClick={scrollToServices}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-full
                bg-[#7547B8]
                px-7 py-4
                font-semibold
                text-white
                shadow-none
                transition-all
                duration-200
                hover:-translate-y-1
                hover:bg-[#6439A5]
              "
            >
              Explore Our Services

              <ArrowRight size={18} />
            </button>

            <a
              href="/business-check"
              className="
                inline-flex
                items-center
                justify-center
                rounded-full
                border
                border-black/15
                bg-white
                px-7 py-4
                font-semibold
                text-[#17151A]
                transition-all
                duration-200
                hover:border-[#7547B8]/50
                hover:text-[#7547B8]
              "
            >
              Free Online Business Check
            </a>
          </div>

          <div
            className="
              mt-11
              flex
              flex-wrap
              gap-x-6
              gap-y-3
              text-sm
              font-medium
              text-[#17151A]/45
            "
          >
            <span>Websites</span>

            <span>
              Google Presence
            </span>

            <span>Reviews</span>

            <span>
              Digital Tools
            </span>
          </div>
        </div>

        <div
          className="
            relative
            mx-auto
            w-full
            max-w-xl
          "
        >
          <div
            className="
              absolute
              -left-20
              -top-20
              h-60 w-60
              rounded-full
              bg-[#F4F0A3]
              blur-3xl
            "
          />

          <div
            className="
              absolute
              -bottom-14
              -right-16
              h-72 w-72
              rounded-full
              bg-[#7547B8]/15
              blur-3xl
            "
          />

          <div
            className="
              relative
              rotate-[1.5deg]
              rounded-[2.25rem]
              bg-[#7547B8]
              p-5
              shadow-[0_35px_100px_rgba(74,46,105,0.25)]
              sm:p-7
            "
          >
            <div
              className="
                -rotate-[1.5deg]
                rounded-[1.75rem]
                bg-[#F7F5EF]
                p-6
                sm:p-8
              "
            >
              <div
                className="
                  flex
                  items-start
                  justify-between
                  gap-6
                "
              >
                <div>
                  <p
                    className="
                      text-xs
                      font-bold
                      uppercase
                      tracking-[0.18em]
                      text-[#7547B8]
                    "
                  >
                    Your business online
                  </p>

                  <h2
                    className="
                      mt-3
                      max-w-sm
                      text-3xl
                      font-bold
                      leading-tight
                      tracking-[-0.04em]
                      text-[#17151A]
                    "
                  >
                    First impressions
                    happen before
                    customers walk in.
                  </h2>
                </div>

                <div
                  className="
                    hidden
                    h-12 w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[#F4F0A3]
                    sm:flex
                  "
                >
                  <Globe2 size={22} />
                </div>
              </div>

              <div
                className="
                  mt-8
                  space-y-4
                "
              >
                <PresenceItem
                  icon={
                    <MapPin
                      size={21}
                    />
                  }
                  iconClass="
                    bg-[#7547B8]/10
                    text-[#7547B8]
                  "
                  title="Get discovered"
                  description="Google, search, maps and local presence"
                />

                <PresenceItem
                  icon={
                    <Smartphone
                      size={21}
                    />
                  }
                  iconClass="
                    bg-[#F4F0A3]
                    text-[#17151A]
                  "
                  title="Make a great impression"
                  description="Modern, fast, mobile-first websites"
                />

                <PresenceItem
                  icon={
                    <Star
                      size={21}
                    />
                  }
                  iconClass="
                    bg-[#AFCB83]/45
                    text-[#17151A]
                  "
                  title="Build visible trust"
                  description="Reviews, reputation and customer feedback"
                />
              </div>

              <div
                className="
                  mt-6
                  flex
                  items-center
                  justify-between
                  gap-5
                  rounded-2xl
                  bg-[#17151A]
                  px-5 py-4
                  text-white
                "
              >
                <div>
                  <p
                    className="
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.2em]
                      text-white/40
                    "
                  >
                    Mordecai
                  </p>

                  <p
                    className="
                      mt-1
                      font-semibold
                    "
                  >
                    Helping local
                    businesses stand
                    out.
                  </p>
                </div>

                <ArrowRight
                  className="shrink-0"
                  size={20}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PresenceItem({
  icon,
  iconClass,
  title,
  description,
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-4
        rounded-2xl
        border
        border-black/[0.06]
        bg-white
        p-4
      "
    >
      <div
        className={`
          flex h-11 w-11
          shrink-0
          items-center
          justify-center
          rounded-xl

          ${iconClass}
        `}
      >
        {icon}
      </div>

      <div>
        <p
          className="
            font-semibold
            text-[#17151A]
          "
        >
          {title}
        </p>

        <p
          className="
            mt-0.5
            text-sm
            text-[#17151A]/50
          "
        >
          {description}
        </p>
      </div>
    </div>
  );
}

export default Hero;