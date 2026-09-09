"use client";

import { DetailFieldList } from "@/modules/events/components/detail-field-row";
import { EventOverviewSummary } from "@/modules/events/components/event-overview-summary";
import { HighlightedJson } from "@/modules/events/components/highlighted-json";
import { TopicsTable } from "@/modules/events/components/topics-table";
import { ValueFields } from "@/modules/events/components/value-fields";
import type { EventDetailViewModel } from "@/modules/events/domain/event-view-model";
import { ExplorerPageShell } from "@/modules/explore/components/explorer-page-shell";
import { DetailSectionCard } from "@/shared/ui/detail-section-card";
import { DetailSummaryCard } from "@/shared/ui/detail-summary-card";

export function EventDetailPage({ event }: { event: EventDetailViewModel }) {
  return (
    <ExplorerPageShell>
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
    </ExplorerPageShell>
  );
}
