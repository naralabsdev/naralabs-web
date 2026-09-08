import type { NetworkStatsSummary } from "@/modules/explore/domain/map-network-stats";
import { DetailSummaryCard } from "@/shared/ui/detail-summary-card";

export function ExplorerListSummary({
  title,
  description,
  stats,
}: {
  title: string;
  description: string;
  stats: NetworkStatsSummary;
}) {
  const items = [
    { label: "Total events", value: stats.totalEvents, hint: "Indexed from Soroban" },
    { label: "Contracts tracked", value: stats.contractsTracked, hint: "With indexed activity" },
    { label: "Events today", value: stats.eventsToday, hint: "Last 24 hours" },
    {
      label: "Last indexed ledger",
      value: stats.lastIndexedLedger,
      hint: stats.lastIndexedAgo,
    },
  ];

  return (
    <DetailSummaryCard>
      <div className="px-5 py-4 sm:px-6">
        <h1 className="text-lg font-semibold tracking-tight text-neutral-900">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-neutral-500">{description}</p>

        <dl className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.label} className="min-w-0">
              <dt className="text-xs font-medium text-neutral-500">{item.label}</dt>
              <dd className="mt-1 text-base font-semibold tracking-tight text-neutral-900">
                {item.value}
              </dd>
              {item.hint ? (
                <dd className="mt-0.5 text-xs text-neutral-500">{item.hint}</dd>
              ) : null}
            </div>
          ))}
        </dl>
      </div>
    </DetailSummaryCard>
  );
}
