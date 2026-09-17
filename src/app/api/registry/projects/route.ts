import { cookies } from "next/headers";

import type { SchemaProjectDetail, SchemaProjectList } from "@/modules/registry/types";
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

  const result = await proxyAtlasGet<SchemaProjectList>("/v1/schema-projects", token);
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

  let body: { name?: string } = {};
  try {
    body = (await request.json()) as { name?: string };
  } catch {
    return errorResponse({ status: 400, message: "Invalid JSON body" });
  }

  if (!body.name?.trim()) {
    return errorResponse({ status: 400, message: "Schema name is required" });
  }

  const result = await proxyAtlasPost<SchemaProjectDetail>(
    "/v1/schema-projects",
    { name: body.name.trim() },
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
