import { getSafePostAuthRedirect } from "@/modules/auth/lib/safe-redirect";
import { errorResponse, jsonResponse } from "@/shared/infra/fetch-api-helpers";
import { proxyAtlasPost } from "@/shared/infra/proxy-atlas-auth";

type ResendBody = {
  email?: string;
  callbackUrl?: string;
};

type ResendResponse = {
  sent: boolean;
  alreadyVerified: boolean;
};

export async function POST(request: Request) {
  let body: ResendBody;

  try {
    body = (await request.json()) as ResendBody;
  } catch {
    return errorResponse({ status: 400, message: "Invalid JSON body" });
  }

  if (!body.email?.trim()) {
    return errorResponse({ status: 400, message: "Email is required" });
  }

  const callbackUrl = getSafePostAuthRedirect(body.callbackUrl);
  const result = await proxyAtlasPost<ResendResponse>(
    "/v1/auth/resend-verification",
    {
      email: body.email.trim(),
      callbackUrl,
    },
  );

  if (!result.ok) {
    return jsonResponse(
      { error: result.message, code: result.code },
      result.status,
    );
  }

  return jsonResponse({
    sent: result.data.sent,
    alreadyVerified: result.data.alreadyVerified,
  });
}
