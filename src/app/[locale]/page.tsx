import {getPortfolioContent, type Locale} from "@/content";
import {Hero} from "@/components/hero";
import {Navigation} from "@/components/navigation";
import {ContinuousScroll} from "@/components/continuous-scroll";
import {
  Footer,
  NotesSection,
  ProjectsSection,
  SkillsSection,
  WorkSection
} from "@/components/sections";
import {hasLocale} from "next-intl";
import {setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";
import {routing} from "@/i18n/routing";

type PageProps = {
  params: Promise<{locale: string}>;
};

function assertLocale(locale: string): Locale {
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return locale;
}

export default async function Page({params}: PageProps) {
  const {locale: rawLocale} = await params;
  const locale = assertLocale(rawLocale);
  setRequestLocale(locale);
  const content = getPortfolioContent(locale);

  const sections = [
    {
      id: "hero",
      label: "소개",
      content: (
        <div className="h-[250svh] bg-bg">
          <div className="sticky top-0 h-[100svh]">
            <Hero content={content.hero} />
          </div>
        </div>
      ),
    },
    {
      id: "work",
      label: "주요 경력",
      navTitle: content.sectionEyebrows.work,
      content: (
        <WorkSection eyebrow={content.sectionEyebrows.work} items={content.work} />
      ),
    },
    {
      id: "projects",
      label: "프로젝트",
      navTitle: content.sectionEyebrows.projects,
      content: (
        <ProjectsSection
          eyebrow={content.sectionEyebrows.projects}
          items={content.projects}
        />
      ),
    },
    {
      id: "notes",
      label: "노트",
      navTitle: content.sectionEyebrows.notes,
      content: (
        <div className="min-h-[100svh] bg-bg pt-16 md:pt-20">
          <NotesSection
            eyebrow={content.sectionEyebrows.notes}
            intro={content.notes.intro}
            items={content.notes.items}
          />
        </div>
      ),
    },
    {
      id: "skills",
      label: "기술",
      navTitle: content.sectionEyebrows.skills,
      content: (
        <div className="min-h-[100svh] bg-bg pt-16 md:pt-20">
          <SkillsSection eyebrow={content.sectionEyebrows.skills} items={content.skills} />
          <Footer content={content.footer} />
        </div>
      ),
    },
  ];

  return (
    <>
      <Navigation sectionTitles={sections.map((section) => section.navTitle)} />
      <ContinuousScroll sections={sections} />
    </>
  );
}
