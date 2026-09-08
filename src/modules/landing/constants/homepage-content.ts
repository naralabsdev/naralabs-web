export const EXPLORER_HERO = {
  title: "Explore Decoded Soroban Events",
  searchPlaceholder: "Search by contract ID, event ID, or transaction hash",
  searchButton: "Search",
  quickExamples: [
    { label: "Contract", query: "CDLZFC3SYJYDZT7K7VZ95HJTAKCDA3S2P2X6DZ5Y5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z" },
    { label: "Event", query: "evt-001" },
    { label: "Transaction", query: "bcd120dd4a3f8c2e91b4d7e2a9c1f8b6" },
    { label: "Schema", query: "transfer" },
  ] as const,
};

export const SITE_FOOTER = {
  tagline: "Index, decode, and explore Soroban contract events on Stellar.",
  columns: [
    {
      title: "Explore",
      links: [
        { label: "Events", href: "/events" },
        { label: "Contracts", href: "/contracts" },
        { label: "Search", href: "/search" },
      ],
    },
    {
      title: "Developers",
      links: [
        { label: "API Reference", href: "/developers" },
        { label: "Schemas", href: "/schemas" },
        { label: "Playground", href: "/playground" },
        { label: "GitHub", href: "github", external: true },
      ],
    },
    {
      title: "Resources",
      links: [{ label: "Docs", href: "docs", external: true }],
    },
  ],
};

export const NETWORK_OVERVIEW = {
  totalEvents: {
    value: "12,450",
    sublabel: "indexed from Soroban",
    tooltip:
      "Total Soroban contract events indexed by NaraLabs across all tracked contracts.",
  },
  contractsTracked: {
    value: "87",
    sublabel: "with events",
    tooltip: "Smart contracts that have emitted at least one indexed event.",
  },
  lastIndexedLedger: {
    sequence: 5_284_917,
    ago: "~5s ago",
    tooltip:
      "Latest Stellar ledger sequence processed by the NaraLabs indexer.",
  },
  eventsToday: {
    value: "1,284",
    sublabel: "last 24 hours",
    tooltip: "Contract events captured by the indexer in the last 24 hours.",
  },
  eventActivityTitle: "Event activity",
  eventActivityTooltip:
    "Daily volume of indexed Soroban events over the selected period.",
  chartStartDate: "22.02",
  chartEndDate: "08.03",
  chartData: [42, 38, 55, 48, 62, 58, 71, 65, 78, 72, 85, 80, 88, 92],
};

export const LANDING_TABLE_TOOLTIPS = {
  events: {
    event: "Decoded event type emitted by the Soroban contract.",
    summary: "Human-readable summary of what happened in this event.",
    contract: "The Soroban contract that emitted this event.",
    ledger: "Stellar ledger sequence where this event was recorded.",
    txn: "Transaction hash for the invocation that produced this event.",
    age: "Time elapsed since this event was indexed.",
  },
  contracts: {
    contract: "Contract display name and on-chain Soroban contract ID.",
    events: "Total number of indexed events from this contract.",
    schema: "Whether events are decoded with a registered schema or shown as raw data.",
    lastActivity: "Time since the most recent event from this contract.",
    ledgers: "Ledger range covered by this contract's indexed events.",
  },
} as const;

