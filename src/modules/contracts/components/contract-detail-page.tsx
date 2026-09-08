"use client";

import { ContractEventsPanel } from "@/modules/contracts/components/contract-events-panel";
import { ContractOverviewSummary } from "@/modules/contracts/components/contract-overview-summary";
import { TypeBreakdownTable } from "@/modules/contracts/components/type-breakdown-table";
import type { ContractDetailViewModel } from "@/modules/contracts/domain/contract-view-model";
import { DetailFieldList } from "@/modules/events/components/detail-field-row";
import { MarketingChrome } from "@/modules/landing/components/chrome/marketing-chrome";
import { MarketingContent } from "@/modules/landing/components/chrome/marketing-content";
import { HeroNav } from "@/modules/landing/components/hero/hero-nav";
import { inter, satoshi } from "@/modules/landing/fonts";
import "@/modules/landing/styles/marketing.css";
import { DetailSectionCard } from "@/shared/ui/detail-section-card";
import { DetailSummaryCard } from "@/shared/ui/detail-summary-card";
import { cn } from "@/shared/lib/cn";

export function ContractDetailPage({ contract }: { contract: ContractDetailViewModel }) {
  return (
    <div
      className={cn(
        satoshi.variable,
        inter.variable,
        "marketing-theme font-default flex min-h-screen flex-col overflow-x-hidden",
      )}
      style={{ backgroundColor: "#fafbfd" }}
    >
      <MarketingChrome>
        <header className="bg-white">
          <HeroNav theme="light" />
        </header>

        <main className="pb-14 pt-12">
          <MarketingContent>
            <div>
              <DetailSummaryCard>
                <ContractOverviewSummary contract={contract} />
              </DetailSummaryCard>

              <DetailSectionCard flushContent>
                <DetailFieldList rows={contract.overviewRows} />
              </DetailSectionCard>

              <DetailSectionCard title="Events by Type">
                <TypeBreakdownTable rows={contract.typeBreakdown} />
              </DetailSectionCard>

              <DetailSectionCard title="Events">
                <ContractEventsPanel
                  contractId={contract.id}
                  network={contract.network}
                  eventTypes={contract.typeBreakdown}
                />
              </DetailSectionCard>
            </div>
          </MarketingContent>
        </main>
      </MarketingChrome>
    </div>
  );
}
