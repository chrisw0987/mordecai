const GEOAPIFY_AUTOCOMPLETE =
  "https://api.geoapify.com/v1/geocode/autocomplete";

const GEOAPIFY_DETAILS =
  "https://api.geoapify.com/v2/place-details";

const STOP_WORDS = new Set([
  "the",
  "and",
  "of",
  "at",
  "in",
  "on",
  "a",
  "an",
  "llc",
  "inc",
  "corp",
  "company",
  "co",
]);

function normalizeText(value = "") {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(value = "") {
  return normalizeText(value)
    .split(" ")
    .filter(
      (token) =>
        token &&
        !STOP_WORDS.has(token)
    );
}

function getNameSimilarity(
  query,
  name
) {
  const normalizedQuery =
    normalizeText(query);

  const normalizedName =
    normalizeText(name);

  if (
    !normalizedQuery ||
    !normalizedName
  ) {
    return 0;
  }

  if (
    normalizedName ===
    normalizedQuery
  ) {
    return 1;
  }

  if (
    normalizedName.startsWith(
      normalizedQuery
    )
  ) {
    return 0.96;
  }

  if (
    normalizedName.includes(
      normalizedQuery
    )
  ) {
    return 0.92;
  }

  const queryTokens =
    tokenize(query);

  const nameTokens =
    tokenize(name);

  if (
    queryTokens.length === 0 ||
    nameTokens.length === 0
  ) {
    return 0;
  }

  let weightedMatches = 0;
  let totalWeight = 0;

  for (
    const queryToken
    of queryTokens
  ) {
    const weight =
      Math.max(
        queryToken.length,
        1
      );

    totalWeight += weight;

    const exactMatch =
      nameTokens.includes(
        queryToken
      );

    const partialMatch =
      nameTokens.some(
        (nameToken) =>
          nameToken.startsWith(
            queryToken
          ) ||
          queryToken.startsWith(
            nameToken
          )
      );

    if (exactMatch) {
      weightedMatches +=
        weight;
    } else if (
      partialMatch
    ) {
      weightedMatches +=
        weight * 0.7;
    }
  }

  const coverage =
    totalWeight > 0
      ? weightedMatches /
        totalWeight
      : 0;

  const nameCoverage =
    nameTokens.length > 0
      ? queryTokens.filter(
          (token) =>
            nameTokens.includes(
              token
            )
        ).length /
        Math.max(
          nameTokens.length,
          queryTokens.length
        )
      : 0;

  return Math.min(
    1,
    coverage * 0.8 +
      nameCoverage * 0.2
  );
}

function isLikelyBusiness(place) {
  const hasBusinessName =
    Boolean(
      place.name &&
      place.name.trim()
    );

  if (!hasBusinessName) {
    return false;
  }

  const resultType =
    (
      place.result_type ||
      ""
    ).toLowerCase();

  const categoryText =
    Array.isArray(
      place.categories
    )
      ? place.categories
          .join(" ")
          .toLowerCase()
      : "";

  const obviouslyGeographic =
    [
      "city",
      "county",
      "state",
      "country",
      "postcode",
      "street",
      "building",
      "suburb",
      "district",
      "neighbourhood",
      "neighborhood",
    ].includes(
      resultType
    );

  if (
    obviouslyGeographic &&
    !categoryText
  ) {
    return false;
  }

  return true;
}

function normalizeSuggestion(
  place,
  query
) {
  const name =
    place.name || "";

  const nameSimilarity =
    getNameSimilarity(
      query,
      name
    );

  const geoConfidence =
    place.rank?.confidence ??
    0;

  const combinedScore =
    nameSimilarity * 0.82 +
    geoConfidence * 0.18;

  return {
    placeId:
      place.place_id || "",

    name,

    address:
      place.formatted || "",

    city:
      place.city || "",

    state:
      place.state || "",

    postcode:
      place.postcode || "",

    country:
      place.country || "",

    countryCode:
      place.country_code || "",

    latitude:
      place.lat ?? null,

    longitude:
      place.lon ?? null,

    resultType:
      place.result_type || "",

    categories:
      place.categories || [],

    confidence:
      geoConfidence,

    nameSimilarity,

    matchScore:
      combinedScore,
  };
}

async function getPlaceDetails(
  placeId,
  apiKey
) {
  const params =
    new URLSearchParams({
      id: placeId,
      features: "details",
      apiKey,
    });

  const response =
    await fetch(
      `${GEOAPIFY_DETAILS}?${params.toString()}`
    );

  const rawBody =
    await response.text();

  if (!response.ok) {
    console.error(
      "Geoapify details error:",
      response.status,
      rawBody
    );

    throw new Error(
      "Could not load business details."
    );
  }

  let data;

  try {
    data =
      JSON.parse(rawBody);
  } catch {
    throw new Error(
      "Geoapify returned invalid business details."
    );
  }

  const properties =
    data.features?.[0]
      ?.properties || {};

  return {
    placeId,

    name:
      properties.name ||
      properties.address_line1 ||
      "",

    address:
      properties.formatted ||
      "",

    city:
      properties.city || "",

    state:
      properties.state || "",

    postcode:
      properties.postcode || "",

    country:
      properties.country || "",

    countryCode:
      properties.country_code ||
      "",

    website:
      properties.website ||
      properties
        .brand_details
        ?.website ||
      properties
        .operator_details
        ?.website ||
      "",

    phone:
      properties.contact
        ?.phone || "",

    email:
      properties.contact
        ?.email || "",

    categories:
      properties.categories ||
      [],

    latitude:
      properties.lat ?? null,

    longitude:
      properties.lon ?? null,
  };
}

function shouldAutoSelect(
  suggestions
) {
  if (
    suggestions.length === 0
  ) {
    return false;
  }

  const first =
    suggestions[0];

  const second =
    suggestions[1];

  if (
    first.nameSimilarity >=
      0.96 &&
    first.matchScore >=
      0.78 &&
    (
      !second ||
      first.matchScore -
        second.matchScore >=
        0.16
    )
  ) {
    return true;
  }

  if (
    suggestions.length === 1 &&
    first.nameSimilarity >=
      0.82
  ) {
    return true;
  }

  return false;
}

export async function handler(
  event
) {
  if (
    event.httpMethod !==
    "POST"
  ) {
    return {
      statusCode: 405,

      headers: {
        "Content-Type":
          "application/json",
      },

      body:
        JSON.stringify({
          error:
            "Method not allowed.",
        }),
    };
  }

  try {
    let parsedBody;

    try {
      parsedBody =
        JSON.parse(
          event.body || "{}"
        );
    } catch {
      return {
        statusCode: 400,

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify({
            error:
              "Invalid request.",
          }),
      };
    }

    const query =
      parsedBody.query;

    if (
      !query ||
      typeof query !==
        "string" ||
      query.trim().length <
        2
    ) {
      return {
        statusCode: 400,

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify({
            error:
              "Please enter your business name.",
          }),
      };
    }

    const apiKey =
      process.env
        .GEOAPIFY_API_KEY;

    if (!apiKey) {
      throw new Error(
        "GEOAPIFY_API_KEY is missing from Netlify."
      );
    }

    const params =
      new URLSearchParams({
        text:
          query.trim(),

        format:
          "json",

        limit:
          "10",

        lang:
          "en",

        /*
         * Important:
         * search businesses /
         * amenities instead of
         * cities and streets.
         */
        type:
          "amenity",

        /*
         * Mordecai currently
         * supports US businesses
         * only.
         */
        filter:
          "countrycode:us",

        apiKey,
      });

    const response =
      await fetch(
        `${GEOAPIFY_AUTOCOMPLETE}?${params.toString()}`
      );

    const rawBody =
      await response.text();

    if (!response.ok) {
      console.error(
        "Geoapify search error:",
        response.status,
        rawBody
      );

      return {
        statusCode: 502,

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify({
            error:
              "We couldn't search for that business right now.",
          }),
      };
    }

    let data;

    try {
      data =
        JSON.parse(rawBody);
    } catch {
      return {
        statusCode: 502,

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify({
            error:
              "Business search returned an unexpected response.",
          }),
      };
    }

    const suggestions =
      (data.results || [])
        /*
         * Remove obvious
         * geography results.
         */
        .filter(
          isLikelyBusiness
        )

        /*
         * Calculate how closely
         * each returned name
         * matches what the user
         * actually typed.
         */
        .map(
          (place) =>
            normalizeSuggestion(
              place,
              query
            )
        )

        /*
         * Keep only useful
         * US business matches.
         */
        .filter(
          (place) =>
            place.placeId &&
            place.name &&
            place.countryCode ===
              "us" &&
            place.nameSimilarity >=
              0.35
        )

        /*
         * Business-name relevance
         * matters much more than
         * Geoapify's generic
         * geographic confidence.
         */
        .sort(
          (a, b) =>
            b.matchScore -
            a.matchScore
        )

        .slice(
          0,
          5
        );

    /*
     * Nothing useful found.
     */
    if (
      suggestions.length ===
      0
    ) {
      return {
        statusCode: 200,

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify({
            status:
              "not_found",

            suggestions: [],

            hint:
              "Try adding the city or state, like “Green Tea Stony Brook NY.”",
          }),
      };
    }

    /*
     * Don't silently guess when
     * several businesses could
     * reasonably match.
     */
    if (
      !shouldAutoSelect(
        suggestions
      )
    ) {
      return {
        statusCode: 200,

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify({
            status:
              "multiple",

            suggestions:
              suggestions.slice(
                0,
                4
              ),

            hint:
              "Choose the right location, or add a city or state to narrow the search.",
          }),
      };
    }

    /*
     * Strong match:
     * fetch the full business
     * record so we can attempt
     * to find its website.
     */
    const business =
      await getPlaceDetails(
        suggestions[0]
          .placeId,
        apiKey
      );

    /*
     * Geoapify knows the business
     * but doesn't have a website
     * stored for it.
     */
    if (
      !business.website
    ) {
      return {
        statusCode: 200,

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify({
            status:
              "website_missing",

            business,
          }),
      };
    }

    /*
     * Best case:
     * business + website found.
     */
    return {
      statusCode: 200,

      headers: {
        "Content-Type":
          "application/json",
      },

      body:
        JSON.stringify({
          status:
            "found",

          business,
        }),
    };
  } catch (error) {
    console.error(
      "Find business error:",
      error
    );

    return {
      statusCode: 500,

      headers: {
        "Content-Type":
          "application/json",
      },

      body:
        JSON.stringify({
          error:
            error.message ||
            "We couldn't find that business.",
        }),
    };
  }
}