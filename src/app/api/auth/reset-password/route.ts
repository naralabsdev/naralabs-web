import { getSafePostAuthRedirect } from "@/modules/auth/lib/safe-redirect";
import { errorResponse } from "@/shared/infra/fetch-api-helpers";
import {
  buildSessionCookie,
  extractAuthToken,
  proxyAtlasPost,
} from "@/shared/infra/proxy-atlas-auth";

type ResetPasswordBody = {
  token?: string;
  password?: string;
  callbackUrl?: string;
};

export async function POST(request: Request) {
  let body: ResetPasswordBody;
  try {
    body = (await request.json()) as ResetPasswordBody;
  } catch {
    return errorResponse({ status: 400, message: "Invalid JSON body" });
  }

  if (!body.token?.trim() || !body.password) {
    return errorResponse({ status: 400, message: "Token and password are required" });
  }

  const result = await proxyAtlasPost<Record<string, unknown>>("/v1/auth/reset-password", {
    token: body.token.trim(),
    password: body.password,
  });

  if (!result.ok) {
    return Response.json(
      { error: result.message, code: result.code },
      { status: result.status },
    );
  }

  const sessionToken = extractAuthToken(result.data);
  if (!sessionToken) {
    return errorResponse({ status: 500, message: "Missing session token" });
  }

  const redirectTo = getSafePostAuthRedirect(body.callbackUrl, "/dashboard");
  const secure = process.env.NODE_ENV === "production";

  return Response.json(
    { ok: true, redirectTo },
    {
      status: 200,
      headers: {
        "Set-Cookie": buildSessionCookie(sessionToken, secure),
      },
    },
  );
}
