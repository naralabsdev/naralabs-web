"use client";

import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/shared/lib/cn";

const transition = {
  duration: 0.28,
  ease: [0.22, 1, 0.36, 1] as const,
};

export function AnimatedText({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex overflow-hidden", className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={transition}
          className="inline-block"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
