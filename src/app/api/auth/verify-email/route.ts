import { getSafePostAuthRedirect } from "@/modules/auth/lib/safe-redirect";
import { getAppBaseUrl } from "@/shared/config/env";
import {
  buildSessionCookie,
  extractAuthToken,
  proxyAtlasPost,
} from "@/shared/infra/proxy-atlas-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const token = requestUrl.searchParams.get("token");
  const callbackUrl = getSafePostAuthRedirect(
    requestUrl.searchParams.get("callbackUrl"),
  );

  if (!token) {
    return NextResponse.redirect(
      new URL("/verify-email?error=invalid", getAppBaseUrl()),
    );
  }

  const result = await proxyAtlasPost<Record<string, unknown>>(
    "/v1/auth/verify-email",
    { token },
  );

  if (!result.ok) {
    const error =
      result.code === "TOKEN_EXPIRED"
        ? "expired"
        : result.code === "INVALID_TOKEN"
          ? "invalid"
          : "invalid";

    return NextResponse.redirect(
      new URL(`/verify-email?error=${error}`, getAppBaseUrl()),
    );
  }

  const sessionToken = extractAuthToken(result.data);
  if (!sessionToken) {
    return NextResponse.redirect(
      new URL("/verify-email?error=invalid", getAppBaseUrl()),
    );
  }

  const secure = process.env.NODE_ENV === "production";
  const response = NextResponse.redirect(
    new URL(callbackUrl, getAppBaseUrl()),
  );
  response.headers.set(
    "Set-Cookie",
    buildSessionCookie(sessionToken, secure),
  );

  return response;
}
