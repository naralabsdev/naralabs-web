export const EVENT_DETAIL_FIELD_TIPS: Record<string, string> = {
  "Event ID":
    "Unique identifier for this event record in NaraLabs. Use it to link directly to this page.",
  Status:
    "Shows whether the event payload was decoded into readable fields or is still stored as raw XDR.",
  Contract:
    "The Soroban contract address that emitted this event on the Stellar network.",
  Ledger:
    "The Stellar ledger sequence number where this event was recorded on-chain.",
  "Transaction Hash":
    "The hash of the transaction that included this contract event.",
  "Indexed At":
    "When NaraLabs indexed this event. Hover the timestamp to see additional time formats.",
  "Event Kind":
    "The Soroban event category, such as contract, system, or diagnostic events.",
  "Type Code":
    "Numeric event type identifier from the protocol for this event emission.",
};

export function getEventFieldTip(label: string, fallback?: string): string | undefined {
  return EVENT_DETAIL_FIELD_TIPS[label] ?? fallback;
}
