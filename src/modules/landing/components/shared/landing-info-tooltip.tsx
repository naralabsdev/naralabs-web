"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";
import { CircleInfo } from "@/shared/ui/icons/nucleo";

type LandingInfoTooltipProps = {
  content: string;
  className?: string;
  iconClassName?: string;
  side?: "top" | "bottom" | "left" | "right";
  children?: ReactNode;
};

export function LandingInfoTooltip({
  content,
  className,
  iconClassName,
  side = "top",
  children,
}: LandingInfoTooltipProps) {
  return (
    <TooltipPrimitive.Root delayDuration={120}>
      <TooltipPrimitive.Trigger asChild>
        {children ? (
          <span
            tabIndex={0}
            className={cn(
              "inline-flex cursor-help items-center gap-1.5 rounded-sm text-neutral-500 outline-none focus-visible:ring-2 focus-visible:ring-neutral-300",
              className,
            )}
            aria-label={content}
          >
            {children}
            <CircleInfo
              className={cn("size-3.5 shrink-0 text-neutral-400", iconClassName)}
              aria-hidden
            />
          </span>
        ) : (
          <button
            type="button"
            className={cn(
              "inline-flex shrink-0 cursor-help rounded-sm text-neutral-400 transition-colors hover:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300",
              className,
            )}
            aria-label={content}
          >
            <CircleInfo className={cn("size-3.5", iconClassName)} aria-hidden />
          </button>
        )}
      </TooltipPrimitive.Trigger>

      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          sideOffset={8}
          collisionPadding={12}
          className={cn(
            "z-[120] w-max max-w-[260px] rounded-lg border border-neutral-200 bg-white px-3 py-2",
            "text-left text-xs leading-relaxed text-neutral-700 shadow-md",
            "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          )}
        >
          {content}
          <TooltipPrimitive.Arrow className="fill-white" width={10} height={5} />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}
