"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { ContractEventsTable } from "@/modules/contracts/components/contract-events-table";
import type {
  ContractRecentEventRow,
  EventTypeBreakdownRow,
} from "@/modules/contracts/domain/contract-view-model";
import { fetchContractEvents } from "@/modules/contracts/services/fetch-contract-events";
import { cn } from "@/shared/lib/cn";
import { InputSearch } from "@/shared/ui/icons/nucleo";
import { Input } from "@/shared/ui/input";
import { PaginationControls } from "@/shared/ui/pagination-controls";

const selectClassName = cn(
  "h-9 rounded-md border border-neutral-300 bg-white px-2.5 text-sm text-neutral-900",
  "focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500",
);

type ContractEventsPanelProps = {
  contractId: string;
  network: string;
  eventTypes: EventTypeBreakdownRow[];
};

export function ContractEventsPanel({
  contractId,
  network,
  eventTypes,
}: ContractEventsPanelProps) {
  const [pagination, setPagination] = useState({ pageIndex: 1, pageSize: 20 });
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [eventType, setEventType] = useState("");
  const [decodeStatus, setDecodeStatus] = useState<"" | "decoded" | "raw">("");
  const [totalCount, setTotalCount] = useState<number | undefined>(undefined);
  const [rows, setRows] = useState<ContractRecentEventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(searchInput.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setPagination((current) => ({ ...current, pageIndex: 1 }));
  }, [debouncedSearch, eventType, decodeStatus]);

  const eventTypeOptions = useMemo(
    () =>
      eventTypes.map((item) => ({
        key: item.eventTypeKey,
        label: item.eventType,
      })),
    [eventTypes],
  );

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchContractEvents(
        contractId,
        {
          page: pagination.pageIndex,
          pageSize: pagination.pageSize,
          search: debouncedSearch,
          eventType,
          decodeStatus,
        },
        network,
      );
      setRows(result.items);
      setTotalCount(result.total);
    } catch {
      setError("Failed to load events. Please try again.");
      setRows([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [
    contractId,
    network,
    pagination.pageIndex,
    pagination.pageSize,
    debouncedSearch,
    eventType,
    decodeStatus,
  ]);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap">
          <label className="block min-w-[14rem] flex-1">
            <span className="mb-1.5 block text-xs font-medium text-neutral-500">Search</span>
            <div className="relative">
              <InputSearch
                className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
                aria-hidden
              />
              <Input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Event ID, txn hash, payload…"
                className="pl-9"
              />
            </div>
          </label>

          <label className="block min-w-[10rem]">
            <span className="mb-1.5 block text-xs font-medium text-neutral-500">Event type</span>
            <select
              value={eventType}
              onChange={(event) => setEventType(event.target.value)}
              className={cn(selectClassName, "w-full min-w-[10rem]")}
            >
              <option value="">All types</option>
              {eventTypeOptions.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block min-w-[10rem]">
            <span className="mb-1.5 block text-xs font-medium text-neutral-500">Decode status</span>
            <select
              value={decodeStatus}
              onChange={(event) =>
                setDecodeStatus(event.target.value as "" | "decoded" | "raw")
              }
              className={cn(selectClassName, "w-full min-w-[10rem]")}
            >
              <option value="">All statuses</option>
              <option value="decoded">Decoded</option>
              <option value="raw">Raw</option>
            </select>
          </label>
        </div>
      </div>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className={cn(loading && "opacity-60")}>
        <ContractEventsTable rows={rows} />
      </div>

      <PaginationControls
        pagination={pagination}
        setPagination={setPagination}
        totalCount={totalCount}
        unit={(plural) => `event${plural ? "s" : ""}`}
      />
    </div>
  );
}
