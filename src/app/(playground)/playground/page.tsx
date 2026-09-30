import { PlaygroundPageClient } from "@/modules/playground/components/playground-page-client";
import { mapEventPayloadToPlaygroundPrefill } from "@/modules/playground/lib/map-event-prefill";
import type { PlaygroundCustomPrefill } from "@/modules/playground/types";
import type { EventDetailPayload } from "@/modules/events/domain/atlas-types";
import { fetchApi } from "@/shared/infra/fetch-api";
import { ApiError } from "@/shared/infra/errors";

type PageProps = {
  searchParams: Promise<{ fromEvent?: string }>;
};

export default async function PlaygroundPage({ searchParams }: PageProps) {
  const params = await searchParams;
  let customPrefill: PlaygroundCustomPrefill | null = null;

  if (params.fromEvent?.trim()) {
    try {
      const query = new URLSearchParams({ network: "testnet" });
      const payload = await fetchApi<EventDetailPayload>(
        `/v1/events/${encodeURIComponent(params.fromEvent.trim())}?${query.toString()}`,
      );
      customPrefill = mapEventPayloadToPlaygroundPrefill(payload);
    } catch (error) {
      if (!(error instanceof ApiError && error.status === 404)) {
        throw error;
      }
    }
  }

  return <PlaygroundPageClient customPrefill={customPrefill} />;
}
