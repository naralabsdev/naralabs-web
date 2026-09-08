export type NetworkOverviewView = {
  totalEvents: {
    value: string;
    sublabel: string;
    tooltip: string;
  };
  contractsTracked: {
    value: string;
    sublabel: string;
    tooltip: string;
  };
  lastIndexedLedger: {
    sequence: number;
    ago: string;
    tooltip: string;
  };
  eventsToday: {
    value: string;
    sublabel: string;
    tooltip: string;
  };
  eventActivityTitle: string;
  eventActivityTooltip: string;
  chartStartDate: string;
  chartEndDate: string;
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
  ago: string;
};

export type ActiveContractRow = {
  id: string;
  name: string;
  eventCount: number;
  schemaStatus: string;
  lastActivity: string;
  ledgerRange: string;
};

export type HomePageViewModel = {
  networkOverview: NetworkOverviewView;
  recentEvents: RecentEventRow[];
  activeContracts: ActiveContractRow[];
};
