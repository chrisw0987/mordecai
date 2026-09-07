exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
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
        body: JSON.stringify({
          suggestions: [],
        }),
      };
    }

    const apiKey =
      process.env.GEOAPIFY_API_KEY;

    if (!apiKey) {
      throw new Error(
        "Geoapify API key is not configured."
      );
    }

    const params =
      new URLSearchParams({
        text: input.trim(),
        format: "json",
        limit: "6",
        lang: "en",
        apiKey,
      });

    // Since Mordecai is currently focused on U.S.
    // local businesses, this improves relevance.
    params.set(
      "filter",
      "countrycode:us"
    );

    const url =
      `https://api.geoapify.com/v1/geocode/autocomplete?${params.toString()}`;

    const response =
      await fetch(url);

    const data =
      await response.json();

    if (!response.ok) {
      console.error(
        "Geoapify autocomplete error:",
        data
      );

      throw new Error(
        "Could not search businesses."
      );
    }

    const suggestions =
      (data.results || [])
        .filter((place) => {
          // Prioritize things that actually
          // look like named places/businesses.
          return Boolean(
            place.name ||
            place.address_line1
          );
        })
        .map((place) => {
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

            latitude:
              place.lat ?? null,

            longitude:
              place.lon ?? null,
          };
        });

    return {
      statusCode: 200,
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        suggestions,
      }),
    };
  } catch (error) {
    console.error(
      "Autocomplete function error:",
      error
    );

    return {
      statusCode: 500,
      body: JSON.stringify({
        error:
          error.message ||
          "Could not search businesses.",
      }),
    };
  }
};