export type SchemaProject = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status: "draft" | "published" | "archived";
  createdAt: string;
  updatedAt: string;
};

export type SchemaProjectDetail = SchemaProject & {
  publishToken: string;
};

export type SchemaProjectList = {
  items: SchemaProject[];
  total: number;
};

export type SchemaVersionSummary = {
  id: string;
  version: number;
  trustTier: "community" | "verified";
  status: "draft" | "published" | "archived";
  createdAt: string;
};

export type VerifiedSummary = {
  id: string;
  version: number;
  verifiedWallet: string;
  verifiedAt: string;
};

export type EventPublication = {
  eventName: string;
  latestCommunity?: SchemaVersionSummary;
  verified?: VerifiedSummary;
  versions: SchemaVersionSummary[];
};

export type ContractPublication = {
  contractId: string;
  network: string;
  events: EventPublication[];
  canVerify: boolean;
};

export type ProjectPublications = {
  contracts: ContractPublication[];
};

export type VerifyChallenge = {
  nonce: string;
  message: string;
  expiresAt: string;
};

export type VerifyContractResult = {
  contractId: string;
  network: string;
  wallet: string;
  verifiedAt: string;
  events: Array<{
    eventName: string;
    schemaId: string;
    version: number;
  }>;
};
