import { clearSessionCookie } from "@/shared/infra/proxy-atlas-auth";

export async function POST() {
  const secure = process.env.NODE_ENV === "production";

  return Response.json(
    { ok: true },
    {
      status: 200,
      headers: {
        "Set-Cookie": clearSessionCookie(secure),
      },
    },
  );
}
