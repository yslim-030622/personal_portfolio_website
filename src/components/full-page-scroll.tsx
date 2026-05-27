"use client";

import {motion} from "motion/react";
import {useState, useRef, useEffect, useCallback, type ReactNode} from "react";

// Card enter: spring physics — natural drag/pull feel
const SPRING_ENTER = {type: "spring" as const, stiffness: 210, damping: 30, mass: 1};
// Card exit: smooth ease-in-out — slides away without snapping
const CARD_EXIT_EASE: [number, number, number, number] = [0.4, 0, 0.6, 1];

const CARD_EXIT_DURATION = 0.52;
const ANIMATION_LOCK_MS  = 840;

const SCROLL_THRESHOLD = 180;
const NAV_COOLDOWN     = 800;
const DELTA_DECAY_MS   = 140;
const DELTA_CAP        = 80;

export interface PageSection {
  id: string;
  label?: string;
  content: ReactNode;
}

function getSectionState(offset: number) {
  if (offset === 0) {
    return {
      y: "0%",
      scale: 1,
      opacity: 1,
      transition: {
        y:       SPRING_ENTER,
        scale:   SPRING_ENTER,
        opacity: {duration: 0.42, ease: [0.22, 1, 0.36, 1] as [number, number, number, number]},
      },
    };
  }

  if (offset > 0) {
    return {
      y: "5%",
      scale: 0.96,
      opacity: 0,
      transition: {
        y:       {duration: CARD_EXIT_DURATION, ease: CARD_EXIT_EASE},
        scale:   {duration: CARD_EXIT_DURATION, ease: CARD_EXIT_EASE},
        opacity: {duration: CARD_EXIT_DURATION * 0.5, ease: CARD_EXIT_EASE},
      },
    };
  }

  const depth = -offset;
  return {
    y: "0%",
    scale: Math.max(0.86, 1 - depth * 0.04),
    opacity: Math.max(0.0, 1 - depth * 0.8),
    transition: {
      y:       {duration: CARD_EXIT_DURATION, ease: CARD_EXIT_EASE},
      scale:   {duration: CARD_EXIT_DURATION, ease: CARD_EXIT_EASE},
      opacity: {duration: CARD_EXIT_DURATION * 0.75, ease: CARD_EXIT_EASE},
    },
  };
}

