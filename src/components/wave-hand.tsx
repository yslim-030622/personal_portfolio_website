"use client";

import {useEffect, useRef, type CSSProperties} from "react";

export function WaveHand({slideDelay, waveDelay}: {slideDelay: number; waveDelay: number}) {
  const waveRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const onSection = (e: Event) => {
      const {index} = (e as CustomEvent<{index: number}>).detail;
      if (index !== 0 || !waveRef.current) return;
      // Restart the CSS animation by briefly removing it
      waveRef.current.style.animation = "none";
      void waveRef.current.offsetHeight;
      waveRef.current.style.animation = "";
    };
    document.addEventListener("fp-section-change", onSection);
    return () => document.removeEventListener("fp-section-change", onSection);
  }, []);

  return (
    <span
      className="wave-hand-wrap"
      style={{
        display: "inline-block",
        marginLeft: "0.08em",
        marginRight: "-0.08em",
        overflow: "visible",
        whiteSpace: "nowrap",
      }}
    >
      <span className="word-slide" style={{animationDelay: `${slideDelay}ms`}}>
        <span
          ref={waveRef}
          className="wave-hand"
          style={{"--wave-delay": `${waveDelay}ms`} as CSSProperties}
        >
          👋
        </span>
      </span>
    </span>
  );
}
