import dns from "node:dns/promises";
import net from "node:net";

const MAX_HTML_LENGTH = 1_500_000;
const MAX_REDIRECTS = 5;

function isPrivateIp(ip) {
  if (!ip) return true;

  if (net.isIPv4(ip)) {
    const [a, b] = ip
      .split(".")
      .map(Number);

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
    !input.startsWith("http://") &&
    !input.startsWith("https://")
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
    url.hostname.toLowerCase();

  if (
    hostname === "localhost" ||
    hostname.endsWith(".local")
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
        isPrivateIp(address)
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
          redirect: "manual",

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
      ?.replace(/\s+/g, " ")
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
      ?.replace(/\s+/g, " ")
      ?.trim() || ""
  );
}

function makeCheck({
  id,
  internalLabel,
  label,
  category,
  passed,
  points,
  success,
  failure,
  technical = {},
}) {
  return {
    id,
    internalLabel,
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

    technical,
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

        internalLabel:
          "HTTPS",

        label:
          "Customer Trust & Safety",

        category:
          "Trust & Credibility",

        passed:
          usesHttps,

        points: 15,

        success:
          "Your website gives visitors a secure, trustworthy experience.",

        failure:
          "Your website may be missing a basic trust signal customers expect when browsing online.",

        technical: {
          usesHttps,
          finalUrl,
        },
      }),

      makeCheck({
        id: "title",

        internalLabel:
          "HTML page title",

        label:
          "Google Search Presence",

        category:
          "Google Visibility",

        passed:
          title.length >= 10,

        points: 12,

        success:
          "Your website gives search engines a clear idea of who you are.",

        failure:
          "Your website could do a better job telling search engines what your business is about.",

        technical: {
          title,

          titleLength:
            title.length,
        },
      }),

      makeCheck({
        id:
          "description",

        internalLabel:
          "Meta description",

        label:
          "Search Result Appeal",

        category:
          "Google Visibility",

        passed:
          metaDescription.length >=
          50,

        points: 12,

        success:
          "Your website has a strong description that can help customers understand your business in search results.",

        failure:
          "Your search listing could use a clearer description that encourages customers to click.",

        technical: {
          metaDescription,

          metaDescriptionLength:
            metaDescription.length,
        },
      }),

      makeCheck({
        id:
          "viewport",

        internalLabel:
          "Viewport meta tag",

        label:
          "Mobile Friendly",

        category:
          "Customer Experience",

        passed:
          hasViewport,

        points: 12,

        success:
          "Your website is set up for customers browsing from their phones.",

        failure:
          "Your mobile experience may need attention so customers can browse comfortably on their phones.",

        technical: {
          hasViewport,
        },
      }),

      makeCheck({
        id: "h1",

        internalLabel:
          "H1 heading",

        label:
          "Clear First Impression",

        category:
          "Customer Experience",

        passed:
          hasH1,

        points: 10,

        success:
          "Your homepage gives visitors a clear first impression.",

        failure:
          "Your homepage could communicate what your business does more clearly at first glance.",

        technical: {
          hasH1,
        },
      }),

      makeCheck({
        id:
          "contact",

        internalLabel:
          "Contact/action links",

        label:
          "Easy to Reach",

        category:
          "Customer Action",

        passed:
          hasPhone ||
          hasEmail ||
          hasContactLink,

        points: 12,

        success:
          "Customers have an easy way to reach you or take the next step.",

        failure:
          "Make it easier for customers to call, message, book, reserve, or contact your business.",

        technical: {
          hasPhone,
          hasEmail,
          hasContactLink,
        },
      }),

      makeCheck({
        id: "cta",

        internalLabel:
          "CTA detection",

        label:
          "Strong Call to Action",

        category:
          "Customer Action",

        passed:
          hasStrongCTA ||
          hasContactLink,

        points: 10,

        success:
          "Your website gives visitors a clear next step.",

        failure:
          "Your website could guide customers more clearly toward calling, booking, ordering, or requesting a quote.",

        technical: {
          hasStrongCTA,
          hasContactLink,
        },
      }),

      makeCheck({
        id:
          "schema",

        internalLabel:
          "LocalBusiness JSON-LD",

        label:
          "Google-Friendly Business Info",

        category:
          "Google Visibility",

        passed:
          hasLocalSchema,

        points: 7,

        success:
          "Your website is set up in a way that can help search platforms understand your business.",

        failure:
          "Your website could give search platforms clearer business information behind the scenes.",

        technical: {
          hasLocalSchema,
        },
      }),

      makeCheck({
        id:
          "social",

        internalLabel:
          "Open Graph metadata",

        label:
          "Social Media Ready",

        category:
          "Trust & Credibility",

        passed:
          hasOpenGraph,

        points: 5,

        success:
          "Your website is prepared to look polished when shared online.",

        failure:
          "Shared links from your website may not look as polished as they could on social platforms.",

        technical: {
          hasOpenGraph,
        },
      }),

      makeCheck({
        id:
          "favicon",

        internalLabel:
          "Favicon",

        label:
          "Professional Branding",

        category:
          "Trust & Credibility",

        passed:
          hasFavicon,

        points: 5,

        success:
          "Your website includes a small branding detail that helps it feel complete.",

        failure:
          "A small branding detail could make your website feel more polished and recognizable.",

        technical: {
          hasFavicon,
        },
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

    const technicalDiagnostics =
      Object.fromEntries(
        checks.map(
          (check) => [
            check.id,

            {
              internalLabel:
                check.internalLabel,

              passed:
                check.passed,

              points:
                check.points,

              earned:
                check.earned,

              ...check.technical,
            },
          ]
        )
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

          technicalDiagnostics,
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