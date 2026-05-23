import {sectionEyebrows, hero} from "./hero";
import {footer, seo} from "./meta";
import {notes} from "./notes";
import {projects} from "./projects";
import {skills} from "./skills";
import type {
  Bilingual,
  Locale,
  LocalizedOptionalLink,
  LocalizedPortfolioContent,
  RawPortfolioContent
} from "./types";
import {work} from "./work";

const rawContent = {
  sectionEyebrows,
  hero,
  work,
  projects,
  notes,
  skills,
  footer,
  seo
} satisfies RawPortfolioContent;

const text = (value: Bilingual, locale: Locale) => value[locale];

const localizeHref = (href: string | Bilingual | undefined, locale: Locale) => {
  if (!href) return undefined;
  if (typeof href === "string") return href;
  return href[locale];
};

const localizeLinks = (
  links: RawPortfolioContent["hero"]["links"],
  locale: Locale
): LocalizedOptionalLink[] =>
  links.map((link) => ({
    label: text(link.label, locale),
    href: localizeHref(link.href, locale),
    external: link.external,
    ariaLabel: link.ariaLabel ? text(link.ariaLabel, locale) : undefined
  }));

const buildDate = () =>
  process.env.NEXT_PUBLIC_BUILD_DATE ?? new Date().toISOString().slice(0, 10);

export function getRawPortfolioContent(): RawPortfolioContent {
  return rawContent;
}

export function getPortfolioContent(
  locale: Locale
): LocalizedPortfolioContent {
  const date = buildDate();

  return {
    sectionEyebrows: {
      work: text(rawContent.sectionEyebrows.work, locale),
      projects: text(rawContent.sectionEyebrows.projects, locale),
      notes: text(rawContent.sectionEyebrows.notes, locale),
      skills: text(rawContent.sectionEyebrows.skills, locale)
    },
    hero: {
      eyebrow: text(rawContent.hero.eyebrow, locale),
      headline: {
        name: text(rawContent.hero.headline.name, locale),
        before: text(rawContent.hero.headline.before, locale),
        italic: text(rawContent.hero.headline.italic, locale),
        after: text(rawContent.hero.headline.after, locale)
      },
      subline: text(rawContent.hero.subline, locale),
      image: {
        src: rawContent.hero.image.src,
        alt: text(rawContent.hero.image.alt, locale),
        width: rawContent.hero.image.width,
        height: rawContent.hero.image.height
      },
      links: localizeLinks(rawContent.hero.links, locale)
    },
    work: rawContent.work.map((entry) =>
      entry.status === "empty"
        ? entry
        : {
            status: "filled",
            company: entry.company,
            companyUrl: entry.companyUrl,
            dates: entry.dates,
            location: text(entry.location, locale),
            role: text(entry.role, locale),
            paragraph: text(entry.paragraph, locale),
            highlights: entry.highlights?.map((highlight) => text(highlight, locale)),
            photos: entry.photos?.map((photo) => ({
              src: photo.src,
              alt: text(photo.alt, locale),
              width: photo.width,
              height: photo.height
            })),
            links: entry.links ? localizeLinks(entry.links, locale) : undefined
          }
    ),
    projects: rawContent.projects.map((entry) =>
      entry.status === "empty"
        ? entry
        : {
            status: "filled",
            title: entry.title,
            kindDate: entry.kindDate,
            description: text(entry.description, locale),
            tech: entry.tech,
            links: entry.links ? localizeLinks(entry.links, locale) : undefined
          }
    ),
    notes: {
      intro: text(rawContent.notes.intro, locale),
      items: rawContent.notes.items.map((note) => ({
        title: text(note.title, locale),
        date: note.date,
        tag: note.tag,
        body: text(note.body, locale)
      }))
    },
    skills: rawContent.skills.map((skill) => ({
      title: text(skill.title, locale),
      body: text(skill.body, locale)
    })),
    footer: {
      line1: text(rawContent.footer.line1, locale).replace("{buildDate}", date),
      line2: rawContent.footer.line2
    },
    seo: {
      title: text(rawContent.seo.title, locale),
      description: text(rawContent.seo.description, locale),
      person: {
        name: text(rawContent.seo.person.name, locale),
        email: rawContent.seo.person.email,
        location: rawContent.seo.person.location,
        githubUrl: rawContent.seo.person.githubUrl,
        linkedInUrl: rawContent.seo.person.linkedInUrl,
        resumeUrl: rawContent.seo.person.resumeUrl
      }
    }
  };
}

export type {
  LocalizedNoteEntry,
  Locale,
  LocalizedOptionalLink,
  LocalizedPortfolioContent,
  LocalizedProjectEntry,
  LocalizedWorkEntry
} from "./types";
