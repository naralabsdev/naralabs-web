import { cookies } from "next/headers";

import type { APIKeyRevokeResponse } from "@/modules/developers/types";
import { errorResponse } from "@/shared/infra/fetch-api-helpers";
import { AUTH_SESSION_COOKIE, proxyAtlasDelete } from "@/shared/infra/proxy-atlas-auth";

async function sessionToken() {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_SESSION_COOKIE)?.value ?? null;
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const token = await sessionToken();
  if (!token) {
    return errorResponse({ status: 401, message: "Sign in required" });
  }

  const { id } = await context.params;
  const result = await proxyAtlasDelete<APIKeyRevokeResponse>(`/v1/api-keys/${id}`, token);
  if (!result.ok) {
    return errorResponse({ status: result.status, message: result.message });
  }

  return Response.json(result.data, { status: 200 });
}
