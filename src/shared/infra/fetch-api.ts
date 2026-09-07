import { ApiError } from "@/shared/infra/errors";
import { proxyAtlasGet } from "@/shared/infra/proxy-atlas";
import { BFF_ATLAS_PREFIX } from "@/shared/config/env";

type ProblemDetails = {
  title?: string;
  detail?: string;
  status?: number;
  error?: string;
};

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";

  if (!response.ok) {
    let detail: string | undefined;
    if (contentType.includes("application/json")) {
      const problem = (await response.json()) as ProblemDetails;
      detail = problem.detail ?? problem.title ?? problem.error;
    }
    throw new ApiError(
      response.status,
      detail ?? `Request failed with status ${response.status}`,
      detail,
    );
  }

  if (contentType.includes("application/json")) {
    return (await response.json()) as T;
  }

  throw new ApiError(response.status, "Expected JSON response");
}

function buildBffUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${BFF_ATLAS_PREFIX}${normalized}`;
}

/**
 * Fetch Atlas data through the BFF proxy (`/api/atlas/*`).
 * Server-side calls invoke the proxy directly (no loopback HTTP).
 * Browser/client calls hit the same-origin route handler.
 */
export async function fetchApi<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (typeof window === "undefined") {
    const response = await proxyAtlasGet(normalizedPath, {
      requestId: crypto.randomUUID(),
    });
    return parseJsonResponse<T>(response);
  }

  const response = await fetch(buildBffUrl(normalizedPath), {
    ...init,
    headers: {
      Accept: "application/json",
      ...init.headers,
    },
    credentials: "same-origin",
  });

  return parseJsonResponse<T>(response);
}
