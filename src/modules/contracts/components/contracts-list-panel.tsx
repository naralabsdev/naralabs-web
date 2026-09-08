"use client";

import { useCallback, useEffect, useState } from "react";

import { ContractsListTable } from "@/modules/contracts/components/contracts-list-table";
import type { ContractsListViewModel } from "@/modules/contracts/domain/contracts-list-view-model";
import { fetchContractsList } from "@/modules/contracts/services/fetch-contracts-list";
import { cn } from "@/shared/lib/cn";
import { InputSearch } from "@/shared/ui/icons/nucleo";
import { Input } from "@/shared/ui/input";
import { PaginationControls } from "@/shared/ui/pagination-controls";

const selectClassName = cn(
  "h-9 rounded-md border border-neutral-300 bg-white px-2.5 text-sm text-neutral-900",
  "focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500",
);

export function ContractsListPanel({
  network,
  initialData,
}: {
  network: string;
  initialData: ContractsListViewModel;
}) {
  const [pagination, setPagination] = useState({
    pageIndex: initialData.page,
    pageSize: initialData.pageSize,
  });
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [schemaStatus, setSchemaStatus] = useState<"" | "decoded" | "raw_only">("");
  const [totalCount, setTotalCount] = useState(initialData.total);
  const [rows, setRows] = useState(initialData.items);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(searchInput.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setPagination((current) => ({ ...current, pageIndex: 1 }));
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
    void loadContracts();
  }, [loadContracts]);

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
              placeholder="Contract ID…"
              className="pl-9"
            />
          </div>
        </label>

        <label className="block min-w-[10rem]">
          <span className="mb-1.5 block text-xs font-medium text-neutral-500">Schema status</span>
          <select
            value={schemaStatus}
            onChange={(event) =>
              setSchemaStatus(event.target.value as "" | "decoded" | "raw_only")
            }
            className={selectClassName}
          >
            <option value="">All contracts</option>
            <option value="decoded">Decoded</option>
            <option value="raw_only">Raw only</option>
          </select>
        </label>
      </div>

      {error ? <p className="px-5 text-sm text-red-600 sm:px-6">{error}</p> : null}

      <div className={cn(loading && "opacity-60")}>
        <ContractsListTable rows={rows} />
      </div>

      <div className="border-t border-neutral-100 px-5 py-4 sm:px-6">
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
