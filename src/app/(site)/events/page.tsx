import { EventsListPage } from "@/modules/events/components/events-list-page";
import { fetchEventsList } from "@/modules/events/services/fetch-events-list";
import { getDefaultNetwork } from "@/shared/config/env";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events · Naralabs Explorer",
  description: "Browse indexed Soroban contract events on Stellar",
};

export default async function EventsPage() {
  const network = getDefaultNetwork();
  const events = await fetchEventsList({ network, page: 1, pageSize: 20 });

  return <EventsListPage events={events} network={network} />;
}
