import { ContractDetailPage } from "@/modules/contracts/components/contract-detail-page";
import { mapUnindexedContractDetail } from "@/modules/contracts/domain/map-contract-detail";
import { getContractDetail } from "@/modules/contracts/services/fetch-contract";
import { fetchContractSchemas } from "@/modules/registry/services/fetch-contract-schemas";
import { fetchSchemaContractDetail } from "@/modules/registry/services/fetch-schema-contract-detail";
import { ApiError } from "@/shared/infra/errors";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Contract ${id.slice(0, 8)}… · Naralabs Explorer`,
    description: "Soroban contract activity, schema registry status, and published event schemas",
  };
}

export default async function ContractPage({ params }: PageProps) {
  const { id } = await params;

  let profile;
  try {
    profile = await fetchSchemaContractDetail(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 400) {
      notFound();
    }
    throw error;
  }

  let contract = mapUnindexedContractDetail(id, profile.network);
  try {
    contract = await getContractDetail(id);
  } catch (error) {
    if (!(error instanceof ApiError && error.status === 404)) {
      throw error;
    }
  }

  const publishedSchemas = await fetchContractSchemas(id);

  return (
    <ContractDetailPage contract={contract} publishedSchemas={publishedSchemas} />
  );
}
