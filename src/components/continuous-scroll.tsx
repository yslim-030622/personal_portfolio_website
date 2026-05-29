"use client";

import {useEffect, useRef} from "react";
import type {PageSection} from "./full-page-scroll";
import {LenisProvider} from "./lenis-provider";

export function ContinuousScroll({sections}: {sections: PageSection[]}) {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const isSnapping = useRef(false);
  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    lastScrollTime.current = Date.now();
    lastScrollY.current = window.scrollY;

    const handleScrollSnap = () => {
      if (isSnapping.current) return;

      const currentScroll = window.scrollY;
      const now = Date.now();
      const dt = now - lastScrollTime.current;
      const dy = currentScroll - lastScrollY.current;

      // 스크롤 속도 측정 (px/ms). dt가 너무 크면 속도를 0으로 처리
      const velocity = dt > 0 && dt < 100 ? Math.abs(dy / dt) : 0;
      const isScrollActive = Math.abs(dy) > 3; // 미세한 미동은 무시

      lastScrollTime.current = now;

      const heroEl = document.getElementById("hero");
      const workEl = document.getElementById("work");
      const projectsEl = document.getElementById("projects");
      if (!heroEl || !workEl || !projectsEl) {
        if (isScrollActive) {
          lastScrollY.current = currentScroll;
        }
        return;
      }

      const workTop = workEl.offsetTop;
      const projectsTop = projectsEl.offsetTop;
      const threshold = 80; // 스냅 감도를 부드럽게 제어하기 위해 작동 문턱값을 30px에서 80px로 여유롭게 조정
      const snapDuration = 1.25; // 획 넘어가지 않고 구름 타듯 부드럽게 미끄러지도록 안착 시간을 1.25초로 튜닝

      // 마우스를 천천히 스크롤하는 상황을 고려하기 위한 최소 속도 임계값
      // 천천히 스크롤할 때는 절대 작동하지 않고, 의도적이고 빠른 휠 스크롤에서만 스냅이 걸리도록 0.60px/ms로 상향 조정
      const minVelocityForSnap = 0.60;

      // 1. Hero -> Work 스냅 (내려갈 때)
      if (
        velocity > minVelocityForSnap &&
        lastScrollY.current <= threshold &&
        currentScroll > threshold &&
        currentScroll < workTop - 120
      ) {
        isSnapping.current = true;
        const targetScroll = workTop;

        const onSnapComplete = () => {
          isSnapping.current = false;
          lastScrollY.current = window.scrollY;
        };

        const globalLenis = (window as unknown as { lenis?: { scrollTo: (target: unknown, options?: unknown) => void } }).lenis;
        if (globalLenis) {
          globalLenis.scrollTo(workEl, {
            onComplete: onSnapComplete,
            duration: snapDuration,
            easing: (t: number) => 1 - Math.pow(1 - t, 4), // 덜컥거림 없이 더 부드럽게 흘러가며 안착하도록 EaseOutQuart 곡선으로 최적화
          });
        } else {
          window.scrollTo({top: targetScroll, behavior: "smooth"});
          setTimeout(onSnapComplete, 650);
        }
        return;
      }

      // 2. Work -> Hero 스냅 (올라갈 때)
      if (
        velocity > minVelocityForSnap &&
        lastScrollY.current >= workTop - threshold &&
        currentScroll < workTop - threshold &&
        currentScroll > threshold &&
        currentScroll < workTop
      ) {
        isSnapping.current = true;
        const targetScroll = 0;

        const onSnapComplete = () => {
          isSnapping.current = false;
          lastScrollY.current = window.scrollY;
        };

        const globalLenis = (window as unknown as { lenis?: { scrollTo: (target: unknown, options?: unknown) => void } }).lenis;
        if (globalLenis) {
          globalLenis.scrollTo(0, {
            onComplete: onSnapComplete,
            duration: snapDuration,
            easing: (t: number) => 1 - Math.pow(1 - t, 4), // EaseOutQuart 곡선 최적화
          });
        } else {
          window.scrollTo({top: targetScroll, behavior: "smooth"});
          setTimeout(onSnapComplete, 650);
        }
        return;
      }

      // 3. Work -> Projects 스냅 (내려갈 때)
      if (
        velocity > minVelocityForSnap &&
        lastScrollY.current <= projectsTop - threshold &&
        currentScroll > projectsTop - threshold &&
        currentScroll < projectsTop - 100 &&
        currentScroll > workTop + 200
      ) {
        isSnapping.current = true;
        const targetScroll = projectsTop;

        const onSnapComplete = () => {
          isSnapping.current = false;
          lastScrollY.current = window.scrollY;
        };

        const globalLenis = (window as unknown as { lenis?: { scrollTo: (target: unknown, options?: unknown) => void } }).lenis;
        if (globalLenis) {
          globalLenis.scrollTo(projectsEl, {
            onComplete: onSnapComplete,
            duration: snapDuration,
            easing: (t: number) => 1 - Math.pow(1 - t, 4), // EaseOutQuart 곡선 최적화
          });
        } else {
          window.scrollTo({top: targetScroll, behavior: "smooth"});
          setTimeout(onSnapComplete, 650);
        }
        return;
      }

      // 4. Projects -> Work 스냅 (올라갈 때)
      if (
        velocity > minVelocityForSnap &&
        lastScrollY.current >= projectsTop - threshold &&
        currentScroll < projectsTop - threshold &&
        currentScroll > workTop + 200
      ) {
        isSnapping.current = true;
        const targetScroll = Math.max(workTop, projectsTop - window.innerHeight);

        const onSnapComplete = () => {
          isSnapping.current = false;
          lastScrollY.current = window.scrollY;
        };

        const globalLenis = (window as unknown as { lenis?: { scrollTo: (target: unknown, options?: unknown) => void } }).lenis;
        if (globalLenis) {
          globalLenis.scrollTo(targetScroll, {
            onComplete: onSnapComplete,
            duration: snapDuration,
            easing: (t: number) => 1 - Math.pow(1 - t, 4), // EaseOutQuart 곡선 최적화
          });
        } else {
          window.scrollTo({top: targetScroll, behavior: "smooth"});
          setTimeout(onSnapComplete, 650);
        }
        return;
      }

      if (isScrollActive) {
        lastScrollY.current = currentScroll;
      }
    };

    window.addEventListener("scroll", handleScrollSnap, {passive: true});
    return () => {
      window.removeEventListener("scroll", handleScrollSnap);
    };
  }, []);

  useEffect(() => {
    let lastActiveIndex = -1;

    const update = () => {
      // Use 35% from the top of viewport as the probe point.
      // This works reliably for sections of any height, unlike IntersectionObserver
      // which breaks for very tall sections whose max intersectionRatio never crosses
      // a threshold (e.g. a 210vh section through a 40vh observation window tops out
      // at ~0.19 and gets stuck between the 0.1 and 0.2 thresholds).
      const probeY = window.scrollY + window.innerHeight * 0.35;
      let activeIndex = -1;

      sectionRefs.current.forEach((el, i) => {
        if (!el) return;
        const sectionTop = window.scrollY + el.getBoundingClientRect().top;
        const sectionBottom = sectionTop + el.offsetHeight;
        if (probeY >= sectionTop && probeY < sectionBottom) {
          activeIndex = i;
        }
      });

      if (activeIndex !== -1 && activeIndex !== lastActiveIndex) {
        lastActiveIndex = activeIndex;
        document.dispatchEvent(new CustomEvent("fp-section-change", {detail: {index: activeIndex}}));
      }
    };

    update();
    window.addEventListener("scroll", update, {passive: true});
    window.addEventListener("resize", update, {passive: true});

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <>
      <LenisProvider />
      <main className="text-fg bg-bg">
        {sections.map((section, i) => (
          <section
            key={section.id}
            id={section.id}
            ref={(el) => {
              sectionRefs.current[i] = el;
            }}
            className="w-full relative z-10"
          >
            {section.content}
          </section>
        ))}
      </main>
    </>
  );
}
