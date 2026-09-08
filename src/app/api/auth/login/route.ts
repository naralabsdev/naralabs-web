import { getSafePostAuthRedirect } from "@/modules/auth/lib/safe-redirect";
import { errorResponse } from "@/shared/infra/fetch-api-helpers";
import {
  buildSessionCookie,
  extractAuthToken,
  proxyAtlasPost,
} from "@/shared/infra/proxy-atlas-auth";

type LoginBody = {
  email?: string;
  password?: string;
  callbackUrl?: string;
};

export async function POST(request: Request) {
  let body: LoginBody;

  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return errorResponse({ status: 400, message: "Invalid JSON body" });
  }

  if (!body.email?.trim() || !body.password) {
    return errorResponse({ status: 400, message: "Email and password are required" });
  }

  const result = await proxyAtlasPost<Record<string, unknown>>("/v1/auth/login", {
    email: body.email.trim(),
    password: body.password,
  });

  if (!result.ok) {
    return Response.json(
      { error: result.message, code: result.code },
      { status: result.status },
    );
  }

  const token = extractAuthToken(result.data);
  if (!token) {
    return errorResponse({ status: 500, message: "Missing session token" });
  }

  const redirectTo = getSafePostAuthRedirect(body.callbackUrl);
  const secure = process.env.NODE_ENV === "production";

  return Response.json(
    { ok: true, redirectTo },
    {
      status: 200,
      headers: {
        "Set-Cookie": buildSessionCookie(token, secure),
      },
    },
  );
}
