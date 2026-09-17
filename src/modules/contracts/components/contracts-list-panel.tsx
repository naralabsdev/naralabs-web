"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { ContractsListViewModel } from "@/modules/contracts/domain/contracts-list-view-model";
import { fetchContractsList } from "@/modules/contracts/services/fetch-contracts-list";
import {
  explorerListErrorClass,
  explorerListFilterLabelClass,
  explorerListFiltersClass,
  explorerListPaginationClass,
  explorerListPanelRootClass,
  explorerListTableWrapClass,
} from "@/modules/explore/components/explorer-list-section";
import { cn } from "@/shared/lib/cn";
import { ActiveContractsTable } from "@/shared/ui/explorer-table";
import { InputSearch } from "@/shared/ui/icons/nucleo";
import { Input } from "@/shared/ui/input";
import { PaginationControls } from "@/shared/ui/pagination-controls";
import { SimpleSelect } from "@/shared/ui/simple-select";

export function ContractsListPanel({
  network,
  initialData,
}: {
  network: string;
  initialData: ContractsListViewModel;
}) {
  const skipInitialFetchRef = useRef(true);
  const [pagination, setPagination] = useState({
    pageIndex: initialData.page,
    pageSize: initialData.pageSize,
  });
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [schemaStatus, setSchemaStatus] = useState<"" | "decoded" | "raw_only">("");
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
  }, [debouncedSearch, schemaStatus]);

  const loadContracts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchContractsList({
        network,
        page: pagination.pageIndex,
        pageSize: pagination.pageSize,
        search: debouncedSearch,
        schemaStatus,
      });
      setRows(result.items);
      setTotalCount(result.total);
    } catch {
      setError("Failed to load contracts. Please try again.");
      setRows([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [network, pagination.pageIndex, pagination.pageSize, debouncedSearch, schemaStatus]);

  useEffect(() => {
    if (skipInitialFetchRef.current) {
      skipInitialFetchRef.current = false;
      return;
    }
    void loadContracts();
  }, [loadContracts]);

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
              placeholder="Contract ID…"
              className="pl-9"
            />
          </div>
        </label>

        <label className="block min-w-[10rem]">
          <span className={explorerListFilterLabelClass}>Schema status</span>
          <SimpleSelect
            aria-label="Schema status"
            value={schemaStatus}
            onValueChange={(nextValue) =>
              setSchemaStatus(nextValue as "" | "decoded" | "raw_only")
            }
            className="min-w-[10rem]"
            placeholder="All contracts"
            options={[
              { value: "", label: "All contracts" },
              { value: "decoded", label: "Decoded" },
              { value: "raw_only", label: "Raw only" },
            ]}
          />
        </label>
      </div>

      {error ? <p className={explorerListErrorClass}>{error}</p> : null}

      <div className={cn(explorerListTableWrapClass, loading && "opacity-60")}>
        <ActiveContractsTable
          rows={rows}
          emptyMessage="No contracts match the current filters."
        />
      </div>

      <div className={explorerListPaginationClass}>
        <PaginationControls
          pagination={pagination}
          setPagination={setPagination}
          totalCount={totalCount}
          unit={(plural) => `contract${plural ? "s" : ""}`}
        />
      </div>
    </div>
  );
}
