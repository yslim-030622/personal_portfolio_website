import type {RawProjectEntry} from "./types";

const projectLinks = [
  {label: {en: "github", ko: "github"}},
  {label: {en: "live", ko: "live"}}
];

export const projects: RawProjectEntry[] = [
  {
    status: "filled",
    title: "ClearSplit",
    kindDate: "Backend · 2025–2026",
    description: {
      en: "I built ClearSplit from a real roommate problem: one person would pay first, then everyone had to trust the math when splitting the cost later.",
      ko: "ClearSplit은 룸메이트와 살면서 겪은 실제 정산 문제에서 시작했습니다. 한 사람이 먼저 결제하고 나중에 비용을 나눌 때, 계산을 그냥 믿어야 하는 경우가 많았습니다."
    },
    highlights: [
      {
        en: "Built a FastAPI backend with OCR receipt parsing, item assignment, and balance calculation.",
        ko: "FastAPI 백엔드에서 OCR 영수증 파싱, 항목별 할당, 정산 금액 계산을 구현했습니다."
      },
      {
        en: "Used PostgreSQL, Redis, and Celery to handle stored receipts and background processing.",
        ko: "PostgreSQL, Redis, Celery를 사용해 영수증 저장과 백그라운드 처리를 구성했습니다."
      }
    ],
    tech: ["Python", "Swift", "FastAPI", "PostgreSQL", "Redis", "Docker"],
    links: projectLinks
  },
  {
    status: "filled",
    title: "Canvas Assistant",
    kindDate: "AI Tooling · 2026",
    description: {
      en: "A Chrome Extension that adds reminders, notifications, and assignment management on top of Canvas LMS.",
      ko: "Canvas LMS에 리마인더, 알림, 과제 관리 기능을 추가하는 Chrome Extension입니다."
    },
    highlights: [
      {
        en: "Implemented real-time integration between the Spring Boot backend and the extension.",
        ko: "Spring Boot 백엔드와 Extension이 실시간으로 연동되는 구조를 구현했습니다."
      },
      {
        en: "As PO, managed the backlog and sprints for a six-person team; as a developer, built the reminder system, backend, extension UI, and unit tests.",
        ko: "PO로 6인 팀의 백로그와 스프린트를 관리했고, 개발자로서는 리마인더 시스템 설계, 백엔드, Extension UI, 단위 테스트를 구현했습니다."
      }
    ],
    tech: ["TypeScript", "Canvas API", "Automation"],
    links: [
      ...projectLinks,
      {
        label: {en: "portfolio preview", ko: "포트폴리오 미리보기"},
        href: "/docs/canvas-assistant-final-demo.pdf",
        external: true,
        ariaLabel: {
          en: "Preview Canvas Assistant final demo presentation PDF",
          ko: "Canvas Assistant 최종 데모 발표 자료 PDF 미리보기"
        }
      }
    ]
  },
  {
    status: "filled",
    title: "Pyrefly (Meta) contribution",
    kindDate: "Open Source · 2026",
    description: {
      en: "Contributed to Meta's open-source Python type checker, Pyrefly, by improving code search results so they better surface the actual implementation location. I worked on an assigned issue, submitted a PR, and had it reviewed and merged.",
      ko: "Meta의 오픈소스 Python 타입 체커 Pyrefly에서, 코드 검색 결과가 실제 구현 위치를 더 잘 보여주도록 개선한 이슈를 맡아 PR을 올렸고 리뷰 후 머지되었습니다."
    },
    tech: ["Rust", "Python", "Type Checking", "Open Source"],
    links: [
      {
        label: {en: "facebook/pyrefly#2899", ko: "facebook/pyrefly#2899"},
        href: "https://github.com/facebook/pyrefly/pull/2899",
        external: true,
        ariaLabel: {
          en: "Pyrefly pull request 2899 on GitHub",
          ko: "GitHub의 Pyrefly pull request 2899"
        }
      }
    ]
  },
  {
    status: "empty",
    note: "Reserved for future work. Do not render visually."
  }
] satisfies RawProjectEntry[];
