"use client";

import {useLocale, useTranslations} from "next-intl";
import {AnimatePresence, motion} from "motion/react";
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

function HomeIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="16">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  );
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

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
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-50 px-5 py-1.5 transition-all duration-300 md:px-8 ${
          scrolled
            ? "nav-scrolled bg-bg/40 backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <nav className="flex min-h-11 w-full items-center justify-between gap-4 text-[0.9rem] uppercase tracking-normal text-fg">
          <p
            aria-live="polite"
            className={`max-w-[52vw] truncate text-fg transition-opacity duration-300 md:max-w-none text-[0.95rem] md:text-[1.1rem] ${
              locale === "en" ? "font-body font-bold tracking-[0.12em]" : "font-sans font-bold tracking-[0.08em]"
            } ${currentTitle ? "opacity-100" : "opacity-0"}`}
          >
            {currentTitle ?? " "}
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

      {/* Home button — bottom left */}
      <AnimatePresence>
        {scrolled && (
          <motion.button
            initial={{opacity: 0, y: 6}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: 6}}
            transition={{duration: 0.22, ease: EASE}}
            className="fixed bottom-6 left-6 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-bg/70 text-fg/60 backdrop-blur-xl shadow-sm transition-colors duration-200 hover:bg-bg hover:text-fg"
            onClick={() => window.scrollTo({top: 0, behavior: "smooth"})}
            aria-label={locale === "ko" ? "맨 위로 이동" : "Scroll to top"}
            type="button"
          >
            <HomeIcon />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
