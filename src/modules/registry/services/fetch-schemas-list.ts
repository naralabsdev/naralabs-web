import type { SchemasListPayload } from "@/modules/registry/domain/atlas-types";
import { mapSchemasList } from "@/modules/registry/domain/map-schemas-list";
import { getDefaultNetwork } from "@/shared/config/env";
import { fetchApi } from "@/shared/infra/fetch-api";

export type FetchSchemasListOptions = {
  page?: number;
  pageSize?: number;
  search?: string;
  network?: string;
};

export async function fetchSchemasList(options: FetchSchemasListOptions = {}) {
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

  const payload = await fetchApi<SchemasListPayload>(`/v1/schemas?${params.toString()}`);

  return mapSchemasList(payload, { page, pageSize });
}
