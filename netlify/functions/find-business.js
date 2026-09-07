const GEOAPIFY_AUTOCOMPLETE =
  "https://api.geoapify.com/v1/geocode/autocomplete";

const GEOAPIFY_DETAILS =
  "https://api.geoapify.com/v2/place-details";

function normalizeSuggestion(
  place
) {
  return {
    placeId:
      place.place_id || "",

    name:
      place.name ||
      place.address_line1 ||
      place.formatted ||
      "",

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

    confidence:
      place.rank?.confidence ??
      null,
  };
}

async function getPlaceDetails(
  placeId,
  apiKey
) {
  const params =
    new URLSearchParams({
      id: placeId,

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

  const data =
    JSON.parse(rawBody);

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
      properties.city ||
      "",

    state:
      properties.state ||
      "",

    postcode:
      properties.postcode ||
      "",

    country:
      properties.country ||
      "",

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
      properties.lat ??
      null,

    longitude:
      properties.lon ??
      null,
  };
}

function looksLikeStrongMatch(
  results
) {
  if (
    results.length === 1
  ) {
    return true;
  }

  const first =
    results[0];

  const second =
    results[1];

  const firstConfidence =
    first.confidence ??
    0;

  const secondConfidence =
    second?.confidence ??
    0;

  return (
    firstConfidence >=
      0.85 &&
    firstConfidence -
      secondConfidence >=
      0.15
  );
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
    const {
      query,
    } =
      JSON.parse(
        event.body ||
          "{}"
      );

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
          "5",

        lang:
          "en",

        // Restrict business
        // searches to the US.
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

    const data =
      JSON.parse(
        rawBody
      );

    const suggestions =
      (data.results || [])
        .map(
          normalizeSuggestion
        )
        .filter(
          (place) =>
            place.placeId &&
            place.name
        )
        .slice(
          0,
          5
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
          }),
      };
    }

    if (
      !looksLikeStrongMatch(
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
                3
              ),
          }),
      };
    }

    const business =
      await getPlaceDetails(
        suggestions[0]
          .placeId,

        apiKey
      );

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