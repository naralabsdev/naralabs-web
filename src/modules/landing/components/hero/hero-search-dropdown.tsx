"use client";

import { DicebearAvatar } from "@/modules/landing/components/activity/dicebear-avatar";
import type {
  ActiveContractRow,
  RecentEventRow,
} from "@/modules/landing/domain/home-view-model";
import { getDocsLinkProps } from "@/shared/lib/docs-link";
import { cn } from "@/shared/lib/cn";
import { truncateMiddle } from "@/shared/ui/explorer-table/borderless-table";
import {
  ArrowUpRight2,
  Bolt,
  Book2,
  BracketsCurly,
  Key,
} from "@/shared/ui/icons";
import Link from "next/link";
import type { ComponentType, ReactNode, SVGProps } from "react";

export type HeroSearchFilter = "all" | "events" | "contracts" | "pages";

type SearchPageLink = {
  label: string;
  description: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  external?: boolean;
};

const SEARCH_PAGES: SearchPageLink[] = [
  {
    label: "All Events",
    description: "Browse indexed Soroban events",
    href: "/events",
    icon: Bolt,
  },
  {
    label: "All Contracts",
    description: "Explore contracts with event history",
    href: "/contracts",
    icon: BracketsCurly,
  },
  {
    label: "Event Schemas",
    description: "Browse published SEP-0048 schemas",
    href: "/schemas",
    icon: Book2,
  },
  {
    label: "API Dashboard",
    description: "Manage API keys and developer access",
    href: "/dashboard/developers",
    icon: Key,
  },
  {
    label: "Documentation",
    description: "Atlas API guides and references",
    href: "/docs",
    icon: Book2,
    external: true,
  },
];

const FILTER_OPTIONS: { id: HeroSearchFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "events", label: "Recent Events" },
  { id: "contracts", label: "Active Contracts" },
  { id: "pages", label: "Pages" },
];

function matchesQuery(value: string, query: string) {
  return value.toLowerCase().includes(query.trim().toLowerCase());
}

function filterEvents(events: RecentEventRow[], query: string) {
  if (!query.trim()) {
    return events.slice(0, 5);
  }

  return events
    .filter(
      (event) =>
        matchesQuery(event.eventType, query) ||
        matchesQuery(event.summary, query) ||
        matchesQuery(event.id, query) ||
        matchesQuery(event.contractId, query) ||
        matchesQuery(event.txnHash, query),
    )
    .slice(0, 5);
}

function filterContracts(contracts: ActiveContractRow[], query: string) {
  if (!query.trim()) {
    return contracts.slice(0, 5);
  }

  return contracts
    .filter(
      (contract) =>
        matchesQuery(contract.name, query) ||
        matchesQuery(contract.id, query) ||
        matchesQuery(contract.schemaStatus, query),
    )
    .slice(0, 5);
}

function filterPages(pages: SearchPageLink[], query: string) {
  if (!query.trim()) {
    return pages;
  }

  return pages.filter(
    (page) => matchesQuery(page.label, query) || matchesQuery(page.description, query),
  );
}

function SectionHeading({ children }: { children: string }) {
  return (
    <p className="px-4 pb-2 pt-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-400">
      {children}
    </p>
  );
}

function DropdownRow({
  href,
  external,
  onNavigate,
  children,
}: {
  href: string;
  external?: boolean;
  onNavigate?: () => void;
  children: ReactNode;
}) {
  const docsProps = external ? getDocsLinkProps(href) : {};

  return (
    <Link
      href={href}
      target={docsProps.target}
      rel={docsProps.rel}
      onClick={onNavigate}
      className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-neutral-50"
    >
      {children}
    </Link>
  );
}

