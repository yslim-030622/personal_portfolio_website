import type {RawPortfolioContent} from "./types";

export const sectionEyebrows = {
  work: {en: "01 — Work Experience", ko: "01 — 주요 경력"},
  projects: {en: "02 — Projects", ko: "02 — 프로젝트"},
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
    en: "Hi! My full name is Yeongseok Lim but you can call me Eddie :) I was born in South Korea, continued my education in the U.S. starting in high school. I recently graduated from the University of Wisconsin-Madison with a degree in Computer Science. I'm interested in backend systems and AI, and this site is where I document what I build. I'm exploring new career opportunities where I can apply the skills I've developed. Let's stay connected!",
    ko: "저는 한국에서 태어나 미국에서 고등학교부터 재학했고, 최근 위스콘신 대학교에서 컴퓨터 과학 전공으로 졸업했습니다. 요즘은 특히 백엔드 시스템과 인공지능에 관심이 많고, 이 웹사이트는 제가 만든 것과 그에 관한 느낀 점들을 정리하는 공간입니다. 현재는 제가 보유한 역량을 바탕으로 구직 중입니다. 아래 연락처로 연락주신다면 답장 드리겠습니다!"
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
