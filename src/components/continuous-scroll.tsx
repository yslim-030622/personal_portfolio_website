"use client";

import {useEffect, useRef} from "react";
import type {PageSection} from "./full-page-scroll";
import {LenisProvider} from "./lenis-provider";

export function ContinuousScroll({sections}: {sections: PageSection[]}) {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry that is intersecting the most
        let maxIntersectionRatio = 0;
        let activeIndex = -1;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxIntersectionRatio) {
            maxIntersectionRatio = entry.intersectionRatio;
            activeIndex = sectionRefs.current.findIndex((el) => el === entry.target);
          }
        });

        if (activeIndex !== -1) {
          document.dispatchEvent(new CustomEvent("fp-section-change", {detail: {index: activeIndex}}));
        }
      },
      {
        root: null,
        rootMargin: "-20% 0px -40% 0px", // adjust margins so middle of screen triggers
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
      }
    );

    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
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
