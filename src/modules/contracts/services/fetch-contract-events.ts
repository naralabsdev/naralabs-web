import type {
  ContractEventsListPayload,
  ContractEventsQuery,
} from "@/modules/contracts/domain/atlas-types";
import { mapContractEventsList } from "@/modules/contracts/domain/map-contract-events";
import type { ContractEventsListViewModel } from "@/modules/contracts/domain/contract-view-model";
import { getDefaultNetwork } from "@/shared/config/env";
import { fetchApi } from "@/shared/infra/fetch-api";

export async function fetchContractEvents(
  contractId: string,
  {
    page = 1,
    pageSize = 20,
    search = "",
    eventType = "",
    decodeStatus = "",
  }: ContractEventsQuery = {},
  network = getDefaultNetwork(),
): Promise<ContractEventsListViewModel> {
  const params = new URLSearchParams({
    network,
    page: String(page),
    page_size: String(pageSize),
  });

  const trimmedSearch = search.trim();
  if (trimmedSearch) params.set("search", trimmedSearch);
  if (eventType) params.set("event_type", eventType);
  if (decodeStatus) params.set("decode_status", decodeStatus);

  const payload = await fetchApi<ContractEventsListPayload>(
    `/v1/contracts/${encodeURIComponent(contractId)}/events?${params.toString()}`,
  );
  return mapContractEventsList(payload);
}
