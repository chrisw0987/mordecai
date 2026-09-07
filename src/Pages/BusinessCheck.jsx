import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Globe2,
  LoaderCircle,
  MapPin,
  Search,
  X,
} from "lucide-react";

function BusinessCheck() {
  const [
    businessQuery,
    setBusinessQuery,
  ] = useState("");

  const [
    suggestions,
    setSuggestions,
  ] = useState([]);

  const [
    selectedBusiness,
    setSelectedBusiness,
  ] = useState(null);

  const [
    businessName,
    setBusinessName,
  ] = useState("");

  const [
    website,
    setWebsite,
  ] = useState("");

  const [
    searching,
    setSearching,
  ] = useState(false);

  const [
    loadingBusiness,
    setLoadingBusiness,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    result,
    setResult,
  ] = useState(null);

  const [
    error,
    setError,
  ] = useState("");

  /*
   * --------------------------------
   * Geoapify autocomplete
   * --------------------------------
   */
  useEffect(() => {
    if (
      selectedBusiness ||
      businessQuery.trim().length < 3
    ) {
      setSuggestions([]);
      return;
    }

    const timeout =
      setTimeout(async () => {
        setSearching(true);

        try {
          const response =
            await fetch(
              "/.netlify/functions/places-autocomplete",
              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json",
                },

                body:
                  JSON.stringify({
                    input:
                      businessQuery,
                  }),
              }
            );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.error ||
                "Could not search businesses."
            );
          }

          setSuggestions(
            data.suggestions || []
          );
        } catch (searchError) {
          console.error(
            "Business search error:",
            searchError
          );

          setSuggestions([]);
        } finally {
          setSearching(false);
        }
      }, 300);

    return () =>
      clearTimeout(timeout);
  }, [
    businessQuery,
    selectedBusiness,
  ]);

  /*
   * --------------------------------
   * Select a Geoapify business
   * --------------------------------
   */
  const handleBusinessSelect =
    async (suggestion) => {
      setSuggestions([]);
      setError("");
      setResult(null);

      setBusinessQuery(
        suggestion.name
      );

      setLoadingBusiness(true);

      try {
        const response =
          await fetch(
            "/.netlify/functions/place-details",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  placeId:
                    suggestion.placeId,
                }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Could not load that business."
          );
        }

        const business = {
          ...suggestion,
          ...data,

          name:
            data.name ||
            suggestion.name ||
            "",

          address:
            data.address ||
            suggestion.address ||
            "",
        };

        setSelectedBusiness(
          business
        );

        setBusinessName(
          business.name
        );

        setWebsite(
          business.website || ""
        );
      } catch (
        businessError
      ) {
        console.error(
          "Business details error:",
          businessError
        );

        setError(
          businessError.message
        );

        /*
         * We still know the business
         * from autocomplete, so let the
         * user continue manually.
         */
        setSelectedBusiness(
          suggestion
        );

        setBusinessName(
          suggestion.name || ""
        );

        setWebsite("");
      } finally {
        setLoadingBusiness(false);
      }
    };

  /*
   * --------------------------------
   * Reset selection
   * --------------------------------
   */
  const clearBusiness = () => {
    setSelectedBusiness(null);
    setBusinessQuery("");
    setBusinessName("");
    setWebsite("");
    setSuggestions([]);
    setResult(null);
    setError("");
  };

  /*
   * --------------------------------
   * Run Mordecai website checker
   * --------------------------------
   */
  const handleSubmit =
    async (event) => {
      event.preventDefault();

      if (!selectedBusiness) {
        setError(
          "Please select your business first."
        );

        return;
      }

      if (!website.trim()) {
        setError(
          "Please enter your business website."
        );

        return;
      }

      setLoading(true);
      setError("");
      setResult(null);

      try {
        const response =
          await fetch(
            "/.netlify/functions/business-check",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  website:
                    website.trim(),
                }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "We couldn't check that website."
          );
        }

        setResult(data);

        /*
         * Record successful checks
         * through Netlify Forms.
         *
         * This intentionally happens
         * after the website checker so
         * the form stores the score.
         */
        try {
          const formBody =
            new URLSearchParams({
              "form-name":
                "business-check",

              businessName:
                businessName ||
                selectedBusiness
                  ?.name ||
                "",

              address:
                selectedBusiness
                  ?.address || "",

              placeId:
                selectedBusiness
                  ?.placeId || "",

              website:
                data.website ||
                website,

              score:
                String(
                  data.score ?? ""
                ),

              grade:
                data.grade || "",
            });

          await fetch("/", {
            method: "POST",

            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded",
            },

            body:
              formBody.toString(),
          });
        } catch (
          formError
        ) {
          /*
           * Don't fail the customer's
           * check just because analytics
           * logging fails.
           */
          console.error(
            "Netlify form logging error:",
            formError
          );
        }
      } catch (
        checkError
      ) {
        console.error(
          "Business check error:",
          checkError
        );

        setError(
          checkError.message ||
            "Something went wrong. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

  const failedChecks =
    result?.checks?.filter(
      (check) => !check.passed
    ) || [];

  const passedChecks =
    result?.checks?.filter(
      (check) => check.passed
    ) || [];

  return (
    <main className="min-h-screen bg-[#F7F5EF]">
      {/* Hero */}
      <section
        className="
          border-b
          border-black/[0.06]
          px-5
          pb-14
          pt-16
          lg:px-8
          lg:pb-20
          lg:pt-24
        "
      >
        <div className="mx-auto max-w-7xl">
          <Link
            to="/"
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-[#17151A]/45
              transition
              hover:text-[#7547B8]
            "
          >
            <ArrowLeft size={16} />

            Back to Mordecai
          </Link>

          <div
            className="
              mt-10
              grid
              gap-12
              lg:grid-cols-[1.1fr_0.9fr]
              lg:items-end
            "
          >
            <div>
              <p
                className="
                  text-sm
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-[#7547B8]
                "
              >
                Free Online Business Check
              </p>

              <h1
                className="
                  mt-5
                  max-w-3xl
                  text-5xl
                  font-bold
                  leading-[0.95]
                  tracking-[-0.055em]
                  text-[#17151A]
                  sm:text-6xl
                  lg:text-7xl
                "
              >
                See your business through a{" "}
                <span className="text-[#7547B8]">
                  customer's eyes.
                </span>
              </h1>
            </div>

            <p
              className="
                max-w-xl
                text-lg
                leading-8
                text-[#17151A]/55
                lg:justify-self-end
              "
            >
              Find your business and we'll check
              common website signals that affect
              credibility, usability, and how
              customers experience your business
              online.
            </p>
          </div>
        </div>
      </section>

      {/* Checker */}
      <section
        className="
          px-5
          py-14
          lg:px-8
          lg:py-20
        "
      >
        <div
          className="
            mx-auto
            grid
            max-w-7xl
            gap-8
            lg:grid-cols-[1fr_0.7fr]
            lg:gap-12
          "
        >
          <div>
            {!result ? (
              <form
                onSubmit={
                  handleSubmit
                }
                className="
                  rounded-[2rem]
                  border
                  border-black/[0.07]
                  bg-white
                  p-6
                  shadow-[0_30px_100px_rgba(23,21,26,0.06)]
                  sm:p-8
                  lg:p-10
                "
              >
                <div>
                  <p
                    className="
                      text-sm
                      font-bold
                      uppercase
                      tracking-[0.16em]
                      text-[#7547B8]
                    "
                  >
                    Step 1
                  </p>

                  <h2
                    className="
                      mt-3
                      text-3xl
                      font-bold
                      tracking-[-0.04em]
                      text-[#17151A]
                    "
                  >
                    Find your business
                  </h2>

                  <p
                    className="
                      mt-3
                      max-w-xl
                      leading-7
                      text-[#17151A]/50
                    "
                  >
                    Start typing your business
                    name and select the correct
                    location.
                  </p>
                </div>

                {/* Search */}
                <div className="relative mt-8">
                  <label
                    htmlFor="business-search"
                    className="
                      block
                      text-sm
                      font-semibold
                      text-[#17151A]
                    "
                  >
                    Business name
                  </label>

                  <div className="relative mt-2">
                    <Search
                      size={19}
                      className="
                        pointer-events-none
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-black/30
                      "
                    />

                    <input
                      id="business-search"
                      type="text"
                      value={
                        businessQuery
                      }
                      onChange={(
                        event
                      ) => {
                        setBusinessQuery(
                          event.target
                            .value
                        );

                        setError("");

                        if (
                          selectedBusiness
                        ) {
                          setSelectedBusiness(
                            null
                          );

                          setBusinessName(
                            ""
                          );

                          setWebsite("");
                          setResult(null);
                        }
                      }}
                      placeholder="Try 'Jardin De China'"
                      autoComplete="off"
                      className="
                        w-full
                        rounded-2xl
                        border
                        border-black/10
                        bg-[#F7F5EF]
                        py-4
                        pl-12
                        pr-12
                        text-[#17151A]
                        outline-none
                        transition
                        placeholder:text-[#17151A]/30
                        focus:border-[#7547B8]
                        focus:ring-4
                        focus:ring-[#7547B8]/10
                      "
                    />

                    {searching && (
                      <LoaderCircle
                        size={18}
                        className="
                          absolute
                          right-4
                          top-1/2
                          -translate-y-1/2
                          animate-spin
                          text-[#7547B8]
                        "
                      />
                    )}

                    {selectedBusiness && (
                      <button
                        type="button"
                        onClick={
                          clearBusiness
                        }
                        aria-label="Clear business"
                        className="
                          absolute
                          right-4
                          top-1/2
                          -translate-y-1/2
                          bg-transparent
                          p-0
                          text-black/35
                          shadow-none
                          transition
                          hover:text-[#17151A]
                        "
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>

                  {/* Suggestions */}
                  {suggestions.length >
                    0 && (
                    <div
                      className="
                        absolute
                        left-0
                        right-0
                        top-full
                        z-30
                        mt-2
                        overflow-hidden
                        rounded-2xl
                        border
                        border-black/10
                        bg-white
                        shadow-[0_20px_60px_rgba(23,21,26,0.14)]
                      "
                    >
                      {suggestions.map(
                        (
                          suggestion
                        ) => (
                          <button
                            key={
                              suggestion.placeId
                            }
                            type="button"
                            onClick={() =>
                              handleBusinessSelect(
                                suggestion
                              )
                            }
                            className="
                              flex
                              w-full
                              items-start
                              gap-3
                              border-b
                              border-black/[0.06]
                              bg-white
                              px-4
                              py-4
                              text-left
                              shadow-none
                              transition
                              last:border-b-0
                              hover:bg-[#F7F5EF]
                            "
                          >
                            <MapPin
                              size={18}
                              className="
                                mt-0.5
                                shrink-0
                                text-[#7547B8]
                              "
                            />

                            <span className="min-w-0">
                              <span
                                className="
                                  block
                                  font-semibold
                                  text-[#17151A]
                                "
                              >
                                {
                                  suggestion.name
                                }
                              </span>

                              <span
                                className="
                                  mt-1
                                  block
                                  text-sm
                                  leading-5
                                  text-[#17151A]/45
                                "
                              >
                                {
                                  suggestion.address
                                }
                              </span>
                            </span>
                          </button>
                        )
                      )}

                      <div
                        className="
                          bg-[#F7F5EF]
                          px-4
                          py-2.5
                          text-right
                          text-[11px]
                          font-semibold
                          text-black/35
                        "
                      >
                        Powered by Geoapify
                      </div>
                    </div>
                  )}
                </div>

                {/* Loading details */}
                {loadingBusiness && (
                  <div
                    className="
                      mt-5
                      flex
                      items-center
                      gap-3
                      rounded-2xl
                      bg-[#F7F5EF]
                      p-4
                      text-sm
                      text-[#17151A]/55
                    "
                  >
                    <LoaderCircle
                      size={18}
                      className="
                        animate-spin
                        text-[#7547B8]
                      "
                    />

                    Loading business details...
                  </div>
                )}

                {/* Selected business */}
                {selectedBusiness &&
                  !loadingBusiness && (
                    <div
                      className="
                        mt-6
                        rounded-2xl
                        border
                        border-[#7547B8]/15
                        bg-[#7547B8]/[0.04]
                        p-5
                      "
                    >
                      <div
                        className="
                          flex
                          items-start
                          justify-between
                          gap-4
                        "
                      >
                        <div>
                          <div
                            className="
                              flex
                              items-center
                              gap-2
                            "
                          >
                            <CheckCircle2
                              size={18}
                              className="
                                shrink-0
                                text-[#7547B8]
                              "
                            />

                            <p
                              className="
                                font-bold
                                text-[#17151A]
                              "
                            >
                              {
                                selectedBusiness.name
                              }
                            </p>
                          </div>

                          {selectedBusiness.address && (
                            <p
                              className="
                                mt-2
                                text-sm
                                leading-6
                                text-[#17151A]/50
                              "
                            >
                              {
                                selectedBusiness.address
                              }
                            </p>
                          )}

                          {selectedBusiness.categories
                            ?.length >
                            0 && (
                            <p
                              className="
                                mt-2
                                text-xs
                                font-medium
                                text-[#17151A]/35
                              "
                            >
                              {
                                selectedBusiness
                                  .categories[0]
                              }
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={
                            clearBusiness
                          }
                          className="
                            shrink-0
                            bg-transparent
                            p-0
                            text-sm
                            font-semibold
                            text-[#7547B8]
                            shadow-none
                          "
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  )}

                {/* Website */}
                {selectedBusiness &&
                  !loadingBusiness && (
                    <div className="mt-8">
                      <p
                        className="
                          text-sm
                          font-bold
                          uppercase
                          tracking-[0.16em]
                          text-[#7547B8]
                        "
                      >
                        Step 2
                      </p>

                      <label
                        htmlFor="website"
                        className="
                          mt-3
                          block
                          text-sm
                          font-semibold
                          text-[#17151A]
                        "
                      >
                        Website
                      </label>

                      {selectedBusiness.website ? (
                        <>
                          <div
                            className="
                              mt-2
                              flex
                              items-center
                              gap-3
                              rounded-2xl
                              border
                              border-black/10
                              bg-[#F7F5EF]
                              px-4
                              py-4
                            "
                          >
                            <Globe2
                              size={18}
                              className="
                                shrink-0
                                text-[#7547B8]
                              "
                            />

                            <span
                              className="
                                min-w-0
                                flex-1
                                truncate
                                text-[#17151A]/70
                              "
                            >
                              {website}
                            </span>

                            <Check
                              size={17}
                              className="
                                shrink-0
                                text-[#7547B8]
                              "
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              setSelectedBusiness(
                                {
                                  ...selectedBusiness,
                                  website:
                                    "",
                                }
                              )
                            }
                            className="
                              mt-2
                              bg-transparent
                              p-0
                              text-xs
                              font-semibold
                              text-[#17151A]/40
                              shadow-none
                              hover:text-[#7547B8]
                            "
                          >
                            Wrong website? Enter
                            it manually
                          </button>
                        </>
                      ) : (
                        <>
                          <p
                            className="
                              mt-2
                              text-sm
                              leading-6
                              text-[#17151A]/45
                            "
                          >
                            We found your business,
                            but couldn't find a
                            website. Enter it below
                            if you have one.
                          </p>

                          <div className="relative mt-3">
                            <Globe2
                              size={18}
                              className="
                                pointer-events-none
                                absolute
                                left-4
                                top-1/2
                                -translate-y-1/2
                                text-black/30
                              "
                            />

                            <input
                              id="website"
                              type="text"
                              value={
                                website
                              }
                              onChange={(
                                event
                              ) =>
                                setWebsite(
                                  event
                                    .target
                                    .value
                                )
                              }
                              placeholder="yourbusiness.com"
                              className="
                                w-full
                                rounded-2xl
                                border
                                border-black/10
                                bg-[#F7F5EF]
                                py-4
                                pl-12
                                pr-4
                                outline-none
                                transition
                                focus:border-[#7547B8]
                                focus:ring-4
                                focus:ring-[#7547B8]/10
                              "
                            />
                          </div>
                        </>
                      )}
                    </div>
                  )}

                {/* Error */}
                {error && (
                  <div
                    className="
                      mt-6
                      rounded-2xl
                      border
                      border-red-200
                      bg-red-50
                      px-4
                      py-3
                      text-sm
                      leading-6
                      text-red-700
                    "
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={
                    loading ||
                    loadingBusiness ||
                    !selectedBusiness ||
                    !website.trim()
                  }
                  className="
                    mt-8
                    inline-flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-full
                    bg-[#7547B8]
                    px-7
                    py-4
                    font-semibold
                    text-white
                    transition
                    hover:-translate-y-0.5
                    hover:bg-[#6439A5]
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                    disabled:hover:translate-y-0
                  "
                >
                  {loading ? (
                    <>
                      <LoaderCircle
                        size={18}
                        className="animate-spin"
                      />

                      Checking your website...
                    </>
                  ) : (
                    <>
                      Check My Business

                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /*
               * --------------------------
               * RESULTS
               * --------------------------
               */
              <div
                className="
                  overflow-hidden
                  rounded-[2rem]
                  border
                  border-black/[0.07]
                  bg-white
                  shadow-[0_30px_100px_rgba(23,21,26,0.06)]
                "
              >
                {/* Result header */}
                <div
                  className="
                    bg-[#7547B8]
                    p-7
                    text-white
                    sm:p-9
                    lg:p-10
                  "
                >
                  <p
                    className="
                      text-sm
                      font-bold
                      uppercase
                      tracking-[0.16em]
                      text-white/55
                    "
                  >
                    Your Website Check
                  </p>

                  <div
                    className="
                      mt-6
                      flex
                      flex-col
                      gap-6
                      sm:flex-row
                      sm:items-end
                      sm:justify-between
                    "
                  >
                    <div>
                      <div
                        className="
                          flex
                          items-end
                          gap-2
                        "
                      >
                        <span
                          className="
                            text-7xl
                            font-bold
                            leading-none
                            tracking-[-0.07em]
                          "
                        >
                          {result.score}
                        </span>

                        <span
                          className="
                            pb-1
                            text-xl
                            font-semibold
                            text-white/45
                          "
                        >
                          / 100
                        </span>
                      </div>

                      <p
                        className="
                          mt-4
                          text-lg
                          font-semibold
                          text-[#F4F0A3]
                        "
                      >
                        {result.grade}
                      </p>
                    </div>

                    <div className="max-w-sm sm:text-right">
                      <p className="font-semibold">
                        {businessName}
                      </p>

                      {selectedBusiness
                        ?.address && (
                        <p
                          className="
                            mt-1
                            text-sm
                            leading-5
                            text-white/50
                          "
                        >
                          {
                            selectedBusiness.address
                          }
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Result content */}
                <div
                  className="
                    p-6
                    sm:p-8
                    lg:p-10
                  "
                >
                  {passedChecks.length >
                    0 && (
                    <div>
                      <p
                        className="
                          text-xs
                          font-bold
                          uppercase
                          tracking-[0.17em]
                          text-[#17151A]/35
                        "
                      >
                        Looking good
                      </p>

                      <div className="mt-4 space-y-3">
                        {passedChecks.map(
                          (
                            check,
                            index
                          ) => (
                            <div
                              key={
                                check.id ||
                                check.name ||
                                index
                              }
                              className="
                                flex
                                items-start
                                gap-3
                                rounded-2xl
                                bg-[#AFCB83]/10
                                p-4
                              "
                            >
                              <CheckCircle2
                                size={19}
                                className="
                                  mt-0.5
                                  shrink-0
                                  text-[#58743A]
                                "
                              />

                              <div>
                                <p
                                  className="
                                    font-semibold
                                    text-[#17151A]
                                  "
                                >
                                  {
                                    check.label ||
                                    check.name ||
                                    check.title
                                  }
                                </p>

                                {check.description && (
                                  <p
                                    className="
                                      mt-1
                                      text-sm
                                      leading-6
                                      text-[#17151A]/45
                                    "
                                  >
                                    {
                                      check.description
                                    }
                                  </p>
                                )}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {failedChecks.length >
                    0 && (
                    <div
                      className={
                        passedChecks.length >
                        0
                          ? "mt-10"
                          : ""
                      }
                    >
                      <p
                        className="
                          text-xs
                          font-bold
                          uppercase
                          tracking-[0.17em]
                          text-[#17151A]/35
                        "
                      >
                        Needs attention
                      </p>

                      <div className="mt-4 space-y-3">
                        {failedChecks.map(
                          (
                            check,
                            index
                          ) => (
                            <div
                              key={
                                check.id ||
                                check.name ||
                                index
                              }
                              className="
                                rounded-2xl
                                border
                                border-black/[0.06]
                                bg-[#F7F5EF]
                                p-4
                              "
                            >
                              <div
                                className="
                                  flex
                                  items-start
                                  gap-3
                                "
                              >
                                <span
                                  className="
                                    mt-0.5
                                    flex
                                    h-5
                                    w-5
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-[#F4F0A3]
                                    text-xs
                                    font-bold
                                    text-[#17151A]
                                  "
                                >
                                  !
                                </span>

                                <div>
                                  <p
                                    className="
                                      font-semibold
                                      text-[#17151A]
                                    "
                                  >
                                    {
                                      check.label ||
                                      check.name ||
                                      check.title
                                    }
                                  </p>

                                  {check.description && (
                                    <p
                                      className="
                                        mt-1
                                        text-sm
                                        leading-6
                                        text-[#17151A]/45
                                      "
                                    >
                                      {
                                        check.description
                                      }
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {result.priorities
                    ?.length >
                    0 && (
                    <div
                      className="
                        mt-10
                        rounded-3xl
                        bg-[#17151A]
                        p-6
                        text-white
                      "
                    >
                      <p
                        className="
                          text-xs
                          font-bold
                          uppercase
                          tracking-[0.17em]
                          text-[#F4F0A3]
                        "
                      >
                        Start here
                      </p>

                      <h3
                        className="
                          mt-3
                          text-2xl
                          font-bold
                          tracking-[-0.035em]
                        "
                      >
                        Your biggest opportunities
                      </h3>

                      <div className="mt-5 space-y-4">
                        {result.priorities.map(
                          (
                            priority,
                            index
                          ) => (
                            <div
                              key={
                                priority.id ||
                                priority.name ||
                                index
                              }
                              className="
                                flex
                                gap-3
                              "
                            >
                              <span
                                className="
                                  flex
                                  h-7
                                  w-7
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-full
                                  bg-white/10
                                  text-xs
                                  font-bold
                                "
                              >
                                {index + 1}
                              </span>

                              <div>
                                <p className="font-semibold">
                                  {priority.label ||
                                    priority.name ||
                                    priority.title}
                                </p>

                                {priority.description && (
                                  <p
                                    className="
                                      mt-1
                                      text-sm
                                      leading-6
                                      text-white/45
                                    "
                                  >
                                    {
                                      priority.description
                                    }
                                  </p>
                                )}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  <div
                    className="
                      mt-10
                      flex
                      flex-col
                      gap-3
                      sm:flex-row
                    "
                  >
                    <Link
                      to="/contact"
                      className="
                        inline-flex
                        flex-1
                        items-center
                        justify-center
                        gap-2
                        rounded-full
                        bg-[#7547B8]
                        px-6
                        py-4
                        font-semibold
                        text-white
                        transition
                        hover:bg-[#6439A5]
                      "
                    >
                      Help Me Improve It

                      <ArrowUpRight
                        size={18}
                      />
                    </Link>

                    <button
                      type="button"
                      onClick={
                        clearBusiness
                      }
                      className="
                        inline-flex
                        flex-1
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-black/10
                        bg-white
                        px-6
                        py-4
                        font-semibold
                        text-[#17151A]
                        shadow-none
                        transition
                        hover:bg-[#F7F5EF]
                      "
                    >
                      Check Another Business
                    </button>
                  </div>

                  <p
                    className="
                      mt-6
                      text-xs
                      leading-5
                      text-[#17151A]/35
                    "
                  >
                    This automated check reviews
                    common website signals. It is
                    not a complete SEO,
                    accessibility, security, or
                    Google Business Profile audit.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Side explanation */}
          <aside
            className="
              h-fit
              rounded-[2rem]
              bg-[#17151A]
              p-7
              text-white
              sm:p-8
              lg:sticky
              lg:top-28
            "
          >
            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.17em]
                text-[#F4F0A3]
              "
            >
              What we check
            </p>

            <h2
              className="
                mt-4
                text-3xl
                font-bold
                leading-tight
                tracking-[-0.04em]
              "
            >
              Small details can make a big
              difference online.
            </h2>

            <div className="mt-8 space-y-6">
              {[
                {
                  title:
                    "Security",
                  description:
                    "Whether your website uses a secure HTTPS connection.",
                },

                {
                  title:
                    "Search basics",
                  description:
                    "Page titles, descriptions, headings, and other common website signals.",
                },

                {
                  title:
                    "Mobile setup",
                  description:
                    "Whether the page is configured for customers browsing on phones.",
                },

                {
                  title:
                    "Customer actions",
                  description:
                    "Whether visitors can easily find a clear next step, contact method, or call to action.",
                },

                {
                  title:
                    "Business information",
                  description:
                    "Structured data and metadata that can help platforms understand your website.",
                },
              ].map(
                (item) => (
                  <div
                    key={
                      item.title
                    }
                    className="
                      border-t
                      border-white/10
                      pt-5
                      first:border-t-0
                      first:pt-0
                    "
                  >
                    <p className="font-semibold">
                      {item.title}
                    </p>

                    <p
                      className="
                        mt-2
                        text-sm
                        leading-6
                        text-white/45
                      "
                    >
                      {
                        item.description
                      }
                    </p>
                  </div>
                )
              )}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default BusinessCheck;