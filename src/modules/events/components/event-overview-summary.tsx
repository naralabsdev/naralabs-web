"use client";

import { DicebearAvatar } from "@/modules/landing/components/activity/dicebear-avatar";
import type { EventDetailViewModel } from "@/modules/events/domain/event-view-model";
import { cn } from "@/shared/lib/cn";

export function EventOverviewSummary({ event }: { event: EventDetailViewModel }) {
  const decodeClass =
    event.decodeStatus === "decoded"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : "bg-neutral-100 text-neutral-600 ring-neutral-200";

  return (
    <div className="flex items-center gap-2.5 px-4 py-3">
      <DicebearAvatar seed={event.id} style="waves" className="size-7 shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <h1 className="text-sm font-semibold text-neutral-900">{event.eventType}</h1>
          <span
            className={cn(
              "inline-flex rounded-full px-1.5 py-px text-[10px] font-medium ring-1 ring-inset",
              decodeClass,
            )}
          >
            {event.decodeLabel}
          </span>
        </div>
        <p className="mt-0.5 line-clamp-1 text-xs text-neutral-600">{event.summary}</p>
        <p className="mt-0.5 text-[11px] text-neutral-500">{event.ingestedAgo}</p>
      </div>
    </div>
  );
}
