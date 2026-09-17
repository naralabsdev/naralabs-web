import { SchemaEventDetailPage } from "@/modules/registry/components/schema-event-detail-page";
import { fetchSchemaById } from "@/modules/registry/services/fetch-schema-by-id";
import { fetchSchemaEventVersions } from "@/modules/registry/services/fetch-schema-event-versions";
import { isSorobanContractId } from "@/shared/lib/soroban-contract-id";
import { ApiError } from "@/shared/infra/errors";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ schemaId: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { schemaId } = await params;
  return {
    title: `Schema · ${schemaId.slice(0, 8)}… · Naralabs`,
    description: "Published SEP-0048 event schema with mapping, version history, and trust status",
  };
}

export default async function SchemaDetailPage({ params }: PageProps) {
  const { schemaId } = await params;

  if (isSorobanContractId(schemaId)) {
    redirect(`/contracts/${schemaId}`);
  }

  try {
    const schema = await fetchSchemaById(schemaId);
    const versions = await fetchSchemaEventVersions(
      schema.contractId,
      schema.eventName,
      schema.id,
      schema.network,
    );

    return <SchemaEventDetailPage schema={schema} versions={versions} />;
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 400)) {
      notFound();
    }
    throw error;
  }
}
