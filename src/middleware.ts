import createMiddleware from "next-intl/middleware";
import {NextResponse, type NextRequest} from "next/server";
import {routing} from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;

  // Korean locale stays in routing/content, but is hidden from visitors
  // until the language switch is re-enabled. Flip SHOW_LOCALE_SWITCH in
  // navigation.tsx back to true and remove this redirect together.
  if (pathname === "/ko" || pathname.startsWith("/ko/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/ko/, "") || "/";
    return NextResponse.redirect(url);
  }

  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/en";
    url.searchParams.set("__defaultLocale", "1");
    return NextResponse.rewrite(url);
  }

  if (
    (pathname === "/en" || pathname.startsWith("/en/")) &&
    request.nextUrl.searchParams.get("__defaultLocale") === "1"
  ) {
    return NextResponse.next();
  }

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/en/, "") || "/";
    return NextResponse.redirect(url);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/",
    "/((?!api(?:/|$)|_next(?:/|$)|_vercel(?:/|$)|robots\\.txt$|sitemap\\.xml$|og(?:/.*)?$|ko/og(?:/.*)?$|favicon\\.ico$|favicon\\.svg$|manifest\\.webmanifest$|.*\\..*).*)"
  ]
};
