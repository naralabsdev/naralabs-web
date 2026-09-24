import { PlaygroundPageClient } from "@/modules/playground/components/playground-page-client";
import { mapEventPayloadToPlaygroundPrefill } from "@/modules/playground/lib/map-event-prefill";
import type { PlaygroundCustomPrefill } from "@/modules/playground/types";
import type { EventDetailPayload } from "@/modules/events/domain/atlas-types";
import { getDefaultNetwork } from "@/shared/config/env";
import { fetchApi } from "@/shared/infra/fetch-api";
import { ApiError } from "@/shared/infra/errors";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Decode Playground · Naralabs",
  description: "Try Atlas event decoding on sample or custom Soroban payloads",
};

type PageProps = {
  searchParams: Promise<{ fromEvent?: string; tab?: string }>;
};

export default async function PlaygroundPage({ searchParams }: PageProps) {
  const params = await searchParams;
  let customPrefill: PlaygroundCustomPrefill | null = null;
  const initialTab = params.tab === "custom" ? "custom" : undefined;

  if (params.fromEvent?.trim()) {
    try {
      const network = getDefaultNetwork();
      const query = new URLSearchParams({ network });
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

  return (
    <PlaygroundPageClient
      initialTab={initialTab ?? (customPrefill ? "custom" : undefined)}
      customPrefill={customPrefill}
    />
  );
}
