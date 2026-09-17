export type EventSchemaPublicPayload = {
  id: string;
  contractId: string;
  network: string;
  eventName: string;
  version: number;
  schemaBody: unknown;
  author?: string;
  trustTier: "community" | "verified";
  status: "draft" | "published" | "archived";
  verifiedWallet?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type EventSchemaVersionPayload = {
  id: string;
  version: number;
  trustTier: "community" | "verified";
  status: "draft" | "published" | "archived";
  author?: string;
  verifiedWallet?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type EventSchemaVersionsPayload = {
  contractId: string;
  network: string;
  eventName: string;
  items: EventSchemaVersionPayload[];
  total: number;
};

export type SchemasListPayload = {
  items: EventSchemaPublicPayload[];
  total: number;
};

export type SchemaBodyDefinition = {
  name?: string;
  doc?: string;
  prefix_topics?: string[];
  data_format?: string;
  params?: Array<{
    name?: string;
    type?: string;
    location?: string;
    doc?: string;
  }>;
};

export type SchemaContractListItemPayload = {
  contractId: string;
  network: string;
  schemaCount: number;
  eventCount: number;
  isVerified: boolean;
  verifiedAt?: string;
  updatedAt: string;
};

export type SchemaContractListPayload = {
  items: SchemaContractListItemPayload[];
  total: number;
};

export type SchemaRegistrySummaryPayload = {
  network: string;
  publishedContracts: number;
  eventSchemas: number;
  verifiedContracts: number;
  communityContracts: number;
};

export type SchemaContractActivityPayload = {
  eventCount: number;
  transactionCount: number;
  decodedCount: number;
  events24h: number;
  firstLedger: number;
  lastLedger: number;
  lastSeen: string;
  schemaStatus: string;
};

export type SchemaBundleSummaryPayload = {
  version: number;
  trustTier: "community" | "verified";
  eventCount: number;
  author?: string;
  updatedAt: string;
  verifiedAt?: string;
};

export type SchemaContractProfilePayload = {
  contractId: string;
  network: string;
  indexed: boolean;
  isVerified: boolean;
  verifiedAt?: string;
  bundles: SchemaBundleSummaryPayload[];
  activity: SchemaContractActivityPayload | null;
};

export type SchemaBundleEventPayload = {
  id: string;
  eventName: string;
  version: number;
  trustTier: "community" | "verified";
  schemaBody: unknown;
  author?: string;
  createdAt: string;
  updatedAt: string;
};

export type SchemaBundleDetailPayload = {
  contractId: string;
  network: string;
  version: number;
  trustTier: "community" | "verified";
  author?: string;
  createdAt: string;
  updatedAt: string;
  verifiedAt?: string;
  events: SchemaBundleEventPayload[];
};
