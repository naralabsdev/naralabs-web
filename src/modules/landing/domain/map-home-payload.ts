import type {
  ContractItem,
  EventItem,
  HomePayload,
  NetworkStats,
} from "@/modules/landing/domain/atlas-types";
import type {
  ActiveContractRow,
  HomePageViewModel,
  NetworkOverviewView,
  RecentEventRow,
} from "@/modules/landing/domain/home-view-model";
import { NETWORK_OVERVIEW } from "@/modules/landing/constants/homepage-content";
import { nFormatter } from "@/shared/lib/functions/nformatter";
import { timeAgo } from "@/shared/lib/functions/time-ago";

function formatChartLabel(isoDate: string | undefined): string {
  if (!isoDate) return "—";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "—";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}.${month}`;
}

function truncateContractId(contractId: string): string {
  if (contractId.length <= 12) return contractId;
  return `${contractId.slice(0, 4)}…${contractId.slice(-4)}`;
}

function resolveContractName(
  contractId: string,
  namesById: Map<string, string>,
): string {
  return namesById.get(contractId) ?? truncateContractId(contractId);
}

function formatEventLabel(raw: string): string {
  const normalized = raw
    .trim()
    .replaceAll("_", " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase();
  if (!normalized) return "Event";
  return normalized.replace(/\b\w/g, (char) => char.toUpperCase());
}

function buildNamesById(contracts: ContractItem[]): Map<string, string> {
  return new Map(
    contracts
      .filter((contract) => contract.display_name?.trim())
      .map((contract) => [contract.contract_id, contract.display_name!.trim()]),
  );
}

export function mapStatsToOverview(stats: NetworkStats): NetworkOverviewView {
  const activity = stats.activity ?? [];
  const chartData = activity.map((bucket) => bucket.count);

  return {
    totalEvents: {
      raw: stats.total_events,
      value: nFormatter(stats.total_events, { full: true }),
      sublabel: NETWORK_OVERVIEW.totalEvents.sublabel,
      tooltip: NETWORK_OVERVIEW.totalEvents.tooltip,
    },
    contractsTracked: {
      raw: stats.contract_count,
      value: nFormatter(stats.contract_count, { full: true }),
      sublabel: NETWORK_OVERVIEW.contractsTracked.sublabel,
      tooltip: NETWORK_OVERVIEW.contractsTracked.tooltip,
    },
    lastIndexedLedger: {
      sequence: stats.last_ingested_ledger,
      indexedAt: stats.last_indexed_at ?? null,
      ago: stats.last_indexed_at
        ? timeAgo(new Date(stats.last_indexed_at), { withAgo: true })
        : "—",
      tooltip: NETWORK_OVERVIEW.lastIndexedLedger.tooltip,
    },
    eventsToday: {
      raw: stats.events_24h,
      value: nFormatter(stats.events_24h, { full: true }),
      sublabel: NETWORK_OVERVIEW.eventsToday.sublabel,
      tooltip: NETWORK_OVERVIEW.eventsToday.tooltip,
    },
    ingestLagLedgers: stats.ingest_lag_ledgers ?? null,
    eventActivityTitle: NETWORK_OVERVIEW.eventActivityTitle,
    eventActivityTooltip: NETWORK_OVERVIEW.eventActivityTooltip,
    chartStartDate: formatChartLabel(activity[0]?.bucket),
    chartEndDate: formatChartLabel(activity[activity.length - 1]?.bucket),
    chartLabels:
      activity.length > 0
        ? activity.map((bucket) => formatChartLabel(bucket.bucket))
        : ["—"],
    chartData: chartData.length > 0 ? chartData : [0],
  };
}

export function mapRecentEvents(
  events: EventItem[],
  namesById: Map<string, string>,
): RecentEventRow[] {
  return events.map((event) => ({
    id: event.id,
    eventType: formatEventLabel(event.event_type),
    summary: event.summary_preview,
    contractName: resolveContractName(event.contract_id, namesById),
    contractId: event.contract_id,
    ledger: event.ledger,
    txnHash: event.txn_hash,
    ingestedAt: event.ingested_at,
    ago: timeAgo(new Date(event.ingested_at), { withAgo: true }),
  }));
}

export function mapActiveContracts(
  contracts: ContractItem[],
): ActiveContractRow[] {
  return contracts.map((contract) => ({
    id: contract.contract_id,
    name:
      contract.display_name?.trim() || truncateContractId(contract.contract_id),
    eventCount: contract.event_count,
    schemaStatus: contract.schema_status,
    lastSeenAt: contract.last_seen,
    lastActivity: timeAgo(new Date(contract.last_seen), { withAgo: true }),
    ledgerRange: `${contract.first_ledger.toLocaleString()} – ${contract.last_ledger.toLocaleString()}`,
  }));
}

export function mapHomePayload(payload: HomePayload): HomePageViewModel {
  const namesById = buildNamesById(payload.active_contracts);

  return {
    networkOverview: mapStatsToOverview(payload.stats),
    recentEvents: mapRecentEvents(payload.recent_events, namesById),
    activeContracts: mapActiveContracts(payload.active_contracts),
  };
}

export function bumpOverviewForIngestedEvents(
  overview: NetworkOverviewView,
  eventCount: number,
): NetworkOverviewView {
  if (eventCount <= 0) {
    return overview;
  }

  const chartData = [...overview.chartData];
  if (chartData.length > 0) {
    chartData[chartData.length - 1] += eventCount;
  }

  return {
    ...overview,
    totalEvents: {
      ...overview.totalEvents,
      raw: overview.totalEvents.raw + eventCount,
    },
    eventsToday: {
      ...overview.eventsToday,
      raw: overview.eventsToday.raw + eventCount,
    },
    chartData,
  };
}

export function mergeIngestedEvents(
  current: HomePageViewModel,
  incoming: EventItem[],
  limit = 8,
): HomePageViewModel {
  const namesById = buildNamesById(
    current.activeContracts.map((contract) => ({
      contract_id: contract.id,
      display_name: contract.name.includes("…") ? null : contract.name,
      event_count: contract.eventCount,
      first_ledger: 0,
      last_ledger: 0,
      last_seen: contract.lastSeenAt,
      schema_status: contract.schemaStatus,
    })),
  );

  const mergedRows = mapRecentEvents(incoming, namesById);

  for (const row of current.recentEvents) {
    if (mergedRows.length >= limit) break;
    if (mergedRows.some((item) => item.id === row.id)) continue;
    mergedRows.push(row);
  }

  return {
    ...current,
    recentEvents: mergedRows.slice(0, limit),
    networkOverview: bumpOverviewForIngestedEvents(
      current.networkOverview,
      incoming.length,
    ),
  };
}
