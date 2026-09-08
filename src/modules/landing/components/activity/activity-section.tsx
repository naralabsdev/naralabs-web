import { ACTIVITY_SECTION } from "@/modules/landing/constants/homepage-content";
import type {
  ActiveContractRow,
  RecentEventRow,
} from "@/modules/landing/domain/home-view-model";
import {
  ActiveContractsTable,
  BorderlessTableSection,
  RecentEventsTable,
} from "@/shared/ui/explorer-table";
import { MarketingContent } from "@/modules/landing/components/chrome/marketing-content";

export function ActivitySection({
  recentEvents,
  activeContracts,
}: {
  recentEvents: RecentEventRow[];
  activeContracts: ActiveContractRow[];
}) {
  return (
    <section className="pb-12 pt-2">
      <MarketingContent>
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <BorderlessTableSection
            title={ACTIVITY_SECTION.eventsTitle}
            viewAllHref={ACTIVITY_SECTION.eventsHref}
            className="min-w-0"
          >
            <RecentEventsTable rows={recentEvents} />
          </BorderlessTableSection>

          <BorderlessTableSection
            title={ACTIVITY_SECTION.contractsTitle}
            viewAllHref={ACTIVITY_SECTION.contractsHref}
            className="min-w-0"
          >
            <ActiveContractsTable
              rows={activeContracts.map((contract) => ({
                id: contract.id,
                name: contract.name,
                eventCount: contract.eventCount,
                schemaLabel: contract.schemaStatus,
                lastActivity: contract.lastActivity,
                ledgerRange: contract.ledgerRange,
              }))}
            />
          </BorderlessTableSection>
        </div>
      </MarketingContent>
    </section>
  );
}
