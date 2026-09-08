import type { ReactNode } from "react";

import { detailCardShadowClass } from "@/shared/ui/detail-card-surface";
import { cn } from "@/shared/lib/cn";

export function DetailSectionCard({
  title,
  description,
  action,
  children,
  className,
  headerClassName,
  contentClassName,
  flushContent = false,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  flushContent?: boolean;
}) {
  const hasHeader = Boolean(title || description || action);

  return (
    <section
      className={cn(
        "mt-3 overflow-hidden rounded-xl bg-white",
        detailCardShadowClass,
        className,
      )}
    >
      {hasHeader ? (
        <div
          className={cn(
            "flex flex-col gap-3 border-b border-neutral-100 px-5 py-3 sm:flex-row sm:items-start sm:justify-between sm:px-6",
            headerClassName,
          )}
        >
          <div className="min-w-0">
            {title ? (
              <h2 className="text-sm font-semibold text-neutral-900">{title}</h2>
            ) : null}
            {description ? (
              <p className="mt-1 text-sm text-neutral-500">{description}</p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}

      {flushContent ? (
        children
      ) : (
        <div
          className={cn(
            "px-5 pb-5 pt-4 sm:px-6 sm:pb-6",
            contentClassName,
          )}
        >
          {children}
        </div>
      )}
    </section>
  );
}
