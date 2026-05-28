import "@/app/globals.css";

import {getPortfolioContent, type Locale} from "@/content";
import {fontVariablesForLocale} from "@/lib/fonts";
import {
  getAbsoluteUrl,
  getLocalePath,
  getSiteUrl,
  personJsonLd
} from "@/lib/site";
import {hasLocale, NextIntlClientProvider} from "next-intl";
import {getMessages, setRequestLocale} from "next-intl/server";
import type {Metadata} from "next";
import {notFound} from "next/navigation";
import type {ReactNode} from "react";
import {routing} from "@/i18n/routing";

type LayoutProps = {
  children: ReactNode;
  params: Promise<{locale: string}>;
};

function assertLocale(locale: string): Locale {
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return locale;
}

function ThemeScript() {
  const code = `document.documentElement.dataset.theme="light";`;

  return <script dangerouslySetInnerHTML={{__html: code}} />;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale: rawLocale} = await params;
  const locale = assertLocale(rawLocale);
  const content = getPortfolioContent(locale);
  const path = getLocalePath(locale);
  const title = content.seo.title;
  const description = content.seo.description;

  return {
    metadataBase: new URL(getSiteUrl()),
    title,
    description,
    alternates: {
      canonical: path,
      languages: {
        en: "/",
        ko: "/ko",
        "x-default": "/"
      }
    },
    openGraph: {
      type: "website",
      locale: locale === "en" ? "en_US" : "ko_KR",
      url: getAbsoluteUrl(path),
      title,
      description,
      siteName: content.seo.person.name,
      images: [
        {
          url: getAbsoluteUrl(locale === "en" ? "/og" : "/ko/og"),
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [getAbsoluteUrl(locale === "en" ? "/og" : "/ko/og")]
    },
    icons: {
      icon: "/favicon.svg"
    }
  };
}

export default async function LocaleLayout({children, params}: LayoutProps) {
  const {locale: rawLocale} = await params;
  const locale = assertLocale(rawLocale);
  setRequestLocale(locale);
  const messages = await getMessages();
  const content = getPortfolioContent(locale);

  return (
    <html
      className={fontVariablesForLocale(locale)}
      data-theme="light"
      lang={locale}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd(content, locale))
          }}
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
