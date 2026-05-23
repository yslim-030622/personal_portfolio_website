import type {RawPortfolioContent} from "./types";

export const footer = {
  line1: {
    en: "Designed and built in Madison. Last updated {buildDate}.",
    ko: "매디슨에서 디자인하고 만듦. 마지막 업데이트 {buildDate}."
  },
  line2: "ylim76@wisc.edu · linkedin · github"
} satisfies RawPortfolioContent["footer"];

export const seo = {
  title: {
    en: "Yeongseok Lim — Software Engineer",
    ko: "임영석 — 소프트웨어 엔지니어"
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
    githubUrl: "https://github.com/ylim76",
    linkedInUrl: "https://www.linkedin.com/in/yeongseok-lim",
    resumeUrl: "/resume.pdf"
  }
} satisfies RawPortfolioContent["seo"];
