import type {RawPortfolioContent} from "./types";

export const notes = {
  intro: {
    en: "Courses I've taken at UW–Madison that shaped how I think about software.",
    ko: "소프트웨어를 생각하는 방식을 만든 UW–Madison 수업들."
  },
  items: [
    {
      title: {
        en: "CS537 — Introduction to Operating Systems",
        ko: "CS537 — 운영체제 개론"
      },
      date: "FALL 2024",
      tag: "SYSTEMS",
      body: {
        en: "Core OS abstractions: processes, threads, scheduling, virtual memory, file systems, and synchronization primitives. Implemented a simplified shell, memory allocator, and file system in C. The course made the gap between user-space programs and hardware concrete — and showed how most reliability work happens at this layer.",
        ko: "프로세스, 스레드, 스케줄링, 가상 메모리, 파일 시스템, 동기화 기본체 등 핵심 OS 추상화를 다뤘습니다. C로 간단한 셸, 메모리 할당기, 파일 시스템을 직접 구현했습니다. 유저 공간 프로그램과 하드웨어 사이의 거리가 구체적으로 느껴졌고, 신뢰성 작업의 대부분이 이 계층에서 이루어진다는 것을 알게 됐습니다."
      }
    },
    {
      title: {
        en: "CS577 — Introduction to Algorithms",
        ko: "CS577 — 알고리즘 개론"
      },
      date: "FALL 2024",
      tag: "ALGORITHMS",
      body: {
        en: "Proof-based treatment of algorithm design covering divide-and-conquer, dynamic programming, greedy methods, graph algorithms, and NP-hardness reductions. The emphasis on correctness proofs and asymptotic analysis changed how I read unfamiliar code — I now look for invariants and growth rates before optimizing.",
        ko: "분할 정복, 동적 프로그래밍, 그리디, 그래프 알고리즘, NP-완전성 환원을 증명 기반으로 다루는 수업입니다. 정확성 증명과 점근 분석에 집중한 덕분에 모르는 코드를 읽는 방식이 바뀌었습니다. 최적화 전에 불변조건과 성장률을 먼저 찾게 됐습니다."
      }
    },
    {
      title: {
        en: "CS542 — Introduction to Software Security",
        ko: "CS542 — 소프트웨어 보안 개론"
      },
      date: "FALL 2024",
      tag: "SECURITY",
      body: {
        en: "Vulnerability classes at the binary and language level: buffer overflows, format strings, use-after-free, injection attacks, and side channels. Covered static and dynamic analysis techniques — relevant background for the SAST work at Fasoo. The key takeaway: most vulnerabilities are correctness bugs in a security-sensitive context.",
        ko: "버퍼 오버플로, 포맷 스트링, use-after-free, 인젝션 공격, 사이드 채널 등 바이너리 및 언어 수준의 취약점 유형을 다뤘습니다. 정적 분석과 동적 분석 기법도 다뤄서 Fasoo의 SAST 작업과 직접 연결됐습니다. 핵심 교훈: 대부분의 취약점은 보안 민감한 문맥의 정확성 버그입니다."
      }
    },
    {
      title: {
        en: "CS540 — Introduction to Artificial Intelligence",
        ko: "CS540 — 인공지능 개론"
      },
      date: "SPRING 2025",
      tag: "AI",
      body: {
        en: "Search algorithms, constraint satisfaction, probabilistic reasoning, and supervised learning. The course built intuition for when heuristics are good enough and when exact methods are needed. Bayesian networks and the formalism around uncertainty were particularly useful when reasoning about anomaly detection pipelines later.",
        ko: "탐색 알고리즘, 제약 충족, 확률적 추론, 지도 학습을 다뤘습니다. 휴리스틱이 충분한 경우와 정확한 방법이 필요한 경우에 대한 직관을 길렀습니다. 베이즈 네트워크와 불확실성 형식화는 이후 이상 탐지 파이프라인을 설계할 때 특히 유용했습니다."
      }
    },
    {
      title: {
        en: "CS506 — Software Engineering",
        ko: "CS506 — 소프트웨어 엔지니어링"
      },
      date: "SPRING 2025",
      tag: "SOFTWARE",
      body: {
        en: "Software engineering as the work around the code: requirements, specifications, architecture, design patterns, testing, debugging, version control, and team process. The important part for me was seeing how quickly a codebase becomes a communication problem once several people share it. It made reviews, tests, naming, and small design decisions feel less like ceremony and more like the things that keep a project understandable after the first week.",
        ko: "코드 자체보다 코드 주변의 일을 배운 수업입니다. 요구사항, 명세, 아키텍처, 디자인 패턴, 테스트, 디버깅, 버전관리, 팀 프로세스를 다뤘습니다. 가장 크게 느낀 점은 여러 사람이 같은 코드베이스를 만지는 순간 소프트웨어는 곧 커뮤니케이션 문제가 된다는 것이었습니다. 리뷰, 테스트, 이름 짓기, 작은 설계 결정들이 형식적인 절차가 아니라 프로젝트를 첫 주 이후에도 이해 가능한 상태로 유지하는 장치라는 점이 중요하게 남았습니다."
      }
    },
    {
      title: {
        en: "CS570 — Introduction to Human-Computer Interaction",
        ko: "CS570 — 인간-컴퓨터 상호작용 개론"
      },
      date: "SPRING 2025",
      tag: "HCI",
      body: {
        en: "User research methods, prototyping, and usability evaluation. The course reframed engineering decisions as UX decisions — interface latency is a user experience problem, not just a performance metric. Conducting think-aloud studies and interpreting qualitative feedback made me a more deliberate designer of developer-facing tools.",
        ko: "사용자 연구 방법, 프로토타이핑, 사용성 평가를 다뤘습니다. 엔지니어링 결정이 곧 UX 결정임을 새롭게 이해했습니다. 인터페이스 레이턴시는 성능 지표가 아니라 사용자 경험 문제입니다. 소리내어 생각하기 실험과 정성적 피드백을 해석하면서 개발자용 도구를 더 의도적으로 설계하게 됐습니다."
      }
    }
  ]
} satisfies RawPortfolioContent["notes"];
