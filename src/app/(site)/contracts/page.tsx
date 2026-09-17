import { ContractsListPage } from "@/modules/contracts/components/contracts-list-page";
import { fetchContractsList } from "@/modules/contracts/services/fetch-contracts-list";
import { getDefaultNetwork } from "@/shared/config/env";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contracts · Naralabs Explorer",
  description: "Browse Soroban contracts with indexed events on Stellar",
};

export default async function ContractsPage() {
  const network = getDefaultNetwork();
  const contracts = await fetchContractsList({ network, page: 1, pageSize: 20 });

  return <ContractsListPage contracts={contracts} network={network} />;
}
