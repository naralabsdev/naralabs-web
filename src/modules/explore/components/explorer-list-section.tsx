import { landingFlatSectionClass } from "@/shared/ui/landing-card-surface";
import { cn } from "@/shared/lib/cn";
import type { ReactNode } from "react";

/** Flat list section — matches landing `BorderlessTableSection` surface. */
export function ExplorerListSection({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={cn(landingFlatSectionClass, className)}>{children}</section>;
}

export const explorerListPanelRootClass = "space-y-4";

export const explorerListFiltersClass =
  "flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end";

export const explorerListFilterLabelClass = "mb-1.5 block text-[13px] text-neutral-500";

export const explorerListTableWrapClass = "overflow-x-auto";

export const explorerListPaginationClass = "border-t border-neutral-200/70 pt-4";

export const explorerListErrorClass = "text-sm text-red-600";
