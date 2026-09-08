import type { NetworkStats } from "@/modules/explore/domain/atlas-types";
import { mapNetworkStatsSummary } from "@/modules/explore/domain/map-network-stats";
import { getDefaultNetwork } from "@/shared/config/env";
import { fetchApi } from "@/shared/infra/fetch-api";

export async function fetchNetworkStats(network = getDefaultNetwork()) {
  const params = new URLSearchParams({ network });
  const payload = await fetchApi<NetworkStats>(`/v1/stats?${params.toString()}`);
  return mapNetworkStatsSummary(payload);
}
