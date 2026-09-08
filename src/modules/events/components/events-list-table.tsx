import type { EventsListRow } from "@/modules/events/domain/events-list-view-model";
import {
  LANDING_TABLE_TOOLTIPS,
} from "@/modules/landing/constants/homepage-content";
import {
  BorderlessCell,
  BorderlessHeaderCell,
  BorderlessHeaderRow,
  BorderlessRow,
  BorderlessTable,
  BorderlessTableBody,
  BorderlessTableHead,
  truncateMiddle,
} from "@/modules/landing/components/activity/borderless-table";
import { DicebearAvatar } from "@/modules/landing/components/activity/dicebear-avatar";
import { cn } from "@/shared/lib/cn";
import Link from "next/link";

export function EventsListTable({ rows }: { rows: EventsListRow[] }) {
  if (rows.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-neutral-500">
        No events match the current filters.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto px-5 pb-2 sm:px-6">
      <BorderlessTable className="min-w-[48rem]">
        <BorderlessTableHead>
          <BorderlessHeaderRow>
            <BorderlessHeaderCell infoTooltip={LANDING_TABLE_TOOLTIPS.events.event}>
              Event
            </BorderlessHeaderCell>
            <BorderlessHeaderCell infoTooltip={LANDING_TABLE_TOOLTIPS.events.summary}>
              Summary
            </BorderlessHeaderCell>
            <BorderlessHeaderCell infoTooltip={LANDING_TABLE_TOOLTIPS.events.contract}>
              Contract
            </BorderlessHeaderCell>
            <BorderlessHeaderCell>Status</BorderlessHeaderCell>
            <BorderlessHeaderCell infoTooltip={LANDING_TABLE_TOOLTIPS.events.ledger}>
              Ledger
            </BorderlessHeaderCell>
            <BorderlessHeaderCell infoTooltip={LANDING_TABLE_TOOLTIPS.events.txn}>
              Txn
            </BorderlessHeaderCell>
            <BorderlessHeaderCell infoTooltip={LANDING_TABLE_TOOLTIPS.events.age}>
              Age
            </BorderlessHeaderCell>
          </BorderlessHeaderRow>
        </BorderlessTableHead>
        <BorderlessTableBody>
          {rows.map((event) => {
            const decodeClass =
              event.decodeStatus === "decoded"
                ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                : "bg-neutral-100 text-neutral-600 ring-neutral-200";

            return (
              <BorderlessRow key={event.id}>
                <BorderlessCell>
                  <Link href={`/events/${event.id}`} className="group block">
                    <div className="flex items-center gap-2.5">
                      <DicebearAvatar seed={event.id} style="waves" className="size-6" />
                      <p className="font-medium text-neutral-900 group-hover:text-primary">
                        {event.eventType}
                      </p>
                    </div>
                  </Link>
                </BorderlessCell>
                <BorderlessCell className="max-w-[18rem] text-sm leading-snug text-neutral-600">
                  <Link href={`/events/${event.id}`} className="line-clamp-2 hover:text-primary">
                    {event.summary}
                  </Link>
                </BorderlessCell>
                <BorderlessCell>
                  <Link
                    href={`/contracts/${event.contractId}`}
                    className="font-medium text-neutral-900 hover:text-primary"
                  >
                    {event.contractName}
                  </Link>
                </BorderlessCell>
                <BorderlessCell>
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
                      decodeClass,
                    )}
                  >
                    {event.decodeLabel}
                  </span>
                </BorderlessCell>
                <BorderlessCell>
                  <Link
                    href={`/ledger/${event.ledger}`}
                    className="font-mono text-sm text-primary hover:underline"
                  >
                    #{event.ledger.toLocaleString()}
                  </Link>
                </BorderlessCell>
                <BorderlessCell>
                  <Link
                    href={`/tx/${event.txnHash}`}
                    className="font-mono text-sm text-primary hover:underline"
                  >
                    {truncateMiddle(event.txnHash, 6, 4)}
                  </Link>
                </BorderlessCell>
                <BorderlessCell className="whitespace-nowrap text-neutral-600">
                  {event.ago}
                </BorderlessCell>
              </BorderlessRow>
            );
          })}
        </BorderlessTableBody>
      </BorderlessTable>
    </div>
  );
}
