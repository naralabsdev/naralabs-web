import type { SchemasListPayload } from "@/modules/registry/domain/atlas-types";
import { getDefaultNetwork } from "@/shared/config/env";
import { fetchApi } from "@/shared/infra/fetch-api";

import { mapContractSchemaRow } from "../domain/map-contract-schemas";

export async function fetchContractSchemas(contractId: string, network = getDefaultNetwork()) {
  const params = new URLSearchParams({ network });
  const payload = await fetchApi<SchemasListPayload>(
    `/v1/schemas/${encodeURIComponent(contractId)}?${params.toString()}`,
  );

  return payload.items.map(mapContractSchemaRow);
}
