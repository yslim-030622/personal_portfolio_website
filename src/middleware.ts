import createMiddleware from "next-intl/middleware";
import {NextResponse, type NextRequest} from "next/server";
import {routing} from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;

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
