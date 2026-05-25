"use client";

import {Link} from "@/i18n/navigation";
import Image from "next/image";
import {useLocale, useTranslations} from "next-intl";
import {useEffect, useMemo, useState, type ReactNode} from "react";

type Theme = "dark" | "light";

function themeForCurrentHour(): Theme {
  const hour = new Date().getHours();
  return hour >= 7 && hour < 18 ? "light" : "dark";
}

function SegmentedSwitch<T extends string>({
  options,
  value,
  onChange,
}: {
  options: {label: ReactNode; value: T; ariaLabel?: string}[];
  value: T;
  onChange: (val: T) => void;
}) {
  const activeIndex = options.findIndex((o) => o.value === value);

  return (
    <div
      className="relative inline-flex items-stretch overflow-hidden rounded-[5px] border border-border/80 bg-bg-elev"
      style={{boxShadow: "inset 0 1px 3px rgba(0,0,0,0.18), 0 1px 0 rgba(255,255,255,0.04)"}}
    >
      {/* sliding track */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-[2px] rounded-[3px] border border-border/60 bg-fg/10 transition-all duration-200"
        style={{
          width: `calc(${100 / options.length}% - 4px)`,
          left: `calc(${(activeIndex * 100) / options.length}% + 2px)`,
          boxShadow: "0 1px 0 rgba(255,255,255,0.06), inset 0 1px 2px rgba(0,0,0,0.12)",
        }}
      />
      {options.map((opt, i) => (
        <button
          aria-label={opt.ariaLabel}
          className={`relative z-10 px-2.5 py-1.5 text-[0.68rem] tracking-widest transition-colors duration-200 ${
            value === opt.value ? "text-fg" : "text-fg-muted hover:text-fg/60"
          }`}
          key={String(opt.value)}
          onClick={() => onChange(opt.value)}
          type="button"
        >
          {opt.label}
          {i < options.length - 1 && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-0 top-1/2 h-3 w-px -translate-y-1/2 bg-border/60"
            />
          )}
        </button>
      ))}
    </div>
  );
}

export function Navigation() {
  const locale = useLocale();
  const t = useTranslations("nav");
  const [theme, setTheme] = useState<Theme>("dark");
  const [scrolled, setScrolled] = useState(false);
  const themeParts = useMemo(() => t("themeToggle").split(" · "), [t]);

  useEffect(() => {
    const stored = window.localStorage.getItem("ysl-theme");
    const next = stored === "light" || stored === "dark" ? stored : themeForCurrentHour();
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

        <div className="flex items-center gap-3">
          <SegmentedSwitch
            options={[
              {label: "ENG", value: "en", ariaLabel: t("switchToEnglish")},
              {label: "KOR", value: "ko", ariaLabel: t("switchToKorean")},
            ]}
            value={locale as "en" | "ko"}
            onChange={(val) => {
              window.location.href = val === "en" ? "/en" : "/ko";
            }}
          />

          <SegmentedSwitch
            options={[
              {label: themeParts[0], value: "light", ariaLabel: t("switchToLight")},
              {label: themeParts[1], value: "dark", ariaLabel: t("switchToDark")},
            ]}
            value={theme}
            onChange={setThemeValue}
          />
        </div>
      </nav>
    </header>
  );
}
