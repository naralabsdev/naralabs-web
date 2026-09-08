import { getSafePostAuthRedirect } from "@/modules/auth/lib/safe-redirect";
import { errorResponse, jsonResponse } from "@/shared/infra/fetch-api-helpers";
import { proxyAtlasPost } from "@/shared/infra/proxy-atlas-auth";

type RegisterBody = {
  email?: string;
  password?: string;
  callbackUrl?: string;
};

type RegisterResponse = {
  user: {
    id: string;
    email: string;
    emailVerified: boolean;
  };
  requiresVerification: boolean;
};

export async function POST(request: Request) {
  let body: RegisterBody;

  try {
    body = (await request.json()) as RegisterBody;
  } catch {
    return errorResponse({ status: 400, message: "Invalid JSON body" });
  }

  if (!body.email?.trim() || !body.password) {
    return errorResponse({ status: 400, message: "Email and password are required" });
  }

  const callbackUrl = getSafePostAuthRedirect(body.callbackUrl);
  const result = await proxyAtlasPost<RegisterResponse>("/v1/auth/register", {
    email: body.email.trim(),
    password: body.password,
    callbackUrl,
  });

  if (!result.ok) {
    return jsonResponse(
      { error: result.message, code: result.code },
      result.status,
    );
  }

  return jsonResponse(
    {
      user: result.data.user,
      requiresVerification: result.data.requiresVerification,
    },
    201,
  );
}
