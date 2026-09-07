import dns from "node:dns/promises";
import net from "node:net";

const MAX_HTML_LENGTH = 1_500_000;
const MAX_REDIRECTS = 5;

function isPrivateIp(ip) {
  if (!ip) return true;

  if (net.isIPv4(ip)) {
    const parts = ip
      .split(".")
      .map(Number);

    const [a, b] = parts;

    return (
      a === 10 ||
      a === 127 ||
      a === 0 ||
      (a === 169 && b === 254) ||
      (a === 172 &&
        b >= 16 &&
        b <= 31) ||
      (a === 192 && b === 168)
    );
  }

  if (net.isIPv6(ip)) {
    const lower =
      ip.toLowerCase();

    return (
      lower === "::1" ||
      lower.startsWith("fc") ||
      lower.startsWith("fd") ||
      lower.startsWith("fe80:")
    );
  }

  return true;
}

async function validatePublicUrl(
  value
) {
  let input =
    value.trim();

  if (
    !input.startsWith(
      "http://"
    ) &&
    !input.startsWith(
      "https://"
    )
  ) {
    input =
      `https://${input}`;
  }

  const url =
    new URL(input);

  if (
    url.protocol !== "http:" &&
    url.protocol !== "https:"
  ) {
    throw new Error(
      "Only normal website URLs can be checked."
    );
  }

  const hostname =
    url.hostname
      .toLowerCase();

  if (
    hostname ===
      "localhost" ||
    hostname.endsWith(
      ".local"
    )
  ) {
    throw new Error(
      "That website cannot be checked."
    );
  }

  const addresses =
    await dns.lookup(
      hostname,
      {
        all: true,
      }
    );

  if (
    !addresses.length ||
    addresses.some(
      ({ address }) =>
        isPrivateIp(
          address
        )
    )
  ) {
    throw new Error(
      "That website cannot be checked."
    );
  }

  return url;
}

async function fetchPublicWebsite(
  startingUrl,
  signal
) {
  let currentUrl =
    startingUrl;

  for (
    let redirectCount = 0;
    redirectCount <=
    MAX_REDIRECTS;
    redirectCount += 1
  ) {
    const validatedUrl =
      await validatePublicUrl(
        currentUrl.toString()
      );

    const response =
      await fetch(
        validatedUrl.toString(),
        {
          redirect:
            "manual",

          signal,

          headers: {
            "User-Agent":
              "Mordecai-Business-Check/1.0",

            Accept:
              "text/html,application/xhtml+xml",
          },
        }
      );

    if (
      response.status >= 300 &&
      response.status < 400
    ) {
      const location =
        response.headers.get(
          "location"
        );

      if (!location) {
        throw new Error(
          "The website returned an invalid redirect."
        );
      }

      if (
        redirectCount ===
        MAX_REDIRECTS
      ) {
        throw new Error(
          "The website redirected too many times."
        );
      }

      currentUrl =
        new URL(
          location,
          validatedUrl
        );

      continue;
    }

    return response;
  }

  throw new Error(
    "The website redirected too many times."
  );
}

function contains(
  html,
  regex
) {
  return regex.test(html);
}

function getTitle(html) {
  const match =
    html.match(
      /<title[^>]*>([\s\S]*?)<\/title>/i
    );

  return (
    match?.[1]
      ?.replace(
        /\s+/g,
        " "
      )
      ?.trim() || ""
  );
}

