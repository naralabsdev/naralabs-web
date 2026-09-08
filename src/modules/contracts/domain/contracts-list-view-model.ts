export type ContractsListRow = {
  id: string;
  name: string;
  eventCount: number;
  schemaStatus: string;
  schemaLabel: string;
  lastActivity: string;
  ledgerRange: string;
};

export type ContractsListViewModel = {
  items: ContractsListRow[];
  total: number;
  page: number;
  pageSize: number;
};
