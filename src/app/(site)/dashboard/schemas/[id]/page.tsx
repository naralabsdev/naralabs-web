import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { SchemaDetailPage } from "@/app/(site)/dashboard/schemas/[id]/schema-detail";
import type { SchemaProjectDetail } from "@/modules/registry/types";
import {
  AUTH_SESSION_COOKIE,
  proxyAtlasGet,
} from "@/shared/infra/proxy-atlas-auth";

type PageParams = {
  params: Promise<{ id: string }>;
};

export default async function SchemaDetailRoute({ params }: PageParams) {
  const cookieStore = await cookies();
  const session = cookieStore.get(AUTH_SESSION_COOKIE)?.value;

  if (!session) {
    notFound();
  }

  const { id } = await params;
  const result = await proxyAtlasGet<SchemaProjectDetail>(`/v1/schema-projects/${id}`, session);

  if (!result.ok) {
    notFound();
  }

  return <SchemaDetailPage project={result.data} />;
}
