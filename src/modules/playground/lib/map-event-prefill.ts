import type { EventDetailPayload } from "@/modules/events/domain/atlas-types";
import type { PlaygroundCustomPrefill } from "@/modules/playground/types";

export function mapEventPayloadToPlaygroundPrefill(
  payload: EventDetailPayload,
): PlaygroundCustomPrefill {
  const hasXdr =
    Array.isArray(payload.topics_xdr) &&
    payload.topics_xdr.length > 0 &&
    typeof payload.value_xdr === "string" &&
    payload.value_xdr.trim() !== "";

  if (hasXdr) {
    const payloadJson = JSON.stringify(
      {
        topics_xdr: payload.topics_xdr,
        value_xdr: payload.value_xdr,
      },
      null,
      2,
    );
    return {
      contractId: payload.contract_id,
      payloadMode: "xdr",
      payloadJson,
    };
  }

  const payloadJson = JSON.stringify(
    {
      topicsJson: payload.topics,
      valueJson: payload.value,
    },
    null,
    2,
  );

  return {
    contractId: payload.contract_id,
    payloadMode: "json",
    payloadJson,
  };
}
