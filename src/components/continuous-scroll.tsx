"use client";

import {useEffect, useRef} from "react";
import type {PageSection} from "./full-page-scroll";
import {LenisProvider} from "./lenis-provider";

export function ContinuousScroll({sections}: {sections: PageSection[]}) {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }
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