export function FullPageScroll({sections}: {sections: PageSection[]}) {
  const [current, setCurrent] = useState(0);
  const currentRef            = useRef(0);
  const sectionRefs           = useRef<(HTMLDivElement | null)[]>([]);
  const overflowRef           = useRef<{scrollHeight: number; clientHeight: number}[]>([]);
  const accDelta              = useRef(0);
  const lastNav               = useRef(0);
  const isAnimating           = useRef(false);
  const touchStartY           = useRef(0);
  const decayTimer            = useRef<ReturnType<typeof setTimeout> | null>(null);

  const positionSectionForEntry = useCallback((index: number, dir: 1 | -1) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = sectionRefs.current[index];
        if (!el) return;
        const maxScroll = Math.max(0, el.scrollHeight - el.clientHeight);
        el.scrollTo({top: dir < 0 ? maxScroll : 0});
      });
    });
  }, []);

  const navigate = useCallback(
    (dir: 1 | -1) => {
      if (isAnimating.current) return;
      const next = currentRef.current + dir;
      if (next < 0 || next >= sections.length) return;

      isAnimating.current = true;
      currentRef.current  = next;
      accDelta.current    = 0;
      setCurrent(next);
      document.dispatchEvent(new CustomEvent("fp-section-change", {detail: {index: next}}));
      positionSectionForEntry(next, dir);
      setTimeout(() => {
        isAnimating.current = false;
      }, ANIMATION_LOCK_MS);
    },
    [positionSectionForEntry, sections.length]
  );

  const refreshOverflowMetrics = useCallback((index = currentRef.current) => {
    const el = sectionRefs.current[index];
    if (!el) return;
    overflowRef.current[index] = {
      scrollHeight: el.scrollHeight,
      clientHeight: el.clientHeight,
    };
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (isAnimating.current || index === currentRef.current) return;
      if (index < 0 || index >= sections.length) return;

      const dir = index > currentRef.current ? 1 : -1;
      isAnimating.current = true;
      currentRef.current  = index;
      accDelta.current    = 0;
      setCurrent(index);
      document.dispatchEvent(new CustomEvent("fp-section-change", {detail: {index}}));
      positionSectionForEntry(index, dir);
      setTimeout(() => {
        isAnimating.current = false;
      }, ANIMATION_LOCK_MS);
    },
    [positionSectionForEntry, sections.length]
  );

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (isAnimating.current) {
        e.preventDefault();
        return;
      }

      const el = sectionRefs.current[currentRef.current];
      if (!el) return;

      const metrics = overflowRef.current[currentRef.current] ?? {
        scrollHeight: el.scrollHeight,
        clientHeight: el.clientHeight,
      };
      overflowRef.current[currentRef.current] = metrics;

      const hasOverflow   = metrics.scrollHeight > metrics.clientHeight + 2;
      const canScrollDown = hasOverflow && el.scrollTop < metrics.scrollHeight - metrics.clientHeight - 2;
      const canScrollUp   = el.scrollTop > 1;

      if (e.deltaY > 0 && canScrollDown) {
        // Native scroll
        return;
      }
      if (e.deltaY < 0 && canScrollUp) {
        // Native scroll
        return;
      }

      e.preventDefault();

      const clamped = Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY), DELTA_CAP);
      accDelta.current += clamped;

      if (decayTimer.current) clearTimeout(decayTimer.current);
      decayTimer.current = setTimeout(() => {
        accDelta.current = 0;
      }, DELTA_DECAY_MS);

      const now = Date.now();
      if (Math.abs(accDelta.current) >= SCROLL_THRESHOLD && now - lastNav.current > NAV_COOLDOWN) {
        lastNav.current = now;
        navigate(accDelta.current > 0 ? 1 : -1);
      }
    };

    window.addEventListener("wheel", onWheel, {passive: false});
    return () => window.removeEventListener("wheel", onWheel);
  }, [navigate]);

  useEffect(() => {
    const onResize = () => {
      overflowRef.current = [];
      refreshOverflowMetrics();
    };
    refreshOverflowMetrics();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [current, refreshOverflowMetrics]);

  useEffect(() => {
    const onStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };
    const onEnd = (e: TouchEvent) => {
      const delta = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(delta) < 50) return;

      const el = sectionRefs.current[currentRef.current];
      if (!el) return;

      const metrics = overflowRef.current[currentRef.current] ?? {
        scrollHeight: el.scrollHeight,
        clientHeight: el.clientHeight,
      };

      const atBottom = el.scrollTop >= metrics.scrollHeight - metrics.clientHeight - 2;
      const atTop    = el.scrollTop <= 1;

      if (delta > 0 && atBottom) navigate(1);
      else if (delta < 0 && atTop) navigate(-1);
    };

    window.addEventListener("touchstart", onStart, {passive: true});
    window.addEventListener("touchend",   onEnd,   {passive: true});
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend",   onEnd);
    };
  }, [navigate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if      (e.key === "ArrowDown" || e.key === "PageDown") navigate(1);
      else if (e.key === "ArrowUp"   || e.key === "PageUp")   navigate(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  return (
    <div className="fp-shell fixed inset-0 overflow-hidden bg-bg">
      {sections.map((s, i) => {
        const offset = i - current;
        const state  = getSectionState(offset);

        return (
          <motion.div
            key={s.id}
            ref={(el) => {
              sectionRefs.current[i] = el;
            }}
            className="fp-section absolute inset-0 h-[100svh] overflow-y-auto bg-bg"
            animate={{y: state.y, scale: state.scale, opacity: state.opacity}}
            transition={state.transition}
            style={{
              zIndex:          offset === 0 ? 10 : offset < 0 ? Math.max(1, 10 + offset) : Math.max(1, 5 - offset),
              pointerEvents:   offset === 0 ? "auto" : "none",
              willChange:      "transform, opacity",
              transformOrigin: "center center",
            }}
          >
            {s.content}
          </motion.div>
        );
      })}

      <nav
        aria-label="페이지 섹션"
        className="fixed right-2 top-1/2 z-50 flex -translate-y-1/2 flex-col items-center gap-[10px] rounded-full bg-fg/[0.02] px-[7px] py-3 backdrop-blur-[3px] md:right-3"
      >
        {sections.map((s, i) => (
          <button
            aria-label={s.label ?? `섹션 ${i + 1}`}
            className="group flex h-4 w-4 items-center justify-center"
            key={s.id}
            onClick={() => goTo(i)}
            type="button"
          >
            <span
              className={`block rounded-full transition-all duration-300 ${
                i === current
                  ? "h-2 w-2 bg-fg/80"
                  : "h-[5px] w-[5px] bg-fg/35 group-hover:bg-fg/60"
              }`}
            />
          </button>
        ))}
      </nav>
    </div>
  );
}
