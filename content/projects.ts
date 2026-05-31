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
    kindDate: "Full Stack Project · 2025–2026",
    description: {
      en: "ClearSplit is an iOS app I developed to solve expense splitting problems with my roommate during college. I especially put a lot of effort into building the backend structure for this app. This is one of my favorite projects, please visit my GitHub!",
      ko: "Clearsplit은 대학 생활 동안 여러 룸메이트들과 함께 살면서, 정산 문제를 해결하고자 만든 iOS 앱입니다. 특히 백엔드 개발 과정에서 많은 공을 들였으며, 많은 것을 배울 수 있었던 프로젝트였습니다. 깃허브에 놀러오세요!"
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
    previewImages: [
      {
        src: "/clearsplit/clearsplit-showcase.png",
        alt: {en: "ClearSplit app screenshots", ko: "ClearSplit 앱 스크린샷"},
        width: 1800,
        height: 940
      }
    ],
    tech: ["Python", "Swift", "PostgreSQL", "Docker"],
    links: clearSplitLinks
  },
  {
    status: "filled",
    title: "Canvas Assistant",
    kindDate: "Group Project · 2026",
    description: {
      en: "Canvas is the most widely used LMS in American universities. We built a Chrome extension to enhance it by adding features such as a chatbot and reminders. In a team of six, I served as both Product Owner and backend developer.",
      ko: "Canvas는 미국에서 가장 많이 쓰이는 러닝 플랫폼입니다. 6명의 팀으로 챗봇, 리마인더 등의 유용한 기능을 추가하는 크롬 확장 프로그램을 개발하였습니다. 이 프로젝트에서 저는 PO인 동시에 백엔드 개발자의 역할을 맡았습니다."
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
    tech: ["TypeScript", "Spring Boot", "MySQL", "Docker", "GitLab CI"],
    links: [
      ...projectLinks,
      {
        label: {en: "portfolio", ko: "포트폴리오"},
        href: "/docs/canvas-assistant-final-demo.pdf",
        external: true,
        ariaLabel: {
          en: "Preview Canvas Assistant final demo presentation PDF",
          ko: "Canvas Assistant 최종 데모 발표 자료 PDF 미리보기"
        },
        pdfLandscape: true,
        previewImage: {
          src: "/docs/previews/canvas-assistant-architecture-preview.png",
          alt: {
            en: "Canvas Assistant architecture stack diagram preview",
            ko: "Canvas Assistant 아키텍처 스택 다이어그램 미리보기"
          },
          width: 1440,
          height: 810
        }
      }
    ]
  },
  {
    status: "filled",
    title: "Systems Programming Portfolio",
    kindDate: "Systems · 2025",
    description: {
      en: "In this project, I implemented a filesystem, shell, and scheduler on top of the xv6 operating system to learn core OS concepts. It was my first experience with C, but it gave me a solid foundation in OS knowledge that every developer needs.",
      ko: "이 프로젝트에서 저는 xv6 운영체제 위에서 파일 시스템, 셸, 스케줄러 등을 직접 구현하며 운영체제 필수 개념들을 학습하였습니다. 처음 C를 경험해봐서 많이 힘들었지만, 이를 통해 개발자의 필수 요소인 운영체제 지식을 갖출 수 있었습니다."
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
    previewImages: [
      {
        src: "/systems-programming-diagram.jpg",
        alt: {
          en: "Systems Programming Portfolio architecture diagram",
          ko: "Systems Programming Portfolio 아키텍처 다이어그램"
        },
        width: 2301,
        height: 1320
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
      en: "I'm passionate about open source. While browsing Pyrefly's issue board, I found an interesting issue, got it assigned, and had my PR merged. This was my first open source contribution, and I continue to explore other projects today.",
      ko: "오픈소스에 관심이 많은 저는 Meta에서 운영하는 Pyrefly의 이슈 목록을 둘러보다 흥미로운 이슈를 발견해 assign을 받고 PR을 올려 머지되었습니다. 이는 제 첫 오픈소스 기여이며, 현재도 다양한 오픈소스 프로젝트들을 꾸준히 살펴보고 있습니다."
    },
    previewImages: [
      {
        src: "/open-source-contribution.png",
        alt: {
          en: "Pyrefly open source contribution preview",
          ko: "Pyrefly 오픈소스 기여 미리보기"
        },
        width: 2104,
        height: 1514
      }
    ],
    tech: ["Rust", "Python"],
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
