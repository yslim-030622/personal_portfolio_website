import type {RawWorkEntry} from "./types";

export const work: RawWorkEntry[] = [
  {
    status: "filled",
    company: "Fasoo, Inc.",
    companyUrl: "https://en.fasoo.ai/",
    dates: {en: "May–Aug 2025", ko: "2025년 5–8월"},
    location: {en: "Seoul", ko: "서울"},
    role: {en: "Software Engineer Intern", ko: "Software Engineer Intern"},
    paragraph: {
      en: "Fasoo is a Korean software company specializing in document and data security. For about 10 weeks, I built an anomaly detection pipeline for a static analyzer on the development team.",
      ko: "파수는 문서, 데이터 보안에 특화되어 있는 소프트웨어 기업입니다. 저는 개발 1팀에서 약 10주 동안 정적 분석기의 이상 탐지 기준 수립 및 파이프라인 구축을 담당하였습니다."
    },
    highlights: [
      {
        en: "Built a training dataset from ~1,100 open-source GitHub repositories run through the analyzer.",
        ko: "오픈소스 저장소 약 1,100개에 정적 분석 요청하여 학습 데이터셋을 구축했습니다."
      },
      {
        en: "Trained an XGBoost model on 28 metadata features, improving prediction R² from 0.29 to 0.93.",
        ko: "28개 메타데이터 feature로 XGBoost 라이브러리를 학습시켜 예측 R²를 0.29에서 0.93으로 개선했습니다."
      },
      {
        en: "Integrated the detector into the production pipeline with CI retraining and alerting.",
        ko: "CI 기반 재학습과 알림까지 연결해 탐지 결과를 실제 분석 파이프라인에 통합했습니다."
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
        label: {en: "portfolio preview", ko: "포트폴리오 미리보기"},
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
    logo: "/modoc-ai-logo.png",
    dates: {en: "May 2026–Present", ko: "2026년 5월–현재"},
    location: {en: "Boston remote", ko: "보스턴 원격"},
    role: {en: "AI Automation Developer", ko: "AI Automation Developer"},
    paragraph: {
      en: "Collaboration project between LikeLion Madison Chapter and MoDoc AI, a health-tech startup. I'm building an automated pipeline that converts child medical text content into short videos and uploads them to YouTube.",
      ko: "학교 산하 멋쟁이사자처럼 동아리와 헬스케어 스타트업 MoDoc AI 간의 산학협력 프로젝트입니다. 아이들 대상의 의료 콘텐츠를 숏폼 영상으로 변환을 자동화하고, 포스팅하는 파이프라인을 만들었습니다."
    },
    highlights: [
      {
        en: "Structured a database of medical blog posts as the content foundation for the pipeline.",
        ko: "의료 블로그 글을 데이터베이스화해 파이프라인의 콘텐츠 기반을 구축했습니다."
      },
      {
        en: "Automated script generation and video synthesis using Gemini API and Veo 3.",
        ko: "Gemini API와 Veo 3를 활용해 스크립트 생성과 영상 합성을 자동화했습니다."
      },
      {
        en: "Automated YouTube uploads as the final step of the end-to-end pipeline.",
        ko: "파이프라인의 마지막 단계로 유튜브 업로드까지 자동화했습니다."
      }
    ],
    previewImages: [
      {
        src: "/modoc_ai_preview.png",
        alt: {
          en: "MoDoc AI automated video pipeline preview",
          ko: "MoDoc AI 자동화 영상 파이프라인 미리보기"
        },
        width: 2138,
        height: 1374
      }
    ],
    links: [
      {
        label: {en: "github", ko: "github"},
        href: "https://github.com/yslim-030622/Modoc-Ai-Pipeline",
        external: true,
        ariaLabel: {
          en: "MoDoc AI Pipeline GitHub repository",
          ko: "MoDoc AI Pipeline GitHub 저장소"
        }
      }
    ]
  },
  {
    status: "empty",
    note: "Reserved for a future selected work entry. Do not render visually."
  }
] satisfies RawWorkEntry[];
