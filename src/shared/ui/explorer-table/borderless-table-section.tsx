import { cn } from "@/shared/lib/cn";
import { ArrowRight } from "@/shared/ui/icons/nucleo";
import Link from "next/link";
import type { ReactNode } from "react";

export function BorderlessTableSection({
  title,
  viewAllHref,
  children,
  className,
}: {
  title: string;
  viewAllHref: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("bg-white px-5 py-5 sm:px-6", className)}>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold tracking-tight text-neutral-900">{title}</h2>
        <Link
          href={viewAllHref}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View all
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </div>
      <div className="overflow-x-auto">{children}</div>
    </section>
  );
}
