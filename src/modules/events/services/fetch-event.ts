import type { EventDetailPayload } from "@/modules/events/domain/atlas-types";
import { mapEventDetail } from "@/modules/events/domain/map-event-detail";
import type { EventDetailViewModel } from "@/modules/events/domain/event-view-model";
import { getDefaultNetwork } from "@/shared/config/env";
import { fetchApi } from "@/shared/infra/fetch-api";

export async function getEventDetail(
  id: string,
  network = getDefaultNetwork(),
): Promise<EventDetailViewModel> {
  const params = new URLSearchParams({ network });
  const payload = await fetchApi<EventDetailPayload>(
    `/v1/events/${encodeURIComponent(id)}?${params.toString()}`,
  );
  return mapEventDetail(payload);
}
