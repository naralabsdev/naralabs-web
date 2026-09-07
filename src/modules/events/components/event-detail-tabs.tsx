"use client";

import type { ReactNode } from "react";

import { DetailFieldList } from "@/modules/events/components/detail-field-row";
import { EventOverviewSummary } from "@/modules/events/components/event-overview-summary";
import { HighlightedJson } from "@/modules/events/components/highlighted-json";
import { TopicsTable } from "@/modules/events/components/topics-table";
import { ValueFields } from "@/modules/events/components/value-fields";
import type { EventDetailViewModel } from "@/modules/events/domain/event-view-model";

function EventSectionCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-3 overflow-hidden rounded-xl bg-white">
      <div className="border-b border-neutral-100 px-5 py-3 sm:px-6">
        <h2 className="text-sm font-semibold text-neutral-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export function EventDetailTabs({ event }: { event: EventDetailViewModel }) {
  return (
    <div>
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <EventOverviewSummary event={event} />
      </div>

      <section className="mt-3 overflow-hidden rounded-xl bg-white">
        <DetailFieldList rows={event.overviewRows} />
      </section>

      <EventSectionCard title="Topics">
        <TopicsTable rows={event.topicRows} />
      </EventSectionCard>

      <EventSectionCard title="Value">
        <ValueFields rows={event.valueRows} />
      </EventSectionCard>

      <EventSectionCard title="XDR">
        <HighlightedJson code={event.xdrJson} />
      </EventSectionCard>
    </div>
  );
}
