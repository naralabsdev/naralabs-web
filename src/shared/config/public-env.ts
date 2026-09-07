type PublicEnvKey =
  | "NEXT_PUBLIC_APP_URL"
  | "NEXT_PUBLIC_DOCS_URL"
  | "NEXT_PUBLIC_GITHUB_URL"
  | "NEXT_PUBLIC_NGROK_URL"
  | "NEXT_PUBLIC_STELLAR_NETWORK"
  | "NEXT_PUBLIC_VERCEL_ENV";

function readPublicEnv(key: PublicEnvKey): string | undefined {
  if (typeof process === "undefined" || !process.env) {
    return undefined;
  }

  return process.env[key];
}

function readServerEnv(key: "STORAGE_BASE_URL" | "VERCEL_URL"): string | undefined {
  if (typeof process === "undefined" || !process.env) {
    return undefined;
  }

  return process.env[key];
}

export const publicEnv = {
  appUrl: readPublicEnv("NEXT_PUBLIC_APP_URL"),
  docsUrl: readPublicEnv("NEXT_PUBLIC_DOCS_URL"),
  githubUrl: readPublicEnv("NEXT_PUBLIC_GITHUB_URL"),
  ngrokUrl: readPublicEnv("NEXT_PUBLIC_NGROK_URL"),
  stellarNetwork: readPublicEnv("NEXT_PUBLIC_STELLAR_NETWORK"),
  vercelEnv: readPublicEnv("NEXT_PUBLIC_VERCEL_ENV"),
} as const;

export const serverEnv = {
  storageBaseUrl: readServerEnv("STORAGE_BASE_URL"),
  vercelUrl: readServerEnv("VERCEL_URL"),
} as const;

export const isDevelopment =
  typeof process !== "undefined" && process.env?.NODE_ENV === "development";
