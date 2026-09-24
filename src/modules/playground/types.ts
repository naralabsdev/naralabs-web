export type PlaygroundNetwork = "testnet" | "mainnet" | "futurenet";

export type DecodeRequestBody = {
  network: string;
  contractId: string;
  eventName?: string;
  schemaVersion?: number;
  topicsXdr?: string[];
  topicsJson?: unknown[];
  valueXdr?: string;
  valueJson?: unknown;
};

export type DecodeResult = {
  decodeStatus: string;
  eventName?: string;
  schemaVersion?: number;
  fields?: Record<string, unknown>;
  summary?: string;
  level2?: {
    topics?: unknown[];
    value?: unknown;
  };
};

export type PlaygroundSampleMeta = {
  id: string;
  title: string;
  description: string;
  expectedStatus: "decoded" | "raw";
};

export type PlaygroundCustomPrefill = {
  network: string;
  contractId: string;
  eventName?: string;
  payloadJson: string;
};
