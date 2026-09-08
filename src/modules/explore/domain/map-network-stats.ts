import type { NetworkStats } from "@/modules/explore/domain/atlas-types";
import { nFormatter } from "@/shared/lib/functions/nformatter";
import { timeAgo } from "@/shared/lib/functions/time-ago";

export type NetworkStatsSummary = {
  network: string;
  totalEvents: string;
  contractsTracked: string;
  eventsToday: string;
  lastIndexedLedger: string;
  lastIndexedAgo: string;
};

export function mapNetworkStatsSummary(stats: NetworkStats): NetworkStatsSummary {
  return {
    network: stats.network,
    totalEvents: nFormatter(stats.total_events, { full: true }),
    contractsTracked: nFormatter(stats.contract_count, { full: true }),
    eventsToday: nFormatter(stats.events_24h, { full: true }),
    lastIndexedLedger: stats.last_ingested_ledger.toLocaleString(),
    lastIndexedAgo: stats.last_indexed_at
      ? timeAgo(new Date(stats.last_indexed_at), { withAgo: true })
      : "—",
  };
}
