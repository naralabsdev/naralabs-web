"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { EventsListViewModel } from "@/modules/events/domain/events-list-view-model";
import { fetchEventsList } from "@/modules/events/services/fetch-events-list";
import {
  explorerListErrorClass,
  explorerListFilterLabelClass,
  explorerListFiltersClass,
  explorerListPaginationClass,
  explorerListPanelRootClass,
  explorerListTableWrapClass,
} from "@/modules/explore/components/explorer-list-section";
import { cn } from "@/shared/lib/cn";
import { RecentEventsTable } from "@/shared/ui/explorer-table";
import { InputSearch } from "@/shared/ui/icons/nucleo";
import { Input } from "@/shared/ui/input";
import { PaginationControls } from "@/shared/ui/pagination-controls";
import { SimpleSelect } from "@/shared/ui/simple-select";
import { useSearchParams } from "next/navigation";

export function EventsListPanel({
  network,
  initialData,
}: {
  network: string;
  initialData: EventsListViewModel;
}) {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") ?? "";
  const skipInitialFetchRef = useRef(!initialSearch.trim());
  const [pagination, setPagination] = useState({
    pageIndex: initialData.page,
    pageSize: initialData.pageSize,
  });
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch.trim());
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
    <div className={explorerListPanelRootClass}>
      <div className={explorerListFiltersClass}>
        <label className="block min-w-[14rem] flex-1">
          <span className={explorerListFilterLabelClass}>Search</span>
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
          <span className={explorerListFilterLabelClass}>Decode status</span>
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
              { value: "raw", label: "Raw only" },
            ]}
          />
        </label>
      </div>

      {error ? <p className={explorerListErrorClass}>{error}</p> : null}

      <div className={cn(explorerListTableWrapClass, loading && "opacity-60")}>
        <RecentEventsTable
          rows={rows}
          showStatus
          emptyMessage="No events match the current filters."
        />
      </div>

      <div className={explorerListPaginationClass}>
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
