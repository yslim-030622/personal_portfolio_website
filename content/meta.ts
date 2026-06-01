import type {RawPortfolioContent} from "./types";

export const footer = {
  line1: {
    en: "Thanks for visiting!",
    ko: "방문해주셔서 감사합니다!"
  },
  line2: "ylim76@wisc.edu · linkedin · github"
} satisfies RawPortfolioContent["footer"];

export const seo = {
  title: {
    en: "Yeongseok's Portfolio",
    ko: "Yeongseok's Portfolio"
  },
  description: {
    en: "CS senior at UW–Madison. Backend systems, applied ML, security tooling. Previously at Fasoo and MoDoc AI.",
    ko: "위스콘신 매디슨 대학교 CS 졸업반. 백엔드 시스템, 응용 ML, 보안 도구. Fasoo와 MoDoc AI에서 일했습니다."
  },
  person: {
    name: {
      en: "Yeongseok Lim",
      ko: "임영석"
    },
    email: "ylim76@wisc.edu",
    location: "Madison, WI",
    githubUrl: "https://github.com/yslim-030622",
    linkedInUrl: "https://www.linkedin.com/in/yeongseok-lim",
    resumeUrl: "/resume.pdf"
  }
} satisfies RawPortfolioContent["seo"];
