"use client";

import type {
  LocalizedNoteEntry,
  LocalizedOptionalLink,
  LocalizedPortfolioContent,
  LocalizedProjectEntry,
  LocalizedWorkEntry
} from "@/content";
import {NotesAccordion} from "./notes-accordion";
import {PresentationPreview} from "./presentation-preview";
import {usePrefersReducedMotion} from "./use-prefers-reduced-motion";
import {motion} from "motion/react";
import Image from "next/image";
import {type ReactNode} from "react";

type SectionProps = {
  eyebrow: string;
  children: ReactNode;
  className?: string;
  animateContent?: boolean;
};

type FilledWorkEntry = Extract<LocalizedWorkEntry, {status: "filled"}>;
type FilledProjectEntry = Extract<LocalizedProjectEntry, {status: "filled"}>;

function isFilledEntry<T extends {status: string}>(
  item: T
): item is Extract<T, {status: "filled"}> {
  return item.status === "filled";
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const VP = {once: true, amount: 0.03} as const;

function Section({eyebrow, children, className, animateContent = true}: SectionProps) {
  const reduce = usePrefersReducedMotion();

  return (
    <section
      className={`content-visibility-auto mx-auto max-w-[1100px] px-5 py-10 md:px-8 md:py-14 ${className ?? ""}`}
    >
      <div className="flex items-center gap-5">
        {/* eyebrow slide-in */}
        <motion.p
          className="shrink-0 font-display text-[0.9rem] tracking-normal text-fg/70"
          initial={reduce ? false : {opacity: 0, x: -20}}
          whileInView={reduce ? undefined : {opacity: 1, x: 0}}
          viewport={VP}
          transition={{duration: 0.28, delay: 0.04, ease: EASE}}
        >
          {eyebrow}
        </motion.p>

        {/* line sweep */}
        <motion.div
          aria-hidden="true"
          className="h-px flex-1 origin-left bg-fg/70"
          initial={reduce ? false : {scaleX: 0}}
          whileInView={reduce ? undefined : {scaleX: 1}}
          viewport={VP}
          transition={{duration: 0.42, ease: EASE}}
        />
      </div>

      {animateContent ? (
        /* content fade-up */
        <motion.div
          className="mt-7 md:mt-8"
          initial={reduce ? false : {opacity: 0, y: 18}}
          whileInView={reduce ? undefined : {opacity: 1, y: 0}}
          viewport={VP}
          transition={{duration: 0.38, delay: 0.1, ease: EASE}}
        >
          {children}
        </motion.div>
      ) : (
        <div className="mt-7 md:mt-8">{children}</div>
      )}
    </section>
  );
}

function ExternalLink({link}: {link: LocalizedOptionalLink}) {
  if (!link.href) {
    return <span className="text-fg-muted">→ {link.label}</span>;
  }

  return (
    <a
      aria-label={link.ariaLabel}
      className="link-underline transition-colors duration-200 hover:text-accent"
      href={link.href}
      rel={link.external ? "noreferrer" : undefined}
      target={link.external ? "_blank" : undefined}
    >
      → {link.label}
    </a>
  );
}

const isPdfLink = (link: LocalizedOptionalLink) =>
  link.href?.toLowerCase().endsWith(".pdf") ?? false;

function GitHubIcon() {
  return (
    <svg aria-hidden="true" fill="currentColor" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .322.216.694.825.576C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
}

const ITEM_VP = {once: true, margin: "0px 0px -2% 0px", amount: 0.04} as const;

function WorkItem({item, index}: {item: FilledWorkEntry; index: number}) {
  const reduce = usePrefersReducedMotion();
  const previewLinks = item.links?.filter(isPdfLink);
  const textLinks = item.links?.filter((link) => !isPdfLink(link));
  const photos = item.photos;

  return (
    <motion.article
      className="group grid gap-4 py-6 first:pt-0 last:pb-0 md:grid-cols-[220px_1fr] md:gap-9 md:py-7"
      initial={reduce ? false : {opacity: 0, y: 28}}
      whileInView={reduce ? undefined : {opacity: 1, y: 0}}
      viewport={ITEM_VP}
      transition={{duration: 0.6, delay: index === 0 ? 0.05 : 0, ease: EASE}}
    >
      <motion.div
        className={
          photos?.length
            ? "grid grid-cols-[minmax(0,1fr)_96px] items-start gap-4 md:block"
            : undefined
        }
        initial={reduce ? false : {opacity: 0, x: -12}}
        whileInView={reduce ? undefined : {opacity: 1, x: 0}}
        viewport={ITEM_VP}
        transition={{duration: 0.52, delay: index === 0 ? 0.12 : 0.08, ease: EASE}}
      >
        <div>
          <p className="font-display text-[1rem] tracking-normal text-fg/68">
            {item.dates}
          </p>
          {item.companyUrl ? (
            <a
              className="mt-3 inline-block font-display text-[1.5rem] font-medium leading-tight text-fg transition-colors duration-200 hover:text-accent md:text-[1.6rem]"
              href={item.companyUrl}
              rel="noreferrer"
              target="_blank"
            >
              {item.company}
            </a>
          ) : (
            <h2 className="mt-3 font-display text-[1.5rem] font-medium leading-tight text-fg transition-colors duration-200 group-hover:text-accent md:text-[1.6rem]">
              {item.company}
            </h2>
          )}
          <p className="mt-1.5 text-[0.96rem] leading-[1.55] text-fg">
            {item.role}
          </p>
          <p className="mt-1 font-display text-[0.92rem] tracking-normal text-fg/62">
            {item.location}
          </p>
        </div>
        {photos?.length ? (
          <div className="grid max-w-[96px] gap-3 md:mt-5 md:max-w-[150px]">
            {photos.map((photo) => (
              <motion.figure
                className="relative overflow-hidden rounded-[6px] border border-border bg-bg-elev"
                initial={reduce ? false : {opacity: 0, scale: 0.94}}
                whileInView={reduce ? undefined : {opacity: 1, scale: 1}}
                viewport={ITEM_VP}
                transition={{duration: 0.6, delay: 0.18, ease: EASE}}
                key={photo.src}
              >
                <div className="relative aspect-[4/5]">
                  <Image
                    alt={photo.alt}
                    className="object-cover object-[50%_36%]"
                    fill
                    sizes="150px"
                    src={photo.src}
                  />
                </div>
              </motion.figure>
            ))}
          </div>
        ) : null}
      </motion.div>
      <motion.div
        initial={reduce ? false : {opacity: 0, y: 16}}
        whileInView={reduce ? undefined : {opacity: 1, y: 0}}
        viewport={ITEM_VP}
        transition={{duration: 0.56, delay: index === 0 ? 0.18 : 0.12, ease: EASE}}
      >
        <p className="max-w-[62ch] font-display text-[1.08rem] leading-[1.76] text-fg">
          {item.paragraph}
        </p>
        {item.highlights?.length ? (
          <ul className="mt-4 grid gap-3 font-display text-[1.03rem] leading-[1.68] text-fg-muted">
            {item.highlights.map((highlight, hi) => (
              <motion.li
                className="flex gap-3"
                initial={reduce ? false : {opacity: 0, x: 8}}
                whileInView={reduce ? undefined : {opacity: 1, x: 0}}
                viewport={ITEM_VP}
                transition={{duration: 0.4, delay: (index === 0 ? 0.24 : 0.16) + hi * 0.06, ease: EASE}}
                key={highlight}
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.62em] h-1.5 w-1.5 flex-none rounded-full bg-accent/80"
                />
                <span>{highlight}</span>
              </motion.li>
            ))}
          </ul>
        ) : null}
        {previewLinks?.map((link) => (
          <PresentationPreview className="mt-5" key={link.label} link={link} />
        ))}
        {(() => {
          const githubLink = textLinks?.find((l) => l.label.toLowerCase() === "github");
          const otherLinks = textLinks?.filter((l) => l.label.toLowerCase() !== "github");
          return (
            <>
              {githubLink?.href ? (
                <div className="mt-5">
                  <a
                    aria-label={githubLink.ariaLabel ?? `${item.company} GitHub repository`}
                    className="inline-flex items-center gap-2 rounded-md border border-border px-3.5 py-2 text-[0.82rem] text-fg/75 transition-all duration-200 hover:border-accent hover:text-accent"
                    href={githubLink.href}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <GitHubIcon />
                    GitHub
                  </a>
                </div>
              ) : null}
              {otherLinks?.length ? (
                <div className="mt-5 flex flex-wrap gap-4 text-[0.75rem] uppercase text-fg">
                  {otherLinks.map((link) => (
                    <ExternalLink key={link.label} link={link} />
                  ))}
                </div>
              ) : null}
            </>
          );
        })()}
      </motion.div>
    </motion.article>
  );
}

export function WorkSection({
  eyebrow,
  items
}: {
  eyebrow: string;
  items: LocalizedWorkEntry[];
}) {
  const filled = items.filter(isFilledEntry);

  return (
    <Section eyebrow={eyebrow} animateContent={false}>
      <div className="divide-y divide-border">
        {filled.map((item, index) => (
          <WorkItem index={index} item={item} key={`${item.company}-${item.dates}`} />
        ))}
      </div>
    </Section>
  );
}

export function ProjectsSection({
  eyebrow,
  items
}: {
  eyebrow: string;
  items: LocalizedProjectEntry[];
}) {
  const filled = items.filter(isFilledEntry);

  return (
    <Section eyebrow={eyebrow}>
      <div className="divide-y divide-border/80 border-y border-border/80">
        {filled.map((item) => {
          const previewLinks = item.links?.filter(isPdfLink);
          const githubLink = item.links?.find((link) => !isPdfLink(link) && link.label.toLowerCase() === "github");
          const otherLinks = item.links?.filter(
            (link) => !isPdfLink(link) && link.label.toLowerCase() !== "github"
          );
          const [kind, date] = item.kindDate.includes(" · ")
            ? item.kindDate.split(" · ", 2)
            : [item.kindDate, ""];

          return (
            <article
              className="group py-7 md:grid md:grid-cols-[240px_1fr] md:gap-10 md:py-9"
              key={item.title}
            >
              <div className="min-w-0">
                <p className="font-display text-[0.86rem] tracking-normal text-fg/65">
                  {kind}
                </p>
                <h2 className="mt-2.5 font-display text-[1.45rem] font-medium leading-tight text-fg transition-colors duration-200 group-hover:text-accent md:text-[1.6rem]">
                  {item.title}
                </h2>
                {date ? (
                  <p className="mt-1 font-display text-[0.8rem] tracking-normal text-fg/60">
                    {date}
                  </p>
                ) : null}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {item.tech.map((tech) => (
                    <span
                      className="inline-block rounded-full border border-border px-2.5 py-[3px] font-sans text-[0.72rem] text-fg/65"
                      key={tech}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-5 min-w-0 md:mt-0">
                <p className="max-w-[64ch] font-display text-[1.02rem] leading-[1.74] text-fg">
                  {item.description}
                </p>
                {item.highlights?.length ? (
                  <ul className="mt-4 grid gap-2.5 font-display text-[0.98rem] leading-[1.7] text-fg-muted">
                    {item.highlights.map((highlight) => (
                      <li className="flex gap-3" key={highlight}>
                        <span
                          aria-hidden="true"
                          className="mt-[0.65em] h-1.5 w-1.5 flex-none rounded-full bg-accent/80"
                        />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {previewLinks?.map((link) => (
                  <PresentationPreview className="mt-5" key={link.label} link={link} />
                ))}
                {githubLink?.href ? (
                  <div className="mt-5">
                    <a
                      aria-label={githubLink.ariaLabel ?? `${item.title} GitHub repository`}
                      className="inline-flex items-center gap-2 rounded-md border border-border px-3.5 py-2 text-[0.82rem] text-fg/75 transition-all duration-200 hover:border-accent hover:text-accent"
                      href={githubLink.href}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <GitHubIcon />
                      GitHub
                    </a>
                  </div>
                ) : null}
                {otherLinks?.length ? (
                  <div className="mt-5 flex flex-wrap gap-4 text-[0.8rem] text-fg">
                    {otherLinks.map((link) => (
                      <ExternalLink key={link.label} link={link} />
                    ))}
                  </div>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </Section>
  );
}

export function NotesSection({
  eyebrow,
  intro,
  items
}: {
  eyebrow: string;
  intro: string;
  items: LocalizedNoteEntry[];
}) {
  return (
    <Section eyebrow={eyebrow}>
      <p className="max-w-[56ch] font-display text-[1.02rem] leading-[1.74] text-fg">
        {intro}
      </p>
      <NotesAccordion items={items} />
    </Section>
  );
}

export function SkillsSection({
  eyebrow,
  items
}: {
  eyebrow: string;
  items: LocalizedPortfolioContent["skills"];
}) {
  return (
    <Section eyebrow={eyebrow}>
      <div className="grid gap-7 md:grid-cols-2">
        {items.map((item) => (
          <section className="group" key={item.title}>
            <h2 className="font-display text-[1.3rem] font-medium leading-tight text-fg transition-colors duration-200 group-hover:text-accent md:text-[1.4rem]">
              {item.title}
            </h2>
            <p className="mt-3 max-w-[56ch] font-display text-[0.93rem] leading-[1.8] text-fg">
              {item.body}
            </p>
          </section>
        ))}
      </div>
    </Section>
  );
}

export function Footer({content}: {content: LocalizedPortfolioContent["footer"]}) {
  const dateMatch = content.line1.match(/^(.*?)(\d{4}-\d{2}-\d{2})(\.)?$/);

  return (
    <footer className="mx-auto max-w-[1100px] px-5 pb-12 pt-8 md:px-8">
      <div className="border-t border-border pt-8">
        <p className="text-sm leading-7 text-fg-muted">
          {dateMatch ? (
            <>
              {dateMatch[1]}
              <span className="text-fg">{dateMatch[2]}</span>
              {dateMatch[3]}
            </>
          ) : (
            content.line1
          )}
        </p>
        <p className="mt-2 text-[0.72rem] uppercase text-fg-muted">
          {content.line2}
        </p>
      </div>
    </footer>
  );
}
