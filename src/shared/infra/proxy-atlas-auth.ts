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
  message?: string;
  code?: string;
  errors?: Array<{
    message?: string;
    value?: string;
    location?: string;
  }>;
};

function isJsonContentType(contentType: string): boolean {
  return contentType.toLowerCase().includes("json");
}

function defaultAtlasErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return "Invalid request. Please check your input and try again.";
    case 401:
      return "Invalid email or password.";
    case 403:
      return "Please verify your email before signing in.";
    case 404:
      return "Auth API not found. Restart Atlas server with the latest build.";
    case 409:
      return "An account with this email already exists.";
    case 429:
      return "Please wait before trying again.";
    default:
      return "Something went wrong. Please try again.";
  }
}

function parseAtlasErrorPayload(
  payload: unknown,
  status: number,
): { code?: string; message: string } {
  if (!payload || typeof payload !== "object") {
    return { message: defaultAtlasErrorMessage(status) };
  }

  const problem = payload as HumaErrorBody;
  const codeEntry = problem.errors?.find((entry) => entry.location === "code");
  const code =
    (typeof codeEntry?.value === "string" ? codeEntry.value : undefined) ??
    (typeof problem.code === "string" ? problem.code : undefined);

  const message =
    problem.detail?.trim() ||
    codeEntry?.message?.trim() ||
    (typeof problem.message === "string" ? problem.message.trim() : "") ||
    problem.errors?.[0]?.message?.trim() ||
    problem.title?.trim() ||
    defaultAtlasErrorMessage(status);

  return {
    code,
    message,
  };
}

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
  const payload = isJsonContentType(contentType)
    ? ((await response.json()) as T | HumaErrorBody)
    : null;

  if (!response.ok) {
    const { code, message } = parseAtlasErrorPayload(payload, response.status);

    return {
      ok: false,
      status: response.status,
      data: payload as T,
      code,
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
  const payload = isJsonContentType(contentType)
    ? ((await response.json()) as T | HumaErrorBody)
    : null;

  if (!response.ok) {
    const status = response.status === 404 ? 503 : response.status;
    const { code, message } = parseAtlasErrorPayload(payload, response.status);

    return {
      ok: false,
      status,
      data: payload as T,
      code: response.status === 404 ? "AUTH_API_UNAVAILABLE" : code,
      message:
        response.status === 404
          ? "Auth API not found. Restart Atlas server with the latest build."
          : message,
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
