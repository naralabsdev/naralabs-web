"use client";

import { DetailFieldList } from "@/modules/events/components/detail-field-row";
import { EventOverviewSummary } from "@/modules/events/components/event-overview-summary";
import { HighlightedJson } from "@/modules/events/components/highlighted-json";
import { TopicsTable } from "@/modules/events/components/topics-table";
import { ValueFields } from "@/modules/events/components/value-fields";
import type { EventDetailViewModel } from "@/modules/events/domain/event-view-model";
import { MarketingChrome } from "@/modules/landing/components/chrome/marketing-chrome";
import { MarketingContent } from "@/modules/landing/components/chrome/marketing-content";
import { HeroNav } from "@/modules/landing/components/hero/hero-nav";
import { inter, satoshi } from "@/modules/landing/fonts";
import "@/modules/landing/styles/marketing.css";
import { DetailSectionCard } from "@/shared/ui/detail-section-card";
import { DetailSummaryCard } from "@/shared/ui/detail-summary-card";
import { cn } from "@/shared/lib/cn";

export function EventDetailPage({ event }: { event: EventDetailViewModel }) {
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
                <EventOverviewSummary event={event} />
              </DetailSummaryCard>

              <DetailSectionCard flushContent>
                <DetailFieldList rows={event.overviewRows} />
              </DetailSectionCard>

              <DetailSectionCard title="Topics" flushContent>
                <TopicsTable rows={event.topicRows} />
              </DetailSectionCard>

              <DetailSectionCard title="Value" flushContent>
                <ValueFields rows={event.valueRows} />
              </DetailSectionCard>

              <DetailSectionCard title="XDR" flushContent>
                <HighlightedJson code={event.xdrJson} />
              </DetailSectionCard>
            </div>
          </MarketingContent>
        </main>
      </MarketingChrome>
    </div>
  );
}
