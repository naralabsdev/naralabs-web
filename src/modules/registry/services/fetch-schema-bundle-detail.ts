import type { SchemaBundleDetailPayload } from "@/modules/registry/domain/atlas-types";
import { mapSchemaBundleDetail } from "@/modules/registry/domain/map-schema-bundle-detail";
import { getDefaultNetwork } from "@/shared/config/env";
import { fetchApi } from "@/shared/infra/fetch-api";

export async function fetchSchemaBundleDetail(
  contractId: string,
  version: number,
  network = getDefaultNetwork(),
) {
  const params = new URLSearchParams({ network });
  const payload = await fetchApi<SchemaBundleDetailPayload>(
    `/v1/schemas/contracts/${encodeURIComponent(contractId)}/bundles/${version}?${params.toString()}`,
  );

  return mapSchemaBundleDetail(payload);
}
