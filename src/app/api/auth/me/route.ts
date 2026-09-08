import { cookies } from "next/headers";

import type { AuthUser } from "@/modules/auth/lib/auth-user";
import { errorResponse } from "@/shared/infra/fetch-api-helpers";
import {
  AUTH_SESSION_COOKIE,
  proxyAtlasGet,
} from "@/shared/infra/proxy-atlas-auth";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_SESSION_COOKIE)?.value;

  if (!token) {
    return Response.json({ user: null }, { status: 200 });
  }

  const result = await proxyAtlasGet<AuthUser>("/v1/auth/me", token);

  if (!result.ok) {
    if (result.status === 401) {
      return Response.json({ user: null }, { status: 200 });
    }

    return errorResponse({
      status: result.status,
      message: result.message ?? "Unable to load session",
    });
  }

  return Response.json({ user: result.data }, { status: 200 });
}
