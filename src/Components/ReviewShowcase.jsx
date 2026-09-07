import React from "react";

import {
  ArrowRight,
  Check,
  MessageSquareText,
  Radio,
  Star,
} from "lucide-react";

function ReviewShowcase() {
  return (
    <section className="overflow-hidden bg-[#F4F0A3] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Visual */}
          <div className="relative order-2 lg:order-1">
            <div className="absolute -left-16 top-8 h-64 w-64 rounded-full bg-white/45 blur-3xl" />

            <div className="relative mx-auto max-w-lg">
              {/* NFC card */}
              <div
                className="
                  relative
                  z-10
                  mx-auto
                  w-[78%]
                  rotate-[-5deg]
                  rounded-[2rem]
                  bg-[#7547B8]
                  px-7
                  py-10
                  text-white
                  shadow-[0_35px_80px_rgba(79,51,110,0.22)]
                  sm:px-9
                  sm:py-12
                "
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold">
                    Mordecai
                  </p>

                  <Radio
                    size={25}
                    className="text-[#F4F0A3]"
                  />
                </div>

                <div className="mt-20">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F4F0A3]">
                    Enjoyed your experience?
                  </p>

                  <h3 className="mt-4 text-4xl font-bold leading-[1] tracking-[-0.045em]">
                    Tap to share your feedback.
                  </h3>

                  <div className="mt-7 flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={22}
                        fill="currentColor"
                        className="text-[#F4F0A3]"
                      />
                    ))}
                  </div>
                </div>

                <p className="mt-14 text-xs text-white/40">
                  powered by Mordecai
                </p>
              </div>

              {/* Phone mockup */}
              <div
                className="
                  relative
                  z-20
                  -mt-16
                  ml-auto
                  w-[62%]
                  rotate-[5deg]
                  rounded-[2.4rem]
                  border-[7px]
                  border-[#17151A]
                  bg-[#17151A]
                  p-1
                  shadow-[0_30px_70px_rgba(23,21,26,0.25)]
                "
              >
                <div className="min-h-[400px] overflow-hidden rounded-[1.9rem] bg-[#F7F5EF]">
                  <div className="flex justify-center pt-3">
                    <div className="h-5 w-20 rounded-full bg-[#17151A]" />
                  </div>

                  <div className="px-5 pb-7 pt-10 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#7547B8] text-white">
                      <MessageSquareText size={24} />
                    </div>

                    <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-[#7547B8]">
                      How was your visit?
                    </p>

                    <h4 className="mt-3 text-2xl font-bold tracking-[-0.035em] text-[#17151A]">
                      We'd love to hear about your experience.
                    </h4>

                    <div className="mt-6 flex justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div
                          key={star}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F4F0A3]"
                        >
                          <Star
                            size={15}
                            className="text-[#17151A]"
                          />
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      className="
                        mt-8
                        w-full
                        rounded-full
                        bg-[#7547B8]
                        px-4
                        py-3
                        text-sm
                        font-semibold
                        text-white
                        shadow-none
                      "
                    >
                      Continue
                    </button>

                    <p className="mt-5 text-[10px] text-black/30">
                      Feedback experience powered by Mordecai
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Copy */}
          <div className="order-1 lg:order-2">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7547B8]">
              Reviews & reputation
            </p>

            <h2 className="mt-5 max-w-xl text-4xl font-bold leading-[1] tracking-[-0.05em] text-[#17151A] sm:text-5xl lg:text-6xl">
              Turn a great experience into visible trust.
            </h2>

            <p className="mt-7 max-w-xl text-lg leading-8 text-[#17151A]/60">
              Mordecai Review Cards make it simple for customers to share
              feedback while they&apos;re still thinking about their
              experience.
            </p>

            <div className="mt-10 space-y-6">
              <Feature
                number="01"
                title="Tap"
                text="The customer taps the NFC review card with their phone."
              />

              <Feature
                number="02"
                title="Share"
                text="A simple mobile experience makes leaving feedback easy."
              />

              <Feature
                number="03"
                title="Build trust"
                text="A stronger stream of genuine customer feedback strengthens your business online."
              />
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                type="button"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  bg-[#17151A]
                  px-7
                  py-4
                  font-semibold
                  text-white
                  shadow-none
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                "
              >
                Explore Review Cards
                <ArrowRight size={18} />
              </button>

              <div className="flex items-center gap-2 text-sm font-semibold text-[#17151A]/50">
                <Check size={17} />

                No app required
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Feature({
  number,
  title,
  text,
}) {
  return (
    <div className="grid grid-cols-[42px_1fr] gap-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#17151A]/15 text-xs font-bold text-[#17151A]/45">
        {number}
      </div>

      <div>
        <h3 className="text-lg font-bold text-[#17151A]">
          {title}
        </h3>

        <p className="mt-1 max-w-md leading-7 text-[#17151A]/55">
          {text}
        </p>
      </div>
    </div>
  );
}

export default ReviewShowcase;