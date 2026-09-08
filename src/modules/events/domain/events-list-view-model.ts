export type EventsListRow = {
  id: string;
  eventType: string;
  summary: string;
  contractName: string;
  contractId: string;
  ledger: number;
  txnHash: string;
  decodeStatus: string;
  decodeLabel: string;
  ago: string;
};

export type EventsListViewModel = {
  items: EventsListRow[];
  total: number;
  page: number;
  pageSize: number;
};
