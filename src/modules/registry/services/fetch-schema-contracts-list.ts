import type { SchemaContractListPayload } from "@/modules/registry/domain/atlas-types";
import { mapSchemaContractsList } from "@/modules/registry/domain/map-schema-contracts-list";
import { getDefaultNetwork } from "@/shared/config/env";
import { fetchApi } from "@/shared/infra/fetch-api";

export type FetchSchemaContractsListOptions = {
  page?: number;
  pageSize?: number;
  search?: string;
  network?: string;
};

export async function fetchSchemaContractsList(options: FetchSchemaContractsListOptions = {}) {
  const network = options.network ?? getDefaultNetwork();
  const page = options.page ?? 1;
  const pageSize = options.pageSize ?? 20;
  const offset = (page - 1) * pageSize;

  const params = new URLSearchParams({
    network,
    limit: String(pageSize),
    offset: String(offset),
  });

  if (options.search?.trim()) {
    params.set("search", options.search.trim());
  }

  const payload = await fetchApi<SchemaContractListPayload>(
    `/v1/schemas/contracts?${params.toString()}`,
  );

  return mapSchemaContractsList(payload, { page, pageSize });
}
