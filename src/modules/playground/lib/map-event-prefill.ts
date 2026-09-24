import type { EventDetailPayload } from "@/modules/events/domain/atlas-types";
import type { PlaygroundCustomPrefill } from "@/modules/playground/types";

export function mapEventPayloadToPlaygroundPrefill(
  payload: EventDetailPayload,
): PlaygroundCustomPrefill {
  const payloadJson = JSON.stringify(
    {
      topicsJson: payload.topics,
      valueJson: payload.value,
    },
    null,
    2,
  );

  return {
    network: payload.network,
    contractId: payload.contract_id,
    payloadJson,
  };
}
