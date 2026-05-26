import {getPortfolioContent, type Locale} from "@/content";
import {Hero} from "@/components/hero";
import {Navigation} from "@/components/navigation";
import {FullPageScroll} from "@/components/full-page-scroll";
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
        <div className="h-[100svh] bg-bg">
          <Hero content={content.hero} />
        </div>
      ),
    },
    {
      id: "work",
      label: "주요 경력",
      content: (
        <WorkSection eyebrow={content.sectionEyebrows.work} items={content.work} />
      ),
    },
    {
      id: "projects",
      label: "프로젝트",
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
      <Navigation />
      <FullPageScroll sections={sections} />
    </>
  );
}
