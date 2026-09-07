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
    return 0.97;
  }

  if (
    normalizedName.includes(
      normalizedQuery
    )
  ) {
    return 0.94;
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

  const exactTokenCoverage =
    queryTokens.filter(
      (token) =>
        nameTokens.includes(
          token
        )
    ).length /
    Math.max(
      queryTokens.length,
      1
    );

  return Math.min(
    1,
    coverage * 0.82 +
      exactTokenCoverage * 0.18
  );
}

function getLocationScore(
  place,
  city,
  state
) {
  if (
    !city &&
    !state
  ) {
    return 0;
  }

  let score = 0;
  let possible = 0;

  if (city) {
    possible += 1;

    const placeCity =
      normalizeText(
        place.city || ""
      );

    const requestedCity =
      normalizeText(city);

    if (
      placeCity ===
      requestedCity
    ) {
      score += 1;
    } else if (
      placeCity.includes(
        requestedCity
      ) ||
      requestedCity.includes(
        placeCity
      )
    ) {
      score += 0.7;
    }
  }

  if (state) {
    possible += 1;

    const requestedState =
      normalizeText(state);

    const placeState =
      normalizeText(
        place.state || ""
      );

    const placeStateCode =
      normalizeText(
        place.state_code || ""
      );

    if (
      placeState ===
        requestedState ||
      placeStateCode ===
        requestedState
    ) {
      score += 1;
    }
  }

  return possible > 0
    ? score / possible
    : 0;
}

function isLikelyBusiness(place) {
  const name =
    place.name?.trim();

  if (!name) {
    return false;
  }

  const resultType =
    (
      place.result_type ||
      ""
    ).toLowerCase();

  const categories =
    Array.isArray(
      place.categories
    )
      ? place.categories
      : [];

  const categoryText =
    categories
      .join(" ")
      .toLowerCase();

  const geographicTypes =
    new Set([
      "city",
      "county",
      "state",
      "country",
      "postcode",
      "street",
      "suburb",
      "district",
      "neighbourhood",
      "neighborhood",
    ]);

  if (
    geographicTypes.has(
      resultType
    ) &&
    !categoryText
  ) {
    return false;
  }

  return true;
}

function normalizeSuggestion(
  place,
  query,
  city,
  state
) {
  const name =
    place.name || "";

  const nameSimilarity =
    getNameSimilarity(
      query,
      name
    );

  const locationScore =
    getLocationScore(
      place,
      city,
      state
    );

  const geoConfidence =
    place.rank?.confidence ??
    0;

  let matchScore;

  if (
    city ||
    state
  ) {
    /*
     * When the user gives us
     * a location, use it.
     *
     * Business name still matters
     * most.
     */
    matchScore =
      nameSimilarity * 0.72 +
      locationScore * 0.2 +
      geoConfidence * 0.08;
  } else {
    matchScore =
      nameSimilarity * 0.9 +
      geoConfidence * 0.1;
  }

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

    stateCode:
      place.state_code || "",

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

    locationScore,

    matchScore,
  };
}

async function searchGeoapify({
  searchText,
  apiKey,
  type,
}) {
  const params =
    new URLSearchParams({
      text:
        searchText,

      format:
        "json",

      limit:
        "20",

      lang:
        "en",

      /*
       * Keep Mordecai searches
       * inside the United States.
       */
      filter:
        "countrycode:us",

      apiKey,
    });

  /*
   * First pass uses amenity.
   * Broad fallback omits this.
   */
  if (type) {
    params.set(
      "type",
      type
    );
  }

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

    throw new Error(
      "We couldn't search for that business right now."
    );
  }

  try {
    const data =
      JSON.parse(rawBody);

    return (
      data.results || []
    );
  } catch {
    throw new Error(
      "Business search returned an unexpected response."
    );
  }
}

function dedupePlaces(
  places
) {
  const seen =
    new Set();

  const unique = [];

  for (
    const place
    of places
  ) {
    const key =
      place.place_id ||
      [
        place.name,
        place.formatted,
      ]
        .filter(Boolean)
        .join("|");

    if (
      !key ||
      seen.has(key)
    ) {
      continue;
    }

    seen.add(key);

    unique.push(place);
  }

  return unique;
}

