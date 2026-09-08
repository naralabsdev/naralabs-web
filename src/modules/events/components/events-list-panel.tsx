"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { EventsListViewModel } from "@/modules/events/domain/events-list-view-model";
import { fetchEventsList } from "@/modules/events/services/fetch-events-list";
import { cn } from "@/shared/lib/cn";
import { RecentEventsTable } from "@/shared/ui/explorer-table";
import { InputSearch } from "@/shared/ui/icons/nucleo";
import { Input } from "@/shared/ui/input";
import { PaginationControls } from "@/shared/ui/pagination-controls";

const selectClassName = cn(
  "h-9 rounded-md border border-neutral-300 bg-white px-2.5 text-sm text-neutral-900",
  "focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500",
);

export function EventsListPanel({
  network,
  initialData,
}: {
  network: string;
  initialData: EventsListViewModel;
}) {
  const skipInitialFetchRef = useRef(true);
  const [pagination, setPagination] = useState({
    pageIndex: initialData.page,
    pageSize: initialData.pageSize,
  });
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [decodeStatus, setDecodeStatus] = useState<"" | "decoded" | "raw">("");
  const [totalCount, setTotalCount] = useState(
    initialData.total ?? initialData.items.length,
  );
  const [rows, setRows] = useState(initialData.items);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(searchInput.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setPagination((current) =>
      current.pageIndex === 1 ? current : { ...current, pageIndex: 1 },
    );
  }, [debouncedSearch, decodeStatus]);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchEventsList({
        network,
        page: pagination.pageIndex,
        pageSize: pagination.pageSize,
        search: debouncedSearch,
        decodeStatus,
      });
      setRows(result.items);
      setTotalCount(result.total);
    } catch {
      setError("Failed to load events. Please try again.");
      setRows([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [network, pagination.pageIndex, pagination.pageSize, debouncedSearch, decodeStatus]);

  useEffect(() => {
    if (skipInitialFetchRef.current) {
      skipInitialFetchRef.current = false;
      return;
    }
    void loadEvents();
  }, [loadEvents]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 px-5 pt-4 sm:flex-row sm:flex-wrap sm:items-end sm:px-6">
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
              placeholder="Event ID, contract ID, txn hash, payload…"
              className="pl-9"
            />
          </div>
        </label>

        <label className="block min-w-[10rem]">
          <span className="mb-1.5 block text-xs font-medium text-neutral-500">Decode status</span>
          <select
            value={decodeStatus}
            onChange={(event) =>
              setDecodeStatus(event.target.value as "" | "decoded" | "raw")
            }
            className={selectClassName}
          >
            <option value="">All statuses</option>
            <option value="decoded">Decoded</option>
            <option value="raw">Raw only</option>
          </select>
        </label>
      </div>

      {error ? <p className="px-5 text-sm text-red-600 sm:px-6">{error}</p> : null}

      <div className={cn("overflow-x-auto px-5 pb-2 sm:px-6", loading && "opacity-60")}>
        <RecentEventsTable
          rows={rows}
          showStatus
          emptyMessage="No events match the current filters."
        />
      </div>

      <div className="border-t border-neutral-100 px-5 py-4 sm:px-6">
        <PaginationControls
          pagination={pagination}
          setPagination={setPagination}
          totalCount={totalCount}
          unit={(plural) => `event${plural ? "s" : ""}`}
        />
      </div>
    </div>
  );
}
