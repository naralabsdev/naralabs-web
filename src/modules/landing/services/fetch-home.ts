import type { HomePayload } from "@/modules/landing/domain/atlas-types";
import { mapHomePayload } from "@/modules/landing/domain/map-home-payload";
import type { HomePageViewModel } from "@/modules/landing/domain/home-view-model";
import { getDefaultNetwork } from "@/shared/config/env";
import { fetchApi } from "@/shared/infra/fetch-api";

export async function getHomePageData(
  network = getDefaultNetwork(),
): Promise<HomePageViewModel> {
  const params = new URLSearchParams({ network });
  const payload = await fetchApi<HomePayload>(`/v1/home?${params.toString()}`);
  return mapHomePayload(payload);
}
