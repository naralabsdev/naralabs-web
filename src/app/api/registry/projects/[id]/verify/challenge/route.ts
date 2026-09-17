import { cookies } from "next/headers";

import type { VerifyChallenge } from "@/modules/registry/types";
import { errorResponse } from "@/shared/infra/fetch-api-helpers";
import { AUTH_SESSION_COOKIE, proxyAtlasPost } from "@/shared/infra/proxy-atlas-auth";

type RouteParams = {
  params: Promise<{ id: string }>;
};

async function sessionToken() {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_SESSION_COOKIE)?.value ?? null;
}

export async function POST(request: Request, { params }: RouteParams) {
  const token = await sessionToken();
  if (!token) {
    return errorResponse({ status: 401, message: "Sign in required" });
  }

  const { id } = await params;
  let body: { contractId?: string; network?: string } = {};

  try {
    body = (await request.json()) as { contractId?: string; network?: string };
  } catch {
    return errorResponse({ status: 400, message: "Invalid JSON body" });
  }

  const result = await proxyAtlasPost<VerifyChallenge>(
    `/v1/schema-projects/${id}/verify/challenge`,
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
