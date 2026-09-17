import type { DetailFieldRow } from "@/modules/events/domain/event-view-model";

export type SchemaContractListRow = {
  contractId: string;
  contractLabel: string;
  network: string;
  schemaCount: number;
  eventCount: number;
  isVerified: boolean;
  trustLabel: string;
  verifiedAt?: string;
  verifiedLabel?: string;
  updatedAt: string;
  updatedLabel: string;
};

export type SchemaContractsListViewModel = {
  items: SchemaContractListRow[];
  total: number;
  page: number;
  pageSize: number;
};

export type SchemaRegistrySummaryViewModel = {
  publishedContracts: string;
  eventSchemas: string;
  verifiedContracts: string;
  communityContracts: string;
};

export type SchemaListRow = {
  id: string;
  schemaLabel: string;
  eventName: string;
  schemaName: string;
  contractId: string;
  contractLabel: string;
  version: number;
  isVerified: boolean;
  trustLabel: string;
  author?: string;
  updatedAt: string;
  updatedLabel: string;
  href: string;
  contractHref: string;
};

export type SchemasListViewModel = {
  items: SchemaListRow[];
  total: number;
  page: number;
  pageSize: number;
};

export type ContractSchemaRow = {
  id: string;
  eventName: string;
  schemaName: string;
  version: number;
  isVerified: boolean;
  trustLabel: string;
  author?: string;
  updatedLabel: string;
  href: string;
};

export type SchemaBundleRow = {
  version: number;
  label: string;
  trustTier: "community" | "verified";
  trustLabel: string;
  eventCount: number;
  author?: string;
  updatedAt: string;
  updatedLabel: string;
  verifiedAt?: string;
  verifiedLabel?: string;
  href: string;
};

export type SchemaContractActivityViewModel = {
  eventCount: number;
  transactionCount: number;
  decodedCount: number;
  events24h: number;
  firstLedger: number;
  lastLedger: number;
  lastSeenLabel: string;
  schemaStatusLabel: string;
};

export type SchemaContractDetailViewModel = {
  contractId: string;
  contractLabel: string;
  network: string;
  indexed: boolean;
  isVerified: boolean;
  trustLabel: string;
  verifiedAt?: string;
  verifiedLabel?: string;
  bundles: SchemaBundleRow[];
  activity: SchemaContractActivityViewModel | null;
  overviewRows: DetailFieldRow[];
};

export type SchemaBundleEventRow = {
  id: string;
  eventName: string;
  version: number;
  trustTier: "community" | "verified";
  trustLabel: string;
  prefixTopics: string[];
  paramCount: number;
  doc?: string;
  schemaBodyJson: string;
};

export type SchemaBundleDetailViewModel = {
  contractId: string;
  contractLabel: string;
  network: string;
  version: number;
  label: string;
  trustTier: "community" | "verified";
  trustLabel: string;
  author?: string;
  createdAt: string;
  updatedAt: string;
  createdLabel: string;
  updatedLabel: string;
  verifiedAt?: string;
  verifiedLabel?: string;
  overviewRows: DetailFieldRow[];
  events: SchemaBundleEventRow[];
};

export type SchemaParamRow = {
  name: string;
  type: string;
  location: string;
  doc?: string;
};

export type EventSchemaDetailViewModel = {
  id: string;
  contractId: string;
  contractLabel: string;
  network: string;
  eventName: string;
  schemaName: string;
  version: number;
  trustTier: "community" | "verified";
  trustLabel: string;
  author?: string;
  status: string;
  verifiedWallet?: string;
  verifiedAt?: string;
  verifiedLabel?: string;
  createdAt: string;
  updatedAt: string;
  createdLabel: string;
  updatedLabel: string;
  summary: string;
  overviewRows: DetailFieldRow[];
  prefixTopics: string[];
  dataFormat?: string;
  doc?: string;
  params: SchemaParamRow[];
  schemaBodyJson: string;
};

export type SchemaVersionHistoryRow = {
  id: string;
  version: number;
  isVerified: boolean;
  trustLabel: string;
  status: string;
  author?: string;
  verifiedWallet?: string;
  verifiedLabel?: string;
  createdAt: string;
  updatedAt: string;
  createdLabel: string;
  updatedLabel: string;
  href: string;
  isCurrent: boolean;
};

export type SchemaVersionHistoryViewModel = {
  items: SchemaVersionHistoryRow[];
  total: number;
};