async function getPlaceDetails(
  placeId,
  apiKey
) {
  const params =
    new URLSearchParams({
      id:
        placeId,

      features:
        "details",

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

    stateCode:
      properties.state_code || "",

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

  /*
   * Exact / near-exact name,
   * clearly better than the
   * next candidate.
   */
  if (
    first.nameSimilarity >=
      0.94 &&
    first.matchScore >=
      0.75 &&
    (
      !second ||
      first.matchScore -
        second.matchScore >=
        0.12
    )
  ) {
    return true;
  }

  /*
   * Only one realistic result.
   */
  if (
    suggestions.length === 1 &&
    first.nameSimilarity >=
      0.75
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
          event.body ||
            "{}"
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
      typeof parsedBody.query ===
      "string"
        ? parsedBody.query.trim()
        : "";

    const city =
      typeof parsedBody.city ===
      "string"
        ? parsedBody.city.trim()
        : "";

    const state =
      typeof parsedBody.state ===
      "string"
        ? parsedBody.state.trim()
        : "";

    if (
      query.length < 2
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

    /*
     * Example:
     *
     * Iron Poke,
     * Stony Brook,
     * NY
     */
    const searchText =
      [
        query,
        city,
        state,
      ]
        .filter(Boolean)
        .join(", ");

    /*
     * PASS 1
     *
     * Try Geoapify's business /
     * amenity search first.
     */
    const amenityResults =
      await searchGeoapify({
        searchText,
        apiKey,
        type:
          "amenity",
      });

    let allResults =
      [...amenityResults];

    /*
     * See whether the amenity
     * search actually gave us
     * useful business candidates.
     */
    const usefulAmenityResults =
      amenityResults
        .filter(
          isLikelyBusiness
        )
        .map(
          (place) =>
            normalizeSuggestion(
              place,
              query,
              city,
              state
            )
        )
        .filter(
          (place) =>
            place.placeId &&
            place.name &&
            place.countryCode ===
              "us"
        );

    /*
     * PASS 2
     *
     * Geoapify sometimes stores
     * businesses in ways that don't
     * surface under type=amenity.
     *
     * If pass 1 is weak, run a
     * broader search and filter it
     * ourselves.
     */
    const strongAmenityResult =
      usefulAmenityResults.some(
        (place) =>
          place.nameSimilarity >=
            0.75 &&
          (
            !city &&
            !state
              ? true
              : place.locationScore >=
                0.5
          )
      );

    if (
      usefulAmenityResults.length <
        3 ||
      !strongAmenityResult
    ) {
      const broadResults =
        await searchGeoapify({
          searchText,
          apiKey,
        });

      allResults = [
        ...allResults,
        ...broadResults,
      ];
    }

    /*
     * Merge duplicate places
     * returned by both searches.
     */
    const uniqueResults =
      dedupePlaces(
        allResults
      );

    /*
     * Now Mordecai performs its
     * own relevance ranking.
     *
     * We no longer hard-block
     * results just because their
     * name similarity is under
     * 0.35.
     */
    const suggestions =
      uniqueResults
        .filter(
          isLikelyBusiness
        )

        .map(
          (place) =>
            normalizeSuggestion(
              place,
              query,
              city,
              state
            )
        )

        .filter(
          (place) =>
            place.placeId &&
            place.name &&
            place.countryCode ===
              "us"
        )

        /*
         * Completely unrelated
         * results can still be
         * discarded, but this is
         * intentionally loose.
         */
        .filter(
          (place) =>
            place.nameSimilarity >
              0 ||
            place.locationScore >=
              0.75
        )

        .sort(
          (a, b) =>
            b.matchScore -
            a.matchScore
        )

        .slice(
          0,
          6
        );

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
              city || state
                ? "We couldn't find a matching business in that area. Double-check the name or try a nearby city."
                : "Add the city and state to narrow the search.",
          }),
      };
    }

    /*
     * Don't guess if several
     * plausible businesses exist.
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
                5
              ),

            hint:
              "Choose the right business from the matches below.",
          }),
      };
    }

    const business =
      await getPlaceDetails(
        suggestions[0]
          .placeId,
        apiKey
      );

    /*
     * Business found, but
     * Geoapify does not know
     * its website.
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
     * Business + website found.
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