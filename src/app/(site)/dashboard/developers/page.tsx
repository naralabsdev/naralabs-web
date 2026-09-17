import { DevelopersDashboard } from "@/modules/developers/components/developers-dashboard";
import type { APIKeyListResponse } from "@/modules/developers/types";
import {
  AUTH_SESSION_COOKIE,
  proxyAtlasGet,
} from "@/shared/infra/proxy-atlas-auth";
import { cookies } from "next/headers";

async function loadAPIKeys() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_SESSION_COOKIE)?.value;
  if (!token) {
    return [] as APIKeyListResponse["items"];
  }

  const result = await proxyAtlasGet<APIKeyListResponse>("/v1/api-keys", token);
  if (!result.ok) {
    return [] as APIKeyListResponse["items"];
  }

  return result.data.items ?? [];
}

export default async function ApiDashboardPage() {
  const initialKeys = await loadAPIKeys();

  return <DevelopersDashboard initialKeys={initialKeys} />;
}
