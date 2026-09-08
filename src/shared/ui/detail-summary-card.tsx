import type { ReactNode } from "react";

import { detailCardSurfaceClass } from "@/shared/ui/detail-card-surface";
import { cn } from "@/shared/lib/cn";

export function DetailSummaryCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(detailCardSurfaceClass, className)}
    >
      {children}
    </div>
  );
}
