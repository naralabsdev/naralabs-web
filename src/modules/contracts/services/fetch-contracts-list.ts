import type { ContractsListPayload } from "@/modules/explore/domain/atlas-types";
import { mapContractsList } from "@/modules/contracts/domain/map-contracts-list";
import { getDefaultNetwork } from "@/shared/config/env";
import { fetchApi } from "@/shared/infra/fetch-api";

export type FetchContractsListOptions = {
  page?: number;
  pageSize?: number;
  search?: string;
  schemaStatus?: "" | "decoded" | "raw_only";
  network?: string;
};

export async function fetchContractsList(options: FetchContractsListOptions = {}) {
  const network = options.network ?? getDefaultNetwork();
  const page = options.page ?? 1;
  const pageSize = options.pageSize ?? 20;
  const params = new URLSearchParams({ network });
  params.set("page", String(page));
  params.set("page_size", String(pageSize));

  if (options.search?.trim()) {
    params.set("search", options.search.trim());
  }
  if (options.schemaStatus) {
    params.set("schema_status", options.schemaStatus);
  }

  const payload = await fetchApi<ContractsListPayload>(`/v1/contracts?${params.toString()}`);
  return mapContractsList(payload, { page, pageSize });
}
