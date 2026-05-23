import type {RawPortfolioContent} from "./types";

export const sectionEyebrows = {
  work: {en: "01 — Selected Work", ko: "01 — 주요 경력"},
  projects: {en: "02 — Projects", ko: "02 — 만든 것들"},
  notes: {en: "03 — Coursework", ko: "03 — 수강 과목"},
  skills: {en: "04 — Tools", ko: "04 — 자주 쓰는 도구들"}
} satisfies RawPortfolioContent["sectionEyebrows"];

export const hero = {
  eyebrow: {
    en: "MADISON, WI · AVAILABLE MAY 2026",
    ko: "매디슨, 위스콘신 · 2026년 5월부터 가능"
  },
  headline: {
    name: {
      en: "Yeongseok Lim",
      ko: "임영석"
    },
    before: {
      en: "Software engineer building ",
      ko: ""
    },
    italic: {
      en: "reliable",
      ko: "안정적인"
    },
    after: {
      en: " systems.",
      ko: " 시스템을 만드는 소프트웨어 엔지니어입니다."
    }
  },
  subline: {
    en: "Hi, I\u2019m Yeongseok Lim. I was born in Korea and recently graduated from UW\u2060\u2013\u2060Madison with a degree in\u00a0Computer\u00a0Science. I\u2019m interested in backend systems and practical\u00a0AI\u00a0workflows, and I\u2019m now developing FeverCoach workflow automation at\u00a0MoDoc\u00a0AI.",
    ko: "안녕하세요, 임영석입니다. 한국에서 태어났고 최근 UW\u2060\u2013\u2060Madison에서 Computer\u00a0Science 전공으로 졸업했습니다. 백엔드 시스템과 실무형 AI\u00a0워크플로에 관심이 많고, 현재는 MoDoc\u00a0AI에서 FeverCoach 자동화 워크플로를 개발하고 있습니다."
  },
  image: {
    src: "/photo1.jpg",
    alt: {
      en: "Yeongseok Lim in graduation regalia on the UW–Madison campus",
      ko: "위스콘신 매디슨 캠퍼스에서 졸업 가운을 입은 임영석"
    },
    width: 1800,
    height: 1350
  },
  links: [
    {
      label: {en: "email", ko: "email"},
      href: "mailto:ylim76@wisc.edu",
      ariaLabel: {en: "Email Yeongseok Lim", ko: "임영석에게 이메일 보내기"}
    },
    {
      label: {en: "github", ko: "github"},
      href: "https://github.com/ylim76",
      external: true,
      ariaLabel: {en: "GitHub profile", ko: "GitHub 프로필"}
    },
    {
      label: {en: "linkedin", ko: "linkedin"},
      href: "https://www.linkedin.com/in/yeongseok-lim",
      external: true,
      ariaLabel: {en: "LinkedIn profile", ko: "LinkedIn 프로필"}
    },
    {
      label: {en: "resume.pdf", ko: "resume.pdf"},
      ariaLabel: {en: "Resume PDF", ko: "이력서 PDF"}
    }
  ]
} satisfies RawPortfolioContent["hero"];
