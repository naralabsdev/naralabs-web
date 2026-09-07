import type { EventDetailPayload } from "@/modules/events/domain/atlas-types";
import { getEventFieldTip } from "@/modules/events/constants/field-tips";
import type {
  DetailFieldRow,
  EventDetailViewModel,
  TopicTableRow,
  ValueFieldRow,
} from "@/modules/events/domain/event-view-model";
import { timeAgo } from "@/shared/lib/functions/time-ago";

function formatEventLabel(raw: string): string {
  const normalized = raw
    .trim()
    .replaceAll("_", " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase();
  if (!normalized) return "Event";
  return normalized.replace(/\b\w/g, (char) => char.toUpperCase());
}

function truncateMiddle(value: string, head = 8, tail = 6): string {
  if (value.length <= head + tail + 3) return value;
  return `${value.slice(0, head)}…${value.slice(-tail)}`;
}

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });
}

function prettyJson(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function formatStroopsAmount(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return raw;

  const negative = trimmed.startsWith("-");
  const digits = negative ? trimmed.slice(1) : trimmed;
  const whole = BigInt(digits) / 10_000_000n;
  const frac = BigInt(digits) % 10_000_000n;
  const sign = negative ? "−" : "";

  if (frac === 0n) return `${sign}${whole.toString()} XLM`;

  let fracStr = frac.toString().padStart(7, "0").replace(/0+$/, "");
  return `${sign}${whole.toString()}.${fracStr} XLM`;
}

function stringifyTaggedValue(type: string, value: unknown): string {
  if (value === null || value === undefined) return "—";

  if (type === "bool") {
    return value ? "True" : "False";
  }

  if (typeof value === "string" || typeof value === "number") {
    if (type === "i128" || type === "i64" || type === "i32") {
      return formatStroopsAmount(String(value));
    }
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => stringifyUnknownValue(item)).join(", ");
  }

  if (typeof value === "object") {
    return stringifyUnknownValue(value);
  }

  return String(value);
}

function stringifyUnknownValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value !== "object") return String(value);

  const record = value as Record<string, unknown>;
  const keys = Object.keys(record);
  if (keys.length === 1) {
    return stringifyTaggedValue(keys[0]!, record[keys[0]!]);
  }

  return JSON.stringify(value);
}

function parseTopicRows(topics: unknown): TopicTableRow[] {
  if (!Array.isArray(topics)) return [];

  return topics.map((item, index) => {
    if (typeof item !== "object" || item === null) {
      return {
        index,
        type: "raw",
        value: stringifyUnknownValue(item),
        raw: prettyJson(item),
      };
    }

    const record = item as Record<string, unknown>;
    const keys = Object.keys(record);
    if (keys.length === 1) {
      const type = keys[0]!;
      const rawValue = record[type];
      return {
        index,
        type,
        value: stringifyTaggedValue(type, rawValue),
        raw: typeof rawValue === "string" ? rawValue : prettyJson(rawValue),
      };
    }

    return {
      index,
      type: "object",
      value: stringifyUnknownValue(item),
      raw: prettyJson(item),
    };
  });
}

function parseValueRows(value: unknown): ValueFieldRow[] {
  if (value === null || value === undefined) {
    return [{ label: "Value", type: "empty", display: "—" }];
  }

  if (typeof value !== "object") {
    return [{ label: "Value", type: typeof value, display: String(value) }];
  }

  const record = value as Record<string, unknown>;
  const keys = Object.keys(record);

  if (keys.length === 1) {
    const type = keys[0]!;
    const raw = record[type];
    const display = stringifyTaggedValue(type, raw);
    const hint =
      type === "i128" || type === "i64" || type === "i32"
        ? `Raw ${type}: ${typeof raw === "string" || typeof raw === "number" ? String(raw) : prettyJson(raw)}`
        : undefined;

    return [{ label: formatEventLabel(type), type, display, hint }];
  }

  if ("entries" in record && Array.isArray(record.entries)) {
    return (record.entries as Array<{ k?: unknown; v?: unknown }>).map((entry, index) => {
      const keyLabel = stringifyUnknownValue(entry.k);
      const valLabel = stringifyUnknownValue(entry.v);
      return {
        label: keyLabel || `Field ${index + 1}`,
        type: "map",
        display: valLabel,
      };
    });
  }

  return Object.entries(record).map(([key, raw]) => ({
    label: formatEventLabel(key),
    type: typeof raw,
    display: stringifyUnknownValue(raw),
  }));
}

function withFieldTip(row: DetailFieldRow): DetailFieldRow {
  return {
    ...row,
    tip: getEventFieldTip(row.label),
  };
}

function buildOverviewRows(payload: EventDetailPayload): DetailFieldRow[] {
  const decodeBadge =
    payload.decode_status === "decoded"
      ? { text: "Decoded", tone: "success" as const }
      : { text: "Raw", tone: "neutral" as const };

  return [
    withFieldTip({
      label: "Event ID",
      value: payload.id,
      copyValue: payload.id,
      mono: true,
    }),
    withFieldTip({
      label: "Status",
      value: payload.decode_status === "decoded" ? "Decoded" : "Raw payload",
      badge: decodeBadge,
    }),
    withFieldTip({
      label: "Contract",
      value: payload.contract_id,
      href: `/contracts/${payload.contract_id}`,
      copyValue: payload.contract_id,
      mono: true,
    }),
    withFieldTip({
      label: "Ledger",
      value: payload.ledger.toLocaleString(),
      href: `/ledger/${payload.ledger}`,
    }),
    withFieldTip({
      label: "Transaction Hash",
      value: payload.txn_hash,
      href: `/tx/${payload.txn_hash}`,
      copyValue: payload.txn_hash,
      mono: true,
    }),
    withFieldTip({
      label: "Indexed At",
      value: timeAgo(new Date(payload.ingested_at), { withAgo: true }),
      timestampIso: payload.ingested_at,
    }),
    withFieldTip({
      label: "Event Kind",
      value: formatEventLabel(payload.event_kind),
    }),
    withFieldTip({
      label: "Type Code",
      value: String(payload.event_type_code),
      mono: true,
    }),
  ];
}

function buildActionDescription(payload: EventDetailPayload): string {
  return `${formatEventLabel(payload.event_type)} on ${truncateMiddle(payload.contract_id, 8, 6)} in ledger ${payload.ledger.toLocaleString()}`;
}

export function mapEventDetail(payload: EventDetailPayload): EventDetailViewModel {
  return {
    id: payload.id,
    eventType: formatEventLabel(payload.event_type),
    summary: payload.summary_preview,
    decodeStatus: payload.decode_status,
    decodeLabel: payload.decode_status === "decoded" ? "Decoded" : "Raw payload",
    network: payload.network,
    eventKind: payload.event_kind,
    contractId: payload.contract_id,
    txnHash: payload.txn_hash,
    ledger: payload.ledger,
    ingestedAgo: timeAgo(new Date(payload.ingested_at), { withAgo: true }),
    ingestedAt: formatTimestamp(payload.ingested_at),
    overviewRows: buildOverviewRows(payload),
    topicRows: parseTopicRows(payload.topics),
    valueRows: parseValueRows(payload.value),
    xdrJson: prettyJson({
      topics_xdr: payload.topics_xdr,
      value_xdr: payload.value_xdr,
    }),
    actionDescription: buildActionDescription(payload),
  };
}
