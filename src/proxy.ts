import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // 1. Check query parameters first (e.g. ?lang=en or ?lng=en)
  const url = new URL(request.url);
  let detectedLang = url.searchParams.get("lang") || url.searchParams.get("lng") || "";
  
  // Validate language parameter
  if (detectedLang && !["ru", "uk", "en"].includes(detectedLang)) {
    detectedLang = "";
  }

  // 2. If not in query params, check "lang" cookie
  if (!detectedLang) {
    detectedLang = request.cookies.get("lang")?.value || "";
  }

  // 3. If still not detected, parse Accept-Language header
  if (!detectedLang) {
    const acceptLanguage = request.headers.get("accept-language");
    detectedLang = "ru"; // default fallback

    if (acceptLanguage) {
      const langs = acceptLanguage
        .split(",")
        .map((lang) => lang.split(";")[0].trim().toLowerCase());

      for (const lang of langs) {
        if (lang.startsWith("ru")) {
          detectedLang = "ru";
          break;
        }
        if (lang.startsWith("uk") || lang.startsWith("ua")) {
          detectedLang = "uk";
          break;
        }
        if (lang.startsWith("en")) {
          detectedLang = "en";
          break;
        }
      }
    }
  }

  // 4. Inject detected language into request headers for Server Components to read
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-lang", detectedLang);

  // 5. Create response and set cookie if needed
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  const currentCookie = request.cookies.get("lang")?.value;
  if (currentCookie !== detectedLang) {
    response.cookies.set("lang", detectedLang, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
  }

  return response;
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, static files, api, etc.)
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|.*\\..*$).*)",
  ],
};
