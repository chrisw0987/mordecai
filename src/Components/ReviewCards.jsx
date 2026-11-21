import React, {
  useRef,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  ArrowRight,
  Check,
  Radio,
  ScanLine,
  Smartphone,
} from "lucide-react";

import googleCards from "../assets/google-review-cards.png";
import socialCards from "../assets/social-review-cards.png";

function ReviewCards() {
  const stageRef = useRef(null);

  const [tilt, setTilt] = useState({
    x: 0,
    y: 0,
  });

  const [active, setActive] = useState(false);

  const handleMouseMove = (event) => {
    if (!stageRef.current) return;

    const rect =
      stageRef.current.getBoundingClientRect();

    const x =
      (event.clientX - rect.left) /
      rect.width;

    const y =
      (event.clientY - rect.top) /
      rect.height;

    const rotateY = (x - 0.5) * 18;
    const rotateX = (0.5 - y) * 14;

    setTilt({
      x: rotateX,
      y: rotateY,
    });
  };

  const resetTilt = () => {
    setTilt({
      x: 0,
      y: 0,
    });

    setActive(false);
  };

  return (
    <section
      id="review-cards"
      className="
        overflow-hidden
        bg-ivory
        px-5
        py-16
        text-[#17151A]
        lg:px-8
        lg:py-20
      "
    >
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-[#7547B8]/15
              bg-[#7547B8]/[0.06]
              px-4
              py-2
              text-xs
              font-bold
              uppercase
              tracking-[0.16em]
              text-[#7547B8]
            "
          >
            <Radio size={14} />
            NFC Review Cards
          </div>

          <h2
            className="
              mt-7
              text-4xl
              font-bold
              tracking-[-0.05em]
              sm:text-5xl
              lg:text-6xl
            "
          >
            Make leaving a review
            <span className="text-[#7547B8]">
              {" "}
              effortless.
            </span>
          </h2>

          <p
            className="
              mx-auto
              mt-6
              max-w-2xl
              text-base
              leading-7
              text-[#17151A]/55
              sm:text-lg
            "
          >
            Give customers a simple way to reach
            your Google review page. One tap or
            scan takes them right where they need
            to go.
          </p>
        </div>

        {/* Product Showcase */}
        <div
          className="
            mt-12
            grid
            items-center
            gap-10
            lg:grid-cols-[1.15fr_0.85fr]
            lg:gap-14
          "
        >
          {/* 3D Stage */}
          <div
            ref={stageRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() =>
              setActive(true)
            }
            onMouseLeave={resetTilt}
            className="
              group
              relative
              flex
              min-h-[420px]
              cursor-pointer
              items-center
              justify-center
              sm:min-h-[520px]
            "
            style={{
              perspective: "1200px",
            }}
          >
            {/* Background Glow */}
            <div
              className="
                pointer-events-none
                absolute
                left-1/2
                top-1/2
                h-[330px]
                w-[330px]
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-[#7547B8]/15
                blur-[80px]
                transition
                duration-500
                group-hover:bg-[#7547B8]/20
                sm:h-[420px]
                sm:w-[420px]
              "
            />

            {/* Decorative ring */}
            <div
              className="
                pointer-events-none
                absolute
                left-1/2
                top-1/2
                h-[310px]
                w-[310px]
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                border
                border-[#7547B8]/10
                sm:h-[410px]
                sm:w-[410px]
              "
            />

            {/* Social cards behind */}
            <div
              className="
                absolute
                left-[4%]
                top-[12%]
                z-10
                w-[48%]
                max-w-[330px]
                select-none
                sm:left-[5%]
              "
              style={{
                transform: `
                  translate3d(
                    ${tilt.y * -0.8}px,
                    ${tilt.x * 0.55}px,
                    -35px
                  )
                  rotateX(${tilt.x * 0.55}deg)
                  rotateY(${tilt.y * 0.55}deg)
                  rotate(-8deg)
                  ${
                    active
                      ? "translate(-10px, -8px)"
                      : ""
                  }
                `,
                transformStyle: "preserve-3d",
                transition: active
                  ? "transform 90ms linear"
                  : "transform 600ms cubic-bezier(.2,.8,.2,1)",
              }}
            >
              <img
                src={socialCards}
                alt="NFC social media cards"
                draggable="false"
                className="
                  w-full
                  object-contain
                  drop-shadow-[0_24px_25px_rgba(23,21,26,0.16)]
                "
              />
            </div>

            {/* Google cards front */}
            <div
              className="
                relative
                z-20
                ml-[12%]
                mt-[8%]
                w-[72%]
                max-w-[500px]
                select-none
              "
              style={{
                transform: `
                  rotateX(${tilt.x}deg)
                  rotateY(${tilt.y}deg)
                  ${
                    active
                      ? "translate3d(8px, -8px, 35px) scale(1.025)"
                      : "translate3d(0, 0, 0)"
                  }
                `,
                transformStyle: "preserve-3d",
                transition: active
                  ? "transform 90ms linear"
                  : "transform 650ms cubic-bezier(.2,.8,.2,1)",
              }}
            >
              <img
                src={googleCards}
                alt="Google NFC review cards"
                draggable="false"
                className="
                  w-full
                  object-contain
                  drop-shadow-[0_30px_35px_rgba(23,21,26,0.20)]
                "
              />

              {/* Floating NFC badge */}
              <div
                className="
                  absolute
                  -bottom-3
                  right-0
                  hidden
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-black/5
                  bg-bone
                  px-4
                  py-2.5
                  text-xs
                  font-bold
                  shadow-xl
                  sm:flex
                "
                style={{
                  transform:
                    "translateZ(70px)",
                }}
              >
                <Smartphone
                  size={15}
                  className="text-[#7547B8]"
                />

                Tap to connect
              </div>
            </div>

            {/* Hint */}
            <div
              className="
                absolute
                bottom-0
                left-1/2
                hidden
                -translate-x-1/2
                items-center
                gap-2
                text-xs
                font-semibold
                text-[#17151A]/35
                lg:flex
              "
            >
              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-[#7547B8]
                "
              />

              Move your mouse to explore
            </div>
          </div>

          {/* Copy */}
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
              Tap. Scan. Review.
            </p>

            <h3
              className="
                mt-4
                text-3xl
                font-bold
                tracking-[-0.04em]
                sm:text-4xl
              "
            >
              One small card.
              <br />
              One easier customer action.
            </h3>

            <p
              className="
                mt-6
                max-w-lg
                leading-7
                text-[#17151A]/55
              "
            >
              Place your review card at the
              register, front desk, or checkout
              area. Customers can tap it with a
              compatible phone or scan the QR code
              to reach your review page.
            </p>

            <div className="mt-8 space-y-4">
              {[
                {
                  icon: Smartphone,
                  text: "NFC tap built in",
                },
                {
                  icon: ScanLine,
                  text: "QR code for easy scanning",
                },
                {
                  icon: Check,
                  text: "Set up for your business",
                },
                {
                  icon: Check,
                  text: "No app required",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.text}
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <div
                      className="
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[#7547B8]/10
                        text-[#7547B8]
                      "
                    >
                      <Icon size={15} />
                    </div>

                    <span
                      className="
                        text-sm
                        font-semibold
                        text-[#17151A]/70
                      "
                    >
                      {item.text}
                    </span>
                  </div>
                );
              })}
            </div>

            <Link
              to="/contact"
              className="
                mt-9
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-[#7547B8]
                px-6
                py-3.5
                text-sm
                font-bold
                text-white
                transition
                duration-300
                hover:-translate-y-0.5
                hover:bg-[#6439A5]
                hover:shadow-lg
              "
            >
              Get a Review Card
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ReviewCards;