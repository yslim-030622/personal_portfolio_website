"use client";

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
      className="liquid-switch relative inline-flex h-11 items-stretch overflow-hidden rounded-xl p-1"
    >
      <div
        aria-hidden="true"
        className="liquid-switch-thumb pointer-events-none absolute inset-y-1 rounded-lg transition-all duration-300"
        style={{
          width: `calc(${100 / options.length}% - 8px)`,
          left: `calc(${(activeIndex * 100) / options.length}% + 4px)`,
        }}
      />
      {options.map((opt, i) => (
        <button
          aria-label={opt.ariaLabel}
          className={`relative z-10 min-w-11 px-3 text-[0.76rem] font-medium tracking-[0.16em] transition-colors duration-200 ${
            value === opt.value ? "text-fg" : "text-fg-muted hover:text-fg"
          }`}
          key={String(opt.value)}
          onClick={() => onChange(opt.value)}
          type="button"
        >
          {opt.label}
          {i < options.length - 1 && (
            <span
              aria-hidden="true"
              className="liquid-switch-divider pointer-events-none absolute right-0 top-1/2 h-5 w-px -translate-y-1/2"
            />
          )}
        </button>
      ))}
    </div>
  );
}

export function Navigation({
  sectionTitles = [],
}: {
  sectionTitles?: (string | null | undefined)[];
}) {
  const locale = useLocale();
  const t = useTranslations("nav");
  const [theme, setTheme] = useState<Theme>("dark");
  const [scrolled, setScrolled] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const themeParts = useMemo(() => t("themeToggle").split(" · "), [t]);
  const currentTitle = currentSection > 0 ? sectionTitles[currentSection] : undefined;

  useEffect(() => {
    const stored = window.localStorage.getItem("ysl-theme");
    const next = stored === "light" || stored === "dark" ? stored : themeForCurrentHour();
    document.documentElement.dataset.theme = next;
    const frame = window.requestAnimationFrame(() => setTheme(next));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const onSection = (e: Event) => {
      const {index} = (e as CustomEvent<{index: number}>).detail;
      setCurrentSection(index);
      setScrolled(index > 0);
    };
    document.addEventListener("fp-section-change", onSection);
    return () => document.removeEventListener("fp-section-change", onSection);
  }, []);

  const setThemeValue = (value: Theme) => {
    document.documentElement.classList.add("theme-transitioning");
    setTheme(value);
    document.documentElement.dataset.theme = value;
    window.localStorage.setItem("ysl-theme", value);
    setTimeout(() => document.documentElement.classList.remove("theme-transitioning"), 500);
  };

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 px-5 py-3 transition-all duration-300 md:px-8 ${
        scrolled
          ? "border-b border-border/50 bg-bg/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="flex min-h-11 w-full items-center justify-between gap-4 text-[0.9rem] uppercase tracking-normal text-fg">
        <p
          aria-live="polite"
          className={`max-w-[52vw] truncate font-body text-[0.78rem] tracking-[0.16em] text-fg/70 transition-opacity duration-300 md:max-w-none md:text-[0.86rem] ${
            currentTitle ? "opacity-100" : "opacity-0"
          }`}
        >
          {currentTitle ?? "\u00a0"}
        </p>
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
