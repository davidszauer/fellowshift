import { NextResponse, type NextRequest } from "next/server";
import { defaultUiLanguage, isUiLanguage, uiLanguages } from "@/i18n/locales";

const LOCALE_COOKIE = "fs_locale";

function parseAcceptLanguage(headerValue: string | null): string[] {
  if (!headerValue) return [];
  return headerValue
    .split(",")
    .map((part) => part.trim())
    .map((part) => {
      const [tag, ...params] = part.split(";").map((p) => p.trim());
      const qParam = params.find((p) => p.startsWith("q="));
      const q = qParam ? Number(qParam.slice(2)) : 1;
      return { tag, q: Number.isFinite(q) ? q : 0 };
    })
    .sort((a, b) => b.q - a.q)
    .map((x) => x.tag);
}

function bestLocaleFromAcceptLanguage(headerValue: string | null) {
  for (const tag of parseAcceptLanguage(headerValue)) {
    const base = tag.split("-")[0]?.toLowerCase() ?? "";
    if (isUiLanguage(base)) return base;
  }
  return defaultUiLanguage;
}

function getLocaleFromPath(pathname: string) {
  const seg = pathname.split("/")[1] ?? "";
  return isUiLanguage(seg) ? seg : null;
}

function isPublicFile(pathname: string) {
  return /\.[a-z0-9]+$/i.test(pathname);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    isPublicFile(pathname)
  ) {
    return NextResponse.next();
  }

  const pathLocale = getLocaleFromPath(pathname);
  const cookieLocale = req.cookies.get(LOCALE_COOKIE)?.value ?? "";

  if (pathLocale) {
    const res = NextResponse.next();
    if (cookieLocale !== pathLocale) {
      res.cookies.set(LOCALE_COOKIE, pathLocale, { path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 * 365 });
    }
    return res;
  }

  const bestFromCookie = isUiLanguage(cookieLocale) ? cookieLocale : null;
  const bestFromHeader = bestLocaleFromAcceptLanguage(req.headers.get("accept-language"));
  const bestLocale = bestFromCookie ?? bestFromHeader ?? defaultUiLanguage;

  const url = req.nextUrl.clone();
  url.pathname = `/${bestLocale}${pathname === "/" ? "" : pathname}`;

  const res = NextResponse.redirect(url);
  res.cookies.set(LOCALE_COOKIE, bestLocale, { path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 * 365 });
  return res;
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
