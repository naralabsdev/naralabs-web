const trimTrailingSlash = (value: string) => value.replace(/\/$/, "");

function httpToWsUrl(httpUrl: string): string {
  const trimmed = trimTrailingSlash(httpUrl);
  if (trimmed.startsWith("https://")) {
    return trimmed.replace(/^https:/, "wss:");
  }
  if (trimmed.startsWith("http://")) {
    return trimmed.replace(/^http:/, "ws:");
  }
  return trimmed;
}

/** Infer Atlas WS host from public app URL (e.g. naralabs.io → api.naralabs.io). */
function deriveRealtimeWsFromAppUrl(appUrl: string): string | null {
  try {
    const url = new URL(appUrl);
    if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
      return "ws://localhost:8080";
    }

    const host = url.hostname.startsWith("www.")
      ? url.hostname.slice(4)
      : url.hostname;

    return `wss://api.${host}`;
  } catch {
    return null;
  }
}

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

  const publicApi = process.env.NEXT_PUBLIC_ATLAS_API_URL?.trim();
  if (publicApi) {
    return httpToWsUrl(publicApi);
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (appUrl) {
    const derived = deriveRealtimeWsFromAppUrl(appUrl);
    if (derived) {
      return derived;
    }
  }

  // Server-only — not available in the browser bundle; used during SSR/tests.
  const atlasUrl = process.env.ATLAS_API_URL?.trim();
  if (atlasUrl) {
    return httpToWsUrl(atlasUrl);
  }

  return "ws://localhost:8080";
}

export const REALTIME_WS_PATH = "/v1/ws/home";

export const BFF_ATLAS_PREFIX = "/api/atlas";

/** Server-only key for public playground samples (POST /v1/decode allowlist). */
export function getPlaygroundDemoApiKey(): string | null {
  const key = process.env.ATLAS_PLAYGROUND_DEMO_API_KEY?.trim();
  return key || null;
}
