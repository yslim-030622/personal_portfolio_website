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
import {motion} from "motion/react";
import Image from "next/image";
import {type ReactNode, useRef, useState, useEffect} from "react";
import {usePrefersReducedMotion} from "./use-prefers-reduced-motion";

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
      <span className="section-eyebrow">{eyebrow}</span>

      {animateContent ? (
        <motion.div
          className="mt-0"
          initial={{opacity: 0, y: 64}}
          whileInView={{opacity: 1, y: 0}}
          viewport={VP}
          transition={{duration: 0.88, delay: 0.18, ease: EASE}}
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
  /github\.com\/[^/]+\/[^/]+/i.test(link.href ?? "") && !isGitHubPullRequestLink(link);

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

function PdfButton({
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
      <svg aria-hidden="true" fill="currentColor" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM13 9V3.5L18.5 9H13z"/>
      </svg>
      {link.label ?? "open pdf"}
    </a>
  );
}


const TECH_ICON_SLUGS: Record<string, string> = {
  "Python": "python",
  "Swift": "swift",
  "FastAPI": "fastapi",
  "PyTorch": "pytorch",
  "PostgreSQL": "postgresql",
  "Docker": "docker",
  "TypeScript": "typescript",
  "Spring Boot": "springboot",
  "MySQL": "mysql",
  "GitLab CI": "gitlab",
  "C": "c",
  "Rust": "rust",
};

function TechIcon({name}: {name: string}) {
  const slug = TECH_ICON_SLUGS[name] ?? name.toLowerCase().replace(/\s+/g, "");
  const [hasError, setHasError] = useState(false);
  const fallback = name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <span title={name} className="tech-icon-wrap inline-flex items-center justify-center">
      {hasError ? (
        <span aria-label={name} className="tech-icon-fallback">
          {fallback}
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`https://cdn.simpleicons.org/${slug}/FFFFFF`}
          alt={name}
          width={22}
          height={22}
          className="tech-icon-img"
          onError={() => setHasError(true)}
        />
      )}
    </span>
  );
}

const WORK_CARD_COLORS = ['#1e3352', '#1e3d30'];
const WORK_CARD_GRADIENTS = [
  'linear-gradient(135deg, #1e3352 0%, #2d5278 100%)',
  'linear-gradient(135deg, #1e3d30 0%, #2a5a44 100%)',
];
const PROJECT_CARD_COLORS = ['#3F86A6', '#A95364', '#5F8C6B', '#7B6AA0', '#8A724E'];

