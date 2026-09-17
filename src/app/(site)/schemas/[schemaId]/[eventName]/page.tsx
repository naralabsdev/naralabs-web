import { fetchEventSchema } from "@/modules/registry/services/fetch-event-schema";
import { isSorobanContractId } from "@/shared/lib/soroban-contract-id";
import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ schemaId: string; eventName: string }>;
};

export default async function LegacyEventSchemaRedirect({ params }: PageProps) {
  const { schemaId: contractId, eventName } = await params;

  if (isSorobanContractId(contractId)) {
    redirect(`/contracts/${contractId}`);
  }

  try {
    const event = await fetchEventSchema(contractId, decodeURIComponent(eventName));
    redirect(`/schemas/${event.id}`);
  } catch {
    redirect("/schemas");
  }
}
