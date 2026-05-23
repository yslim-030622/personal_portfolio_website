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
      en: "Expense sharing with grouped settlements and OCR receipt uploads. The backend handles balance recomputation, settlement generation, duplicate-request prevention, and Celery OCR workers on Azure Container Apps.",
      ko: "그룹 정산과 OCR 영수증 업로드를 지원하는 비용 분담 앱. 백엔드는 잔액 재계산, 정산 생성, 중복 요청 방지, Celery OCR 워커를 처리하며 Azure Container Apps에 배포했습니다."
    },
    tech: ["FastAPI", "Celery", "Redis", "PostgreSQL", "Azure"],
    links: projectLinks
  },
  {
    status: "filled",
    title: "Canvas Assistant",
    kindDate: "AI Tooling · 2026",
    description: {
      en: "A Canvas-focused academic assistant for coursework triage. It pulls assignments, deadlines, and course context into one calmer view so the next action is easier to see.",
      ko: "Canvas 과제 흐름을 정리하는 학업 보조 도구. 과제, 마감일, 수업 맥락을 한 화면으로 모아 다음 행동을 더 쉽게 보이게 합니다."
    },
    tech: ["TypeScript", "Canvas API", "Automation"],
    links: [
      ...projectLinks,
      {
        label: {en: "portfolio", ko: "포트폴리오"},
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
      en: "Accepted contribution to Meta's Pyrefly, a fast Python type checker and language server written in Rust. The change tightened one checker edge case through production open-source review.",
      ko: "Rust로 작성된 Meta의 Python 타입 체커이자 언어 서버인 Pyrefly에 반영된 기여. 체커의 엣지 케이스 하나를 더 정확하게 만들고 오픈소스 리뷰를 거쳤습니다."
    },
    tech: ["Rust", "Python", "Type Checking", "Open Source"],
    links: projectLinks
  },
  {
    status: "empty",
    note: "Reserved for future work. Do not render visually."
  }
] satisfies RawProjectEntry[];
