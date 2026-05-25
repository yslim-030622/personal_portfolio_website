import {getPortfolioContent, type Locale} from "@/content";
import {Hero} from "@/components/hero";
import {LenisProvider} from "@/components/lenis-provider";
import {Navigation} from "@/components/navigation";
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

  return (
    <>
      <LenisProvider />
      <Navigation />
      {/* Hero pinned — sections slide over it as a card (desktop only) */}
      <div className="lg:h-[100svh]">
        <div className="lg:sticky lg:top-0 lg:h-[100svh] lg:overflow-hidden">
          <Hero content={content.hero} />
        </div>
      </div>
      <main className="relative z-10 rounded-t-[24px] bg-bg shadow-[0_-8px_48px_rgba(0,0,0,0.18)]">
        <WorkSection eyebrow={content.sectionEyebrows.work} items={content.work} />
        <ProjectsSection
          eyebrow={content.sectionEyebrows.projects}
          items={content.projects}
        />
        <NotesSection
          eyebrow={content.sectionEyebrows.notes}
          intro={content.notes.intro}
          items={content.notes.items}
        />
        <SkillsSection
          eyebrow={content.sectionEyebrows.skills}
          items={content.skills}
        />
      </main>
      <Footer content={content.footer} />
    </>
  );
}
