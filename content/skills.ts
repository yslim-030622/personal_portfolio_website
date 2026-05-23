import type {RawPortfolioContent} from "./types";

export const skills = [
  {
    title: {
      en: "Languages I think in",
      ko: "익숙한 언어들"
    },
    body: {
      en: "Python and TypeScript daily; Java for coursework; Rust when I'm contributing to systems tooling like pyrefly; SQL for everything that touches data.",
      ko: "Python과 TypeScript는 매일 씁니다. 학부 과제는 주로 Java로, pyrefly 같은 시스템 도구에 기여할 때는 Rust로, 데이터를 다루는 모든 작업은 SQL로 합니다."
    }
  },
  {
    title: {
      en: "Backend & infrastructure",
      ko: "백엔드와 인프라"
    },
    body: {
      en: "FastAPI and Spring Boot for services; Celery and Redis for async work; PostgreSQL and MySQL for storage. I'm comfortable wiring Docker, GitHub Actions, and Azure or AWS to ship things.",
      ko: "서비스는 FastAPI와 Spring Boot로, 비동기 작업은 Celery와 Redis로, 저장소는 PostgreSQL과 MySQL을 씁니다. Docker, GitHub Actions, Azure와 AWS를 엮어 실제로 배포하는 일이 익숙합니다."
    }
  },
  {
    title: {
      en: "Applied ML",
      ko: "응용 ML"
    },
    body: {
      en: "XGBoost for tabular problems, scikit-learn for everything else, plus the data plumbing — feature extraction, retraining loops, drift detection.",
      ko: "정형 데이터엔 XGBoost, 그 외엔 scikit-learn을 쓰고, 그 주위의 데이터 파이프라인 — 피처 추출, 재학습 루프, 드리프트 감지 — 까지 함께 다룹니다."
    }
  },
  {
    title: {
      en: "The boring-but-critical stuff",
      ko: "지루하지만 중요한 것들"
    },
    body: {
      en: "pytest, structured logging, security-tooling literacy (SBOM, CVE/CPE/CWE/CVSS, static analysis), and a calm approach to debugging.",
      ko: "pytest, 구조화된 로깅, 보안 도구에 대한 이해(SBOM, CVE/CPE/CWE/CVSS, 정적 분석), 그리고 차분한 디버깅."
    }
  }
] satisfies RawPortfolioContent["skills"];
