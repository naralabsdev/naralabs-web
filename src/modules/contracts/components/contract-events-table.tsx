import type { ContractRecentEventRow } from "@/modules/contracts/domain/contract-view-model";
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

export function ContractEventsTable({ rows }: { rows: ContractRecentEventRow[] }) {
  if (rows.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-neutral-500">
        No events match the current filters.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <BorderlessTable className="min-w-[40rem]">
        <BorderlessTableHead>
          <BorderlessHeaderRow>
            <BorderlessHeaderCell withInfo>Event</BorderlessHeaderCell>
            <BorderlessHeaderCell withInfo>Summary</BorderlessHeaderCell>
            <BorderlessHeaderCell withInfo>Status</BorderlessHeaderCell>
            <BorderlessHeaderCell withInfo>Ledger</BorderlessHeaderCell>
            <BorderlessHeaderCell withInfo>Txn</BorderlessHeaderCell>
            <BorderlessHeaderCell withInfo>Age</BorderlessHeaderCell>
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
                <BorderlessCell className="max-w-[16rem] text-sm leading-snug text-neutral-600">
                  <Link href={`/events/${event.id}`} className="line-clamp-2 hover:text-primary">
                    {event.summary}
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
