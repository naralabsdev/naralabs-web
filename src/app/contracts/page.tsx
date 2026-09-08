import { ContractsListPage } from "@/modules/contracts/components/contracts-list-page";
import { fetchContractsList } from "@/modules/contracts/services/fetch-contracts-list";
import { fetchNetworkStats } from "@/modules/explore/services/fetch-network-stats";
import { getDefaultNetwork } from "@/shared/config/env";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contracts · Naralabs Explorer",
  description: "Browse Soroban contracts with indexed events on Stellar",
};

export default async function ContractsPage() {
  const network = getDefaultNetwork();
  const [stats, contracts] = await Promise.all([
    fetchNetworkStats(network),
    fetchContractsList({ network, page: 1, pageSize: 20 }),
  ]);

  return (
    <ContractsListPage stats={stats} contracts={contracts} network={network} />
  );
}
