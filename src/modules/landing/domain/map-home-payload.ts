import type { HomePayload } from "@/modules/landing/domain/atlas-types";
import type {
  ActiveContractRow,
  HomePageViewModel,
  RecentEventRow,
} from "@/modules/landing/domain/home-view-model";
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

function mapRecentEvents(
  payload: HomePayload,
  namesById: Map<string, string>,
): RecentEventRow[] {
  return payload.recent_events.map((event) => ({
    id: event.id,
    eventType: formatEventLabel(event.event_type),
    summary: event.summary_preview,
    contractName: resolveContractName(event.contract_id, namesById),
    contractId: event.contract_id,
    ledger: event.ledger,
    txnHash: event.txn_hash,
    ago: timeAgo(new Date(event.ingested_at), { withAgo: true }),
  }));
}

function mapActiveContracts(payload: HomePayload): ActiveContractRow[] {
  return payload.active_contracts.map((contract) => ({
    id: contract.contract_id,
    name: contract.display_name?.trim() || truncateContractId(contract.contract_id),
    eventCount: contract.event_count,
    schemaStatus: contract.schema_status,
    lastActivity: timeAgo(new Date(contract.last_seen), { withAgo: true }),
    ledgerRange: `${contract.first_ledger.toLocaleString()} – ${contract.last_ledger.toLocaleString()}`,
  }));
}

export function mapHomePayload(payload: HomePayload): HomePageViewModel {
  const namesById = new Map(
    payload.active_contracts
      .filter((contract) => contract.display_name?.trim())
      .map((contract) => [contract.contract_id, contract.display_name!.trim()]),
  );

  const activity = payload.stats.activity ?? [];
  const chartData = activity.map((bucket) => bucket.count);

  return {
    networkOverview: {
      totalEvents: {
        value: nFormatter(payload.stats.total_events, { full: true }),
        sublabel: "indexed from Soroban",
      },
      contractsTracked: {
        value: nFormatter(payload.stats.contract_count, { full: true }),
        sublabel: "with events",
      },
      lastIndexedLedger: {
        sequence: payload.stats.last_ingested_ledger,
        ago: payload.stats.last_indexed_at
          ? timeAgo(new Date(payload.stats.last_indexed_at), { withAgo: true })
          : "—",
      },
      eventsToday: {
        value: nFormatter(payload.stats.events_24h, { full: true }),
        sublabel: "last 24 hours",
      },
      eventActivityTitle: "Event activity",
      chartStartDate: formatChartLabel(activity[0]?.bucket),
      chartEndDate: formatChartLabel(activity[activity.length - 1]?.bucket),
      chartData: chartData.length > 0 ? chartData : [0],
    },
    recentEvents: mapRecentEvents(payload, namesById),
    activeContracts: mapActiveContracts(payload),
  };
}
