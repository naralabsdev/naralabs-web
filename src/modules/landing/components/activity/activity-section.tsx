import { MarketingContent } from "@/modules/landing/components/chrome/marketing-content";
import {
  ACTIVITY_SECTION,
  LANDING_TABLE_TOOLTIPS,
} from "@/modules/landing/constants/homepage-content";
import type {
  ActiveContractRow,
  RecentEventRow,
} from "@/modules/landing/domain/home-view-model";
import {
  BorderlessCell,
  BorderlessHeaderCell,
  BorderlessHeaderRow,
  BorderlessRow,
  BorderlessTable,
  BorderlessTableBody,
  BorderlessTableHead,
  BorderlessTableSection,
  truncateMiddle,
} from "@/modules/landing/components/activity/borderless-table";
import { DicebearAvatar } from "@/modules/landing/components/activity/dicebear-avatar";
import Link from "next/link";

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
            <BorderlessTable className="min-w-[40rem]">
              <BorderlessTableHead>
                <BorderlessHeaderRow>
                  <BorderlessHeaderCell infoTooltip={LANDING_TABLE_TOOLTIPS.events.event}>
                    Event
                  </BorderlessHeaderCell>
                  <BorderlessHeaderCell infoTooltip={LANDING_TABLE_TOOLTIPS.events.summary}>
                    Summary
                  </BorderlessHeaderCell>
                  <BorderlessHeaderCell infoTooltip={LANDING_TABLE_TOOLTIPS.events.contract}>
                    Contract
                  </BorderlessHeaderCell>
                  <BorderlessHeaderCell infoTooltip={LANDING_TABLE_TOOLTIPS.events.ledger}>
                    Ledger
                  </BorderlessHeaderCell>
                  <BorderlessHeaderCell infoTooltip={LANDING_TABLE_TOOLTIPS.events.txn}>
                    Txn
                  </BorderlessHeaderCell>
                  <BorderlessHeaderCell infoTooltip={LANDING_TABLE_TOOLTIPS.events.age}>
                    Age
                  </BorderlessHeaderCell>
                </BorderlessHeaderRow>
              </BorderlessTableHead>
              <BorderlessTableBody>
                {recentEvents.map((event) => (
                  <BorderlessRow key={event.id}>
                    <BorderlessCell>
                      <Link href={`/events/${event.id}`} className="group block">
                        <div className="flex items-center gap-2.5">
                          <DicebearAvatar seed={event.id} style="waves" />
                          <p className="font-medium text-neutral-900 group-hover:text-primary">
                            {event.eventType}
                          </p>
                        </div>
                      </Link>
                    </BorderlessCell>
                    <BorderlessCell className="max-w-[16rem] text-sm leading-snug text-neutral-600">
                      <Link
                        href={`/events/${event.id}`}
                        className="line-clamp-2 hover:text-primary"
                      >
                        {event.summary}
                      </Link>
                    </BorderlessCell>
                    <BorderlessCell>
                      <Link
                        href={`/contracts/${event.contractId}`}
                        className="font-medium text-neutral-900 hover:text-primary"
                      >
                        {event.contractName}
                      </Link>
                    </BorderlessCell>
                    <BorderlessCell>
                      <Link
                        href={`/ledger/${event.ledger}`}
                        className="font-mono text-sm text-primary hover:underline"
                      >
                        #{event.ledger.toLocaleString()}
                      </Link>
                    </BorderlessCell>
                    <BorderlessCell>
                      <Link
                        href={`/tx/${event.txnHash}`}
                        className="font-mono text-sm text-primary hover:underline"
                      >
                        {truncateMiddle(event.txnHash, 6, 4)}
                      </Link>
                    </BorderlessCell>
                    <BorderlessCell className="whitespace-nowrap text-neutral-600">
                      {event.ago}
                    </BorderlessCell>
                  </BorderlessRow>
                ))}
              </BorderlessTableBody>
            </BorderlessTable>
          </BorderlessTableSection>

          <BorderlessTableSection
            title={ACTIVITY_SECTION.contractsTitle}
            viewAllHref={ACTIVITY_SECTION.contractsHref}
            className="min-w-0"
          >
            <BorderlessTable className="min-w-[32rem]">
              <BorderlessTableHead>
                <BorderlessHeaderRow>
                  <BorderlessHeaderCell infoTooltip={LANDING_TABLE_TOOLTIPS.contracts.contract}>
                    Contract
                  </BorderlessHeaderCell>
                  <BorderlessHeaderCell infoTooltip={LANDING_TABLE_TOOLTIPS.contracts.events}>
                    Events
                  </BorderlessHeaderCell>
                  <BorderlessHeaderCell infoTooltip={LANDING_TABLE_TOOLTIPS.contracts.schema}>
                    Schema
                  </BorderlessHeaderCell>
                  <BorderlessHeaderCell
                    infoTooltip={LANDING_TABLE_TOOLTIPS.contracts.lastActivity}
                  >
                    Last Activity
                  </BorderlessHeaderCell>
                  <BorderlessHeaderCell infoTooltip={LANDING_TABLE_TOOLTIPS.contracts.ledgers}>
                    Ledgers
                  </BorderlessHeaderCell>
                </BorderlessHeaderRow>
              </BorderlessTableHead>
              <BorderlessTableBody>
                {activeContracts.map((contract) => (
                  <BorderlessRow key={contract.id}>
                    <BorderlessCell>
                      <Link href={`/contracts/${contract.id}`} className="group block">
                        <div className="flex items-center gap-2.5">
                          <DicebearAvatar seed={contract.id} style="triangles" />
                          <div className="min-w-0">
                            <p className="font-medium text-neutral-900 group-hover:text-primary">
                              {contract.name}
                            </p>
                            <p className="mt-0.5 font-mono text-xs text-neutral-500">
                              {truncateMiddle(contract.id, 6, 4)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </BorderlessCell>
                    <BorderlessCell className="font-medium tabular-nums text-neutral-900">
                      {contract.eventCount.toLocaleString()}
                    </BorderlessCell>
                    <BorderlessCell className="text-neutral-600">{contract.schemaStatus}</BorderlessCell>
                    <BorderlessCell className="whitespace-nowrap text-neutral-600">
                      {contract.lastActivity}
                    </BorderlessCell>
                    <BorderlessCell className="whitespace-nowrap font-mono text-xs text-neutral-500">
                      {contract.ledgerRange}
                    </BorderlessCell>
                  </BorderlessRow>
                ))}
              </BorderlessTableBody>
            </BorderlessTable>
          </BorderlessTableSection>
        </div>
      </MarketingContent>
    </section>
  );
}
