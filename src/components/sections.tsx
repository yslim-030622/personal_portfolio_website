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
import {motion, useMotionValue, useSpring, useTransform} from "motion/react";
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
  

  return (
    <section
      className={`mx-auto max-w-[1100px] pl-3 pr-5 py-10 md:pl-5 md:pr-8 md:py-14 ${className ?? ""}`}
    >
      <span className="sr-only">{eyebrow}</span>

      {animateContent ? (
        <motion.div
          className="mt-0"
          initial={{opacity: 0, y: 64}}
          whileInView={{opacity: 1, y: 0}}
          viewport={VP}
          transition={{duration: 0.72, delay: 0.14, ease: EASE}}
        >
          {children}
        </motion.div>
      ) : (
        <div className="mt-0">{children}</div>
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


const STACK_CARD_COLORS = ['#E8314A', '#5C6BC0'];
const WORK_CARD_COLORS = STACK_CARD_COLORS;
const PROJECT_CARD_COLORS = ['#2B4A70', '#1F5C5A', '#B87B22', '#9B2335'];

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

  const PEEK_VH      = 5;
  const ENTRY_Y      = 120;  // start further down so they pull up continuously
  const PEEK_OPACITY = 0.90; // high opacity = vivid original colors preserved
  const step         = total > 1 ? 1 / (total - 1) : 1;

  // Create a dense set of keypoints so the transformation is a continuous curve
  const points: number[] = [];
  const yValues: string[] = [];
  
  // We want the card to be at ENTRY_Y when its turn hasn't started yet,
  // and smoothly move to its active position exactly when scroll reaches its index.
  const activeP = total > 1 ? index / (total - 1) : 0;
  
  
  // Add points for every card index to define the path
  for(let pi = 0; pi < total; pi++) {
      const p = total > 1 ? pi / (total - 1) : 0;
      points.push(p);
      
      if (pi < index) {
         // It's still waiting below the viewport.
         // Make it scale continuously by setting its starting point slightly lower
         // than ENTRY_Y if it's far away.
         const distance = index - pi;
         yValues.push(`${ENTRY_Y + distance * 30}vh`);
      } else {
         // It is active or pushed to the background
         const depth = pi - index;
         const activeShift = pi * (PEEK_VH / 2);
         yValues.push(`${activeShift - depth * PEEK_VH}vh`);
      }
  }

  // Scale: active at 1, peeked cards shrink slightly
  const scaleValues = points.map((_, pi) => {
    if (pi <= index) return 1;
    return Math.max(0.91, 1 - (pi - index) * 0.03);
  });

  // RotateX: peeked cards tilt backward for depth (perspective is set on sticky container)
  const rotateXValues = points.map((_, pi) => {
    if (pi <= index) return 0;
    return Math.min((pi - index) * 2, 5);
  });

  // Opacity: smooth transition without dipping to 0 when moving to the background
  const opacityIns: number[] = [];
  const opacityOuts: number[] = [];

  if (index === 0) {
    opacityIns.push(0); opacityOuts.push(1);
  } else {
    const prevP       = (index - 1) * step;
    const fadeInStart = prevP + 0.2 * step; // Start fading in slightly after it begins moving
    
    if (prevP > 0) {
      opacityIns.push(0); opacityOuts.push(0);
    }
    opacityIns.push(prevP);       opacityOuts.push(0);
    opacityIns.push(fadeInStart); opacityOuts.push(0.1);
    opacityIns.push(index * step); opacityOuts.push(1);
  }

  // When card moves to the background (pi > index)
  for (let pi = index + 1; pi < total; pi++) {
    const currP      = pi * step;
    const depth      = pi - index;
    const peekOp     = Math.max(0.65, PEEK_OPACITY - (depth - 1) * 0.07);

    // Instead of fading to 0 and reappearing, just dim smoothly to peekOp
    opacityIns.push(currP);       
    opacityOuts.push(peekOp);
  }

  const y       = useTransform(scrollYProgress, points,     yValues);
  const scale   = useTransform(scrollYProgress, points,     scaleValues);
  const rotateX = useTransform(scrollYProgress, points,     rotateXValues);
  const opacity = useTransform(scrollYProgress, opacityIns, opacityOuts);

  const zIndex   = index + 1;
  const isActive = index === activeIndex;

  

  return (
    <div
      aria-label={`Card ${index + 1} of ${total}`}
      aria-hidden={!isActive}
      className="card-stack-item"
      data-active={isActive}
      style={{ zIndex, pointerEvents: isActive ? "auto" : "none" }}
    >
      <motion.div
        className="card-stack-drag will-change-transform"
        style={{ y, scale, rotateX, opacity, transformOrigin: "center center" }}
      >
        {children}
      </motion.div>
    </div>
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

    const update = () => {
      const maxScroll = el.scrollHeight - el.clientHeight;
      const progress = maxScroll > 0 ? Math.max(0, Math.min(1, el.scrollTop / maxScroll)) : 0;
      scrollYProgress.set(progress);
      if (cards.length <= 1) { setActiveIndex(0); return; }
      const step = 1 / (cards.length - 1);
      setActiveIndex(Math.max(0, Math.min(Math.round(progress / step), cards.length - 1)));
    };

    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });

    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [cards.length, scrollYProgress]);

  if (cards.length <= 1) {
    return <div className={className ?? ""}>{cards}</div>;
  }

  return (
    <div
      className={`card-stack-scroll relative w-full ${className ?? ""}`}
      ref={containerRef}
      style={{ height: `${cards.length * 50 + 50}vh` }}
    >
      <div className="card-stack-sticky sticky top-0 h-[100svh] flex items-center justify-center overflow-hidden perspective-[1200px]">
        <div className="card-stack-stage relative mx-auto h-full max-w-[1100px] w-full">
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
  const previewLinks = item.links?.filter(isPdfLink);
  const textLinks = item.links?.filter((link) => !isPdfLink(link));
  const photos = item.photos;

  return (
    <article
      className="card-colored liquid-card group grid items-center gap-5 rounded-[28px] p-6 text-center transition duration-300 md:grid-cols-[240px_1fr] md:gap-9 md:p-9"
      style={{"--card-color": colorValue} as React.CSSProperties}
    >
      <div
        className={
          photos?.length
            ? "grid grid-cols-[minmax(0,1fr)_96px] items-center gap-4 md:block md:border-r md:border-white/20 md:pr-9"
            : "md:border-r md:border-white/20 md:pr-9"
        }
      >
        <div>
          {item.companyUrl ? (
            <a
              className="inline-block font-display text-[1.58rem] font-medium leading-tight text-white transition-colors duration-200 hover:text-white/80 md:text-[1.95rem]"
              href={item.companyUrl}
              rel="noreferrer"
              target="_blank"
            >
              {item.company}
            </a>
          ) : (
            <h2 className="font-display text-[1.58rem] font-medium leading-tight text-white transition-colors duration-200 group-hover:text-white/80 md:text-[1.95rem]">
              {item.company}
            </h2>
          )}
          <p className="mt-3 font-body text-[1.02rem] leading-[1.5] text-white/90 md:text-[1.12rem]">
            {item.role}
          </p>
          <p className="mt-4 font-body text-[0.92rem] leading-snug text-white/70 md:text-[1rem]">
            {item.dates}
          </p>
          <p className="mt-1.5 font-body text-[0.9rem] tracking-normal text-white/65 md:text-[0.98rem]">
            {item.location}
          </p>
        </div>
        {photos?.length ? (
          <div className="grid w-full max-w-[96px] gap-3 md:mx-auto md:mt-5 md:max-w-[128px]">
            {photos.map((photo) => (
              <figure
                className="liquid-media relative overflow-hidden rounded-md"
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
        <p className="mx-auto max-w-[58ch] font-body text-[0.94rem] leading-[1.68] text-white/90 md:text-[1.18rem] md:leading-[1.76]">
          {item.paragraph}
        </p>
        {previewLinks?.map((link) => (
          <PresentationPreview className="mx-auto mt-6" key={link.label} link={link} />
        ))}
        {(() => {
          const githubLink = textLinks?.find(isGitHubRepoLink);
          const prLink = textLinks?.find(isGitHubPullRequestLink);
          const otherLinks = textLinks?.filter((l) => !isGitHubRepoLink(l) && !isGitHubPullRequestLink(l));
          return (
            <>
              {githubLink?.href || prLink?.href ? (
                <div className="mt-6 flex flex-wrap justify-center gap-2.5">
                  {githubLink ? (
                    <GitHubButton fallbackAriaLabel={`${item.company} GitHub repository`} link={githubLink} />
                  ) : null}
                  {prLink ? (
                    <GitHubButton fallbackAriaLabel={`${item.company} pull request on GitHub`} link={prLink} />
                  ) : null}
                </div>
              ) : null}
              {otherLinks?.length ? (
                <div className="mt-6 flex flex-wrap justify-center gap-4 text-[0.8rem] uppercase text-white md:text-[0.88rem]">
                  {otherLinks.map((link) => (
                    <ExternalLink key={link.label} link={link} />
                  ))}
                </div>
              ) : null}
            </>
          );
        })()}
      </div>
    </article>
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
    <article
      className="card-colored liquid-card group rounded-[28px] p-6 text-center transition duration-300 md:grid md:grid-cols-[240px_1fr] md:items-center md:gap-9 md:p-9"
      style={{"--card-color": colorValue} as React.CSSProperties}
    >
      <div className="min-w-0 md:flex md:h-full md:flex-col md:justify-center md:border-r md:border-white/20 md:pr-9">
        <p className="font-body text-[0.84rem] tracking-wide text-white/65 uppercase md:text-[0.92rem]">
          {kind}
        </p>
        <h2 className="mt-2.5 font-display text-[1.34rem] font-medium leading-tight text-white transition-colors duration-200 group-hover:text-white/80 md:text-[1.82rem]">
          {item.title}
        </h2>
        {date ? (
          <p className="mt-2 font-body text-[0.88rem] tracking-normal text-white/65 md:text-[0.96rem]">
            {date}
          </p>
        ) : null}
        <div className="mt-5 flex flex-wrap justify-center gap-1.5">
          {item.tech.map((tech) => (
            <span
              className="liquid-pill inline-block rounded-md px-2.5 py-[3px] font-sans text-[0.76rem] text-white/80 md:text-[0.82rem]"
              key={tech}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-3 min-w-0 md:mt-0">
        <p className="mx-auto max-w-[58ch] font-body text-[0.94rem] leading-[1.68] text-white/90 md:text-[1.18rem] md:leading-[1.76]">
          {item.description}
        </p>
        {previewLinks?.map((link) => (
          <PresentationPreview className="mx-auto mt-6" key={link.label} link={link} />
        ))}
        {githubLink?.href || prLink?.href ? (
          <div className="mt-6 flex flex-wrap justify-center gap-2.5">
            {githubLink ? (
              <GitHubButton fallbackAriaLabel={`${item.title} GitHub repository`} link={githubLink} />
            ) : null}
            {prLink ? (
              <GitHubButton fallbackAriaLabel={`${item.title} pull request on GitHub`} link={prLink} />
            ) : null}
          </div>
        ) : null}
        {otherLinks?.length ? (
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-[0.86rem] text-white md:text-[0.94rem]">
            {otherLinks.map((link) => (
              <ExternalLink key={link.label} link={link} />
            ))}
          </div>
        ) : null}
      </div>
    </article>
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
