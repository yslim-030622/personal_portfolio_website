"use client";

import {useLocale, useTranslations} from "next-intl";
import {useEffect, useState, type ReactNode} from "react";

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
  const [scrolled, setScrolled] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const currentTitle = currentSection > 0 ? sectionTitles[currentSection] : undefined;

  useEffect(() => {
    document.documentElement.dataset.theme = "light";
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

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 px-5 py-1.5 transition-all duration-300 md:px-8 ${
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
          {currentTitle ?? " "}
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
        </div>
      </nav>
    </header>
  );
}
