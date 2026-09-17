import type { SchemaRegistrySummaryViewModel } from "@/modules/registry/domain/schema-view-model";

import {
  ExplorerStatColumn,
  ExplorerStatsCard,
} from "@/modules/explore/components/explorer-stat-card";

const SCHEMA_REGISTRY_TOOLTIPS = {
  publishedContracts:
    "Soroban contracts with at least one published SEP-0048 event schema in the NaraLabs registry.",
  eventSchemas:
    "Total published event schema definitions across all registered contracts.",
  verifiedContracts:
    "Contracts whose schema publisher identity has been verified on-chain.",
  communityContracts:
    "Contracts with community-published schemas that are not yet verified.",
} as const;

export function SchemaRegistryStatGrid({ summary }: { summary: SchemaRegistrySummaryViewModel }) {
  return (
    <div className="mb-6">
      <ExplorerStatsCard>
        <ExplorerStatColumn
          label="Published Contracts"
          tooltip={SCHEMA_REGISTRY_TOOLTIPS.publishedContracts}
          showDivider
        >
          <p className="text-[15px] font-semibold tracking-[-0.01em] text-neutral-900">
            {summary.publishedContracts}
          </p>
          <p className="mt-0.5 text-[13px] text-neutral-500">Contracts with registry schemas</p>
        </ExplorerStatColumn>

        <ExplorerStatColumn
          label="Event Schemas"
          tooltip={SCHEMA_REGISTRY_TOOLTIPS.eventSchemas}
          showDivider
        >
          <p className="text-[15px] font-semibold tracking-[-0.01em] text-neutral-900">
            {summary.eventSchemas}
          </p>
          <p className="mt-0.5 text-[13px] text-neutral-500">Published event definitions</p>
        </ExplorerStatColumn>

        <ExplorerStatColumn
          label="Verified Contracts"
          tooltip={SCHEMA_REGISTRY_TOOLTIPS.verifiedContracts}
          showDivider
        >
          <p className="text-[15px] font-semibold tracking-[-0.01em] text-neutral-900">
            {summary.verifiedContracts}
          </p>
          <p className="mt-0.5 text-[13px] text-neutral-500">On-chain verified publishers</p>
        </ExplorerStatColumn>

        <ExplorerStatColumn
          label="Community Contracts"
          tooltip={SCHEMA_REGISTRY_TOOLTIPS.communityContracts}
          showDivider
        >
          <p className="text-[15px] font-semibold tracking-[-0.01em] text-neutral-900">
            {summary.communityContracts}
          </p>
          <p className="mt-0.5 text-[13px] text-neutral-500">Community-published schemas</p>
        </ExplorerStatColumn>
      </ExplorerStatsCard>
    </div>
  );
}
