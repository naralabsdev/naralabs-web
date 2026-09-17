"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

import { borderlessRowDividerClass } from "./borderless-table";

const layoutEase = [0.22, 1, 0.36, 1] as const;

export function AnimatedTableRow({
  children,
  className,
  isNew = false,
  layout = true,
}: {
  children: ReactNode;
  className?: string;
  isNew?: boolean;
  layout?: boolean | "position";
}) {
  return (
    <motion.tr
      layout={layout}
      initial={isNew ? { opacity: 0, y: -14 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        layout: { duration: 0.45, ease: layoutEase },
        opacity: { duration: isNew ? 0.3 : 0 },
        y: { duration: 0.45, ease: layoutEase },
      }}
      className={cn(
        "text-neutral-800 transition-colors hover:bg-neutral-50/80",
        borderlessRowDividerClass,
        "last:bg-none",
        className,
      )}
    >
      {children}
    </motion.tr>
  );
}
