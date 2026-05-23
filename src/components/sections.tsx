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
};

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const VP = {once: true, amount: 0.18} as const;

function Section({eyebrow, children, className}: SectionProps) {
  const reduce = usePrefersReducedMotion();

  return (
    <section
      className={`mx-auto max-w-[1100px] px-5 py-10 md:px-8 md:py-14 ${className ?? ""}`}
    >
      <div className="flex items-center gap-5">
        {/* eyebrow slide-in */}
        <motion.p
          className="shrink-0 font-display text-[0.9rem] tracking-normal text-fg/70"
          initial={reduce ? false : {opacity: 0, x: -14}}
          whileInView={reduce ? undefined : {opacity: 1, x: 0}}
          viewport={VP}
          transition={{duration: 0.42, delay: 0.08, ease: EASE}}
        >
          {eyebrow}
        </motion.p>

        {/* line sweep */}
        <motion.div
          aria-hidden="true"
          className="h-px flex-1 origin-left bg-white/70"
          initial={reduce ? false : {scaleX: 0}}
          whileInView={reduce ? undefined : {scaleX: 1}}
          viewport={VP}
          transition={{duration: 0.58, ease: EASE}}
        />
      </div>

      {/* content fade-up */}
      <motion.div
        className="mt-7 md:mt-8"
        initial={reduce ? false : {opacity: 0, y: 18}}
        whileInView={reduce ? undefined : {opacity: 1, y: 0}}
        viewport={VP}
        transition={{duration: 0.5, delay: 0.14, ease: EASE}}
      >
        {children}
      </motion.div>
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

export function WorkSection({
  eyebrow,
  items
}: {
  eyebrow: string;
  items: LocalizedWorkEntry[];
}) {
  const filled = items.filter((item) => item.status === "filled");

  return (
    <Section eyebrow={eyebrow}>
      <div className="divide-y divide-border">
        {filled.map((item) => {
          const previewLinks = item.links?.filter(isPdfLink);
          const textLinks = item.links?.filter((link) => !isPdfLink(link));
          const photos = item.photos;

          return (
            <article
              className="group grid gap-4 py-6 first:pt-0 last:pb-0 md:grid-cols-[220px_1fr] md:gap-9 md:py-7"
              key={`${item.company}-${item.dates}`}
            >
              <div
                className={
                  photos?.length
                    ? "grid grid-cols-[minmax(0,1fr)_96px] items-start gap-4 md:block"
                    : undefined
                }
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
                      <figure
                        className="relative overflow-hidden rounded-[6px] border border-border bg-bg-elev"
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
                      </figure>
                    ))}
                  </div>
                ) : null}
              </div>
              <div>
                <p className="max-w-[62ch] font-display text-[1.08rem] leading-[1.76] text-fg">
                  {item.paragraph}
                </p>
                {item.highlights?.length ? (
                  <ul className="mt-4 grid gap-3 font-display text-[1.03rem] leading-[1.68] text-fg-muted">
                    {item.highlights.map((highlight) => (
                      <li className="flex gap-3" key={highlight}>
                        <span
                          aria-hidden="true"
                          className="mt-[0.62em] h-1.5 w-1.5 flex-none rounded-full bg-accent/80"
                        />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {previewLinks?.map((link) => (
                  <PresentationPreview className="mt-5" key={link.label} link={link} />
                ))}
                {textLinks?.length ? (
                  <div className="mt-5 flex flex-wrap gap-4 text-[0.75rem] uppercase text-fg">
                    {textLinks.map((link) => (
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

export function ProjectsSection({
  eyebrow,
  items
}: {
  eyebrow: string;
  items: LocalizedProjectEntry[];
}) {
  const filled = items.filter((item) => item.status === "filled");

  return (
    <Section eyebrow={eyebrow}>
      <div className="divide-y divide-border/80 border-y border-border/80">
        {filled.map((item) => {
          const previewLinks = item.links?.filter(isPdfLink);
          const textLinks = item.links?.filter((link) => !isPdfLink(link));
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
                <div className="mt-4 flex flex-wrap gap-x-2 gap-y-1 font-display text-[0.82rem] text-fg/55">
                  {item.tech.map((tech, index) => (
                    <span key={tech}>
                      {tech}
                      {index < item.tech.length - 1 ? (
                        <span className="ml-2 text-fg/25">/</span>
                      ) : null}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-5 min-w-0 md:mt-0">
                <p className="max-w-[64ch] font-display text-[1.02rem] leading-[1.74] text-fg">
                  {item.description}
                </p>
                {previewLinks?.map((link) => (
                  <PresentationPreview className="mt-5" key={link.label} link={link} />
                ))}
                {textLinks?.length ? (
                  <div className="mt-5 flex flex-wrap gap-4 font-display text-[0.84rem] text-fg/70">
                    {textLinks.map((link) => (
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
            <p className="mt-3 max-w-[56ch] text-[0.93rem] leading-[1.8] text-fg">
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
