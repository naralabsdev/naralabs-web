import { errorResponse } from "@/shared/infra/fetch-api-helpers";
import { proxyAtlasPost } from "@/shared/infra/proxy-atlas-auth";

type ForgotPasswordBody = {
  email?: string;
};

export async function POST(request: Request) {
  let body: ForgotPasswordBody;
  try {
    body = (await request.json()) as ForgotPasswordBody;
  } catch {
    return errorResponse({ status: 400, message: "Invalid JSON body" });
  }

  if (!body.email?.trim()) {
    return errorResponse({ status: 400, message: "Email is required" });
  }

  const result = await proxyAtlasPost<{ sent: boolean }>("/v1/auth/forgot-password", {
    email: body.email.trim(),
  });

  if (!result.ok) {
    return Response.json(
      { error: result.message, code: result.code },
      { status: result.status },
    );
  }

  return Response.json({ ok: true, sent: true }, { status: 200 });
}
