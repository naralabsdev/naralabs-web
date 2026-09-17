"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";

import { nFormatter } from "@/shared/lib/functions/nformatter";
import { cn } from "@/shared/lib/cn";

type AnimatedNumberProps = {
  value: number;
  format?: "compact" | "full" | "integer";
  className?: string;
};

export function AnimatedNumber({
  value,
  format = "full",
  className,
}: AnimatedNumberProps) {
  const motionValue = useMotionValue(value);
  const display = useTransform(motionValue, (latest) => {
    if (format === "integer") {
      return Math.round(latest).toLocaleString();
    }
    return nFormatter(Math.max(0, latest), { full: format === "full" });
  });
  const previousRef = useRef(value);

  useEffect(() => {
    const previous = previousRef.current;
    if (previous === value) {
      motionValue.set(value);
      return;
    }

    previousRef.current = value;
    const controls = animate(motionValue, value, {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1],
    });

    return () => controls.stop();
  }, [motionValue, value]);

  return (
    <motion.span className={cn("tabular-nums", className)}>{display}</motion.span>
  );
}
