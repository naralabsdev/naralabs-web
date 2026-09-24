import { cookies } from "next/headers";

import { getPlaygroundSample } from "@/modules/playground/constants/samples";
import type { DecodeRequestBody, DecodeResult } from "@/modules/playground/types";
import { getPlaygroundDemoApiKey } from "@/shared/config/env";
import { errorResponse } from "@/shared/infra/fetch-api-helpers";
import { AUTH_SESSION_COOKIE, proxyAtlasPost } from "@/shared/infra/proxy-atlas-auth";

async function sessionToken() {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_SESSION_COOKIE)?.value ?? null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseCustomDecodeBody(raw: unknown): { decode: DecodeRequestBody; apiKey: string } | null {
  if (!isRecord(raw)) {
    return null;
  }

  const apiKey = typeof raw.apiKey === "string" ? raw.apiKey.trim() : "";
  if (!apiKey.startsWith("nl_api_")) {
    return null;
  }

  const network = typeof raw.network === "string" ? raw.network.trim() : "";
  const contractId = typeof raw.contractId === "string" ? raw.contractId.trim() : "";
  if (!network || !contractId) {
    return null;
  }

  const decode: DecodeRequestBody = { network, contractId };

  if (typeof raw.eventName === "string" && raw.eventName.trim()) {
    decode.eventName = raw.eventName.trim();
  }
  if (typeof raw.schemaVersion === "number" && Number.isFinite(raw.schemaVersion)) {
    decode.schemaVersion = raw.schemaVersion;
  }
  if (Array.isArray(raw.topicsXdr)) {
    decode.topicsXdr = raw.topicsXdr.filter((item): item is string => typeof item === "string");
  }
  if (Array.isArray(raw.topicsJson)) {
    decode.topicsJson = raw.topicsJson;
  }
  if (typeof raw.valueXdr === "string" && raw.valueXdr.trim()) {
    decode.valueXdr = raw.valueXdr.trim();
  }
  if (raw.valueJson !== undefined) {
    decode.valueJson = raw.valueJson;
  }

  const hasTopics = (decode.topicsXdr?.length ?? 0) > 0 || (decode.topicsJson?.length ?? 0) > 0;
  const hasValue = Boolean(decode.valueXdr) || decode.valueJson !== undefined;
  if (!hasTopics || !hasValue) {
    return null;
  }

  return { decode, apiKey };
}

async function decodeWithAtlas(
  body: DecodeRequestBody,
  authorization: string,
): Promise<{ ok: true; data: DecodeResult } | { ok: false; status: number; message: string }> {
  const result = await proxyAtlasPost<DecodeResult>("/v1/decode", body, authorization);
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

    const demoKey = getPlaygroundDemoApiKey();
    if (demoKey) {
      const live = await decodeWithAtlas(sample.request, demoKey);
      if (live.ok) {
        return Response.json(live.data, { status: 200 });
      }
    }

    return Response.json(sample.fallbackResult, { status: 200 });
  }

  const token = await sessionToken();
  if (!token) {
    return errorResponse({ status: 401, message: "Sign in to decode custom payloads" });
  }

  const parsed = parseCustomDecodeBody(body);
  if (!parsed) {
    return errorResponse({
      status: 400,
      message: "Provide network, contractId, topics, value, and a valid nl_api_ key",
    });
  }

  const result = await decodeWithAtlas(parsed.decode, parsed.apiKey);
  if (!result.ok) {
    return errorResponse({ status: result.status, message: result.message });
  }

  return Response.json(result.data, { status: 200 });
}
