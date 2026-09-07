import { MarketingContent } from "@/modules/landing/components/chrome/marketing-content";
import { TransactionHistoryChart } from "@/modules/landing/components/network/transaction-history-chart";
import type { NetworkOverviewView } from "@/modules/landing/domain/home-view-model";
import { CircleInfo } from "@/shared/ui/icons/nucleo";
import Link from "next/link";
import type { ReactNode } from "react";

function StatColumn({
  label,
  showInfo = true,
  showDivider = false,
  children,
}: {
  label: string;
  showInfo?: boolean;
  showDivider?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="relative flex w-full flex-col justify-center px-5 py-4 lg:min-w-0 lg:flex-1 lg:px-6 lg:py-3">
      {showDivider ? (
        <div
          className="absolute left-0 top-1/2 hidden h-10 w-px -translate-y-1/2 bg-neutral-200 lg:block"
          aria-hidden
        />
      ) : null}
      <div className="flex items-center gap-1">
        <p className="text-[13px] text-neutral-500">{label}</p>
        {showInfo ? (
          <CircleInfo className="size-3.5 shrink-0 text-neutral-400" aria-hidden />
        ) : null}
      </div>
      <div className="mt-1">{children}</div>
    </div>
  );
}

export function NetworkStatsSection({ overview }: { overview: NetworkOverviewView }) {
  return (
    <section className="network-stats-section relative z-20">
      <MarketingContent>
        <div className="network-stats-card rounded-2xl bg-white py-1 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
          <div className="flex flex-col divide-y divide-neutral-200 lg:flex-row lg:divide-y-0">
            <StatColumn label="Total Events" showDivider>
              <p className="text-[15px] font-semibold tracking-[-0.01em] text-neutral-900">
                {overview.totalEvents.value}
              </p>
              <p className="mt-0.5 text-[13px] text-neutral-500">
                {overview.totalEvents.sublabel}
              </p>
            </StatColumn>

            <StatColumn label="Contracts Tracked" showDivider>
              <p className="text-[15px] font-semibold tracking-[-0.01em] text-neutral-900">
                {overview.contractsTracked.value}
              </p>
              <p className="mt-0.5 text-[13px] text-neutral-500">
                {overview.contractsTracked.sublabel}
              </p>
            </StatColumn>

            <StatColumn label="Last Indexed Ledger" showDivider>
              <Link
                href={`/ledger/${overview.lastIndexedLedger.sequence}`}
                className="text-[15px] font-semibold tracking-[-0.01em] text-neutral-900 hover:text-primary"
              >
                {overview.lastIndexedLedger.sequence.toLocaleString()}
              </Link>
              <p className="mt-0.5 text-[13px] text-neutral-500">
                {overview.lastIndexedLedger.ago}
              </p>
            </StatColumn>

            <StatColumn label="Events Today" showDivider>
              <p className="text-[15px] font-semibold tracking-[-0.01em] text-neutral-900">
                {overview.eventsToday.value}
              </p>
              <p className="mt-0.5 text-[13px] text-neutral-500">
                {overview.eventsToday.sublabel}
              </p>
            </StatColumn>

            <div className="relative flex w-full flex-col justify-center px-5 py-4 lg:min-w-0 lg:flex-1 lg:px-6 lg:py-3">
              <div
                className="absolute left-0 top-1/2 hidden h-10 w-px -translate-y-1/2 bg-neutral-200 lg:block"
                aria-hidden
              />
              <p className="text-[13px] text-neutral-500">{overview.eventActivityTitle}</p>
              <div className="mt-1 h-[4.5rem]">
                <TransactionHistoryChart
                  data={overview.chartData}
                  startLabel={overview.chartStartDate}
                  endLabel={overview.chartEndDate}
                />
              </div>
            </div>
          </div>
        </div>
      </MarketingContent>
    </section>
  );
}
