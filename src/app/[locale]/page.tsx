import {getPortfolioContent, type Locale} from "@/content";
import {Hero} from "@/components/hero";
import {Navigation} from "@/components/navigation";
import {ContinuousScroll} from "@/components/continuous-scroll";
import {
  Footer,
  ProjectsSection,
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
        <div className="md:h-[100svh]">
          <div className="hero-section-bg md:sticky md:top-0 md:h-[100svh]">
            <Hero content={content.hero} locale={locale} />
          </div>
        </div>
      ),
    },
    {
      id: "work",
      label: "주요 경력",
      navTitle: content.sectionEyebrows.work,
      content: (
        <div className="work-section-bg">
          <WorkSection eyebrow={content.sectionEyebrows.work} items={content.work} pauseVH={45} />
        </div>
      ),
    },
    {
      id: "projects",
      label: "프로젝트",
      navTitle: content.sectionEyebrows.projects,
      content: (
        <div className="projects-section-bg pb-8 md:pb-20">
          <ProjectsSection
            eyebrow={content.sectionEyebrows.projects}
            items={content.projects}
          />
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
