"use client";

import {useEffect} from "react";

export function LenisProvider() {
  useEffect(() => {
    let cancelled = false;
    let frame = 0;
    let destroy: (() => void) | undefined;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");

    if (reduce.matches || coarse.matches) {
      return;
    }

    void import("lenis").then(({default: Lenis}) => {
      if (cancelled) {
        return;
      }

      const lenis = new Lenis({
        lerp: 0.055,
        smoothWheel: true,
        wheelMultiplier: 0.82,
        touchMultiplier: 1.2
      });

      const raf = (time: number) => {
        lenis.raf(time);
        frame = window.requestAnimationFrame(raf);
      };

      frame = window.requestAnimationFrame(raf);
      destroy = () => lenis.destroy();
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      destroy?.();
    };
  }, []);

  return null;
}
