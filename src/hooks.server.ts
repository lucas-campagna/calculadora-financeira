import { base } from "$app/paths";
import type { Handle } from "@sveltejs/kit";
import { SITE_URL } from "$lib/i18n";
import { staticSeo } from "$lib/i18n/static-content";
import type { Locale } from "$lib/i18n";

function stripBase(pathname: string): string {
  // SvelteKit renders the static fallback with a synthetic `[fallback]` path.
  if (pathname.includes("[fallback]")) return "/";
  if (base && (pathname === base || pathname.startsWith(`${base}/`))) {
    return pathname.slice(base.length) || "/";
  }
  return pathname;
}

function localeFor(pathname: string): Locale {
  const path = stripBase(pathname);
  return path === "/en" || path.startsWith("/en/") ? "en" : "pt";
}

/** Absolute canonical URL for the request, matching the page-level <link rel="canonical">. */
function canonicalFor(pathname: string, locale: Locale): string {
  const current = stripBase(pathname);
  const localeNeutral =
    current === "/en" ? "/" : current.startsWith("/en/") ? current.slice(3) : current;
  const path = localeNeutral === "" ? "/" : localeNeutral;
  return `${SITE_URL}${locale === "en" ? "/en" : ""}${path}`;
}

export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);
  if (!response.headers.get("content-type")?.includes("text/html")) {
    return response;
  }

  const locale = localeFor(event.url.pathname);
  const seo = staticSeo[locale];
  const canonical = canonicalFor(event.url.pathname, locale);
  const replacements: Record<string, string> = {
    "%HTML_LANG%": seo.htmlLang,
    "%META_DESCRIPTION%": seo.description,
    "%META_KEYWORDS%": seo.keywords,
    "%OG_TITLE%": seo.ogTitle,
    "%OG_DESCRIPTION%": seo.ogDescription,
    "%OG_URL%": canonical,
    "%CANONICAL_URL%": canonical,
    "%PAGE_TITLE%": seo.title,
    "%STATIC_CONTENT%": seo.content,
  };

  let html = await response.text();
  for (const [token, value] of Object.entries(replacements)) {
    html = html.replaceAll(token, value);
  }

  const headers = new Headers(response.headers);
  headers.delete("content-length");
  return new Response(html, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};
