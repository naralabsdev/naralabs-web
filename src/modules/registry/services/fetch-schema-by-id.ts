import type { EventSchemaPublicPayload } from "@/modules/registry/domain/atlas-types";
import { mapEventSchemaDetail } from "@/modules/registry/domain/map-event-schema-detail";
import { fetchApi } from "@/shared/infra/fetch-api";

export async function fetchSchemaById(schemaId: string) {
  const payload = await fetchApi<EventSchemaPublicPayload>(
    `/v1/schemas/events/${encodeURIComponent(schemaId)}`,
  );

  return mapEventSchemaDetail(payload);
}
