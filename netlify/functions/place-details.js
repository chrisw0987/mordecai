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
    const { placeId } = JSON.parse(
      event.body || "{}"
    );

    if (!placeId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            "Missing place ID.",
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
        id: placeId,
        features: "details",
        apiKey,
      });

    const url =
      `https://api.geoapify.com/v2/place-details?${params.toString()}`;

    const response =
      await fetch(url);

    const data =
      await response.json();

    if (!response.ok) {
      console.error(
        "Geoapify place details error:",
        data
      );

      throw new Error(
        "Could not load business details."
      );
    }

    const feature =
      data.features?.[0];

    const properties =
      feature?.properties || {};

    const website =
      properties.website ||
      properties.brand_details
        ?.website ||
      properties.operator_details
        ?.website ||
      "";

    const phone =
      properties.contact?.phone ||
      "";

    const email =
      properties.contact?.email ||
      "";

    return {
      statusCode: 200,
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
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

        website,

        phone,

        email,

        latitude:
          properties.lat ??
          null,

        longitude:
          properties.lon ??
          null,

        categories:
          properties.categories ||
          [],
      }),
    };
  } catch (error) {
    console.error(
      "Place details function error:",
      error
    );

    return {
      statusCode: 500,
      body: JSON.stringify({
        error:
          error.message ||
          "Could not load business details.",
      }),
    };
  }
};