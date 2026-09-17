import type { SchemaRegistrySummaryPayload } from "@/modules/registry/domain/atlas-types";
import { mapSchemaRegistrySummary } from "@/modules/registry/domain/map-schema-registry-summary";
import { getDefaultNetwork } from "@/shared/config/env";
import { fetchApi } from "@/shared/infra/fetch-api";

export async function fetchSchemaRegistrySummary(network = getDefaultNetwork()) {
  const params = new URLSearchParams({ network });
  const payload = await fetchApi<SchemaRegistrySummaryPayload>(
    `/v1/schemas/summary?${params.toString()}`,
  );

  return mapSchemaRegistrySummary(payload);
}
