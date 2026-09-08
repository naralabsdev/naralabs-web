import { EventsListPage } from "@/modules/events/components/events-list-page";
import { fetchEventsList } from "@/modules/events/services/fetch-events-list";
import { fetchNetworkStats } from "@/modules/explore/services/fetch-network-stats";
import { getDefaultNetwork } from "@/shared/config/env";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events · Naralabs Explorer",
  description: "Browse indexed Soroban contract events on Stellar",
};

export default async function EventsPage() {
  const network = getDefaultNetwork();
  const [stats, events] = await Promise.all([
    fetchNetworkStats(network),
    fetchEventsList({ network, page: 1, pageSize: 20 }),
  ]);

  return <EventsListPage stats={stats} events={events} network={network} />;
}
