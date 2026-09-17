import type { SchemaRegistrySummaryPayload } from "@/modules/registry/domain/atlas-types";
import type { SchemaRegistrySummaryViewModel } from "@/modules/registry/domain/schema-view-model";
import { nFormatter } from "@/shared/lib/functions/nformatter";

export function mapSchemaRegistrySummary(
  payload: SchemaRegistrySummaryPayload,
): SchemaRegistrySummaryViewModel {
  return {
    publishedContracts: nFormatter(payload.publishedContracts, { full: true }),
    eventSchemas: nFormatter(payload.eventSchemas, { full: true }),
    verifiedContracts: nFormatter(payload.verifiedContracts, { full: true }),
    communityContracts: nFormatter(payload.communityContracts, { full: true }),
  };
}
