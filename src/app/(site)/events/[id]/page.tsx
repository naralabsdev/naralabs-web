import { EventDetailPage } from "@/modules/events/components/event-detail-page";
import { getEventDetail } from "@/modules/events/services/fetch-event";
import { ApiError } from "@/shared/infra/errors";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Event ${id} · Naralabs Explorer`,
    description: "Soroban contract event details",
  };
}

export default async function EventPage({ params }: PageProps) {
  const { id } = await params;

  try {
    const event = await getEventDetail(id);
    return <EventDetailPage event={event} />;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}
