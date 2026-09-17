import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { SchemaListPage } from "@/app/(site)/dashboard/schemas/schema-list";
import type { SchemaProjectList } from "@/modules/registry/types";
import {
  AUTH_SESSION_COOKIE,
  proxyAtlasGet,
} from "@/shared/infra/proxy-atlas-auth";

const emptyProjects: SchemaProjectList = { items: [], total: 0 };

export default async function SchemasPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get(AUTH_SESSION_COOKIE)?.value;

  let projects = emptyProjects;

  if (session) {
    const result = await proxyAtlasGet<SchemaProjectList>("/v1/schema-projects", session);
    if (result.ok) {
      projects = result.data;
    }
  }

  return <SchemaListPage initialProjects={projects} />;
}
