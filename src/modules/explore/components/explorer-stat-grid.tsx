import type { NetworkStatsSummary } from "@/modules/explore/domain/map-network-stats";
import { detailCardSurfaceClass } from "@/shared/ui/detail-card-surface";

export function ExplorerStatGrid({ stats }: { stats: NetworkStatsSummary }) {
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
    <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className={detailCardSurfaceClass}>
          <div className="px-5 py-4">
            <p className="text-xs font-medium text-neutral-500">{item.label}</p>
            <p className="mt-2 text-xl font-semibold tracking-tight text-neutral-900">
              {item.value}
            </p>
            {item.hint ? (
              <p className="mt-1 text-xs text-neutral-500">{item.hint}</p>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
