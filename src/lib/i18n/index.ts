import { building } from "$app/environment";
import { base } from "$app/paths";
import { page } from "$app/state";

declare const __ABS_BASE_PATH__: string;
/** Absolute deployment base. Unlike `base`, this is never relativized by SSR. */
const ABS_BASE: string = typeof __ABS_BASE_PATH__ === "undefined" ? "" : __ABS_BASE_PATH__;
import {
  en,
  friendlyStudyNames,
  pt,
  translations,
  type TranslationKey,
} from "./translations";

export type Locale = "pt" | "en";
export const DEFAULT_LOCALE: Locale = "pt";
export const LOCALES: Locale[] = ["pt", "en"];
export const LANGUAGE_LABELS: Record<Locale, string> = {
  pt: "Português",
  en: "English",
};

export const SITE_URL = "https://calculadora-financiamento.click";

export type { TranslationKey };
export { friendlyStudyNames };

/** Strips the deployment base path (e.g. /calculadora-financeira) from a pathname. */
function stripBase(pathname: string): string {
  if (ABS_BASE && (pathname === ABS_BASE || pathname.startsWith(`${ABS_BASE}/`))) {
    return pathname.slice(ABS_BASE.length) || "/";
  }
  return pathname;
}

/** Returns the locale encoded in a pathname. Portuguese is served at `/`. */
export function localeFromPathname(pathname: string): Locale {
  const path = stripBase(pathname);
  return path === "/en" || path.startsWith("/en/") ? "en" : "pt";
}

/** Current locale, derived from the active route. Safe to call during render. */
export function getLocale(): Locale {
  return localeFromPathname(page.url.pathname);
}

export function isLocale(value: string): value is Locale {
  return value === "pt" || value === "en";
}

/** Translates a key, interpolating `{name}` placeholders. */
export function t(
  key: TranslationKey,
  params?: Record<string, string | number>,
): string {
  const dictionary = translations[getLocale()];
  const template = dictionary[key] ?? pt[key] ?? en[key] ?? key;
  return template.replace(/\{(\w+)\}/g, (match, name: string) => {
    const value = params?.[name];
    return value === undefined ? match : String(value);
  });
}

/** Internal link for the active locale. `path` must be locale-neutral (e.g. `/guias`). */
export function href(path: string): string {
  const clean = path === "" || path === "/" ? "/" : path.startsWith("/") ? path : `/${path}`;
  const prefix = getLocale() === "en" ? "/en" : "";
  return `${base}${prefix}${clean}`;
}

/** Link to the same page in another locale, preserving query string and hash. */
export function switchLocaleHref(locale: Locale): string {
  const current = stripBase(page.url.pathname);
  const localeNeutral =
    current === "/en" ? "/" : current.startsWith("/en/") ? current.slice(3) : current;
  const path = localeNeutral === "" ? "/" : localeNeutral;
  const prefix = locale === "en" ? "/en" : "";
  // `url.search` / `url.hash` are unavailable while prerendering. Query strings
  // and fragments are client-only anyway, so they're dropped during the build.
  const suffix = building ? "" : `${page.url.search}${page.url.hash}`;
  return `${base}${prefix}${path}${suffix}`;
}

/** Absolute URL for SEO tags in the active locale. */
export function seoUrl(path = "/"): string {
  const clean = path === "" ? "/" : path.startsWith("/") ? path : `/${path}`;
  const prefix = getLocale() === "en" ? "/en" : "";
  return `${SITE_URL}${prefix}${clean}`;
}

/** Absolute URL of the current page in a given locale, for hreflang tags. */
export function alternateSeoUrl(locale: Locale): string {
  const current = stripBase(page.url.pathname);
  const localeNeutral =
    current === "/en" ? "/" : current.startsWith("/en/") ? current.slice(3) : current;
  const path = localeNeutral === "" ? "/" : localeNeutral;
  return `${SITE_URL}${locale === "en" ? "/en" : ""}${path}`;
}

/** "2 anos e 3 meses" / "2 years and 3 months" for a month count. */
export function formatTerm(months: number): string {
  if (months <= 0) return "";
  const years = Math.floor(months / 12);
  const remaining = months % 12;
  const parts: string[] = [];
  if (years > 0) {
    parts.push(`${years} ${years === 1 ? t("common.yearOne") : t("common.years")}`);
  }
  if (remaining > 0) {
    parts.push(
      `${remaining} ${remaining === 1 ? t("common.monthOne") : t("common.months")}`,
    );
  }
  if (parts.length === 2) return `${parts[0]} ${t("common.and")} ${parts[1]}`;
  return parts[0] ?? "";
}

/** "a.a." / "a.m." in Portuguese, "p.a." / "p.m." in English. */
export function ratePeriod(mode: "annual" | "monthly"): string {
  return mode === "annual" ? t("common.perAnnum") : t("common.perMonth");
}

/** Short axis labels for months/years in charts. */
export function axisLabels(): { month: string; year: string } {
  return getLocale() === "en" ? { month: "m", year: "y" } : { month: "M", year: "A" };
}
