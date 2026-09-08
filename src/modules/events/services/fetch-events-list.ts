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
  const page = options.page ?? 1;
  const pageSize = options.pageSize ?? 20;
  const params = new URLSearchParams({ network });
  params.set("page", String(page));
  params.set("page_size", String(pageSize));

  if (options.search?.trim()) {
    params.set("search", options.search.trim());
  }
  if (options.decodeStatus) {
    params.set("decode_status", options.decodeStatus);
  }

  const payload = await fetchApi<EventsListPayload>(`/v1/events?${params.toString()}`);
  return mapEventsList(payload, { page, pageSize });
}
