"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  explorerListErrorClass,
  explorerListFilterLabelClass,
  explorerListFiltersClass,
  explorerListPaginationClass,
  explorerListPanelRootClass,
  explorerListTableWrapClass,
} from "@/modules/explore/components/explorer-list-section";
import { SchemaContractsTable } from "@/modules/registry/components/schema-contracts-table";
import type { SchemaContractsListViewModel } from "@/modules/registry/domain/schema-view-model";
import { fetchSchemaContractsList } from "@/modules/registry/services/fetch-schema-contracts-list";
import { cn } from "@/shared/lib/cn";
import { InputSearch } from "@/shared/ui/icons/nucleo";
import { Input } from "@/shared/ui/input";
import { PaginationControls } from "@/shared/ui/pagination-controls";
import { SimpleSelect } from "@/shared/ui/simple-select";

export function SchemasListPanel({
  network,
  initialData,
}: {
  network: string;
  initialData: SchemaContractsListViewModel;
}) {
  const skipInitialFetchRef = useRef(true);
  const [pagination, setPagination] = useState({
    pageIndex: initialData.page,
    pageSize: initialData.pageSize,
  });
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [trustStatus, setTrustStatus] = useState<"" | "verified" | "community">("");
  const [totalCount, setTotalCount] = useState(initialData.total ?? initialData.items.length);
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
  }, [debouncedSearch, trustStatus]);

  const loadContracts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchSchemaContractsList({
        network,
        page: pagination.pageIndex,
        pageSize: pagination.pageSize,
        search: debouncedSearch,
      });
      setRows(result.items);
      setTotalCount(result.total);
    } catch {
      setError("Failed to load schema contracts. Please try again.");
      setRows([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [network, pagination.pageIndex, pagination.pageSize, debouncedSearch]);

  useEffect(() => {
    if (skipInitialFetchRef.current) {
      skipInitialFetchRef.current = false;
      return;
    }
    void loadContracts();
  }, [loadContracts]);

  const displayRows =
    trustStatus === "verified"
      ? rows.filter((item) => item.isVerified)
      : trustStatus === "community"
        ? rows.filter((item) => !item.isVerified)
        : rows;

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
          <span className={explorerListFilterLabelClass}>Trust status</span>
          <SimpleSelect
            aria-label="Trust status"
            value={trustStatus}
            onValueChange={(nextValue) =>
              setTrustStatus(nextValue as "" | "verified" | "community")
            }
            className="min-w-[10rem]"
            placeholder="All statuses"
            options={[
              { value: "", label: "All statuses" },
              { value: "verified", label: "Verified" },
              { value: "community", label: "Community" },
            ]}
          />
        </label>
      </div>

      {error ? <p className={explorerListErrorClass}>{error}</p> : null}

      <div className={cn(explorerListTableWrapClass, loading && "opacity-60")}>
        <SchemaContractsTable
          rows={displayRows}
          emptyMessage="No schema contracts match the current filters."
        />
      </div>

      <div className={explorerListPaginationClass}>
        <PaginationControls
          pagination={pagination}
          setPagination={setPagination}
          totalCount={trustStatus ? displayRows.length : totalCount}
          unit={(plural) => `contract${plural ? "s" : ""}`}
        />
      </div>
    </div>
  );
}
