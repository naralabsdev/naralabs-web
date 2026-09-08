import { DicebearAvatar } from "@/modules/landing/components/activity/dicebear-avatar";
import { LANDING_TABLE_TOOLTIPS } from "@/modules/landing/constants/homepage-content";
import { cn } from "@/shared/lib/cn";
import Link from "next/link";

import {
  BorderlessCell,
  BorderlessHeaderCell,
  BorderlessHeaderRow,
  BorderlessRow,
  BorderlessTable,
  BorderlessTableBody,
  BorderlessTableHead,
  truncateMiddle,
} from "./borderless-table";

export type ExplorerEventRow = {
  id: string;
  eventType: string;
  summary: string;
  contractName?: string;
  contractId?: string;
  ledger: number;
  txnHash: string;
  ago: string;
  decodeStatus?: string;
  decodeLabel?: string;
};

export function RecentEventsTable({
  rows,
  showStatus = false,
  showContract = true,
  emptyMessage = "No events found.",
  className,
}: {
  rows: ExplorerEventRow[];
  showStatus?: boolean;
  showContract?: boolean;
  emptyMessage?: string;
  className?: string;
}) {
  if (rows.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-neutral-500">{emptyMessage}</p>
    );
  }

  return (
    <BorderlessTable
      className={cn(
        showStatus ? "min-w-[48rem]" : "min-w-[40rem]",
        className,
      )}
    >
      <BorderlessTableHead>
        <BorderlessHeaderRow>
          <BorderlessHeaderCell infoTooltip={LANDING_TABLE_TOOLTIPS.events.event}>
            Event
          </BorderlessHeaderCell>
          <BorderlessHeaderCell infoTooltip={LANDING_TABLE_TOOLTIPS.events.summary}>
            Summary
          </BorderlessHeaderCell>
          {showContract ? (
            <BorderlessHeaderCell infoTooltip={LANDING_TABLE_TOOLTIPS.events.contract}>
              Contract
            </BorderlessHeaderCell>
          ) : null}
          {showStatus ? <BorderlessHeaderCell>Status</BorderlessHeaderCell> : null}
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
                    <DicebearAvatar seed={event.id} style="waves" />
                    <p className="font-medium text-neutral-900 group-hover:text-primary">
                      {event.eventType}
                    </p>
                  </div>
                </Link>
              </BorderlessCell>
              <BorderlessCell className="max-w-[16rem] text-sm leading-snug text-neutral-600">
                <Link
                  href={`/events/${event.id}`}
                  className="line-clamp-2 hover:text-primary"
                >
                  {event.summary}
                </Link>
              </BorderlessCell>
              {showContract && event.contractId ? (
                <BorderlessCell>
                  <Link
                    href={`/contracts/${event.contractId}`}
                    className="font-medium text-neutral-900 hover:text-primary"
                  >
                    {event.contractName ?? event.contractId}
                  </Link>
                </BorderlessCell>
              ) : null}
              {showStatus ? (
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
              ) : null}
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
  );
}
