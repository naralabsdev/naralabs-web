import { cookies } from "next/headers";

import { errorResponse } from "@/shared/infra/fetch-api-helpers";
import {
  AUTH_SESSION_COOKIE,
  proxyAtlasPost,
} from "@/shared/infra/proxy-atlas-auth";

type ChangePasswordBody = {
  currentPassword?: string;
  newPassword?: string;
};

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_SESSION_COOKIE)?.value;

  if (!token) {
    return errorResponse({ status: 401, message: "Sign in required" });
  }

  let body: ChangePasswordBody;
  try {
    body = (await request.json()) as ChangePasswordBody;
  } catch {
    return errorResponse({ status: 400, message: "Invalid JSON body" });
  }

  if (!body.currentPassword || !body.newPassword) {
    return errorResponse({
      status: 400,
      message: "Current password and new password are required",
    });
  }

  const result = await proxyAtlasPost<{ changed: boolean }>(
    "/v1/auth/change-password",
    {
      currentPassword: body.currentPassword,
      newPassword: body.newPassword,
    },
    token,
  );

  if (!result.ok) {
    return Response.json(
      { error: result.message, code: result.code },
      { status: result.status },
    );
  }

  return Response.json({ ok: true, changed: true }, { status: 200 });
}
