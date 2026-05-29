"use client";

import {useEffect, useRef} from "react";
import type {PageSection} from "./full-page-scroll";
import {LenisProvider} from "./lenis-provider";

export function ContinuousScroll({sections}: {sections: PageSection[]}) {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const isSnapping = useRef(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    const handleScrollSnap = () => {
      if (isSnapping.current) return;

      const currentScroll = window.scrollY;
      const heroEl = document.getElementById("hero");
      const workEl = document.getElementById("work");
      if (!heroEl || !workEl) return;

      const workTop = workEl.offsetTop;
      const threshold = 50; // 자석처럼 스냅 작동할 문턱값 (px)

      // 1. Hero -> Work 스냅
      if (
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
            duration: 1.1,
            easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)), // EaseOutExpo
          });
        } else {
          window.scrollTo({top: targetScroll, behavior: "smooth"});
          setTimeout(onSnapComplete, 850);
        }
        return;
      }

      // 2. Work -> Hero 스냅
      if (
        lastScrollY.current >= workTop - threshold &&
        currentScroll < workTop - threshold &&
        currentScroll > threshold
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
            duration: 1.1,
            easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)), // EaseOutExpo
          });
        } else {
          window.scrollTo({top: targetScroll, behavior: "smooth"});
          setTimeout(onSnapComplete, 850);
        }
        return;
      }

      lastScrollY.current = currentScroll;
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
      <main className="bg-bg text-fg">
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
