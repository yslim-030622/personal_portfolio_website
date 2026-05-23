"use client";

import {motion} from "motion/react";
import type {ReactNode} from "react";
import {usePrefersReducedMotion} from "./use-prefers-reduced-motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section";
};

export function Reveal({
  children,
  className,
  delay = 0,
  as = "div"
}: RevealProps) {
  const reduce = usePrefersReducedMotion();
  const Component = as === "section" ? motion.section : motion.div;

  return (
    <Component
      className={className}
      initial={reduce ? false : {opacity: 0, y: 24, scale: 0.98}}
      whileInView={reduce ? undefined : {opacity: 1, y: 0, scale: 1}}
      viewport={{once: true, margin: "0px 0px -6% 0px", amount: 0.1}}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      {children}
    </Component>
  );
}
