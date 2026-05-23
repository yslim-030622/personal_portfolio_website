"use client";

import {usePrefersReducedMotion} from "@/components/use-prefers-reduced-motion";
import {AnimatePresence, motion} from "motion/react";
import {usePathname} from "next/navigation";
import type {ReactNode} from "react";

export default function Template({children}: {children: ReactNode}) {
  const pathname = usePathname();
  const reduce = usePrefersReducedMotion();

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        key={pathname}
        initial={false}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        transition={{
          duration: reduce ? 0.01 : 0.4,
          ease: [0.22, 1, 0.36, 1]
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
