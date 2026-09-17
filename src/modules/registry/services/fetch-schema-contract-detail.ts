import type { SchemaContractProfilePayload } from "@/modules/registry/domain/atlas-types";
import { mapSchemaContractDetail } from "@/modules/registry/domain/map-schema-contract-detail";
import { getDefaultNetwork } from "@/shared/config/env";
import { fetchApi } from "@/shared/infra/fetch-api";

export async function fetchSchemaContractDetail(
  contractId: string,
  network = getDefaultNetwork(),
) {
  const params = new URLSearchParams({ network });
  const payload = await fetchApi<SchemaContractProfilePayload>(
    `/v1/schemas/contracts/${encodeURIComponent(contractId)}?${params.toString()}`,
  );

  return mapSchemaContractDetail(payload);
}
