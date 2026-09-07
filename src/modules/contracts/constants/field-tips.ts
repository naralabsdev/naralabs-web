export const CONTRACT_DETAIL_FIELD_TIPS: Record<string, string> = {
  "Contract ID":
    "The Soroban contract address on the Stellar network. All indexed events on this page belong to this contract.",
  Network:
    "The Stellar network where this contract is deployed and emitting events.",
  "Schema Status":
    "Whether NaraLabs can decode event payloads for this contract. Partial means some events decode; raw only means payloads are stored as XDR.",
  "Total Events":
    "Total Soroban contract events indexed for this address, similar to SoroTrail contract stats.",
  "Unique Transactions":
    "Number of distinct transactions that emitted at least one event from this contract.",
  "Decoded Events":
    "Events whose topics and value were decoded into readable fields by NaraLabs.",
  "Events (24h)":
    "Contract events indexed in the last 24 hours.",
  "First Ledger":
    "Earliest ledger where an event from this contract was recorded.",
  "Last Ledger":
    "Most recent ledger containing an event from this contract.",
  "Last Seen":
    "When NaraLabs last indexed activity from this contract. Hover the timestamp to see additional time formats.",
};

export function getContractFieldTip(label: string, fallback?: string): string | undefined {
  return CONTRACT_DETAIL_FIELD_TIPS[label] ?? fallback;
}
