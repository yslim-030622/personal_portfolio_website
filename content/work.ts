import type {RawWorkEntry} from "./types";

export const work: RawWorkEntry[] = [
  {
    status: "filled",
    company: "Fasoo, Inc.",
    companyUrl: "https://en.fasoo.ai/",
    dates: "May–Aug 2025",
    location: {en: "Seoul", ko: "서울"},
    role: {en: "Software Engineer Intern", ko: "Software Engineer Intern"},
    paragraph: {
      en: "Production SAST cloud work focused on runtime prediction, anomaly detection, and release automation.",
      ko: "상용 SAST 클라우드의 실행 시간 예측, 이상 탐지, 릴리스 자동화 작업을 맡았습니다."
    },
    highlights: [
      {
        en: "Modeled analysis runtime from 28 metadata features across ~1,100 GitHub repositories.",
        ko: "약 1,100개 GitHub 저장소에서 28개 메타데이터 피처를 추출해 분석 실행 시간을 모델링했습니다."
      },
      {
        en: "Improved XGBoost prediction R² from 0.29 to 0.93 for abnormal job detection.",
        ko: "XGBoost 예측 R²를 0.29에서 0.93으로 개선해 비정상 작업 탐지에 활용했습니다."
      },
      {
        en: "Integrated the model with CI retraining and alerting for a production release.",
        ko: "프로덕션 릴리스를 위해 CI 기반 재학습과 알림 흐름까지 연결했습니다."
      }
    ],
    photos: [
      {
        src: "/fasoo-internship-certificate.jpg",
        alt: {
          en: "Receiving the Fasoo internship certificate",
          ko: "Fasoo 인턴십 수료증을 받는 모습"
        },
        width: 3000,
        height: 4000
      }
    ],
    links: [
      {
        label: {en: "portfolio", ko: "포트폴리오"},
        href: {en: "/docs/fasoo-internship-en.pdf", ko: "/docs/fasoo-internship-ko.pdf"},
        external: true,
        ariaLabel: {
          en: "Preview Fasoo internship presentation PDF",
          ko: "Fasoo 인턴 발표 자료 PDF 미리보기"
        }
      }
    ]
  },
  {
    status: "filled",
    company: "MoDoc AI",
    companyUrl: "https://www.modoc-ai.com/",
    dates: "May 2026–Present",
    location: {en: "Boston remote", ko: "보스턴 원격"},
    role: {en: "AI Automation Developer", ko: "AI Automation Developer"},
    paragraph: {
      en: "Industry collaboration project building repeatable AI workflows for medical explainer content.",
      ko: "의료 설명 콘텐츠 제작을 위한 반복 가능한 AI 워크플로를 만드는 산학 협력 프로젝트입니다."
    },
    highlights: [
      {
        en: "Convert medical Q&A CSV datasets into 30-second short-form video drafts.",
        ko: "의료 Q&A CSV 데이터셋을 30초 숏폼 영상 초안으로 변환합니다."
      },
      {
        en: "Orchestrate parsing, script generation, and video synthesis with Claude and Veo 3.",
        ko: "Claude와 Veo 3를 활용해 파싱, 스크립트 생성, 영상 합성을 오케스트레이션합니다."
      }
    ]
  },
  {
    status: "empty",
    note: "Reserved for a future selected work entry. Do not render visually."
  }
] satisfies RawWorkEntry[];
