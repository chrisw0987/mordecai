import {
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleHelp,
  Globe2,
  LoaderCircle,
  MapPin,
  Search,
} from "lucide-react";

function BusinessCheck() {
  const [
    businessQuery,
    setBusinessQuery,
  ] = useState("");

  const [
    city,
    setCity,
  ] = useState("");

  const [
    state,
    setState,
  ] = useState("");

  const [
    showLocationFields,
    setShowLocationFields,
  ] = useState(false);

  const [
    suggestions,
    setSuggestions,
  ] = useState([]);

  const [
    selectedBusiness,
    setSelectedBusiness,
  ] = useState(null);

  const [
    website,
    setWebsite,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    loadingMessage,
    setLoadingMessage,
  ] = useState("");

  const [
    result,
    setResult,
  ] = useState(null);

  const [
    error,
    setError,
  ] = useState("");

  const recordSuccessfulCheck =
    async (
      business,
      checkResult
    ) => {
      try {
        const formBody =
          new URLSearchParams({
            "form-name":
              "business-check",

            businessName:
              business?.name ||
              businessQuery,

            address:
              business?.address ||
              "",

            placeId:
              business?.placeId ||
              "",

            website:
              checkResult.website ||
              website,

            score:
              String(
                checkResult.score ??
                  ""
              ),

            grade:
              checkResult.grade ||
              "",
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
        console.error(
          "Netlify form logging error:",
          formError
        );
      }
    };

  const runWebsiteCheck =
    async (
      business,
      businessWebsite
    ) => {
      setLoadingMessage(
        "Checking your online presence..."
      );

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
                  businessWebsite,
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

      await recordSuccessfulCheck(
        business,
        data
      );
    };

  const handleSuggestionSelect =
    async (suggestion) => {
      setError("");
      setSuggestions([]);
      setLoading(true);
      setLoadingMessage(
        "Finding your website..."
      );

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
            suggestion.name,

          address:
            data.address ||
            suggestion.address,
        };

        setSelectedBusiness(
          business
        );

        setBusinessQuery(
          business.name
        );

        setWebsite(
          business.website || ""
        );

        if (
          business.website
        ) {
          await runWebsiteCheck(
            business,
            business.website
          );
        }
      } catch (
        selectError
      ) {
        setError(
          selectError.message ||
            "Something went wrong."
        );
      } finally {
        setLoading(false);
        setLoadingMessage("");
      }
    };

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      if (
        businessQuery
          .trim()
          .length < 2
      ) {
        setError(
          "Please enter your business name."
        );

        return;
      }

      setError("");
      setResult(null);
      setSuggestions([]);
      setSelectedBusiness(null);
      setWebsite("");
      setLoading(true);

      setLoadingMessage(
        city.trim() ||
        state.trim()
          ? "Searching this area..."
          : "Finding your business..."
      );

      try {
        const response =
          await fetch(
            "/.netlify/functions/find-business",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  query:
                    businessQuery.trim(),

                  city:
                    city.trim(),

                  state:
                    state.trim(),
                }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "We couldn't search for that business."
          );
        }

        if (
          data.status ===
          "not_found"
        ) {
          setShowLocationFields(
            true
          );

          setError(
            data.hint ||
              "Can't find it yet? Add the city and state to narrow the search."
          );

          return;
        }

        if (
          data.status ===
          "multiple"
        ) {
          setSuggestions(
            data.suggestions || []
          );

          setError("");
          return;
        }

        const business =
          data.business;

        setSelectedBusiness(
          business
        );

        setBusinessQuery(
          business.name ||
            businessQuery
        );

        setWebsite(
          business.website || ""
        );

        if (
          data.status ===
          "website_missing"
        ) {
          return;
        }

        if (
          data.status ===
            "found" &&
          business.website
        ) {
          await runWebsiteCheck(
            business,
            business.website
          );
        }
      } catch (
        searchError
      ) {
        console.error(
          "Business lookup error:",
          searchError
        );

        setError(
          searchError.message ||
            "Something went wrong. Please try again."
        );
      } finally {
        setLoading(false);
        setLoadingMessage("");
      }
    };

  const handleManualWebsite =
    async (event) => {
      event.preventDefault();

      if (!website.trim()) {
        setError(
          "Please enter your business website."
        );

        return;
      }

      setError("");
      setLoading(true);

      try {
        await runWebsiteCheck(
          selectedBusiness,
          website.trim()
        );
      } catch (
        checkError
      ) {
        setError(
          checkError.message ||
            "We couldn't check that website."
        );
      } finally {
        setLoading(false);
        setLoadingMessage("");
      }
    };

  const resetCheck = () => {
    setBusinessQuery("");
    setCity("");
    setState("");
    setShowLocationFields(
      false
    );
    setSuggestions([]);
    setSelectedBusiness(null);
    setWebsite("");
    setResult(null);
    setError("");
    setLoadingMessage("");
  };

  const passedChecks =
    result?.checks?.filter(
      (check) =>
        check.status ===
        "passed"
    ) || [];

  const failedChecks =
    result?.checks?.filter(
      (check) =>
        check.status ===
        "failed"
    ) || [];

  const unverifiedChecks =
    result?.checks?.filter(
      (check) =>
        check.status ===
        "unverified"
    ) || [];

  return (
    <main className="min-h-screen bg-[#F7F5EF]">
      <section className="border-b border-black/[0.06] px-5 pb-14 pt-16 lg:px-8 lg:pb-20 lg:pt-24">
        <div className="mx-auto max-w-7xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#17151A]/45 transition hover:text-[#7547B8]"
          >
            <ArrowLeft size={16} />
            Back to Mordecai
          </Link>

          <div className="mt-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#7547B8]">
                Free Online Business Check
              </p>

              <h1 className="mt-5 max-w-3xl text-5xl font-bold leading-[0.95] tracking-[-0.055em] text-[#17151A] sm:text-6xl lg:text-7xl">
                See how your business looks{" "}
                <span className="text-[#7547B8]">
                  to customers online.
                </span>
              </h1>
            </div>

            <p className="max-w-xl text-lg leading-8 text-[#17151A]/55 lg:justify-self-end">
              Enter your business name. We'll try
              to find your website automatically,
              then review the signals we can
              confidently verify.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 py-14 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.7fr] lg:gap-12">
          <div>
            {!result ? (
              <div className="rounded-[2rem] border border-black/[0.07] bg-white p-6 shadow-[0_30px_100px_rgba(23,21,26,0.06)] sm:p-8 lg:p-10">
                <form
                  onSubmit={
                    handleSubmit
                  }
                >
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#7547B8]">
                    Find your business
                  </p>

                  <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-[#17151A]">
                    One field. We'll do the rest.
                  </h2>

                  <p className="mt-3 max-w-xl leading-7 text-[#17151A]/50">
                    Start with your business name.
                    Add a city and state only if
                    you need to narrow the search.
                  </p>

                  <label
                    htmlFor="business-search"
                    className="mt-8 block text-sm font-semibold text-[#17151A]"
                  >
                    Business name
                  </label>

                  <div className="relative mt-2">
                    <Search
                      size={19}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
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
                        setSuggestions([]);
                        setSelectedBusiness(
                          null
                        );
                        setWebsite("");
                        setError("");
                      }}
                      placeholder="Green Tea"
                      autoComplete="off"
                      className="w-full rounded-2xl border border-black/10 bg-[#F7F5EF] py-4 pl-12 pr-4 text-[#17151A] outline-none transition placeholder:text-[#17151A]/30 focus:border-[#7547B8] focus:ring-4 focus:ring-[#7547B8]/10"
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="text-xs font-medium text-[#17151A]/35">
                      United States businesses only
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setShowLocationFields(
                          (
                            current
                          ) =>
                            !current
                        );
                        setError("");
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7547B8] transition hover:text-[#6439A5]"
                    >
                      {showLocationFields
                        ? "Hide location"
                        : "Add city & state"}

                      {showLocationFields ? (
                        <ChevronUp
                          size={14}
                        />
                      ) : (
                        <ChevronDown
                          size={14}
                        />
                      )}
                    </button>
                  </div>

                  {showLocationFields && (
                    <div className="mt-5 rounded-2xl border border-black/[0.07] bg-[#F7F5EF]/70 p-4">
                      <div className="flex items-start gap-2">
                        <MapPin
                          size={17}
                          className="mt-0.5 shrink-0 text-[#7547B8]"
                        />

                        <div>
                          <p className="text-sm font-semibold text-[#17151A]">
                            Narrow the search
                          </p>

                          <p className="mt-1 text-xs leading-5 text-[#17151A]/45">
                            Example: Green Tea + Stony Brook + NY
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_0.45fr]">
                        <div>
                          <label
                            htmlFor="business-city"
                            className="block text-xs font-semibold text-[#17151A]/60"
                          >
                            City
                          </label>

                          <input
                            id="business-city"
                            type="text"
                            value={city}
                            onChange={(
                              event
                            ) => {
                              setCity(
                                event.target
                                  .value
                              );
                              setError("");
                              setSuggestions(
                                []
                              );
                            }}
                            placeholder="Stony Brook"
                            autoComplete="address-level2"
                            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#17151A]/25 focus:border-[#7547B8] focus:ring-4 focus:ring-[#7547B8]/10"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="business-state"
                            className="block text-xs font-semibold text-[#17151A]/60"
                          >
                            State
                          </label>

                          <input
                            id="business-state"
                            type="text"
                            value={state}
                            onChange={(
                              event
                            ) => {
                              setState(
                                event.target
                                  .value
                              );
                              setError("");
                              setSuggestions(
                                []
                              );
                            }}
                            placeholder="NY"
                            autoComplete="address-level1"
                            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm uppercase outline-none transition placeholder:text-[#17151A]/25 focus:border-[#7547B8] focus:ring-4 focus:ring-[#7547B8]/10"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={
                      loading ||
                      businessQuery
                        .trim()
                        .length < 2
                    }
                    className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#7547B8] px-7 py-4 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#6439A5] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                  >
                    {loading ? (
                      <>
                        <LoaderCircle
                          size={18}
                          className="animate-spin"
                        />
                        {loadingMessage ||
                          "Checking your business..."}
                      </>
                    ) : (
                      <>
                        Check My Business
                        <ArrowRight
                          size={18}
                        />
                      </>
                    )}
                  </button>
                </form>

                {suggestions.length > 0 && (
                  <div className="mt-8">
                    <p className="text-sm font-bold text-[#17151A]">
                      Which business is yours?
                    </p>

                    <p className="mt-1 text-sm text-[#17151A]/45">
                      We found a few possible
                      matches.
                    </p>

                    <div className="mt-4 overflow-hidden rounded-2xl border border-black/10">
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
                              handleSuggestionSelect(
                                suggestion
                              )
                            }
                            className="flex w-full items-start gap-3 border-b border-black/[0.06] bg-white px-4 py-4 text-left shadow-none transition last:border-b-0 hover:bg-[#F7F5EF]"
                          >
                            <MapPin
                              size={18}
                              className="mt-0.5 shrink-0 text-[#7547B8]"
                            />

                            <span>
                              <span className="block font-semibold text-[#17151A]">
                                {
                                  suggestion.name
                                }
                              </span>

                              <span className="mt-1 block text-sm leading-5 text-[#17151A]/45">
                                {
                                  suggestion.address
                                }
                              </span>
                            </span>
                          </button>
                        )
                      )}
                    </div>

                    <p className="mt-2 text-right text-[11px] font-semibold text-black/30">
                      Powered by Geoapify
                    </p>
                  </div>
                )}

                {selectedBusiness &&
                  !selectedBusiness.website &&
                  !loading && (
                    <form
                      onSubmit={
                        handleManualWebsite
                      }
                      className="mt-8 rounded-3xl border border-[#7547B8]/15 bg-[#7547B8]/[0.04] p-5"
                    >
                      <div className="flex items-start gap-3">
                        <CheckCircle2
                          size={19}
                          className="mt-0.5 shrink-0 text-[#7547B8]"
                        />

                        <div>
                          <p className="font-bold text-[#17151A]">
                            {
                              selectedBusiness.name
                            }
                          </p>

                          {selectedBusiness.address && (
                            <p className="mt-1 text-sm leading-5 text-[#17151A]/45">
                              {
                                selectedBusiness.address
                              }
                            </p>
                          )}
                        </div>
                      </div>

                      <p className="mt-5 text-sm leading-6 text-[#17151A]/55">
                        We found your business, but
                        couldn't confidently find
                        its website. Enter it below
                        and we'll finish the check.
                      </p>

                      <div className="relative mt-4">
                        <Globe2
                          size={18}
                          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                        />

                        <input
                          type="text"
                          value={website}
                          onChange={(
                            event
                          ) =>
                            setWebsite(
                              event.target
                                .value
                            )
                          }
                          placeholder="yourbusiness.com"
                          className="w-full rounded-2xl border border-black/10 bg-white py-4 pl-12 pr-4 outline-none transition focus:border-[#7547B8] focus:ring-4 focus:ring-[#7547B8]/10"
                        />
                      </div>

                      <button
                        type="submit"
                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#17151A] px-6 py-4 font-semibold text-white transition hover:bg-black"
                      >
                        Finish My Check
                        <ArrowRight
                          size={18}
                        />
                      </button>
                    </form>
                  )}

                {error && (
                  <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                    {error}
                  </div>
                )}
              </div>
            ) : (
              <div className="overflow-hidden rounded-[2rem] border border-black/[0.07] bg-white shadow-[0_30px_100px_rgba(23,21,26,0.06)]">
                <div className="bg-[#7547B8] p-7 text-white sm:p-9 lg:p-10">
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-white/55">
                    Your Online Presence Snapshot
                  </p>

                  <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <div className="flex items-end gap-2">
                        <span className="text-7xl font-bold leading-none tracking-[-0.07em]">
                          {result.score ?? "—"}
                        </span>

                        {result.score !== null && (
                          <span className="pb-1 text-xl font-semibold text-white/45">
                            / 100
                          </span>
                        )}
                      </div>

                      <p className="mt-4 text-lg font-semibold text-[#F4F0A3]">
                        {result.grade}
                      </p>

                      <p className="mt-2 max-w-md text-sm leading-6 text-white/55">
                        Your score only uses signals
                        we could confidently verify.
                        Anything we couldn't inspect
                        automatically is left out
                        rather than counted against
                        you.
                      </p>
                    </div>

                    <div className="max-w-sm sm:text-right">
                      <p className="font-semibold">
                        {
                          selectedBusiness?.name ||
                          businessQuery
                        }
                      </p>

                      {selectedBusiness
                        ?.address && (
                        <p className="mt-1 text-sm leading-5 text-white/50">
                          {
                            selectedBusiness.address
                          }
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8 lg:p-10">
                  {passedChecks.length > 0 && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#17151A]/35">
                        Looking good
                      </p>

                      <div className="mt-4 space-y-3">
                        {passedChecks.map(
                          (check) => (
                            <div
                              key={check.id}
                              className="flex items-start gap-3 rounded-2xl bg-[#AFCB83]/10 p-4"
                            >
                              <CheckCircle2
                                size={19}
                                className="mt-0.5 shrink-0 text-[#58743A]"
                              />

                              <div>
                                <p className="font-semibold text-[#17151A]">
                                  {
                                    check.label
                                  }
                                </p>

                                <p className="mt-1 text-sm leading-6 text-[#17151A]/45">
                                  {
                                    check.message
                                  }
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {failedChecks.length > 0 && (
                    <div
                      className={
                        passedChecks.length > 0
                          ? "mt-10"
                          : ""
                      }
                    >
                      <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#17151A]/35">
                        Opportunities to improve
                      </p>

                      <div className="mt-4 space-y-3">
                        {failedChecks.map(
                          (check) => (
                            <div
                              key={check.id}
                              className="flex items-start gap-3 rounded-2xl border border-black/[0.06] bg-[#F7F5EF] p-4"
                            >
                              <AlertCircle
                                size={19}
                                className="mt-0.5 shrink-0 text-[#7547B8]"
                              />

                              <div>
                                <p className="font-semibold text-[#17151A]">
                                  {
                                    check.label
                                  }
                                </p>

                                <p className="mt-1 text-sm leading-6 text-[#17151A]/45">
                                  {
                                    check.message
                                  }
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {unverifiedChecks.length > 0 && (
                    <div className="mt-10">
                      <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#17151A]/35">
                        Couldn't verify automatically
                      </p>

                      <p className="mt-2 text-sm leading-6 text-[#17151A]/45">
                        These items are not counted
                        against your score.
                      </p>

                      <div className="mt-4 space-y-3">
                        {unverifiedChecks.map(
                          (check) => (
                            <div
                              key={check.id}
                              className="flex items-start gap-3 rounded-2xl border border-black/[0.06] bg-white p-4"
                            >
                              <CircleHelp
                                size={19}
                                className="mt-0.5 shrink-0 text-[#17151A]/35"
                              />

                              <div>
                                <p className="font-semibold text-[#17151A]">
                                  {
                                    check.label
                                  }
                                </p>

                                <p className="mt-1 text-sm leading-6 text-[#17151A]/45">
                                  {
                                    check.message
                                  }
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {result.priorities?.length > 0 && (
                    <div className="mt-10 rounded-3xl bg-[#17151A] p-6 text-white">
                      <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#F4F0A3]">
                        Start here
                      </p>

                      <h3 className="mt-3 text-2xl font-bold tracking-[-0.035em]">
                        Ways to strengthen your
                        online presence
                      </h3>

                      <div className="mt-5 space-y-4">
                        {result.priorities.map(
                          (
                            priority,
                            index
                          ) => (
                            <div
                              key={priority.id}
                              className="flex gap-3"
                            >
                              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold">
                                {index + 1}
                              </span>

                              <div>
                                <p className="font-semibold">
                                  {
                                    priority.label
                                  }
                                </p>

                                <p className="mt-1 text-sm leading-6 text-white/45">
                                  {
                                    priority.message
                                  }
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                    <Link
                      to="/contact"
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#7547B8] px-6 py-4 font-semibold text-white transition hover:bg-[#6439A5]"
                    >
                      Help Me Improve It
                      <ArrowUpRight
                        size={18}
                      />
                    </Link>

                    <button
                      type="button"
                      onClick={resetCheck}
                      className="inline-flex flex-1 items-center justify-center rounded-full border border-black/10 bg-white px-6 py-4 font-semibold text-[#17151A] shadow-none transition hover:bg-[#F7F5EF]"
                    >
                      Check Another Business
                    </button>
                  </div>

                  <p className="mt-6 text-xs leading-5 text-[#17151A]/35">
                    This automated snapshot reviews
                    common website signals we can
                    verify without pretending to
                    measure everything about your
                    business. It is not a complete
                    SEO, accessibility, security,
                    performance, or Google Business
                    Profile review.
                  </p>
                </div>
              </div>
            )}
          </div>

          <aside className="h-fit rounded-[2rem] bg-[#17151A] p-7 text-white sm:p-8 lg:sticky lg:top-28">
            <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#F4F0A3]">
              What we look at
            </p>

            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-[-0.04em]">
              Get found. Look good. Build trust.
            </h2>

            <div className="mt-8 space-y-6">
              {[
                {
                  title:
                    "Trust & credibility",
                  description:
                    "Signals that help your business feel legitimate, polished, and safe to customers.",
                },
                {
                  title:
                    "Google visibility",
                  description:
                    "Signals that can help search platforms understand and present your business.",
                },
                {
                  title:
                    "Customer experience",
                  description:
                    "How clearly and comfortably customers can understand your business online.",
                },
                {
                  title:
                    "Customer action",
                  description:
                    "How easy it is for visitors to call, book, order, message, or take the next step.",
                },
              ].map(
                (item) => (
                  <div
                    key={item.title}
                    className="border-t border-white/10 pt-5 first:border-t-0 first:pt-0"
                  >
                    <p className="font-semibold">
                      {item.title}
                    </p>

                    <p className="mt-2 text-sm leading-6 text-white/45">
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
