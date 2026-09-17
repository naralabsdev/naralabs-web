import { cookies } from "next/headers";

import type { SchemaProjectDetail } from "@/modules/registry/types";
import { errorResponse } from "@/shared/infra/fetch-api-helpers";
import {
  AUTH_SESSION_COOKIE,
  proxyAtlasGet,
  proxyAtlasPatch,
} from "@/shared/infra/proxy-atlas-auth";

type RouteParams = {
  params: Promise<{ id: string }>;
};

async function sessionToken() {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_SESSION_COOKIE)?.value ?? null;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const token = await sessionToken();
  if (!token) {
    return errorResponse({ status: 401, message: "Sign in required" });
  }

  const { id } = await params;
  const result = await proxyAtlasGet<SchemaProjectDetail>(`/v1/schema-projects/${id}`, token);

  if (!result.ok) {
    return errorResponse({ status: result.status, message: result.message });
  }

  return Response.json(result.data, { status: 200 });
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const token = await sessionToken();
  if (!token) {
    return errorResponse({ status: 401, message: "Sign in required" });
  }

  const { id } = await params;
  let body: { name?: string; description?: string } = {};

  try {
    body = (await request.json()) as { name?: string; description?: string };
  } catch {
    return errorResponse({ status: 400, message: "Invalid JSON body" });
  }

  const result = await proxyAtlasPatch<SchemaProjectDetail>(
    `/v1/schema-projects/${id}`,
    body,
    token,
  );

  if (!result.ok) {
    return Response.json(
      { error: result.message, code: result.code },
      { status: result.status },
    );
  }

  return Response.json(result.data, { status: 200 });
}
