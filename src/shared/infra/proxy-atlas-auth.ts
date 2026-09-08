import { getAtlasBackendUrl } from "@/shared/config/env";

export const AUTH_SESSION_COOKIE = "atlas_session";
export const AUTH_SESSION_MAX_AGE = 60 * 60 * 24 * 7;

type AtlasAuthResponse<T> = {
  ok: boolean;
  status: number;
  data: T;
  code?: string;
  message?: string;
};

type HumaErrorBody = {
  detail?: string;
  title?: string;
  errors?: Array<{
    message?: string;
    value?: string;
    location?: string;
  }>;
};

export async function proxyAtlasGet<T>(
  path: string,
  authorization: string,
): Promise<AtlasAuthResponse<T>> {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const target = `${getAtlasBackendUrl()}${normalized}`;

  const response = await fetch(target, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: authorization.startsWith("Bearer ")
        ? authorization
        : `Bearer ${authorization}`,
    },
    cache: "no-store",
  });

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload = isJson
    ? ((await response.json()) as T | HumaErrorBody)
    : null;

  if (!response.ok) {
    const problem = (payload ?? {}) as HumaErrorBody;
    const code =
      problem.errors?.find((entry) => entry.location === "code")?.value ??
      problem.errors?.[0]?.value;
    const message =
      problem.detail ??
      problem.title ??
      problem.errors?.[0]?.message ??
      "Request failed";

    return {
      ok: false,
      status: response.status,
      data: payload as T,
      code: typeof code === "string" ? code : undefined,
      message,
    };
  }

  return {
    ok: true,
    status: response.status,
    data: payload as T,
  };
}

export async function proxyAtlasPost<T>(
  path: string,
  body: unknown,
): Promise<AtlasAuthResponse<T>> {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const target = `${getAtlasBackendUrl()}${normalized}`;

  const response = await fetch(target, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload = isJson
    ? ((await response.json()) as T | HumaErrorBody)
    : null;

  if (!response.ok) {
    const problem = (payload ?? {}) as HumaErrorBody;
    const code =
      problem.errors?.find((entry) => entry.location === "code")?.value ??
      problem.errors?.[0]?.value;
    let message =
      problem.detail ??
      problem.title ??
      problem.errors?.[0]?.message ??
      "Request failed";

    if (response.status === 404) {
      message =
        "Auth API not found. Restart Atlas server with the latest build.";
    }

    return {
      ok: false,
      status: response.status === 404 ? 503 : response.status,
      data: payload as T,
      code:
        response.status === 404
          ? "AUTH_API_UNAVAILABLE"
          : typeof code === "string"
            ? code
            : undefined,
      message,
    };
  }

  return {
    ok: true,
    status: response.status,
    data: payload as T,
  };
}

export function buildSessionCookie(token: string, secure: boolean): string {
  const parts = [
    `${AUTH_SESSION_COOKIE}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${AUTH_SESSION_MAX_AGE}`,
  ];

  if (secure) {
    parts.push("Secure");
  }

  return parts.join("; ");
}

export function clearSessionCookie(secure: boolean): string {
  const parts = [
    `${AUTH_SESSION_COOKIE}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
  ];

  if (secure) {
    parts.push("Secure");
  }

  return parts.join("; ");
}

type AuthSessionPayload = {
  token: string;
  expiresAt?: string;
  user?: {
    id: string;
    email: string;
    emailVerified?: boolean;
  };
};

export function extractAuthToken(data: unknown): string | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const session = data as AuthSessionPayload;
  return typeof session.token === "string" ? session.token : null;
}