export const ACTIVITY_SECTION = {
  eventsTitle: "Recent Events",
  eventsHref: "/events",
  contractsTitle: "Active Contracts",
  contractsHref: "/contracts",
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

export const RECENT_EVENTS: RecentEventRow[] = [
  {
    id: "evt-001",
    eventType: "Transfer",
    summary: "100 USDC from GABC…4f2a to GDEF…8c1b",
    contractName: "Blend Pool",
    contractId: "CDLZFC3SYJYDZT7K7VZ95HJTAKCDA3S2P2X6DZ5Y5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z",
    ledger: 5_284_917,
    txnHash: "bcd120dd4a3f8c2e91b4d7e2a9c1f8b6",
    ago: "2m ago",
  },
  {
    id: "evt-002",
    eventType: "Swap",
    summary: "2,500 XLM swapped for 312 USDC via path payment",
    contractName: "Soroswap Router",
    contractId: "CA7QYNF7SOWQ3ELP2HKP3X7Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z",
    ledger: 5_284_916,
    txnHash: "a7c6e5f14b9d8a2e6f3c2b1d0e9f8a7c",
    ago: "4m ago",
  },
  {
    id: "evt-003",
    eventType: "Supply",
    summary: "User supplied 1,500 USDC to lending pool",
    contractName: "Blend Pool",
    contractId: "CDLZFC3SYJYDZT7K7VZ95HJTAKCDA3S2P2X6DZ5Y5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z",
    ledger: 5_284_915,
    txnHash: "c9e2a1d73f5b8c4e2a7b6c5d4e3f2a1b",
    ago: "6m ago",
  },
  {
    id: "evt-004",
    eventType: "Withdraw",
    summary: "800 USDC withdrawn from reserve vault",
    contractName: "Blend Pool",
    contractId: "CDLZFC3SYJYDZT7K7VZ95HJTAKCDA3S2P2X6DZ5Y5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z",
    ledger: 5_284_914,
    txnHash: "d4f3b2c81e6a1d9f5c3e2d1c0b9a8f7e",
    ago: "9m ago",
  },
  {
    id: "evt-005",
    eventType: "Mint",
    summary: "New liquidity position minted for XLM/USDC pair",
    contractName: "Aquarius AMM",
    contractId: "CBIELTK6Y3WJY3TN5MQSBJGVGGZTNLZOZCJ5S7VPAIVFV2UTM2A7B5Z5Z",
    ledger: 5_284_913,
    txnHash: "e5a4c3d92f7b6e2c4d1a0b9c8d7e6f5a",
    ago: "12m ago",
  },
  {
    id: "evt-006",
    eventType: "Transfer",
    summary: "50,000 BRL from anchor to merchant wallet",
    contractName: "Anchor BRL",
    contractId: "CCW67TSZV3RRGZL7CI2XYXEGQY5H6HKQCD6X4NOJ7Q3T7QZ5Z5Z5Z5Z5Z",
    ledger: 5_284_912,
    txnHash: "f6b5d4e03a8c7f1d5e2b1a0c9d8e7f6b",
    ago: "15m ago",
  },
  {
    id: "evt-007",
    eventType: "Borrow",
    summary: "Borrowed 2,000 USDC against XLM collateral",
    contractName: "Blend Pool",
    contractId: "CDLZFC3SYJYDZT7K7VZ95HJTAKCDA3S2P2X6DZ5Y5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z",
    ledger: 5_284_911,
    txnHash: "b7d1e4f82c9a3f1b8e6d5c4b3a29180",
    ago: "18m ago",
  },
  {
    id: "evt-008",
    eventType: "Repay",
    summary: "Repaid 500 USDC loan with accrued interest",
    contractName: "Blend Pool",
    contractId: "CDLZFC3SYJYDZT7K7VZ95HJTAKCDA3S2P2X6DZ5Y5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z",
    ledger: 5_284_910,
    txnHash: "a3f8c2e91b4d7e2a9c1f8b6e5d4a3c2",
    ago: "22m ago",
  },
];

export type ActiveContractRow = {
  id: string;
  name: string;
  eventCount: number;
  schemaStatus: "Decoded" | "Raw only";
  lastActivity: string;
  ledgerRange: string;
};

export const ACTIVE_CONTRACTS: ActiveContractRow[] = [
  {
    id: "CDLZFC3SYJYDZT7K7VZ95HJTAKCDA3S2P2X6DZ5Y5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z",
    name: "Blend Pool",
    eventCount: 4_820,
    schemaStatus: "Decoded",
    lastActivity: "2m ago",
    ledgerRange: "5.1M – 5.3M",
  },
  {
    id: "CA7QYNF7SOWQ3ELP2HKP3X7Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z",
    name: "Soroswap Router",
    eventCount: 2_140,
    schemaStatus: "Decoded",
    lastActivity: "4m ago",
    ledgerRange: "5.0M – 5.3M",
  },
  {
    id: "CBIELTK6Y3WJY3TN5MQSBJGVGGZTNLZOZCJ5S7VPAIVFV2UTM2A7B5Z5Z",
    name: "Aquarius AMM",
    eventCount: 1_680,
    schemaStatus: "Decoded",
    lastActivity: "12m ago",
    ledgerRange: "4.9M – 5.3M",
  },
  {
    id: "CCW67TSZV3RRGZL7CI2XYXEGQY5H6HKQCD6X4NOJ7Q3T7QZ5Z5Z5Z5Z5Z",
    name: "Anchor BRL",
    eventCount: 940,
    schemaStatus: "Decoded",
    lastActivity: "15m ago",
    ledgerRange: "5.2M – 5.3M",
  },
  {
    id: "CDKRNMBZAB32BKLYV63M2DDTSDFDVEMGKK5R72N4S4KBDXKH5X5Z5Z5Z5Z5Z",
    name: "Unknown Contract",
    eventCount: 312,
    schemaStatus: "Raw only",
    lastActivity: "28m ago",
    ledgerRange: "5.2M – 5.3M",
  },
  {
    id: "CAXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    name: "Stellar DEX Adapter",
    eventCount: 278,
    schemaStatus: "Decoded",
    lastActivity: "35m ago",
    ledgerRange: "5.1M – 5.2M",
  },
  {
    id: "CBYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY",
    name: "Yield Vault",
    eventCount: 195,
    schemaStatus: "Raw only",
    lastActivity: "41m ago",
    ledgerRange: "5.0M – 5.2M",
  },
  {
    id: "CCZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ",
    name: "Payment Gateway",
    eventCount: 156,
    schemaStatus: "Decoded",
    lastActivity: "48m ago",
    ledgerRange: "4.8M – 5.3M",
  },
];
