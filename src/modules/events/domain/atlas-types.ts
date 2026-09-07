export type EventDetailPayload = {
  id: string;
  network: string;
  contract_id: string;
  ledger: number;
  txn_hash: string;
  event_type: string;
  event_kind: string;
  event_type_code: number;
  ingested_at: string;
  summary_preview: string;
  decode_status: string;
  topics: unknown;
  value: unknown;
  topics_xdr: string[];
  value_xdr: string;
};
