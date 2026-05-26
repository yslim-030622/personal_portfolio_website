"use client";

import type {LocalizedNoteEntry} from "@/content";
import {AnimatePresence, motion} from "motion/react";
import {useTranslations} from "next-intl";
import {useState} from "react";
import {usePrefersReducedMotion} from "./use-prefers-reduced-motion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function NotesAccordion({items}: {items: LocalizedNoteEntry[]}) {
  const [openIndex, setOpenIndex] = useState(-1);
  const reduce = usePrefersReducedMotion();
  const t = useTranslations("courses");

  return (
    <div className="mt-6 border-t border-border">
      {items.map((item, index) => {
        const open = openIndex === index;
        const panelId = `note-panel-${index}`;

        return (
          <motion.div
            className="relative border-b border-border"
            key={item.title}
            initial={reduce ? false : {opacity: 0, y: 10}}
            whileInView={reduce ? undefined : {opacity: 1, y: 0}}
            viewport={{once: true, amount: 0.3}}
            transition={{duration: 0.36, delay: index * 0.04, ease: EASE}}
          >
            {/* hover accent bar */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 w-[2px] rounded-r-full bg-accent transition-all duration-300"
              style={{
                height: open ? "100%" : "0%",
                opacity: open ? 1 : 0,
              }}
            />

            <button
              aria-controls={panelId}
              aria-expanded={open}
              aria-label={open ? t("close") : t("open")}
              className="group grid w-full grid-cols-[5.2rem_1fr] items-center gap-3 py-[1.1rem] pl-3 text-left transition-colors duration-200 hover:text-accent md:grid-cols-[7.5rem_1fr_auto]"
              type="button"
              onClick={() => setOpenIndex(open ? -1 : index)}
            >
              <span className="font-body text-[0.82rem] tracking-wide uppercase text-fg/60 transition-colors duration-200 group-hover:text-accent/70">
                {item.date}
              </span>

              <span className="flex min-w-0 items-center justify-between gap-3">
                <span className="font-body text-[1.06rem] font-medium leading-snug text-fg transition-colors duration-200 group-hover:text-accent md:text-[1.16rem]">
                  {item.title}
                </span>
                {/* rotating chevron — mobile only */}
                <span
                  aria-hidden="true"
                  className="inline-flex flex-none text-fg-muted transition-colors duration-200 group-hover:text-accent md:hidden"
                  style={{
                    transform: open ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.25s cubic-bezier(0.22,1,0.36,1), color 0.2s",
                  }}
                >
                  <svg fill="none" height="14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="14">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </span>

              {/* category badge */}
              <span className="col-start-2 flex items-center justify-between gap-3 md:col-start-auto md:justify-end">
                {item.tag ? (
                  <span className="inline-flex items-center rounded-[4px] border border-border px-2 py-0.5 font-body text-[0.72rem] tracking-wide uppercase text-fg/60 transition-colors duration-200 group-hover:border-accent/40 group-hover:text-accent/70">
                    {item.tag}
                  </span>
                ) : null}
                {/* rotating chevron — desktop only */}
                <span
                  aria-hidden="true"
                  className="hidden flex-none text-fg-muted transition-colors duration-200 group-hover:text-accent md:inline-flex"
                  style={{
                    transform: open ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.25s cubic-bezier(0.22,1,0.36,1), color 0.2s",
                  }}
                >
                  <svg fill="none" height="14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="14">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </span>
            </button>

            <AnimatePresence initial={false}>
              {open ? (
                <motion.div
                  id={panelId}
                  initial={reduce ? {opacity: 0} : {height: 0, opacity: 0}}
                  animate={reduce ? {opacity: 1} : {height: "auto", opacity: 1}}
                  exit={reduce ? {opacity: 0} : {height: 0, opacity: 0}}
                  transition={{duration: reduce ? 0.2 : 0.26, ease: "easeOut"}}
                  style={{overflow: "hidden"}}
                >
                  <motion.p
                    className="max-w-[68ch] pb-6 pl-[6.2rem] font-body text-[1.02rem] leading-[1.76] text-fg/80 md:pl-[9rem]"
                    initial={reduce ? false : {opacity: 0, y: 6}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.22, delay: 0.06, ease: EASE}}
                  >
                    {item.body}
                  </motion.p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
