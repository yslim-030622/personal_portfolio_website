import type {LocalizedPortfolioContent, Locale} from "@/content";

export const locales = ["en", "ko"] as const;

export function getSiteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL;
  return value && value.trim().length > 0
    ? value.replace(/\/$/, "")
    : "http://localhost:3000";
}

export function getLocalePath(locale: Locale) {
  return locale === "en" ? "/" : "/ko";
}

export function getAbsoluteUrl(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalized}`;
}

export function personJsonLd(
  content: LocalizedPortfolioContent,
  locale: Locale
) {
  const path = getLocalePath(locale);
  const sameAs = [
    content.seo.person.githubUrl,
    content.seo.person.linkedInUrl
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: content.seo.person.name,
    url: getAbsoluteUrl(path),
    email: `mailto:${content.seo.person.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: content.seo.person.location
    },
    sameAs
  };
}
