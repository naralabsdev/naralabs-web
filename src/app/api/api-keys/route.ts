import { cookies } from "next/headers";

import type { APIKeyCreateResult, APIKeyListResponse } from "@/modules/developers/types";
import { errorResponse } from "@/shared/infra/fetch-api-helpers";
import {
  AUTH_SESSION_COOKIE,
  proxyAtlasGet,
  proxyAtlasPost,
} from "@/shared/infra/proxy-atlas-auth";

async function sessionToken() {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_SESSION_COOKIE)?.value ?? null;
}

export async function GET() {
  const token = await sessionToken();
  if (!token) {
    return errorResponse({ status: 401, message: "Sign in required" });
  }

  const result = await proxyAtlasGet<APIKeyListResponse>("/v1/api-keys", token);
  if (!result.ok) {
    return errorResponse({ status: result.status, message: result.message });
  }

  return Response.json(result.data, { status: 200 });
}

export async function POST(request: Request) {
  const token = await sessionToken();
  if (!token) {
    return errorResponse({ status: 401, message: "Sign in required" });
  }

  let body: { label?: string } = {};
  try {
    body = (await request.json()) as { label?: string };
  } catch {
    return errorResponse({ status: 400, message: "Invalid JSON body" });
  }

  const result = await proxyAtlasPost<APIKeyCreateResult>(
    "/v1/api-keys",
    { label: body.label?.trim() || "Default" },
    token,
  );

  if (!result.ok) {
    return Response.json(
      { error: result.message, code: result.code },
      { status: result.status },
    );
  }

  return Response.json(result.data, { status: 201 });
}
