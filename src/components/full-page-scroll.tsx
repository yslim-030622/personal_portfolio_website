"use client";

import {motion} from "motion/react";
import {useState, useRef, useEffect, useCallback, type ReactNode} from "react";

// Card enter: spring-like ease out (snappy, satisfying)
const CARD_ENTER_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
// Card exit: ease-in (quick departure)
const CARD_EXIT_EASE: [number, number, number, number] = [0.55, 0, 1, 1];

const CARD_ENTER_DURATION = 0.72;
const CARD_EXIT_DURATION  = 0.48;

const SCROLL_THRESHOLD = 240;
const NAV_COOLDOWN     = 920;
const DELTA_DECAY_MS   = 140;
const DELTA_CAP        = 80;

export interface PageSection {
  id: string;
  label?: string;
  content: ReactNode;
}

/*
 * Each section has a resting state based on its position relative to active:
 *
 *   offset < 0  → already visited  → small, faded, slightly above  (y:-3%)
 *   offset = 0  → active           → full size, visible             (y:0)
 *   offset > 0  → upcoming         → smaller, faded, below          (y:9%)
 *
 * When current changes, Motion smoothly interpolates each section's state.
 * The different y-positions for past vs future give the animation its
 * directionality: new cards rise from below, old ones sink slightly upward.
 */
function getSectionState(offset: number) {
  if (offset === 0) {
    return {
      y: "0%",
      scale: 1,
      opacity: 1,
      transition: {
        y:       {duration: CARD_ENTER_DURATION, ease: CARD_ENTER_EASE},
        scale:   {duration: CARD_ENTER_DURATION, ease: CARD_ENTER_EASE},
        opacity: {duration: CARD_ENTER_DURATION * 0.8, ease: CARD_ENTER_EASE},
      },
    };
  }

  if (offset > 0) {
    // Upcoming card — parked below, will rise when it becomes active
    return {
      y: "9%",
      scale: 0.91,
      opacity: 0,
      transition: {
        y:       {duration: CARD_EXIT_DURATION, ease: CARD_EXIT_EASE},
        scale:   {duration: CARD_EXIT_DURATION, ease: CARD_EXIT_EASE},
        opacity: {duration: CARD_EXIT_DURATION * 0.7, ease: CARD_EXIT_EASE},
      },
    };
  }

  // Past card — was active, now done, park slightly above
  return {
    y: "-3%",
    scale: 0.95,
    opacity: 0,
    transition: {
      y:       {duration: CARD_EXIT_DURATION, ease: CARD_EXIT_EASE},
      scale:   {duration: CARD_EXIT_DURATION, ease: CARD_EXIT_EASE},
      opacity: {duration: CARD_EXIT_DURATION * 0.6, ease: CARD_EXIT_EASE},
    },
  };
}

export function FullPageScroll({sections}: {sections: PageSection[]}) {
  const [current, setCurrent]   = useState(0);
  const currentRef              = useRef(0);
  const sectionRefs             = useRef<(HTMLDivElement | null)[]>([]);
  const overflowRef             = useRef<{scrollHeight: number; clientHeight: number}[]>([]);
  const accDelta                = useRef(0);
  const lastNav                 = useRef(0);
  const isAnimating             = useRef(false);
  const touchStartY             = useRef(0);
  const decayTimer              = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      document.dispatchEvent(
        new CustomEvent("fp-section-change", {detail: {index: next}})
      );
      positionSectionForEntry(next, dir);
      setTimeout(() => {
        isAnimating.current = false;
      }, CARD_ENTER_DURATION * 1000 + 140);
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
      document.dispatchEvent(
        new CustomEvent("fp-section-change", {detail: {index}})
      );
      positionSectionForEntry(index, dir);
      setTimeout(() => {
        isAnimating.current = false;
      }, CARD_ENTER_DURATION * 1000 + 140);
    },
    [positionSectionForEntry, sections.length]
  );

  // Wheel: accumulate with per-event cap + decay reset
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

      const hasOverflow  = metrics.scrollHeight > metrics.clientHeight + 2;
      const canScrollDown = hasOverflow && el.scrollTop < metrics.scrollHeight - metrics.clientHeight - 2;
      const canScrollUp   = el.scrollTop > 1;

      if (e.deltaY > 0 && canScrollDown) {
        e.preventDefault();
        el.scrollTop = Math.min(
          metrics.scrollHeight - metrics.clientHeight,
          el.scrollTop + Math.min(Math.abs(e.deltaY), DELTA_CAP * 2)
        );
        return;
      }
      if (e.deltaY < 0 && canScrollUp) {
        e.preventDefault();
        el.scrollTop = Math.max(0, el.scrollTop - Math.min(Math.abs(e.deltaY), DELTA_CAP * 2));
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
      if (
        Math.abs(accDelta.current) >= SCROLL_THRESHOLD &&
        now - lastNav.current > NAV_COOLDOWN
      ) {
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

  // Touch
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
      overflowRef.current[currentRef.current] = metrics;

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

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") navigate(1);
      else if (e.key === "ArrowUp" || e.key === "PageUp") navigate(-1);
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
            className="fp-section absolute inset-0 h-[100svh] overflow-y-auto"
            animate={{
              y:     state.y,
              scale: state.scale,
              opacity: state.opacity,
            }}
            transition={state.transition}
            style={{
              /*
               * Active section on top, upcoming sections stacked just behind it.
               * Visited sections go to the very back so they never obscure
               * the active one.
               */
              zIndex:        offset === 0 ? 10 : offset > 0 ? Math.max(1, 5 - offset) : 0,
              // Prevent background sections from capturing pointer events
              pointerEvents: offset === 0 ? "auto" : "none",
              willChange:    "transform, opacity",
              transformOrigin: "center top",
            }}
          >
            {s.content}
          </motion.div>
        );
      })}

      {/* Dot navigation */}
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
