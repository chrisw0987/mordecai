export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Method not allowed.",
      }),
    };
  }

  try {
    const { input } = JSON.parse(
      event.body || "{}"
    );

    if (
      !input ||
      input.trim().length < 3
    ) {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          suggestions: [],
        }),
      };
    }

    const apiKey =
      process.env.GEOAPIFY_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error:
            "GEOAPIFY_API_KEY is missing from Netlify.",
        }),
      };
    }

    const params =
      new URLSearchParams({
        text: input.trim(),
        format: "json",
        limit: "6",
        lang: "en",
        filter: "countrycode:us",
        apiKey,
      });

    const url =
      `https://api.geoapify.com/v1/geocode/autocomplete?${params.toString()}`;

    const response =
      await fetch(url);

    const rawBody =
      await response.text();

    console.log(
      "Geoapify status:",
      response.status
    );

    if (!response.ok) {
      console.error(
        "Geoapify response:",
        rawBody
      );

      return {
        statusCode: 502,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error:
            `Geoapify returned ${response.status}.`,
          details:
            rawBody.slice(0, 1000),
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
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error:
            "Geoapify returned invalid JSON.",
        }),
      };
    }

    const suggestions =
      (data.results || [])
        .filter(
          (place) =>
            place.name ||
            place.address_line1 ||
            place.formatted
        )
        .map((place) => ({
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

          latitude:
            place.lat ?? null,

          longitude:
            place.lon ?? null,
        }));

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        suggestions,
      }),
    };
  } catch (error) {
    console.error(
      "Autocomplete function crashed:",
      error
    );

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error:
          error.message ||
          "Autocomplete function failed.",
      }),
    };
  }
}