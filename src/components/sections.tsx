"use client";

import type {
  LocalizedNoteEntry,
  LocalizedOptionalLink,
  LocalizedPortfolioContent,
  LocalizedProjectEntry,
  LocalizedWorkEntry
} from "@/content";
import type {MotionValue} from "motion/react";
import {NotesAccordion} from "./notes-accordion";
import {PresentationPreview} from "./presentation-preview";
import {usePrefersReducedMotion} from "./use-prefers-reduced-motion";
import {motion, useMotionValue, useTransform} from "motion/react";
import Image from "next/image";
import {Children, type ReactNode, useRef, useState, useEffect} from "react";

type SectionProps = {
  eyebrow: string;
  children: ReactNode;
  className?: string;
  animateContent?: boolean;
};

type FilledWorkEntry = Extract<LocalizedWorkEntry, {status: "filled"}>;

function isFilledEntry<T extends {status: string}>(
  item: T
): item is Extract<T, {status: "filled"}> {
  return item.status === "filled";
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const VP = {once: true, margin: "0px 0px -80px 0px", amount: 0.06} as const;

function Section({eyebrow, children, className, animateContent = true}: SectionProps) {
  const reduce = usePrefersReducedMotion();

  return (
    <section
      className={`mx-auto max-w-[1100px] px-5 py-10 md:px-8 md:py-14 ${className ?? ""}`}
    >
      <div className="flex items-center gap-5">
        <motion.p
          className="shrink-0 font-body text-[1rem] tracking-wide uppercase text-fg/70"
          initial={reduce ? false : {opacity: 0, x: -20}}
          whileInView={reduce ? undefined : {opacity: 1, x: 0}}
          viewport={VP}
          transition={{duration: 0.28, delay: 0.04, ease: EASE}}
        >
          {eyebrow}
        </motion.p>
      </div>

      {animateContent ? (
        <motion.div
          className="mt-7 md:mt-8"
          initial={reduce ? false : {opacity: 0, y: 64}}
          whileInView={reduce ? undefined : {opacity: 1, y: 0}}
          viewport={VP}
          transition={{duration: 0.72, delay: 0.14, ease: EASE}}
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
    return <span className="text-white/60">→ {link.label}</span>;
  }

  return (
    <a
      aria-label={link.ariaLabel}
      className="transition-colors duration-200 hover:text-white/80"
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

const isGitHubRepoLink = (link: LocalizedOptionalLink) =>
  link.label.toLowerCase() === "github";

const isGitHubPullRequestLink = (link: LocalizedOptionalLink) =>
  /github\.com\/[^/]+\/[^/]+\/pull\/\d+/i.test(link.href ?? "");

function GitHubIcon() {
  return (
    <svg aria-hidden="true" fill="currentColor" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .322.216.694.825.576C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
}

function GitHubButton({
  link,
  fallbackAriaLabel
}: {
  link: LocalizedOptionalLink;
  fallbackAriaLabel: string;
}) {
  if (!link.href) {
    return null;
  }

  return (
    <a
      aria-label={link.ariaLabel ?? fallbackAriaLabel}
      className="card-github-btn inline-flex items-center gap-2 rounded-md px-3.5 py-2 text-[0.82rem] text-white transition-all duration-200"
      href={link.href}
      rel="noreferrer"
      target="_blank"
    >
      <GitHubIcon />
      {link.label}
    </a>
  );
}

const ITEM_VP = {once: true, margin: "0px 0px -80px 0px", amount: 0.1} as const;

const WORK_CARD_COLORS = ['#e11d48', '#d97706', '#0d9488', '#4f46e5'];
const PROJECT_CARD_COLORS = ['#4f46e5', '#0d9488', '#d97706', '#e11d48'];

function StackCard({
  children,
  index,
  activeIndex,
  total,
  scrollYProgress,
}: {
  children: ReactNode;
  index: number;
  activeIndex: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const reduce = usePrefersReducedMotion();

  const targetProgress = total > 1 ? index / (total - 1) : 0;
  const points = Array.from({ length: total }, (_, i) => i / (total - 1));

  const yValues = points.map(p => {
    if (p < targetProgress) return "100vh";
    if (p === targetProgress) return "0vh";
    const depth = (p - targetProgress) * (total - 1);
    return `-${depth * 4}vh`;
  });

  const scaleValues = points.map(p => {
    if (p < targetProgress) return 1;
    if (p === targetProgress) return 1;
    const depth = (p - targetProgress) * (total - 1);
    return Math.max(0.8, 1 - depth * 0.05);
  });

  const rotateXValues = points.map(p => {
    if (p < targetProgress) return "0deg";
    if (p === targetProgress) return "0deg";
    const depth = (p - targetProgress) * (total - 1);
    return `${depth * 2}deg`; 
  });

  const opacityValues = points.map(p => {
    if (p < targetProgress) return 1;
    if (p === targetProgress) return 1;
    const depth = (p - targetProgress) * (total - 1);
    return Math.max(0, 1 - depth * 0.2);
  });

  const y = useTransform(scrollYProgress, points, yValues);
  const scale = useTransform(scrollYProgress, points, scaleValues);
  const rotateX = useTransform(scrollYProgress, points, rotateXValues);
  const opacity = useTransform(scrollYProgress, points, opacityValues);
  const stackOffset = index - activeIndex;
  const stackDepth = Math.abs(stackOffset);
  const reducedY = `${stackOffset * 18}px`;
  const reducedScale = Math.max(0.94, 1 - stackDepth * 0.025);

  if (reduce) {
    return (
      <div
        aria-label={`Card ${index + 1} of ${total}`}
        className="card-stack-item"
        style={{
          zIndex: total - stackDepth,
          pointerEvents: index === activeIndex ? "auto" : "none",
        }}
      >
        <div
          className="card-stack-drag will-change-transform"
          style={{
            opacity: 1,
            transform: `translateY(${reducedY}) scale(${reducedScale})`,
            transformOrigin: "center bottom",
            transition: "transform 440ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      aria-label={`Card ${index + 1} of ${total}`}
      className="card-stack-item"
      style={{
        zIndex: index,
        pointerEvents: index === activeIndex ? "auto" : "none",
      }}
    >
      <motion.div
        className="card-stack-drag will-change-transform"
        style={{ y, scale, rotateX, opacity, transformOrigin: "center bottom" }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function ActiveCount({ activeIndex, total }: { activeIndex: number, total: number }) {
  return (
    <span className="card-stack-count" aria-hidden="true">
      {activeIndex + 1}/{total}
    </span>
  );
}

function CardStack({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const cards = Children.toArray(children);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollYProgress = useMotionValue(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const el = containerRef.current?.closest('.fp-section');
    if (!el) return;

    const updateActiveIndex = (progress: number) => {
      if (cards.length <= 1) {
        setActiveIndex(0);
        return;
      }

      const step = 1 / (cards.length - 1);
      const index = Math.round(progress / step);
      setActiveIndex(Math.max(0, Math.min(index, cards.length - 1)));
    };

    const updateScroll = () => {
      const maxScroll = el.scrollHeight - el.clientHeight;
      if (maxScroll > 0) {
        let progress = el.scrollTop / maxScroll;
        progress = Math.max(0, Math.min(1, progress));
        scrollYProgress.set(progress);
        updateActiveIndex(progress);
      } else {
        scrollYProgress.set(0);
        updateActiveIndex(0);
      }
    };

    updateScroll();
    el.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll, { passive: true });

    return () => {
      el.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
    };
  }, [cards.length, scrollYProgress]);

  if (cards.length <= 1) {
    return <div className={className ?? ""}>{cards}</div>;
  }

  return (
    <div
      className={`card-stack-scroll relative w-full ${className ?? ""}`}
      ref={containerRef}
      style={{ height: `${cards.length * 100}vh` }}
    >
      <div className="card-stack-sticky sticky top-0 h-[100svh] flex items-center justify-center overflow-hidden perspective-[1200px]">
        <div className="card-stack-stage relative mx-auto h-full max-w-[1100px] w-full">
          <ActiveCount activeIndex={activeIndex} total={cards.length} />
          {cards.map((child, i) => (
            <StackCard
              key={i}
              index={i}
              activeIndex={activeIndex}
              total={cards.length}
              scrollYProgress={scrollYProgress}
            >
              {child}
            </StackCard>
          ))}
        </div>
      </div>
    </div>
  );
}

function WorkItem({item, colorValue}: {item: FilledWorkEntry; colorValue: string}) {
  const reduce = usePrefersReducedMotion();
  const previewLinks = item.links?.filter(isPdfLink);
  const textLinks = item.links?.filter((link) => !isPdfLink(link));
  const photos = item.photos;

  return (
    <motion.article
      className="card-colored liquid-card group grid gap-4 rounded-[28px] p-5 transition duration-300 md:grid-cols-[240px_1fr] md:gap-8 md:p-7"
      style={{"--card-color": colorValue} as React.CSSProperties}
      initial={reduce ? false : {opacity: 0, y: 72}}
      whileInView={reduce ? undefined : {opacity: 1, y: 0}}
      viewport={ITEM_VP}
      transition={{duration: 0.75, delay: 0, ease: EASE}}
    >
      <motion.div
        className={
          photos?.length
            ? "grid grid-cols-[minmax(0,1fr)_96px] items-start gap-4 md:block md:border-r md:border-white/20 md:pr-8"
            : "md:border-r md:border-white/20 md:pr-8"
        }
        initial={reduce ? false : {opacity: 0, x: -28}}
        whileInView={reduce ? undefined : {opacity: 1, x: 0}}
        viewport={ITEM_VP}
        transition={{duration: 0.65, delay: 0.08, ease: EASE}}
      >
        <div>
          {item.companyUrl ? (
            <a
              className="inline-block font-display text-[1.42rem] font-medium leading-tight text-white transition-colors duration-200 hover:text-white/80 md:text-[1.72rem]"
              href={item.companyUrl}
              rel="noreferrer"
              target="_blank"
            >
              {item.company}
            </a>
          ) : (
            <h2 className="font-display text-[1.42rem] font-medium leading-tight text-white transition-colors duration-200 group-hover:text-white/80 md:text-[1.72rem]">
              {item.company}
            </h2>
          )}
          <p className="mt-3 font-body text-[0.94rem] leading-[1.55] text-white/90">
            {item.role}
          </p>
          <p className="mt-4 font-body text-[0.86rem] leading-snug text-white/70">
            {item.dates}
          </p>
          <p className="mt-1.5 font-body text-[0.84rem] tracking-normal text-white/65">
            {item.location}
          </p>
        </div>
        {photos?.length ? (
          <div className="grid max-w-[96px] gap-3 md:mt-5 md:max-w-[150px]">
            {photos.map((photo) => (
              <motion.figure
                className="liquid-media relative overflow-hidden rounded-md"
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
        initial={reduce ? false : {opacity: 0, y: 48}}
        whileInView={reduce ? undefined : {opacity: 1, y: 0}}
        viewport={ITEM_VP}
        transition={{duration: 0.68, delay: 0.16, ease: EASE}}
      >
        <p className="max-w-[64ch] font-body text-[0.875rem] leading-[1.65] text-white/90 md:text-[1.03rem] md:leading-[1.78]">
          {item.paragraph}
        </p>
        {item.highlights?.length ? (
          <ul className="mt-3 grid gap-2 font-body text-[0.84rem] leading-[1.6] text-white/80 md:mt-4 md:gap-3 md:text-[1rem] md:leading-[1.72]">
            {item.highlights.map((highlight, hi) => (
              <motion.li
                className="flex gap-3"
                initial={reduce ? false : {opacity: 0, y: 20}}
                whileInView={reduce ? undefined : {opacity: 1, y: 0}}
                viewport={ITEM_VP}
                transition={{duration: 0.5, delay: 0.22 + hi * 0.08, ease: EASE}}
                key={highlight}
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.62em] h-1.5 w-1.5 flex-none rounded-full bg-white/70"
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
          const githubLink = textLinks?.find(isGitHubRepoLink);
          const prLink = textLinks?.find(isGitHubPullRequestLink);
          const otherLinks = textLinks?.filter((l) => !isGitHubRepoLink(l) && !isGitHubPullRequestLink(l));
          return (
            <>
              {githubLink?.href || prLink?.href ? (
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {githubLink ? (
                    <GitHubButton fallbackAriaLabel={`${item.company} GitHub repository`} link={githubLink} />
                  ) : null}
                  {prLink ? (
                    <GitHubButton fallbackAriaLabel={`${item.company} pull request on GitHub`} link={prLink} />
                  ) : null}
                </div>
              ) : null}
              {otherLinks?.length ? (
                <div className="mt-5 flex flex-wrap gap-4 text-[0.75rem] uppercase text-white">
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
    <Section className="deck-section" eyebrow={eyebrow} animateContent={false}>
      <CardStack>
        {filled.map((item, idx) => (
          <WorkItem
            item={item}
            colorValue={WORK_CARD_COLORS[idx % WORK_CARD_COLORS.length]}
            key={`${item.company}-${item.dates}`}
          />
        ))}
      </CardStack>
    </Section>
  );
}

type FilledProjectEntry = Extract<LocalizedProjectEntry, {status: "filled"}>;

function ProjectItem({item, colorValue}: {item: FilledProjectEntry; colorValue: string}) {
  const reduce = usePrefersReducedMotion();
  const previewLinks = item.links?.filter(isPdfLink);
  const githubLink = item.links?.find((link) => !isPdfLink(link) && isGitHubRepoLink(link));
  const prLink = item.links?.find((link) => !isPdfLink(link) && isGitHubPullRequestLink(link));
  const otherLinks = item.links?.filter(
    (link) => !isPdfLink(link) && !isGitHubRepoLink(link) && !isGitHubPullRequestLink(link)
  );
  const [kind, date] = item.kindDate.includes(" · ")
    ? item.kindDate.split(" · ", 2)
    : [item.kindDate, ""];

  return (
    <motion.article
      className="card-colored liquid-card group rounded-[28px] p-5 transition duration-300 md:grid md:grid-cols-[240px_1fr] md:gap-8 md:p-7"
      style={{"--card-color": colorValue} as React.CSSProperties}
      initial={reduce ? false : {opacity: 0, y: 72}}
      whileInView={reduce ? undefined : {opacity: 1, y: 0}}
      viewport={ITEM_VP}
      transition={{duration: 0.75, ease: EASE}}
      key={item.title}
    >
      <motion.div
        className="min-w-0 md:border-r md:border-white/20 md:pr-8"
        initial={reduce ? false : {opacity: 0, x: -28}}
        whileInView={reduce ? undefined : {opacity: 1, x: 0}}
        viewport={ITEM_VP}
        transition={{duration: 0.65, delay: 0.08, ease: EASE}}
      >
        <p className="font-body text-[0.78rem] tracking-wide text-white/65 uppercase">
          {kind}
        </p>
        <h2 className="mt-2.5 font-display text-[1.18rem] font-medium leading-tight text-white transition-colors duration-200 group-hover:text-white/80 md:text-[1.56rem]">
          {item.title}
        </h2>
        {date ? (
          <p className="mt-1 font-body text-[0.8rem] tracking-normal text-white/65">
            {date}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {item.tech.map((tech) => (
            <span
              className="liquid-pill inline-block rounded-md px-2.5 py-[3px] font-sans text-[0.72rem] text-white/80"
              key={tech}
            >
              {tech}
            </span>
          ))}
        </div>
      </motion.div>
      <motion.div
        className="mt-3 min-w-0 md:mt-0"
        initial={reduce ? false : {opacity: 0, y: 48}}
        whileInView={reduce ? undefined : {opacity: 1, y: 0}}
        viewport={ITEM_VP}
        transition={{duration: 0.68, delay: 0.16, ease: EASE}}
      >
        <p className="max-w-[64ch] font-body text-[0.875rem] leading-[1.65] text-white/90 md:text-[1.03rem] md:leading-[1.78]">
          {item.description}
        </p>
        {item.highlights?.length ? (
          <ul className="mt-3 grid gap-2 font-body text-[0.84rem] leading-[1.6] text-white/80 md:mt-4 md:gap-2.5 md:text-[1rem] md:leading-[1.72]">
            {item.highlights.map((highlight, hi) => (
              <motion.li
                className="flex gap-3"
                initial={reduce ? false : {opacity: 0, y: 20}}
                whileInView={reduce ? undefined : {opacity: 1, y: 0}}
                viewport={ITEM_VP}
                transition={{duration: 0.5, delay: 0.22 + hi * 0.08, ease: EASE}}
                key={highlight}
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.65em] h-1.5 w-1.5 flex-none rounded-full bg-white/70"
                />
                <span>{highlight}</span>
              </motion.li>
            ))}
          </ul>
        ) : null}
        {previewLinks?.map((link) => (
          <PresentationPreview className="mt-5" key={link.label} link={link} />
        ))}
        {githubLink?.href || prLink?.href ? (
          <div className="mt-5 flex flex-wrap gap-2.5">
            {githubLink ? (
              <GitHubButton fallbackAriaLabel={`${item.title} GitHub repository`} link={githubLink} />
            ) : null}
            {prLink ? (
              <GitHubButton fallbackAriaLabel={`${item.title} pull request on GitHub`} link={prLink} />
            ) : null}
          </div>
        ) : null}
        {otherLinks?.length ? (
          <div className="mt-5 flex flex-wrap gap-4 text-[0.8rem] text-white">
            {otherLinks.map((link) => (
              <ExternalLink key={link.label} link={link} />
            ))}
          </div>
        ) : null}
      </motion.div>
    </motion.article>
  );
}

export function ProjectsSection({
  eyebrow,
  items
}: {
  eyebrow: string;
  items: LocalizedProjectEntry[];
}) {
  const filled = items.filter(isFilledEntry) as FilledProjectEntry[];

  return (
    <Section className="deck-section" eyebrow={eyebrow} animateContent={false}>
      <CardStack>
        {filled.map((item, idx) => (
          <ProjectItem
            item={item}
            colorValue={PROJECT_CARD_COLORS[idx % PROJECT_CARD_COLORS.length]}
            key={item.title}
          />
        ))}
      </CardStack>
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
      <p className="max-w-[56ch] font-body text-[1.06rem] leading-[1.76] text-fg">
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
            <p className="mt-3 max-w-[56ch] font-body text-[0.97rem] leading-[1.78] text-fg">
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
    <footer className="mx-auto max-w-[1100px] px-5 pb-3 pt-3 md:px-8">
      <div className="border-t border-border pt-3 flex items-center justify-between">
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
        <div className="footer-logo">
          <Image
            alt="Yeongseok Lim"
            className="footer-logo-light h-6 w-auto"
            height={48}
            src="/yeongseok-lim-orange.png"
            width={192}
          />
          <Image
            alt="Yeongseok Lim"
            className="footer-logo-dark h-6 w-auto"
            height={48}
            src="/yeongseok-lim-white-new.png"
            width={192}
          />
        </div>
      </div>
    </footer>
  );
}
