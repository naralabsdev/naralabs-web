import { cookies } from "next/headers";

import type { ProjectPublications } from "@/modules/registry/types";
import { errorResponse } from "@/shared/infra/fetch-api-helpers";
import { AUTH_SESSION_COOKIE, proxyAtlasGet } from "@/shared/infra/proxy-atlas-auth";

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
  const result = await proxyAtlasGet<ProjectPublications>(
    `/v1/schema-projects/${id}/publications`,
    token,
  );

  if (!result.ok) {
    return errorResponse({ status: result.status, message: result.message });
  }

  return Response.json(result.data, { status: 200 });
}
