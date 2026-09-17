import { LandingInfoTooltip } from "@/modules/landing/components/shared/landing-info-tooltip";
import { landingElevatedCardClass } from "@/shared/ui/landing-card-surface";
import { cn } from "@/shared/lib/cn";
import type { ReactNode } from "react";

export function ExplorerStatsCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(landingElevatedCardClass, "py-1", className)}>
      <div className="flex flex-col divide-y divide-neutral-200 lg:flex-row lg:divide-y-0">
        {children}
      </div>
    </div>
  );
}

export function ExplorerStatColumn({
  label,
  tooltip,
  showDivider = false,
  children,
}: {
  label: string;
  tooltip?: string;
  showDivider?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="relative flex w-full flex-col justify-center px-5 py-4 lg:min-w-0 lg:flex-1 lg:px-6 lg:py-3">
      {showDivider ? (
        <div
          className="absolute left-0 top-1/2 hidden h-10 w-px -translate-y-1/2 bg-neutral-200 lg:block"
          aria-hidden
        />
      ) : null}
      <div className="flex items-center gap-1">
        <p className="text-[13px] text-neutral-500">{label}</p>
        {tooltip ? <LandingInfoTooltip content={tooltip} /> : null}
      </div>
      <div className="mt-1">{children}</div>
    </div>
  );
}
