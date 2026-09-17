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
import { SimpleSelect } from "@/shared/ui/simple-select";

const filterLabelClass = "mb-1.5 block text-[13px] text-neutral-500";

type ContractEventsPanelProps = {
  contractId: string;
  network: string;
  eventTypes: EventTypeBreakdownRow[];
  indexed?: boolean;
};

export function ContractEventsPanel({
  contractId,
  network,
  eventTypes,
  indexed = true,
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
    if (!indexed) {
      setLoading(false);
      setError(null);
      setRows([]);
      setTotalCount(0);
      return;
    }
    void loadEvents();
  }, [indexed, loadEvents]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap">
          <label className="block min-w-[14rem] flex-1">
            <span className={filterLabelClass}>Search</span>
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
            <span className={filterLabelClass}>Event type</span>
            <SimpleSelect
              aria-label="Event type"
              value={eventType}
              onValueChange={setEventType}
              className="min-w-[10rem]"
              placeholder="All types"
              options={[
                { value: "", label: "All types" },
                ...eventTypeOptions.map((option) => ({
                  value: option.key,
                  label: option.label,
                })),
              ]}
            />
          </label>

          <label className="block min-w-[10rem]">
            <span className={filterLabelClass}>Decode status</span>
            <SimpleSelect
              aria-label="Decode status"
              value={decodeStatus}
              onValueChange={(nextValue) =>
                setDecodeStatus(nextValue as "" | "decoded" | "raw")
              }
              className="min-w-[10rem]"
              placeholder="All statuses"
              options={[
                { value: "", label: "All statuses" },
                { value: "decoded", label: "Decoded" },
                { value: "raw", label: "Raw" },
              ]}
            />
          </label>
        </div>
      </div>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className={cn(loading && indexed && "opacity-60")}>
        <ContractEventsTable
          rows={rows}
          emptyMessage={
            indexed ? "No events match the current filters." : "No events indexed for this contract yet."
          }
        />
      </div>

      {indexed ? (
        <PaginationControls
          pagination={pagination}
          setPagination={setPagination}
          totalCount={totalCount}
          unit={(plural) => `event${plural ? "s" : ""}`}
        />
      ) : null}
    </div>
  );
}
