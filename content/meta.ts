import type {RawPortfolioContent} from "./types";

export const footer = {
  line1: {
    en: "Thanks for visiting!",
    ko: "방문해주셔서 감사합니다!"
  },
  line2: "yeongseoklim@lgcns.com · linkedin · github"
} satisfies RawPortfolioContent["footer"];

export const seo = {
  title: {
    en: "Yeongseok's Portfolio",
    ko: "Yeongseok's Portfolio"
  },
  description: {
    en: "AX Engineer at LG CNS. Backend systems, applied ML, security tooling. Previously at Fasoo and MoDoc AI.",
    ko: "LG CNS AX Engineer. 백엔드 시스템, 응용 ML, 보안 도구. Fasoo와 MoDoc AI에서 일했습니다."
  },
  person: {
    name: {
      en: "Yeongseok Lim",
      ko: "임영석"
    },
    email: "yeongseoklim@lgcns.com",
    location: "Seoul, South Korea",
    githubUrl: "https://github.com/yslim-030622",
    linkedInUrl: "https://www.linkedin.com/in/yeongseok-lim",
    resumeUrl: "/Yeongseok_Lim_resume.pdf"
  }
} satisfies RawPortfolioContent["seo"];
