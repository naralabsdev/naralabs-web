const trimTrailingSlash = (value: string) => value.replace(/\/$/, "");

/** Backend Atlas URL — server-only, never exposed to the browser. */
export function getAtlasBackendUrl(): string {
  const url = process.env.ATLAS_API_URL ?? "http://localhost:8080";
  return trimTrailingSlash(url);
}

/** Public app origin for client-side BFF calls (optional on server). */
export function getAppBaseUrl(): string {
  const url =
    process.env.APP_BASE_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000";

  return trimTrailingSlash(url);
}

export function getDefaultNetwork(): string {
  return process.env.NEXT_PUBLIC_STELLAR_NETWORK ?? "testnet";
}

/** Public WebSocket base URL for Atlas realtime (browser connects directly). */
export function getRealtimeWsBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_REALTIME_WS_URL?.trim();
  if (configured) {
    return trimTrailingSlash(configured);
  }

  const httpUrl = getAtlasBackendUrl();
  if (httpUrl.startsWith("https://")) {
    return trimTrailingSlash(httpUrl.replace(/^https:/, "wss:"));
  }
  return trimTrailingSlash(httpUrl.replace(/^http:/, "ws:"));
}

export const REALTIME_WS_PATH = "/v1/ws/home";

export const BFF_ATLAS_PREFIX = "/api/atlas";
