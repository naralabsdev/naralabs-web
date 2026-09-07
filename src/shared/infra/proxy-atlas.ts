import { getAtlasBackendUrl } from "@/shared/config/env";

type ParsedAtlasPath = {
  segments: string[];
  search: string;
};

export function parseAtlasPath(path: string): ParsedAtlasPath {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(normalized, "http://atlas.internal");
  return {
    segments: url.pathname.split("/").filter(Boolean),
    search: url.search,
  };
}

export async function proxyAtlasGet(
  path: string,
  init: { requestId?: string } = {},
): Promise<Response> {
  const { segments, search } = parseAtlasPath(path);
  const target = `${getAtlasBackendUrl()}/${segments.join("/")}${search}`;

  const response = await fetch(target, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...(init.requestId ? { "X-Request-ID": init.requestId } : {}),
    },
    cache: "no-store",
  });

  const body = await response.text();

  return new Response(body, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("content-type") ?? "application/json",
    },
  });
}
