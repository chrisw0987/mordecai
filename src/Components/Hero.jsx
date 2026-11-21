import { ArrowRight } from "lucide-react";

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
        bg-ivory
      "
    >
      <div
        className="
          mx-auto grid
          max-w-7xl
          items-center justify-items-center
          px-5 py-8
          lg:px-8
          lg:py-12
        "
      >
        <div className="page-hero-content text-center">
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
              mt-5
              mx-auto max-w-xl
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
              mt-6
              flex
              flex-col
              gap-4
              sm:flex-row sm:justify-center
            "
          >
            <button
              type="button"
              onClick={scrollToServices}
              className="
                inline-flex
                items-center justify-items-center
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
                items-center justify-items-center
                justify-center
                rounded-full
                border
                border-black/15
                bg-bone
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

        </div>
      </div>
    </section>
  );
}

export default Hero;
