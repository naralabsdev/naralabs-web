import { isSorobanContractId } from "@/shared/lib/soroban-contract-id";
import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ schemaId: string; version: string }>;
};

export default async function LegacySchemaBundleRedirect({ params }: PageProps) {
  const { schemaId: contractId } = await params;

  if (isSorobanContractId(contractId)) {
    redirect(`/contracts/${contractId}`);
  }

  redirect("/schemas");
}
