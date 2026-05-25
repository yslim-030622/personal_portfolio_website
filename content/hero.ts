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
      en: "Hello, I'm\n",
      ko: "안녕하세요,\n"
    },
    italic: {
      en: "Yeongseok",
      ko: "임영석"
    },
    after: {
      en: " 👋",
      ko: "입니다 👋"
    }
  },
  subline: {
    en: "Hi, I'm Yeongseok Lim. I was born in Korea and recently graduated from UW⁠–⁠Madison with a degree in Computer Science. I'm interested in backend systems and AI, and I'm actively looking for new opportunities. This site is where I document what I build — let's stay connected!",
    ko: "안녕하세요! 임영석입니다. 한국에서 태어나 미국에서 고등학교부터 학업을 이어왔고, 최근 위스콘신 대학교에서 컴퓨터 과학 전공으로 졸업했습니다. 백엔드 시스템과 인공지능에 관심이 많고, 현재 직업 기회를 찾고 있습니다! 이 웹사이트는 제가 만든 것들을 정리하는 공간입니다. 편하게 연락 주세요!"
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
