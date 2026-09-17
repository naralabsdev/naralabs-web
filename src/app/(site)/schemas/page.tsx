import { SchemasListPage } from "@/modules/registry/components/schemas-list-page";
import { fetchSchemaContractsList } from "@/modules/registry/services/fetch-schema-contracts-list";
import { getDefaultNetwork } from "@/shared/config/env";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Schemas · Naralabs Explorer",
  description: "Browse Soroban contracts with published SEP-0048 event schemas",
};

export default async function SchemasPage() {
  const network = getDefaultNetwork();
  const contracts = await fetchSchemaContractsList({ network, page: 1, pageSize: 20 });

  return <SchemasListPage contracts={contracts} network={network} />;
}
