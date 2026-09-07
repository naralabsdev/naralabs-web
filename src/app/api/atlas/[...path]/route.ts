import { checkEnv, errorResponse } from "@/shared/infra/fetch-api-helpers";
import { proxyAtlasGet } from "@/shared/infra/proxy-atlas";
import type { NextRequest } from "next/server";

type RouteParams = {
  params: Promise<{ path: string[] }>;
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const envError = checkEnv();
    if (envError) {
      return errorResponse({ status: 500, message: envError });
    }

    const { path } = await params;
    const upstreamPath = `/${path.join("/")}${request.nextUrl.search}`;

    return proxyAtlasGet(upstreamPath, {
      requestId: request.headers.get("x-request-id") ?? crypto.randomUUID(),
    });
  } catch (error) {
    console.error("[api/atlas]", error);
    return errorResponse({ status: 500 });
  }
}
