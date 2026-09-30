import { getPlaygroundSample } from "@/modules/playground/constants/samples";
import type { DecodeRequestBody, DecodeResult } from "@/modules/playground/types";
import { getPlaygroundBffToken } from "@/shared/config/env";
import { errorResponse } from "@/shared/infra/fetch-api-helpers";
import { proxyAtlasPost } from "@/shared/infra/proxy-atlas-auth";

const PLAYGROUND_NETWORK = "testnet";
const PLAYGROUND_DECODE_PATH = "/v1/playground/decode";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringArray(value: unknown): string[] | null {
  if (!Array.isArray(value)) {
    return null;
  }
  const out = value.filter((item): item is string => typeof item === "string" && item.trim() !== "");
  return out.length > 0 ? out : null;
}

function parsePayloadFromRecord(
  raw: Record<string, unknown>,
  payloadMode: "json" | "xdr",
): Pick<
  DecodeRequestBody,
  "topicsXdr" | "topicsJson" | "valueXdr" | "valueJson" | "eventName" | "schemaVersion"
> | null {
  const eventName = typeof raw.eventName === "string" ? raw.eventName.trim() : undefined;
  const schemaVersion =
    typeof raw.schemaVersion === "number" && Number.isFinite(raw.schemaVersion)
      ? raw.schemaVersion
      : undefined;

  if (payloadMode === "xdr") {
    const topicsXdr =
      stringArray(raw.topicsXdr) ??
      stringArray(raw.topics_xdr);
    const valueXdr =
      (typeof raw.valueXdr === "string" && raw.valueXdr.trim()) ||
      (typeof raw.value_xdr === "string" && raw.value_xdr.trim()) ||
      "";
    if (!topicsXdr || !valueXdr) {
      return null;
    }
    return { topicsXdr, valueXdr, eventName, schemaVersion };
  }

  const topicsJson = Array.isArray(raw.topicsJson)
    ? raw.topicsJson
    : Array.isArray(raw.topics_json)
      ? raw.topics_json
      : null;
  const valueJson =
    raw.valueJson !== undefined
      ? raw.valueJson
      : raw.value_json !== undefined
        ? raw.value_json
        : undefined;

  if (!topicsJson?.length || valueJson === undefined) {
    return null;
  }

  return { topicsJson, valueJson, eventName, schemaVersion };
}

function parseCustomDecodeBody(raw: Record<string, unknown>): DecodeRequestBody | null {
  const contractId = typeof raw.contractId === "string" ? raw.contractId.trim() : "";
  if (!contractId) {
    return null;
  }

  const payloadMode: "json" | "xdr" = raw.payloadMode === "xdr" ? "xdr" : "json";

  let payloadPart: Record<string, unknown> = raw;

  if (typeof raw.payloadText === "string" && raw.payloadText.trim()) {
    try {
      const parsed = JSON.parse(raw.payloadText) as unknown;
      if (!isRecord(parsed)) {
        return null;
      }
      payloadPart = { ...parsed, eventName: raw.eventName, schemaVersion: raw.schemaVersion };
    } catch {
      return null;
    }
  }

  const payload = parsePayloadFromRecord(payloadPart, payloadMode);
  if (!payload) {
    return null;
  }

  return {
    network: PLAYGROUND_NETWORK,
    contractId,
    ...payload,
  };
}

async function decodeWithAtlas(
  body: DecodeRequestBody,
): Promise<{ ok: true; data: DecodeResult } | { ok: false; status: number; message: string }> {
  const token = getPlaygroundBffToken();
  if (!token) {
    return {
      ok: false,
      status: 503,
      message: "Playground decode is not configured on this server",
    };
  }

  const result = await proxyAtlasPost<DecodeResult>(PLAYGROUND_DECODE_PATH, body, token);
  if (!result.ok) {
    return {
      ok: false,
      status: result.status,
      message: result.message ?? "Decode request failed",
    };
  }
  return { ok: true, data: result.data };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse({ status: 400, message: "Invalid JSON body" });
  }

  if (!isRecord(body)) {
    return errorResponse({ status: 400, message: "Invalid request body" });
  }

  const sampleId = typeof body.sampleId === "string" ? body.sampleId.trim() : "";
  if (sampleId) {
    const sample = getPlaygroundSample(sampleId);
    if (!sample) {
      return errorResponse({ status: 400, message: "Unknown sample" });
    }

    const live = await decodeWithAtlas({ ...sample.request, network: PLAYGROUND_NETWORK });
    if (live.ok) {
      return Response.json(live.data, { status: 200 });
    }

    if (live.status === 503) {
      return Response.json(sample.fallbackResult, { status: 200 });
    }

    return errorResponse({ status: live.status, message: live.message });
  }

  const parsed = parseCustomDecodeBody(body);
  if (!parsed) {
    return errorResponse({
      status: 400,
      message:
        "Provide contractId and payload (JSON: topicsJson + valueJson, or XDR: topics_xdr + value_xdr)",
    });
  }

  const result = await decodeWithAtlas(parsed);
  if (!result.ok) {
    return errorResponse({ status: result.status, message: result.message });
  }

  return Response.json(result.data, { status: 200 });
}
