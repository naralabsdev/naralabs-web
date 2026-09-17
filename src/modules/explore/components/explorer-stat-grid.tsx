import type { NetworkStatsSummary } from "@/modules/explore/domain/map-network-stats";
import { NETWORK_OVERVIEW } from "@/modules/landing/constants/homepage-content";

import { ExplorerStatColumn, ExplorerStatsCard } from "./explorer-stat-card";

export function ExplorerStatGrid({ stats }: { stats: NetworkStatsSummary }) {
  return (
    <div className="mb-6">
      <ExplorerStatsCard>
        <ExplorerStatColumn
          label="Total Events"
          tooltip={NETWORK_OVERVIEW.totalEvents.tooltip}
          showDivider
        >
          <p className="text-[15px] font-semibold tracking-[-0.01em] text-neutral-900">
            {stats.totalEvents}
          </p>
          <p className="mt-0.5 text-[13px] text-neutral-500">
            {NETWORK_OVERVIEW.totalEvents.sublabel}
          </p>
        </ExplorerStatColumn>

        <ExplorerStatColumn
          label="Contracts Tracked"
          tooltip={NETWORK_OVERVIEW.contractsTracked.tooltip}
          showDivider
        >
          <p className="text-[15px] font-semibold tracking-[-0.01em] text-neutral-900">
            {stats.contractsTracked}
          </p>
          <p className="mt-0.5 text-[13px] text-neutral-500">
            {NETWORK_OVERVIEW.contractsTracked.sublabel}
          </p>
        </ExplorerStatColumn>

        <ExplorerStatColumn
          label="Last Indexed Ledger"
          tooltip={NETWORK_OVERVIEW.lastIndexedLedger.tooltip}
          showDivider
        >
          <p className="text-[15px] font-semibold tracking-[-0.01em] text-neutral-900">
            {stats.lastIndexedLedger}
          </p>
          <p className="mt-0.5 text-[13px] text-neutral-500">{stats.lastIndexedAgo}</p>
        </ExplorerStatColumn>

        <ExplorerStatColumn
          label="Events Today"
          tooltip={NETWORK_OVERVIEW.eventsToday.tooltip}
          showDivider
        >
          <p className="text-[15px] font-semibold tracking-[-0.01em] text-neutral-900">
            {stats.eventsToday}
          </p>
          <p className="mt-0.5 text-[13px] text-neutral-500">
            {NETWORK_OVERVIEW.eventsToday.sublabel}
          </p>
        </ExplorerStatColumn>
      </ExplorerStatsCard>
    </div>
  );
}
