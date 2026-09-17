import Link from "next/link";

import { explorerHeroZoneClass } from "@/modules/explore/components/explorer-aurora-backdrop";
import { ExplorerPageHeader } from "@/modules/explore/components/explorer-page-header";
import { cn } from "@/shared/lib/cn";
import type { ReactNode } from "react";

export type ExplorerDetailBackLink = {
  label: string;
  href: string;
};

/** Detail page layout: title sits in the aurora strip; cards start below it. */
export function ExplorerDetailPageLayout({
  title,
  description,
  backLink,
  children,
  className,
  contentClassName,
}: {
  title: string;
  description: string;
  backLink?: ExplorerDetailBackLink;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <section className={cn("pb-12", className)}>
      <div className={cn(explorerHeroZoneClass, "flex flex-col justify-center")}>
        {backLink ? (
          <Link
            href={backLink.href}
            className="mb-3 inline-flex w-fit text-sm font-medium text-white/90 transition-colors hover:text-white hover:underline"
          >
            ← {backLink.label}
          </Link>
        ) : null}
        <ExplorerPageHeader title={title} description={description} />
      </div>
      <div className={cn("space-y-3 pt-10 sm:pt-12", contentClassName)}>{children}</div>
    </section>
  );
}
