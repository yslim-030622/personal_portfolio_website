"use client";

import {Link} from "@/i18n/navigation";
import Image from "next/image";
import {useLocale, useTranslations} from "next-intl";
import {useEffect, useMemo, useState} from "react";

type Theme = "dark" | "light";

export function Navigation() {
  const locale = useLocale();
  const t = useTranslations("nav");
  const [theme, setTheme] = useState<Theme>("dark");
  const [scrolled, setScrolled] = useState(false);
  const localeParts = useMemo(() => t("localeToggle").split(" · "), [t]);
  const themeParts = useMemo(() => t("themeToggle").split(" · "), [t]);

  useEffect(() => {
    const stored = window.localStorage.getItem("ysl-theme");
    const next = stored === "light" || stored === "dark" ? stored : "dark";
    document.documentElement.dataset.theme = next;
    const frame = window.requestAnimationFrame(() => setTheme(next));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, {passive: true});
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const setThemeValue = (value: Theme) => {
    setTheme(value);
    document.documentElement.dataset.theme = value;
    window.localStorage.setItem("ysl-theme", value);
  };

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 px-5 py-3 transition-all duration-300 md:px-8 ${
        scrolled
          ? "border-b border-border/50 bg-bg/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="flex w-full items-center justify-between text-[0.9rem] uppercase tracking-normal text-fg">
        <Link
          aria-label="University of Wisconsin-Madison"
          className="uw-logo-link"
          href="/"
        >
          <Image
            alt="University of Wisconsin-Madison crest"
            className="uw-logo-mark"
            height={87}
            src="/uw-crest-color-web-digital.svg"
            width={56}
          />
        </Link>
        <div className="flex items-center gap-6">
          <div aria-label={t("currentLocale")} className="flex items-center gap-2">
            <Link
              aria-label={t("switchToEnglish")}
              className={`transition-colors duration-200 hover:text-accent ${
                locale === "en" ? "font-semibold text-fg" : "text-fg-muted"
              }`}
              href="/"
              locale="en"
            >
              {localeParts[0]}
            </Link>
            <span aria-hidden="true" className="text-fg-muted">·</span>
            <Link
              aria-label={t("switchToKorean")}
              className={`transition-colors duration-200 hover:text-accent ${
                locale === "ko" ? "font-semibold text-fg" : "text-fg-muted"
              }`}
              href="/"
              locale="ko"
            >
              {localeParts[1]}
            </Link>
          </div>

          <div aria-label={t("currentTheme")} className="flex items-center gap-2 text-[1.05rem] leading-none">
            <button
              aria-label={t("switchToLight")}
              className={`transition-colors duration-200 hover:text-accent ${
                theme === "light" ? "font-semibold text-fg" : "text-fg-muted"
              }`}
              type="button"
              onClick={() => setThemeValue("light")}
            >
              {themeParts[0]}
            </button>
            <span aria-hidden="true" className="text-[0.9rem] text-fg-muted">·</span>
            <button
              aria-label={t("switchToDark")}
              className={`transition-colors duration-200 hover:text-accent ${
                theme === "dark" ? "font-semibold text-fg" : "text-fg-muted"
              }`}
              type="button"
              onClick={() => setThemeValue("dark")}
            >
              {themeParts[1]}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
