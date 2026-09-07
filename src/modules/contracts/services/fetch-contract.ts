import type { ContractDetailPayload } from "@/modules/contracts/domain/atlas-types";
import { mapContractDetail } from "@/modules/contracts/domain/map-contract-detail";
import type { ContractDetailViewModel } from "@/modules/contracts/domain/contract-view-model";
import { getDefaultNetwork } from "@/shared/config/env";
import { fetchApi } from "@/shared/infra/fetch-api";

export async function getContractDetail(
  id: string,
  network = getDefaultNetwork(),
): Promise<ContractDetailViewModel> {
  const params = new URLSearchParams({ network });
  const payload = await fetchApi<ContractDetailPayload>(
    `/v1/contracts/${encodeURIComponent(id)}?${params.toString()}`,
  );
  return mapContractDetail(payload);
}
