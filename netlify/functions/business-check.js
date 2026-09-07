import dns from "node:dns/promises";
import net from "node:net";

const MAX_HTML_LENGTH = 1_500_000;
const MAX_REDIRECTS = 5;

function isPrivateIp(ip) {
  if (!ip) return true;

  if (net.isIPv4(ip)) {
    const [a, b] = ip.split(".").map(Number);

    return (
      a === 10 ||
      a === 127 ||
      a === 0 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168)
    );
  }

  if (net.isIPv6(ip)) {
    const lower = ip.toLowerCase();

    return (
      lower === "::1" ||
      lower.startsWith("fc") ||
      lower.startsWith("fd") ||
      lower.startsWith("fe80:")
    );
  }

  return true;
}

async function validatePublicUrl(value) {
  let input = value.trim();

  if (
    !input.startsWith("http://") &&
    !input.startsWith("https://")
  ) {
    input = `https://${input}`;
  }

  const url = new URL(input);

  if (
    url.protocol !== "http:" &&
    url.protocol !== "https:"
  ) {
    throw new Error(
      "Only normal website URLs can be checked."
    );
  }

  const hostname = url.hostname.toLowerCase();

  if (
    hostname === "localhost" ||
    hostname.endsWith(".local")
  ) {
    throw new Error(
      "That website cannot be checked."
    );
  }

  const addresses = await dns.lookup(
    hostname,
    {
      all: true,
    }
  );

  if (
    !addresses.length ||
    addresses.some(({ address }) =>
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
  let currentUrl = startingUrl;

  for (
    let redirectCount = 0;
    redirectCount <= MAX_REDIRECTS;
    redirectCount += 1
  ) {
    const validatedUrl =
      await validatePublicUrl(
        currentUrl.toString()
      );

    const response = await fetch(
      validatedUrl.toString(),
      {
        redirect: "manual",
        signal,

        headers: {
          "User-Agent":
            "Mordecai-Business-Check/2.0",

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
        response.headers.get("location");

      if (!location) {
        throw new Error(
          "The website returned an invalid redirect."
        );
      }

      if (
        redirectCount === MAX_REDIRECTS
      ) {
        throw new Error(
          "The website redirected too many times."
        );
      }

      currentUrl = new URL(
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

function contains(html, regex) {
  return regex.test(html);
}

function getTitle(html) {
  const match = html.match(
    /<title[^>]*>([\s\S]*?)<\/title>/i
  );

  return (
    match?.[1]
      ?.replace(/\s+/g, " ")
      ?.trim() || ""
  );
}

function getMetaDescription(html) {
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

function getVisibleTextLength(html) {
  const withoutScripts = html
    .replace(
      /<script[\s\S]*?<\/script>/gi,
      " "
    )
    .replace(
      /<style[\s\S]*?<\/style>/gi,
      " "
    )
    .replace(
      /<noscript[\s\S]*?<\/noscript>/gi,
      " "
    );

  const text = withoutScripts
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();

  return text.length;
}

function detectClientRendering(html) {
  const hasAppMount = contains(
    html,
    /<(div|main)[^>]+id=["'](?:root|app|__next|__nuxt)["'][^>]*>/i
  );

  const hasModuleScript = contains(
    html,
    /<script[^>]+type=["']module["'][^>]*>/i
  );

  const hasBundledAsset = contains(
    html,
    /<script[^>]+src=["'][^"']*(?:assets|static|_next|build)[^"']*\.js[^"']*["']/i
  );

  const visibleTextLength =
    getVisibleTextLength(html);

  const likelyClientRendered =
    hasAppMount &&
    (hasModuleScript || hasBundledAsset) &&
    visibleTextLength < 1200;

  return {
    likelyClientRendered,
    hasAppMount,
    hasModuleScript,
    hasBundledAsset,
    visibleTextLength,
  };
}

function makeCheck({
  id,
  internalLabel,
  label,
  category,
  status,
  points,
  success,
  failure,
  unverified,
  technical = {},
}) {
  const passed =
    status === "passed";

  const failed =
    status === "failed";

  const isUnverified =
    status === "unverified";

  let message = failure;

  if (passed) {
    message = success;
  }

  if (isUnverified) {
    message = unverified;
  }

  return {
    id,
    internalLabel,
    label,
    category,
    status,
    passed,

    verified:
      !isUnverified,

    points,

    earned: passed
      ? points
      : failed
        ? 0
        : null,

    message,
    technical,
  };
}

function getStatus({
  detected,
  canVerify = true,
}) {
  if (detected) {
    return "passed";
  }

  if (!canVerify) {
    return "unverified";
  }

  return "failed";
}

export async function handler(event) {
  if (
    event.httpMethod !== "POST"
  ) {
    return {
      statusCode: 405,

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        error:
          "Method not allowed.",
      }),
    };
  }

  try {
    let body;

    try {
      body = JSON.parse(
        event.body || "{}"
      );
    } catch {
      return {
        statusCode: 400,

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          error:
            "Invalid request.",
        }),
      };
    }

    if (
      !body.website ||
      typeof body.website !== "string"
    ) {
      return {
        statusCode: 400,

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
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
        () => controller.abort(),
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
        .includes("text/html")
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
      getMetaDescription(html);

    const rendering =
      detectClientRendering(html);

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
        /href=["'][^"']*(contact|book|reserve|order|appointment|quote|menu|directions)[^"']*["']/i
      );

    const hasStrongCTA =
      contains(
        html,
        />\s*(call|contact|book|reserve|order|get a quote|schedule|directions|visit us|shop now|view menu|see menu|learn more)\b/i
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

    const canVerifyRenderedContent =
      !rendering.likelyClientRendered;

    const checks = [
      makeCheck({
        id: "https",

        internalLabel:
          "HTTPS",

        label:
          "Customer Trust & Safety",

        category:
          "Trust & Credibility",

        status: getStatus({
          detected:
            usesHttps,
        }),

        points: 15,

        success:
          "Your website gives visitors a secure, trustworthy experience.",

        failure:
          "Your website may be missing a basic trust signal customers expect when browsing online.",

        unverified:
          "We couldn't automatically verify this trust signal.",

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

        status: getStatus({
          detected:
            title.length >= 10,
        }),

        points: 12,

        success:
          "Your website gives search engines a clear idea of who you are.",

        failure:
          "Your website could do a better job telling search engines what your business is about.",

        unverified:
          "We couldn't automatically verify your search title.",

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

        status: getStatus({
          detected:
            metaDescription.length >=
            50,
        }),

        points: 12,

        success:
          "Your website has a strong description that can help customers understand your business in search results.",

        failure:
          "Your search listing could use a clearer description that encourages customers to click.",

        unverified:
          "We couldn't automatically verify your search description.",

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

        status: getStatus({
          detected:
            hasViewport,
        }),

        points: 12,

        success:
          "Your website is set up for customers browsing from their phones.",

        failure:
          "Your mobile experience may need attention so customers can browse comfortably on their phones.",

        unverified:
          "We couldn't automatically verify your mobile setup.",

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

        status: getStatus({
          detected:
            hasH1,

          canVerify:
            canVerifyRenderedContent,
        }),

        points: 10,

        success:
          "Your homepage gives visitors a clear first impression.",

        failure:
          "Your homepage could communicate what your business does more clearly at first glance.",

        unverified:
          "Your site appears to load some content after the page opens, so we couldn't reliably judge the main headline automatically.",

        technical: {
          hasH1,

          likelyClientRendered:
            rendering
              .likelyClientRendered,
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

        status: getStatus({
          detected:
            hasPhone ||
            hasEmail ||
            hasContactLink,

          canVerify:
            canVerifyRenderedContent,
        }),

        points: 12,

        success:
          "Customers have an easy way to reach you or take the next step.",

        failure:
          "Make it easier for customers to call, message, book, reserve, or contact your business.",

        unverified:
          "Your site appears to load some customer actions after the page opens, so we couldn't reliably verify them automatically.",

        technical: {
          hasPhone,
          hasEmail,
          hasContactLink,

          likelyClientRendered:
            rendering
              .likelyClientRendered,
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

        status: getStatus({
          detected:
            hasStrongCTA ||
            hasContactLink,

          canVerify:
            canVerifyRenderedContent,
        }),

        points: 10,

        success:
          "Your website gives visitors a clear next step.",

        failure:
          "Your website could guide customers more clearly toward calling, booking, ordering, or requesting a quote.",

        unverified:
          "Your site appears to load its buttons and actions after the page opens, so we couldn't reliably score this automatically.",

        technical: {
          hasStrongCTA,
          hasContactLink,

          likelyClientRendered:
            rendering
              .likelyClientRendered,
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

        status: getStatus({
          detected:
            hasLocalSchema,

          canVerify:
            canVerifyRenderedContent,
        }),

        points: 7,

        success:
          "Your website is set up in a way that can help search platforms understand your business.",

        failure:
          "Your website could give search platforms clearer business information behind the scenes.",

        unverified:
          "We couldn't reliably verify whether your business information is added after the page loads.",

        technical: {
          hasLocalSchema,

          likelyClientRendered:
            rendering
              .likelyClientRendered,
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

        status: getStatus({
          detected:
            hasOpenGraph,
        }),

        points: 5,

        success:
          "Your website is prepared to look polished when shared online.",

        failure:
          "Shared links from your website may not look as polished as they could on social platforms.",

        unverified:
          "We couldn't automatically verify your social sharing setup.",

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

        status: getStatus({
          detected:
            hasFavicon,
        }),

        points: 5,

        success:
          "Your website includes a small branding detail that helps it feel complete.",

        failure:
          "A small branding detail could make your website feel more polished and recognizable.",

        unverified:
          "We couldn't automatically verify this branding detail.",

        technical: {
          hasFavicon,
        },
      }),
    ];

    /*
     * IMPORTANT:
     *
     * Only VERIFIED checks affect
     * the public score.
     *
     * If a React/Vite/Next/etc.
     * website renders something
     * after JavaScript runs and
     * Mordecai cannot reliably see
     * it from the initial HTML,
     * that check becomes
     * "unverified" instead of
     * automatically failing.
     */

    const verifiedChecks =
      checks.filter(
        (check) =>
          check.verified
      );

    const verifiedPoints =
      verifiedChecks.reduce(
        (
          total,
          check
        ) =>
          total +
          check.points,
        0
      );

    const earnedPoints =
      verifiedChecks.reduce(
        (
          total,
          check
        ) =>
          total +
          (check.earned ||
            0),
        0
      );

    const unverifiedPoints =
      checks
        .filter(
          (check) =>
            !check.verified
        )
        .reduce(
          (
            total,
            check
          ) =>
            total +
            check.points,
          0
        );

    const score =
      verifiedPoints > 0
        ? Math.round(
            (
              earnedPoints /
              verifiedPoints
            ) *
              100
          )
        : null;

    let grade =
      "Needs work";

    if (
      score === null
    ) {
      grade =
        "Not enough data";
    } else if (
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

    /*
     * Only actual verified
     * failures become customer
     * improvement priorities.
     *
     * Unverified checks are NOT
     * treated as problems.
     */

    const priorities =
      checks
        .filter(
          (check) =>
            check.status ===
            "failed"
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

    /*
     * Keep the technical version
     * for Mordecai internally.
     *
     * Later we can include this
     * object in the Netlify/email
     * submission without showing
     * the jargon to customers.
     */

    const technicalDiagnostics =
      {
        rendering,

        verifiedPoints,

        unverifiedPoints,

        earnedPoints,

        totalPossiblePoints:
          100,

        checks:
          Object.fromEntries(
            checks.map(
              (check) => [
                check.id,

                {
                  internalLabel:
                    check
                      .internalLabel,

                  status:
                    check.status,

                  passed:
                    check.passed,

                  verified:
                    check.verified,

                  points:
                    check.points,

                  earned:
                    check.earned,

                  ...check.technical,
                },
              ]
            )
          ),
      };

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

          verifiedPoints,

          unverifiedPoints,

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