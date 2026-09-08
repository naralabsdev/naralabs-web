import type { EventsListPayload } from "@/modules/explore/domain/atlas-types";
import { mapEventsList } from "@/modules/events/domain/map-events-list";
import { getDefaultNetwork } from "@/shared/config/env";
import { fetchApi } from "@/shared/infra/fetch-api";

export type FetchEventsListOptions = {
  page?: number;
  pageSize?: number;
  search?: string;
  decodeStatus?: "" | "decoded" | "raw";
  network?: string;
};

export async function fetchEventsList(options: FetchEventsListOptions = {}) {
  const network = options.network ?? getDefaultNetwork();
  const params = new URLSearchParams({ network });
  params.set("page", String(options.page ?? 1));
  params.set("page_size", String(options.pageSize ?? 20));

  if (options.search?.trim()) {
    params.set("search", options.search.trim());
  }
  if (options.decodeStatus) {
    params.set("decode_status", options.decodeStatus);
  }

  const payload = await fetchApi<EventsListPayload>(`/v1/events?${params.toString()}`);
  return mapEventsList(payload);
}
