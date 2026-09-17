export type StatMetricView = {
  raw: number;
  value: string;
  sublabel: string;
  tooltip: string;
};

export type NetworkOverviewView = {
  totalEvents: StatMetricView;
  contractsTracked: StatMetricView;
  lastIndexedLedger: {
    sequence: number;
    indexedAt: string | null;
    ago: string;
    tooltip: string;
  };
  eventsToday: StatMetricView;
  ingestLagLedgers: number | null;
  eventActivityTitle: string;
  eventActivityTooltip: string;
  chartStartDate: string;
  chartEndDate: string;
  chartLabels: string[];
  chartData: number[];
};

export type RecentEventRow = {
  id: string;
  eventType: string;
  summary: string;
  contractName: string;
  contractId: string;
  ledger: number;
  txnHash: string;
  ingestedAt: string;
  ago: string;
};

export type ActiveContractRow = {
  id: string;
  name: string;
  eventCount: number;
  schemaStatus: string;
  lastSeenAt: string;
  lastActivity: string;
  ledgerRange: string;
};

export type HomePageViewModel = {
  networkOverview: NetworkOverviewView;
  recentEvents: RecentEventRow[];
  activeContracts: ActiveContractRow[];
};
