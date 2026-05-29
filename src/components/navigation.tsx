"use client";

import {useLocale, useTranslations} from "next-intl";
import {AnimatePresence, motion} from "motion/react";
import {useEffect, useRef, useState, type ReactNode} from "react";

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

function EmailIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="13" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24" width="13">
      <rect height="16" rx="2" ry="2" width="20" x="2" y="4" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg aria-hidden="true" fill="currentColor" height="13" viewBox="0 0 24 24" width="13">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .322.216.694.825.576C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg aria-hidden="true" fill="currentColor" height="13" viewBox="0 0 24 24" width="13">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
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
  const [showContact, setShowContact] = useState(false);
  const contactRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (!showContact) return;
    const handleClick = (e: MouseEvent) => {
      if (contactRef.current && !contactRef.current.contains(e.target as Node)) {
        setShowContact(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showContact]);

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
              locale === "en" ? "font-body font-normal tracking-[0.12em]" : "font-sans font-bold tracking-[0.08em]"
            } ${currentTitle ? "opacity-100" : "opacity-0"}`}
          >
            {currentTitle ?? " "}
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

      {/* Contact button — bottom right */}
      <div ref={contactRef} className="fixed bottom-6 right-6 z-40">
        <AnimatePresence>
          {showContact && (
            <motion.div
              initial={{opacity: 0, y: 8, scale: 0.96}}
              animate={{opacity: 1, y: 0, scale: 1}}
              exit={{opacity: 0, y: 8, scale: 0.96}}
              transition={{duration: 0.2, ease: EASE}}
              className="absolute bottom-12 right-0 w-56 rounded-2xl border border-border/60 bg-bg/85 backdrop-blur-xl p-4 shadow-lg"
            >
              <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-widest text-fg-muted">
                {locale === "ko" ? "연락하기" : "Get in touch"}
              </p>
              <div className="flex flex-col gap-2.5">
                <a
                  className="flex items-center gap-2 text-[0.8rem] text-fg/70 transition-colors duration-150 hover:text-fg"
                  href="mailto:ylim76@wisc.edu"
                >
                  <EmailIcon />
                  ylim76@wisc.edu
                </a>
                <a
                  className="flex items-center gap-2 text-[0.8rem] text-fg/70 transition-colors duration-150 hover:text-fg"
                  href="https://github.com/ylim76"
                  rel="noreferrer"
                  target="_blank"
                >
                  <GitHubIcon />
                  github.com/ylim76
                </a>
                <a
                  className="flex items-center gap-2 text-[0.8rem] text-fg/70 transition-colors duration-150 hover:text-fg"
                  href="https://www.linkedin.com/in/yeongseok-lim"
                  rel="noreferrer"
                  target="_blank"
                >
                  <LinkedInIcon />
                  in/yeongseok-lim
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          aria-label={locale === "ko" ? "연락처 보기" : "Contact info"}
          className={`flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-bg/70 backdrop-blur-xl shadow-sm transition-colors duration-200 hover:bg-bg ${
            showContact ? "bg-bg text-fg" : "text-fg/60"
          }`}
          onClick={() => setShowContact((v) => !v)}
          type="button"
        >
          <span className="font-body text-[0.95rem] font-semibold leading-none">?</span>
        </button>
      </div>
    </>
  );
}
