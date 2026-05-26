import type {RawProjectEntry} from "./types";

const projectLinks = [
  {label: {en: "github", ko: "github"}}
];

const clearSplitLinks = [
  {
    label: {en: "github", ko: "github"},
    href: "https://github.com/yslim-030622/ClearSplit",
    external: true,
    ariaLabel: {
      en: "ClearSplit GitHub repository",
      ko: "ClearSplit GitHub 저장소"
    }
  }
];

export const projects: RawProjectEntry[] = [
  {
    status: "filled",
    title: "ClearSplit",
    kindDate: "Full Stack · 2025–2026",
    description: {
      en: "Living with roommates in college meant a lot of grocery runs and group dinners. Every time we split the bill, one person did the math and everyone else just had to trust it. Mistakes happened and there was no easy way to catch them. I built ClearSplit so anyone in the group can upload a receipt, see exactly which items they're being charged for, and settle up without the guesswork.",
      ko: "대학 생활을 하면서 룸메이트들과 함께 장을 보거나 외식을 하는 일이 잦았는데, 비용을 나눌 때마다 한 명이 계산하고 나머지는 그냥 믿는 상황이 종종 있었습니다. 실수가 생겨도 확인할 방법이 없고, 맞아도 찜찜한 게 남았습니다. 영수증을 찍으면 항목별로 자동 인식해 각자가 정확히 얼마를 내야 하는지, 그 이유까지 투명하게 보여주는 앱을 만들었습니다."
    },
    highlights: [
      {
        en: "Backend handles OCR receipt parsing, per-item cost splitting, and balance settlement using FastAPI.",
        ko: "FastAPI 백엔드에서 OCR 영수증 파싱, 항목별 금액 분배, 정산 계산을 구현했습니다."
      },
      {
        en: "PostgreSQL, Redis, and Celery power data storage and async background processing.",
        ko: "PostgreSQL, Redis, Celery를 사용해 데이터 저장과 비동기 처리를 구성했습니다."
      },
      {
        en: "Deployed on Azure with a native iOS client built in SwiftUI.",
        ko: "백엔드는 Azure에 배포되어 있으며, iOS 앱과 연동됩니다."
      }
    ],
    tech: ["Python", "Swift", "FastAPI", "PostgreSQL", "Redis", "Docker"],
    links: clearSplitLinks
  },
  {
    status: "filled",
    title: "Canvas Assistant",
    kindDate: "Group Project · 2026",
    description: {
      en: "A Chrome Extension that helps students manage reminders, tasks, and assignment information directly inside Canvas LMS. I connected the Spring Boot backend with the Extension UI to build a productivity tool that works within the Canvas page.",
      ko: "Canvas LMS 위에서 리마인더, 할 일 관리, 과제 정보를 더 쉽게 확인할 수 있도록 만든 Chrome Extension입니다. Spring Boot 백엔드와 Extension UI를 연결해 Canvas 화면 안에서 바로 사용할 수 있는 생산성 도구를 구현했습니다."
    },
    highlights: [
      {
        en: "Managed the backlog and sprint progress as Product Owner for a 6-person team.",
        ko: "Product Owner로 6인 팀의 백로그와 스프린트 진행을 관리했습니다."
      },
      {
        en: "Built the reminder backend API, active reminder retrieval, dismiss flow, and Extension banner UI.",
        ko: "리마인더 백엔드 API, 알림 조회, dismiss flow, Extension 배너 UI를 구현했습니다."
      },
      {
        en: "Used the Canvas API token to fetch assignment data and connect it with deadline-based reminders.",
        ko: "Canvas API 토큰을 활용해 과제 데이터를 가져오고, 마감일 기반 알림 기능과 연결했습니다."
      },
      {
        en: "Integrated and tested features across Spring Boot, MySQL, Chrome Extension, and Docker.",
        ko: "Spring Boot, MySQL, Chrome Extension, Docker 환경에서 기능을 통합하고 테스트했습니다."
      }
    ],
    tech: ["TypeScript", "Spring Boot", "MySQL", "Canvas API", "Docker", "GitLab CI"],
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
    title: "Systems Programming Portfolio",
    kindDate: "Systems · 2025",
    description: {
      en: "A systems programming portfolio built around core operating system concepts. I implemented a shell for running commands, a filesystem for storing and managing files, a scheduler for choosing which program runs next, and synchronization logic for safely sharing data across threads.",
      ko: "운영체제의 핵심 기능을 직접 만들어 보며 정리한 시스템 프로그래밍 프로젝트입니다. 명령어를 실행하는 셸, 파일을 저장하고 관리하는 파일시스템, 여러 프로그램의 실행 순서를 정하는 스케줄러, 여러 스레드가 안전하게 데이터를 공유하게 하는 동기화 기능을 C로 구현했습니다."
    },
    highlights: [
      {
        en: "Built a Unix shell, FUSE filesystem, xv6 scheduler, and thread synchronization primitives.",
        ko: "유닉스 셸, FUSE 파일시스템, xv6 스케줄러, 스레드 동기화 기능을 구현했습니다."
      },
      {
        en: "Worked directly with OS concepts such as process execution, pipelines, inodes, block allocation, STCF scheduling, and reader-writer locks.",
        ko: "프로세스 실행, 파이프라인, 아이노드, 블록 할당, STCF 스케줄링, reader-writer lock 같은 운영체제 개념을 코드로 다뤘습니다."
      },
      {
        en: "Focused on the lower-level systems that support application behavior, including execution, storage, scheduling, and shared data access.",
        ko: "사용자에게 보이는 앱 기능보다 그 아래에서 동작하는 실행 환경과 데이터 관리 구조를 이해하는 데 집중했습니다."
      }
    ],
    tech: ["C"],
    links: [
      {
        label: {en: "github", ko: "github"},
        href: "https://github.com/yslim-030622/systems-programming-portfolio",
        external: true,
        ariaLabel: {
          en: "Systems Programming Portfolio GitHub repository",
          ko: "Systems Programming Portfolio GitHub 저장소"
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
        label: {en: "Link to PR", ko: "PR 링크 바로가기"},
        href: "https://github.com/facebook/pyrefly/pull/2899",
        external: true,
        ariaLabel: {
          en: "Link to Pyrefly pull request 2899 on GitHub",
          ko: "GitHub의 Pyrefly pull request 2899 바로가기"
        }
      }
    ]
  }
] satisfies RawProjectEntry[];
