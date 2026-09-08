"use client";

import { cn } from "@/shared/lib/cn";
import { CircleInfo } from "@/shared/ui/icons/nucleo";
import { Tooltip } from "@/shared/ui/tooltip";

type LandingInfoTooltipProps = {
  content: string;
  className?: string;
  iconClassName?: string;
  side?: "top" | "bottom" | "left" | "right";
};

export function LandingInfoTooltip({
  content,
  className,
  iconClassName,
  side = "top",
}: LandingInfoTooltipProps) {
  return (
    <Tooltip
      content={
        <p className="max-w-[240px] px-3 py-2 text-left text-xs leading-relaxed text-neutral-700">
          {content}
        </p>
      }
      side={side}
    >
      <button
        type="button"
        className={cn(
          "inline-flex shrink-0 rounded-sm text-neutral-400 transition-colors hover:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300",
          className,
        )}
        aria-label={content}
      >
        <CircleInfo className={cn("size-3.5", iconClassName)} aria-hidden />
      </button>
    </Tooltip>
  );
}