function getMetaDescription(
  html
) {
  const match =
    html.match(
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i
    ) ||
    html.match(
      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["'][^>]*>/i
    );

  return (
    match?.[1]
      ?.replace(
        /\s+/g,
        " "
      )
      ?.trim() || ""
  );
}

function makeCheck({
  id,
  label,
  category,
  passed,
  points,
  success,
  failure,
}) {
  return {
    id,
    label,
    category,
    passed,
    points,

    earned:
      passed
        ? points
        : 0,

    message:
      passed
        ? success
        : failure,
  };
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
    let body;

    try {
      body =
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

    if (
      !body.website ||
      typeof body.website !==
        "string"
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
              "Please enter a website.",
          }),
      };
    }

    const url =
      await validatePublicUrl(
        body.website
      );

    const controller =
      new AbortController();

    const timeout =
      setTimeout(
        () =>
          controller.abort(),
        10000
      );

    let response;

    try {
      response =
        await fetchPublicWebsite(
          url,
          controller.signal
        );
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      throw new Error(
        `Website returned ${response.status}.`
      );
    }

    const contentType =
      response.headers.get(
        "content-type"
      ) || "";

    if (
      !contentType
        .toLowerCase()
        .includes(
          "text/html"
        )
    ) {
      throw new Error(
        "This doesn't appear to be a normal website page."
      );
    }

    const rawHtml =
      await response.text();

    const html =
      rawHtml.slice(
        0,
        MAX_HTML_LENGTH
      );

    const title =
      getTitle(html);

    const metaDescription =
      getMetaDescription(
        html
      );

    const hasViewport =
      contains(
        html,
        /<meta[^>]+name=["']viewport["']/i
      );

    const hasH1 =
      contains(
        html,
        /<h1[\s>]/i
      );

    const hasPhone =
      contains(
        html,
        /href=["']tel:/i
      );

    const hasEmail =
      contains(
        html,
        /href=["']mailto:/i
      );

    const hasContactLink =
      contains(
        html,
        /href=["'][^"']*(contact|book|reserve|order|appointment|quote)[^"']*["']/i
      );

    const hasStrongCTA =
      contains(
        html,
        />\s*(call|contact|book|reserve|order|get a quote|schedule|directions|visit us|shop now)\b/i
      );

    const hasLocalSchema =
      contains(
        html,
        /["']@type["']\s*:\s*["'](?:LocalBusiness|Restaurant|Store|ProfessionalService|FoodEstablishment|HealthAndBeautyBusiness|HomeAndConstructionBusiness)["']/i
      );

    const hasOpenGraph =
      contains(
        html,
        /<meta[^>]+property=["']og:(title|description|image)["']/i
      );

    const hasFavicon =
      contains(
        html,
        /<link[^>]+rel=["'][^"']*(icon|shortcut icon)[^"']*["']/i
      );

    const finalUrl =
      response.url ||
      url.toString();

    const usesHttps =
      finalUrl.startsWith(
        "https://"
      );

    const checks = [
      makeCheck({
        id: "https",
        label:
          "Secure website",
        category: "Trust",

        passed:
          usesHttps,

        points: 15,

        success:
          "Your site uses HTTPS.",

        failure:
          "Your site should use HTTPS to protect visitors and build trust.",
      }),

      makeCheck({
        id: "title",
        label:
          "Page title",
        category:
          "Findability",

        passed:
          title.length >=
          10,

        points: 12,

        success:
          "Your homepage has a descriptive page title.",

        failure:
          "Your homepage needs a clearer page title.",
      }),

      makeCheck({
        id:
          "description",

        label:
          "Search description",

        category:
          "Findability",

        passed:
          metaDescription.length >=
          50,

        points: 12,

        success:
          "A search description is present.",

        failure:
          "Add a useful meta description explaining what the business offers.",
      }),

      makeCheck({
        id: "viewport",
        label:
          "Mobile setup",
        category:
          "Experience",

        passed:
          hasViewport,

        points: 12,

        success:
          "Mobile viewport setup was detected.",

        failure:
          "We couldn't detect standard mobile viewport configuration.",
      }),

      makeCheck({
        id: "h1",

        label:
          "Clear main heading",

        category:
          "Findability",

        passed:
          hasH1,

        points: 10,

        success:
          "Your page has a main heading.",

        failure:
          "Add a clear main heading that immediately explains the business.",
      }),

      makeCheck({
        id: "contact",

        label:
          "Easy to contact",

        category:
          "Conversion",

        passed:
          hasPhone ||
          hasEmail ||
          hasContactLink,

        points: 12,

        success:
          "We found a clear way for customers to contact or take action.",

        failure:
          "Make your phone, contact, booking, or ordering action easier to find.",
      }),

      makeCheck({
        id: "cta",

        label:
          "Clear next step",

        category:
          "Conversion",

        passed:
          hasStrongCTA ||
          hasContactLink,

        points: 10,

        success:
          "Your website gives visitors a clear next step.",

        failure:
          "Use a stronger primary action such as Call, Book, Order, or Get a Quote.",
      }),

      makeCheck({
        id: "schema",

        label:
          "Local business data",

        category:
          "Findability",

        passed:
          hasLocalSchema,

        points: 7,

        success:
          "Local-business structured data was detected.",

        failure:
          "Consider adding LocalBusiness structured data to help search engines understand the business.",
      }),

      makeCheck({
        id: "social",

        label:
          "Share preview",

        category: "Trust",

        passed:
          hasOpenGraph,

        points: 5,

        success:
          "Social sharing metadata was detected.",

        failure:
          "Add Open Graph metadata so shared links look more polished.",
      }),

      makeCheck({
        id:
          "favicon",

        label:
          "Browser icon",

        category: "Trust",

        passed:
          hasFavicon,

        points: 5,

        success:
          "A favicon was detected.",

        failure:
          "Adding a favicon makes the site feel more complete and recognizable.",
      }),
    ];

    const score =
      checks.reduce(
        (
          total,
          check
        ) =>
          total +
          check.earned,
        0
      );

    let grade =
      "Needs work";

    if (
      score >= 85
    ) {
      grade =
        "Strong";
    } else if (
      score >= 70
    ) {
      grade =
        "Good";
    } else if (
      score >= 50
    ) {
      grade =
        "Room to improve";
    }

    const priorities =
      checks
        .filter(
          (check) =>
            !check.passed
        )
        .sort(
          (a, b) =>
            b.points -
            a.points
        )
        .slice(
          0,
          3
        );

    return {
      statusCode: 200,

      headers: {
        "Content-Type":
          "application/json",
      },

      body:
        JSON.stringify({
          website:
            finalUrl,

          title,

          score,

          grade,

          checks,

          priorities,
        }),
    };
  } catch (error) {
    console.error(
      "Business check error:",
      error
    );

    return {
      statusCode: 400,

      headers: {
        "Content-Type":
          "application/json",
      },

      body:
        JSON.stringify({
          error:
            error.name ===
            "AbortError"
              ? "The website took too long to respond."
              : error.message ||
                "We couldn't check that website.",
        }),
    };
  }
}