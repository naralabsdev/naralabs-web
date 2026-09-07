export type DetailFieldRow = {
  label: string;
  value: string;
  href?: string;
  copyValue?: string;
  mono?: boolean;
  badge?: { text: string; tone: "success" | "neutral" | "warning" };
  secondary?: string;
  timestampIso?: string;
  tip?: string;
};

export type TopicTableRow = {
  index: number;
  type: string;
  value: string;
  raw: string;
};

export type ValueFieldRow = {
  label: string;
  type: string;
  display: string;
  hint?: string;
};

export type EventDetailViewModel = {
  id: string;
  eventType: string;
  summary: string;
  decodeStatus: string;
  decodeLabel: string;
  network: string;
  eventKind: string;
  contractId: string;
  txnHash: string;
  ledger: number;
  ingestedAgo: string;
  ingestedAt: string;
  overviewRows: DetailFieldRow[];
  topicRows: TopicTableRow[];
  valueRows: ValueFieldRow[];
  xdrJson: string;
  actionDescription: string;
};