function WorkItem({item, colorValue}: {item: FilledWorkEntry; colorValue: string}) {
  const previewLinks = item.links?.filter(isPdfLink);
  const textLinks = item.links?.filter((link) => !isPdfLink(link));
  const githubLink = textLinks?.find(isGitHubRepoLink);
  const prLink = textLinks?.find(isGitHubPullRequestLink);
  const otherLinks = textLinks?.filter((l) => !isGitHubRepoLink(l) && !isGitHubPullRequestLink(l));
  const photos = item.photos;
  const logo = item.logo;

  return (
    <article
      className="card-colored liquid-card group grid gap-3 rounded-[28px] p-5 transition duration-300 md:grid-cols-[260px_1fr] md:gap-9 md:p-9"
      style={{"--card-color": colorValue, "--card-gradient": colorValue === WORK_CARD_COLORS[0] ? WORK_CARD_GRADIENTS[0] : WORK_CARD_GRADIENTS[1]} as React.CSSProperties}
    >
      {/* Left column */}
      <div className="border-b border-white/20 pb-3 md:flex md:h-full md:flex-col md:border-b-0 md:border-r md:pb-0 md:pr-9">
        <div className={photos?.length ? "flex items-start gap-4 md:block" : ""}>
          <div className="min-w-0 flex-1">
            {item.companyUrl ? (
              <a
                className="card-title-glass font-display text-[1.5rem] font-medium leading-tight text-white transition-colors duration-200 hover:text-white/80 md:text-[1.82rem] break-keep"
                href={item.companyUrl}
                rel="noreferrer"
                target="_blank"
              >
                {item.company}
              </a>
            ) : (
              <h2 className="card-title-glass font-display text-[1.5rem] font-medium leading-tight text-white group-hover:text-white/80 md:text-[1.82rem] break-keep">
                {item.company}
              </h2>
            )}
            <p className="card-role-badge mt-2 font-body leading-snug break-keep md:mt-3">
              {item.role}
            </p>
            <p className="mt-1.5 font-body text-[0.8rem] text-white/65 md:text-[0.86rem] break-keep">
              {item.dates}{item.location ? ` · ${item.location}` : ""}
            </p>
            {githubLink?.href || prLink?.href || previewLinks?.length ? (
              <div className="mt-3 flex flex-wrap gap-2.5">
                {githubLink ? <GitHubButton fallbackAriaLabel={`${item.company} GitHub repository`} link={githubLink} /> : null}
                {prLink ? <GitHubButton fallbackAriaLabel={`${item.company} pull request on GitHub`} link={prLink} /> : null}
                {previewLinks?.map((link) => (
                  <PdfButton key={link.label} link={link} fallbackAriaLabel={`${item.company} PDF presentation`} />
                ))}
              </div>
            ) : null}
          </div>
          {photos?.length ? (
            <div className="shrink-0 md:hidden">
              <figure className="w-[clamp(6.5rem,32vw,9.5rem)] overflow-hidden rounded-lg" key={photos[0].src}>
                <div
                  className="relative w-full bg-white"
                  style={{aspectRatio: `${photos[0].width} / ${photos[0].height}`}}
                >
                  <Image alt={photos[0].alt} className="object-contain" fill sizes="(max-width: 767px) 32vw, 152px" src={photos[0].src} />
                </div>
              </figure>
            </div>
          ) : null}
        </div>
        {photos?.length ? (
          <div className="mt-6 hidden md:block">
            {photos.map((photo) => (
              <figure className="w-full overflow-hidden rounded-lg shadow-[0_2px_10px_rgba(0,0,0,0.28)]" key={photo.src}>
                <div
                  className="relative w-full bg-white"
                  style={{aspectRatio: `${photo.width} / ${photo.height}`}}
                >
                  <Image alt={photo.alt} className="object-contain" fill sizes="260px" src={photo.src} />
                </div>
              </figure>
            ))}
          </div>
        ) : null}
      </div>

      {/* Right column */}
      <div className="project-card-body min-w-0 flex flex-col h-full md:justify-center">
        {logo ? (
          <div
            className="clearsplit-showcase overflow-hidden rounded-[16px] order-1 mb-4 mt-0 md:mb-6"
            style={{"--preview-ratio": logo.width / logo.height, aspectRatio: `${logo.width} / ${logo.height}`} as React.CSSProperties}
          >
            <div className="clearsplit-showcase-stage relative bg-white">
              <Image alt={item.company + " logo"} className="object-contain" fill sizes="(max-width: 768px) 84vw, 720px" src={logo.src} />
            </div>
          </div>
        ) : null}
        {item.previewImages?.length ? (
          <ProjectScreenshotPreview animateOnMount className="work-image-preview order-1 mb-4 mt-0 md:mb-6" imageFit="contain" images={item.previewImages} title={item.company} />
        ) : null}
        {previewLinks?.map((link) => (
          <div key={link.label} className="order-1 mb-4 mt-0 md:mb-6">
            <PresentationPreview link={link} />
          </div>
        ))}
        <p className="order-2 font-body text-[0.94rem] leading-[1.7] text-white/90 md:text-[1.08rem] md:leading-[1.76] break-keep md:mt-0">
          {item.paragraph}
        </p>
        <div className="order-3 mt-4 md:mt-0">
          {otherLinks?.length ? (
            <div className="mt-4 flex flex-wrap gap-4 text-[0.8rem] uppercase text-white md:text-[0.86rem]">
              {otherLinks.map((link) => (
                <ExternalLink key={link.label} link={link} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

/** How many cards deep a card may sink before it stops shrinking further. */
const STACK_MAX_DEPTH = 3;

/**
 * Drives the sticky card stack: each card reports how far it has been covered by
 * the card after it, and the accumulated depth is written to `--stack-depth` so
 * CSS can shrink and shade the layers underneath.
 */
function useCardStack(reduce: boolean) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (reduce || !list) {
      return;
    }

    let items: HTMLElement[] = [];
    let metrics: {stickyTop: number; height: number}[] = [];
    let frame = 0;

    const measure = () => {
      items = Array.from(list.querySelectorAll<HTMLElement>(".scroll-stack-item"));
      metrics = items.map((item) => ({
        stickyTop: Number.parseFloat(window.getComputedStyle(item).top) || 0,
        height: (item.querySelector<HTMLElement>(".scroll-stack-inner") ?? item).offsetHeight
      }));

      // A sticky card unpins once `stickyTop + boxHeight` no longer fits above the
      // list's bottom edge. Cards differ in height, so without this padding the
      // tallest one would tear off the stack first.
      const release = metrics.map(({stickyTop, height}) => stickyTop + height);
      const latest = Math.max(...release, 0);
      items.forEach((item, index) => {
        item.style.setProperty("--stack-tail", `${Math.round(latest - release[index])}px`);
      });
    };

    const apply = () => {
      frame = 0;

      const covered = new Array<number>(items.length).fill(0);
      for (let index = 0; index < items.length - 1; index += 1) {
        const {stickyTop, height} = metrics[index];
        // The next card starts covering this one once its top passes this card's
        // bottom, and finishes once it settles on its own sticky offset.
        const span = height - (metrics[index + 1].stickyTop - stickyTop);
        if (span <= 0) {
          continue;
        }

        const nextTop = items[index + 1].getBoundingClientRect().top;
        const ratio = (stickyTop + height - nextTop) / span;
        covered[index] = Math.min(Math.max(ratio, 0), 1);
      }

      let depth = 0;
      for (let index = items.length - 1; index >= 0; index -= 1) {
        depth += covered[index];
        items[index].style.setProperty(
          "--stack-depth",
          Math.min(depth, STACK_MAX_DEPTH).toFixed(3)
        );
      }
    };

    const schedule = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(apply);
      }
    };

    const remeasure = () => {
      measure();
      schedule();
    };

    measure();
    apply();

    window.addEventListener("scroll", schedule, {passive: true});
    window.addEventListener("resize", remeasure);

    const observer = new ResizeObserver(remeasure);
    observer.observe(list);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", remeasure);
      observer.disconnect();
      items.forEach((item) => {
        item.style.removeProperty("--stack-depth");
        item.style.removeProperty("--stack-tail");
      });
    };
  }, [reduce]);

  return listRef;
}

function StackCardItem({
  children,
  index,
  reduce
}: {
  children: ReactNode;
  index: number;
  reduce: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (reduce) {
      return;
    }

    const node = ref.current;
    if (!node) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      const id = setTimeout(() => setIsVisible(true), 0);
      return () => clearTimeout(id);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {rootMargin: "0px 0px -6% 0px", threshold: 0.08}
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [reduce]);

  if (reduce) {
    return <div className="scroll-stack-item scroll-stack-item--static">{children}</div>;
  }

  return (
    <div
      className="scroll-stack-item"
      ref={ref}
      style={{zIndex: index + 1, "--stack-index": index} as React.CSSProperties}
    >
      <div className={`scroll-stack-enter ${isVisible ? "is-visible" : ""}`}>
        <div className="scroll-stack-inner">{children}</div>
      </div>
    </div>
  );
}

export function WorkSection({
  eyebrow,
  items
}: {
  eyebrow: string;
  items: LocalizedWorkEntry[];
  pauseVH?: number;
}) {
  const filled = items.filter(isFilledEntry);
  const reduce = usePrefersReducedMotion();
  const listRef = useCardStack(reduce);

  return (
    <Section className="work-list-section" eyebrow={eyebrow} animateContent={false}>
      <div className="work-card-list scroll-stack-list" ref={listRef}>
        {filled.map((item, idx) => (
          <StackCardItem
            index={idx}
            key={`${item.company}-${item.dates}`}
            reduce={reduce}
          >
            <WorkItem
              item={item}
              colorValue={WORK_CARD_COLORS[idx % WORK_CARD_COLORS.length]}
            />
          </StackCardItem>
        ))}
        {reduce ? null : <div aria-hidden="true" className="scroll-stack-spacer" />}
      </div>
    </Section>
  );
}

type FilledProjectEntry = Extract<LocalizedProjectEntry, {status: "filled"}>;

function ProjectScreenshotPreview({
  title,
  images,
  className,
  animateOnMount = false,
  imageFit = "contain"
}: {
  title: string;
  images: NonNullable<FilledProjectEntry["previewImages"]>;
  className?: string;
  animateOnMount?: boolean;
  imageFit?: "cover" | "contain";
}) {
  const hasPlayedRef = useRef(false);
  const [hasPlayed, setHasPlayed] = useState(animateOnMount);

  useEffect(() => {
    if (animateOnMount && !hasPlayedRef.current) {
      hasPlayedRef.current = true;
      const id = setTimeout(() => setHasPlayed(true), 0);
      return () => clearTimeout(id);
    }
  }, [animateOnMount]);

  if (!images.length) {
    return null;
  }

  return (
    <motion.div
      className={`clearsplit-showcase overflow-hidden rounded-[26px] ${className ?? "mt-6"}`}
      style={{
        "--preview-ratio": images[0].width / images[0].height,
        aspectRatio: `${images[0].width} / ${images[0].height}`
      } as React.CSSProperties}
      initial={{opacity: 0, y: 20}}
      animate={hasPlayed ? {opacity: 1, y: 0} : {opacity: 0, y: 20}}
      transition={{duration: 0.72, delay: 0.22, ease: [0.22, 1, 0.36, 1]}}
    >
      <div aria-label={`${title} app screenshots`} className="clearsplit-showcase-stage">
        <Image
          alt={images[0].alt}
          className={`project-preview-image ${imageFit === "contain" ? "project-preview-image-contain" : ""}`}
          fill
          priority
          sizes="(max-width: 768px) 84vw, 720px"
          src={images[0].src}
        />
      </div>
    </motion.div>
  );
}

function ProjectItem({item, colorValue}: {item: FilledProjectEntry; colorValue: string}) {
  const previewLinks = item.links?.filter(isPdfLink);
  const githubLink = item.links?.find((link) => !isPdfLink(link) && isGitHubRepoLink(link));
  const prLink = item.links?.find((link) => !isPdfLink(link) && isGitHubPullRequestLink(link));
  const otherLinks = item.links?.filter(
    (link) => !isPdfLink(link) && !isGitHubRepoLink(link) && !isGitHubPullRequestLink(link)
  );

  const hasLeftActions = !!(githubLink?.href || prLink?.href || previewLinks?.length);
  const isDenseProject =
    item.title === "SharedComputing" ||
    item.title === "Pyrefly (Meta) contribution";

  return (
    <article
      className={`project-card card-colored liquid-card group grid gap-5 rounded-[28px] p-6 transition duration-300 md:grid-cols-[minmax(0,280px)_1fr] md:gap-8 md:p-9 ${isDenseProject ? "project-card-dense" : ""}`}
      style={{"--card-color": colorValue} as React.CSSProperties}
    >
      {/* Left column */}
      <div className="border-b border-white/20 pb-3 md:flex md:h-full md:flex-col md:border-b-0 md:border-r md:pb-0 md:pr-7">
        <div className="min-w-0">
          <h2 className="card-title-glass font-display text-[1.5rem] font-medium leading-tight text-white transition-colors duration-200 group-hover:text-white/80 md:text-[1.82rem] break-keep">
            {item.title}
          </h2>
        </div>
        <div className="project-card-actions pt-4 md:pt-5 flex flex-wrap items-center gap-2.5 md:items-start md:gap-3">
          <div className="project-tech-stack card-glass-pane rounded-md px-3.5 py-2 !mt-0">
            {item.tech.map((tech) => (
              <TechIcon key={tech} name={tech} />
            ))}
          </div>
          {hasLeftActions ? (
            <div className="project-left-actions !mt-0">
              {githubLink ? (
                <GitHubButton fallbackAriaLabel={`${item.title} GitHub repository`} link={githubLink} />
              ) : null}
              {prLink ? (
                <GitHubButton fallbackAriaLabel={`${item.title} pull request on GitHub`} link={prLink} />
              ) : null}
              {previewLinks?.map((link) => (
                <PdfButton key={link.label} link={link} fallbackAriaLabel={`${item.title} PDF presentation`} />
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* Right column */}
      <div className="project-card-body min-w-0 flex flex-col h-full md:justify-center">
        {item.previewImages?.length ? (
          <ProjectScreenshotPreview animateOnMount className="order-1 mb-4 mt-0 md:mb-6" images={item.previewImages} title={item.title} />
        ) : null}
        {previewLinks?.map((link) => (
          <div key={link.label} className="order-1 mb-4 mt-0 md:mb-6">
            <PresentationPreview link={link} />
          </div>
        ))}
        <p className="project-description order-2 font-body text-[0.94rem] leading-[1.7] text-white/90 md:text-[1.08rem] md:leading-[1.76] break-keep md:mt-0">
          {item.description}
        </p>
        <div className="order-3 mt-4 md:mt-0">
          {otherLinks?.length ? (
            <div className="mt-4 flex flex-wrap gap-4 text-[0.8rem] uppercase text-white md:text-[0.86rem]">
              {otherLinks.map((link) => (
                <ExternalLink key={link.label} link={link} />
              ))}
            </div>
          ) : null}
        </div>
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
  const reduce = usePrefersReducedMotion();
  const listRef = useCardStack(reduce);

  return (
    <Section className="projects-list-section" eyebrow={eyebrow} animateContent={false}>
      <div className="project-card-list scroll-stack-list" ref={listRef}>
        {filled.map((item, idx) => (
          <StackCardItem
            index={idx}
            key={item.title}
            reduce={reduce}
          >
            <ProjectItem
              item={item}
              colorValue={PROJECT_CARD_COLORS[idx % PROJECT_CARD_COLORS.length]}
            />
          </StackCardItem>
        ))}
        {reduce ? null : <div aria-hidden="true" className="scroll-stack-spacer" />}
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
  return (
    <footer className="border-t border-fg/20 bg-transparent">
      <div className="w-full px-[clamp(1.25rem,4vw,2rem)] py-[clamp(0.6rem,1.5vw,1rem)] flex items-center justify-between gap-4">
        <p className="text-[clamp(0.85rem,1.6vw,1.05rem)] leading-tight text-fg/70 whitespace-nowrap">
          {content.line1}
        </p>
        <Image
          src="/signatureupdated.png"
          alt="Yeongseok Lim signature"
          width={300}
          height={120}
          className="h-[clamp(3.5rem,6vw,5.5rem)] w-auto object-contain object-right opacity-80 filter brightness-0 -mr-[clamp(0.5rem,2vw,1.5rem)]"
        />
      </div>
    </footer>
  );
}
