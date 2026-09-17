import type { EventSchemaPublicPayload } from "@/modules/registry/domain/atlas-types";
import { mapEventSchemaDetail } from "@/modules/registry/domain/map-event-schema-detail";
import { getDefaultNetwork } from "@/shared/config/env";
import { fetchApi } from "@/shared/infra/fetch-api";

export async function fetchEventSchema(
  contractId: string,
  eventName: string,
  options: { network?: string; version?: number } = {},
) {
  const network = options.network ?? getDefaultNetwork();
  const params = new URLSearchParams({ network });

  if (options.version && options.version > 0) {
    params.set("version", String(options.version));
  }

  const payload = await fetchApi<EventSchemaPublicPayload>(
    `/v1/schemas/${encodeURIComponent(contractId)}/${encodeURIComponent(eventName)}?${params.toString()}`,
  );

  return mapEventSchemaDetail(payload);
}