export function HeroSearchDropdown({
  query,
  filter,
  onFilterChange,
  recentEvents,
  activeContracts,
  onNavigate,
}: {
  query: string;
  filter: HeroSearchFilter;
  onFilterChange: (filter: HeroSearchFilter) => void;
  recentEvents: RecentEventRow[];
  activeContracts: ActiveContractRow[];
  onNavigate?: () => void;
}) {
  const events = filterEvents(recentEvents, query);
  const contracts = filterContracts(activeContracts, query);
  const pages = filterPages(SEARCH_PAGES, query);

  const showEvents = filter === "all" || filter === "events";
  const showContracts = filter === "all" || filter === "contracts";
  const showPages = filter === "all" || filter === "pages";

  const hasResults =
    (showEvents && events.length > 0) ||
    (showContracts && contracts.length > 0) ||
    (showPages && pages.length > 0);

  return (
    <div className="bg-white">
      <div className="flex flex-wrap gap-2 border-b border-neutral-100 px-4 py-3">
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => onFilterChange(option.id)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              filter === option.id
                ? "border-neutral-900 bg-neutral-900 text-white"
                : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-900",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="max-h-[min(28rem,calc(100vh-12rem))] overflow-y-auto">
        {!hasResults ? (
          <p className="px-4 py-8 text-center text-sm text-neutral-500">
            No matches found. Try another keyword or browse the sections below.
          </p>
        ) : null}

        {showEvents && events.length > 0 ? (
          <section>
            <SectionHeading>Recent Events</SectionHeading>
            <div className="pb-1">
              {events.map((event) => (
                <DropdownRow
                  key={event.id}
                  href={`/events/${event.id}`}
                  onNavigate={onNavigate}
                >
                  <DicebearAvatar seed={event.id} style="waves" className="size-8 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-neutral-900">
                        {event.eventType}
                      </p>
                      <span className="shrink-0 text-xs text-neutral-400">{event.ago}</span>
                    </div>
                    <p className="truncate text-xs text-neutral-500">{event.summary}</p>
                  </div>
                </DropdownRow>
              ))}
            </div>
          </section>
        ) : null}

        {showContracts && contracts.length > 0 ? (
          <section className="border-t border-neutral-100">
            <SectionHeading>Active Contracts</SectionHeading>
            <div className="pb-1">
              {contracts.map((contract) => (
                <DropdownRow
                  key={contract.id}
                  href={`/contracts/${contract.id}`}
                  onNavigate={onNavigate}
                >
                  <DicebearAvatar seed={contract.id} style="triangles" className="size-8 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-neutral-900">
                        {contract.name || truncateMiddle(contract.id, 8, 6)}
                      </p>
                      <span className="shrink-0 text-xs text-neutral-400">
                        {contract.lastActivity}
                      </span>
                    </div>
                    <p className="truncate text-xs text-neutral-500">
                      {contract.eventCount.toLocaleString()} events · {contract.schemaStatus}
                    </p>
                  </div>
                </DropdownRow>
              ))}
            </div>
          </section>
        ) : null}

        {showPages && pages.length > 0 ? (
          <section className="border-t border-neutral-100">
            <SectionHeading>Pages</SectionHeading>
            <div className="pb-1">
              {pages.map((page) => {
                const Icon = page.icon;
                const docsProps = page.external ? getDocsLinkProps(page.href) : {};

                return (
                  <Link
                    key={page.label}
                    href={page.href}
                    target={docsProps.target}
                    rel={docsProps.rel}
                    onClick={onNavigate}
                    className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-neutral-50"
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-600">
                      <Icon className="size-4" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-neutral-900">{page.label}</p>
                      <p className="truncate text-xs text-neutral-500">{page.description}</p>
                    </div>
                    {page.external ? (
                      <ArrowUpRight2 className="size-3.5 shrink-0 text-neutral-400" />
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </section>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-neutral-100 px-4 py-2.5 text-[11px] text-neutral-400">
        <span>
          <kbd className="rounded border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 font-sans text-[10px] text-neutral-500">
            ↵
          </kbd>{" "}
          Search
        </span>
        <span>
          <kbd className="rounded border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 font-sans text-[10px] text-neutral-500">
            esc
          </kbd>{" "}
          Close
        </span>
      </div>
    </div>
  );
}
