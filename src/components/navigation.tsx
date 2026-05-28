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
  return (
    <div className="inline-flex items-center gap-0">
      {options.map((opt, i) => (
        <div key={String(opt.value)} className="inline-flex items-center">
          <button
            aria-label={opt.ariaLabel}
            className={`text-[0.78rem] font-semibold tracking-[0.12em] transition-colors duration-200 ${
              value === opt.value
                ? "text-fg"
                : "text-fg-muted hover:text-fg"
            }`}
            onClick={() => onChange(opt.value)}
            type="button"
          >
            {opt.label}
          </button>
          {i < options.length - 1 && (
            <span
              aria-hidden="true"
              className="mx-2.5 h-4 w-px bg-fg-muted/40"
            />
          )}
        </div>
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
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, {passive: true});
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onSection = (e: Event) => {
      const {index} = (e as CustomEvent<{index: number}>).detail;
      setCurrentSection(index);
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
          className={`max-w-[52vw] truncate font-sans font-bold text-[0.95rem] tracking-[0.08em] text-fg transition-opacity duration-300 md:max-w-none md:text-[1.1rem] ${
            currentTitle ? "opacity-100" : "opacity-0"
          }`}
        >
          {currentTitle ?? " "}
        </p>
        <div className="flex items-center gap-3">
          <SegmentedSwitch
            options={[
              {label: "KOR", value: "ko", ariaLabel: t("switchToKorean")},
              {label: "ENG", value: "en", ariaLabel: t("switchToEnglish")},
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
