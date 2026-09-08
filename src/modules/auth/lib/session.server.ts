import "server-only";

import { cookies } from "next/headers";

import type { AuthUser } from "@/modules/auth/lib/auth-user";
import {
  AUTH_SESSION_COOKIE,
  proxyAtlasGet,
} from "@/shared/infra/proxy-atlas-auth";

export async function getAuthSession(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const result = await proxyAtlasGet<AuthUser>("/v1/auth/me", token);

  if (!result.ok || !result.data?.email) {
    return null;
  }

  return result.data;
}

export function getAuthTokenFromCookieHeader(
  cookieHeader: string | null | undefined,
): string | null {
  if (!cookieHeader) {
    return null;
  }

  const prefix = `${AUTH_SESSION_COOKIE}=`;
  const match = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));

  if (!match) {
    return null;
  }

  const value = match.slice(prefix.length);
  return value ? decodeURIComponent(value) : null;
}
