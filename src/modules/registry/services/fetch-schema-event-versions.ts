import type { EventSchemaVersionsPayload } from "@/modules/registry/domain/atlas-types";
import { mapSchemaEventVersions } from "@/modules/registry/domain/map-schema-event-versions";
import { getDefaultNetwork } from "@/shared/config/env";
import { fetchApi } from "@/shared/infra/fetch-api";

export async function fetchSchemaEventVersions(
  contractId: string,
  eventName: string,
  currentSchemaId: string,
  network = getDefaultNetwork(),
) {
  const params = new URLSearchParams({ network });
  const payload = await fetchApi<EventSchemaVersionsPayload>(
    `/v1/schemas/${encodeURIComponent(contractId)}/${encodeURIComponent(eventName)}/versions?${params.toString()}`,
  );

  return mapSchemaEventVersions(payload, currentSchemaId);
}
