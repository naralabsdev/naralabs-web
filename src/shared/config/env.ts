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

export const BFF_ATLAS_PREFIX = "/api/atlas";
