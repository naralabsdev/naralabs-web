import { ExplorerListSection } from "@/modules/explore/components/explorer-list-section";
import { explorerHeroZoneClass } from "@/modules/explore/components/explorer-aurora-backdrop";
import { ExplorerPageHeader } from "@/modules/explore/components/explorer-page-header";
import { cn } from "@/shared/lib/cn";
import type { ReactNode } from "react";

/** List page layout: title sits in the aurora strip; table starts below it (no white overlay on aurora). */
export function ExplorerListPageLayout({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("pb-12", className)}>
      <div className={cn(explorerHeroZoneClass, "flex items-center")}>
        <ExplorerPageHeader title={title} description={description} />
      </div>
      <ExplorerListSection className="pt-10 sm:pt-12">{children}</ExplorerListSection>
    </section>
  );
}
