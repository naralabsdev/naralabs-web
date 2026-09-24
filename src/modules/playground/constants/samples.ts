import type { DecodeRequestBody, DecodeResult, PlaygroundSampleMeta } from "@/modules/playground/types";

const COUNTER_CONTRACT = "CBGROPHYFCL5FNTNJF6HXVJEWPLOMHZJ3MNISPTB2JHXLGKQMO2MCWK4";

type PlaygroundSample = PlaygroundSampleMeta & {
  request: DecodeRequestBody;
  fallbackResult: DecodeResult;
};

const COUNTER_DECODED_FALLBACK: DecodeResult = {
  decodeStatus: "decoded",
  eventName: "counter_incremented",
  schemaVersion: 1,
  fields: { count: 42 },
  summary: "counter_incremented: count=42",
  level2: {
    topics: [{ symbol: "cntr" }, { symbol: "incr" }],
    value: { u32: 42 },
  },
};

const UNKNOWN_RAW_FALLBACK: DecodeResult = {
  decodeStatus: "raw",
  level2: {
    topics: [{ symbol: "demo" }, { symbol: "event" }],
    value: { u32: 1 },
  },
};

export const PLAYGROUND_SAMPLES: Record<string, PlaygroundSample> = {
  "counter-decoded": {
    id: "counter-decoded",
    title: "Counter increment",
    description: "Registered SEP-0048 schema on a test counter contract — semantic fields returned.",
    expectedStatus: "decoded",
    request: {
      network: "testnet",
      contractId: COUNTER_CONTRACT,
      topicsJson: [{ symbol: "cntr" }, { symbol: "incr" }],
      valueJson: { u32: 42 },
    },
    fallbackResult: COUNTER_DECODED_FALLBACK,
  },
  "unknown-contract-raw": {
    id: "unknown-contract-raw",
    title: "No matching schema",
    description: "Valid Soroban payload but no registry entry — Atlas returns raw level-2 JSON only.",
    expectedStatus: "raw",
    request: {
      network: "testnet",
      contractId: "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2KM",
      topicsJson: [{ symbol: "demo" }, { symbol: "event" }],
      valueJson: { u32: 1 },
    },
    fallbackResult: UNKNOWN_RAW_FALLBACK,
  },
  "prefix-mismatch-raw": {
    id: "prefix-mismatch-raw",
    title: "Topic prefix mismatch",
    description: "Schema exists on contract but topic symbols do not match — falls back to raw.",
    expectedStatus: "raw",
    request: {
      network: "testnet",
      contractId: COUNTER_CONTRACT,
      topicsJson: [{ symbol: "other" }, { symbol: "incr" }],
      valueJson: { u32: 42 },
    },
    fallbackResult: {
      decodeStatus: "raw",
      level2: {
        topics: [{ symbol: "other" }, { symbol: "incr" }],
        value: { u32: 42 },
      },
    },
  },
};

export const PLAYGROUND_SAMPLE_LIST: PlaygroundSampleMeta[] = Object.values(PLAYGROUND_SAMPLES).map(
  ({ id, title, description, expectedStatus }) => ({
    id,
    title,
    description,
    expectedStatus,
  }),
);

export function getPlaygroundSample(sampleId: string): PlaygroundSample | undefined {
  return PLAYGROUND_SAMPLES[sampleId];
}

export function getSampleFormPrefill(sampleId: string): {
  network: string;
  contractId: string;
  payloadJson: string;
} | null {
  const sample = PLAYGROUND_SAMPLES[sampleId];
  if (!sample) {
    return null;
  }
  const { network, contractId, topicsJson, valueJson, topicsXdr, valueXdr, eventName, schemaVersion } =
    sample.request;
  const payload: Record<string, unknown> = {};
  if (topicsJson) payload.topicsJson = topicsJson;
  if (valueJson !== undefined) payload.valueJson = valueJson;
  if (topicsXdr) payload.topicsXdr = topicsXdr;
  if (valueXdr) payload.valueXdr = valueXdr;
  if (eventName) payload.eventName = eventName;
  if (schemaVersion) payload.schemaVersion = schemaVersion;

  return {
    network,
    contractId,
    payloadJson: JSON.stringify(payload, null, 2),
  };
}
