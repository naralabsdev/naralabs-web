"use client";

import { cn } from "@/shared/lib/cn";

import { ContractDetailContent } from "@/modules/contracts/components/contract-detail-content";
import type { ContractDetailViewModel } from "@/modules/contracts/domain/contract-view-model";
import { MarketingChrome } from "@/modules/landing/components/chrome/marketing-chrome";
import { MarketingContent } from "@/modules/landing/components/chrome/marketing-content";
import { HeroNav } from "@/modules/landing/components/hero/hero-nav";
import { inter, satoshi } from "@/modules/landing/fonts";
import "@/modules/landing/styles/marketing.css";

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
            <ContractDetailContent contract={contract} />
          </MarketingContent>
        </main>
      </MarketingChrome>
    </div>
  );
}
