import { ContractDetailPage } from "@/modules/contracts/components/contract-detail-page";
import { getContractDetail } from "@/modules/contracts/services/fetch-contract";
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
    description: "Soroban contract activity and event breakdown",
  };
}

export default async function ContractPage({ params }: PageProps) {
  const { id } = await params;

  try {
    const contract = await getContractDetail(id);
    return <ContractDetailPage contract={contract} />;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}
