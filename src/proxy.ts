import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // 1. Check if "lang" cookie exists
  const hasLangCookie = request.cookies.has("lang");

  if (!hasLangCookie) {
    // 2. Detect language from Accept-Language header
    const acceptLanguage = request.headers.get("accept-language");
    let detectedLang = "ru"; // default

    if (acceptLanguage) {
      // Find the first supported language (ru, uk, en)
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

    // Create response and set cookie
    const response = NextResponse.next();
    response.cookies.set("lang", detectedLang, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, static files, api, etc.)
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|.*\\..*$).*)",
  ],
};
