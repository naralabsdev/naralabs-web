"use client";

import useSWR from "swr";

import { SchemaVerifyButton } from "@/modules/registry/components/schema-verify-button";
import type { ProjectPublications } from "@/modules/registry/types";
import { truncateMiddle } from "@/shared/ui/explorer-table/borderless-table";
import { DetailSectionCard } from "@/shared/ui/detail-section-card";
import { StatusBadge } from "@/shared/ui/status-badge";

type SchemaPublicationsProps = {
  projectId: string;
};

function tierVariant(tier: string): "neutral" | "success" {
  return tier === "verified" ? "success" : "neutral";
}

async function fetchPublications(projectId: string): Promise<ProjectPublications> {
  const res = await fetch(`/api/registry/projects/${projectId}/publications`, { cache: "no-store" });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? "Unable to load publications");
  }
  return data as ProjectPublications;
}

export function SchemaPublications({ projectId }: SchemaPublicationsProps) {
  const { data, error, isLoading, mutate } = useSWR(
    ["schema-publications", projectId],
    () => fetchPublications(projectId),
  );

  if (isLoading) {
    return (
      <DetailSectionCard title="Published schemas" description="Community and verified event schemas.">
        <p className="text-sm text-neutral-500">Loading publications…</p>
      </DetailSectionCard>
    );
  }

  if (error) {
    return (
      <DetailSectionCard title="Published schemas" description="Community and verified event schemas.">
        <p className="text-sm text-neutral-500">
          {error instanceof Error ? error.message : "Unable to load publications"}
        </p>
      </DetailSectionCard>
    );
  }

  if (!data?.contracts?.length) {
    return (
      <DetailSectionCard title="Published schemas" description="Community and verified event schemas.">
        <p className="text-sm text-neutral-500">
          No published events yet. Use the CLI to publish your first schema.
        </p>
      </DetailSectionCard>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {data.contracts.map((contract) => (
        <DetailSectionCard
          key={contract.contractId}
          title="Published schemas"
          description={truncateMiddle(contract.contractId, 8, 6)}
          action={
            contract.canVerify ? (
              <SchemaVerifyButton
                projectId={projectId}
                contract={contract}
                onVerified={() => void mutate()}
              />
            ) : null
          }
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-100 text-xs uppercase tracking-wide text-neutral-500">
                  <th className="py-2 pr-4 font-medium">Event</th>
                  <th className="py-2 pr-4 font-medium">Version</th>
                  <th className="py-2 pr-4 font-medium">Tier</th>
                  <th className="py-2 font-medium">Updated</th>
                </tr>
              </thead>
              <tbody>
                {contract.events.map((event) => {
                  const latestCommunity = event.latestCommunity;
                  const verified = event.verified;
                  const tier = verified ? "verified" : latestCommunity?.trustTier ?? "community";
                  const version = verified?.version ?? latestCommunity?.version ?? event.versions[0]?.version ?? 0;
                  const updatedAt =
                    verified?.verifiedAt ?? latestCommunity?.createdAt ?? event.versions[0]?.createdAt;

                  return (
                    <tr key={event.eventName} className="border-b border-neutral-50 last:border-0">
                      <td className="py-3 pr-4 font-medium text-neutral-900">{event.eventName}</td>
                      <td className="py-3 pr-4 text-neutral-700">v{version}</td>
                      <td className="py-3 pr-4">
                        <StatusBadge variant={tierVariant(tier)} size="sm">
                          {tier === "verified" ? "Verified" : "Community"}
                        </StatusBadge>
                      </td>
                      <td className="py-3 text-neutral-500">
                        {updatedAt ? new Date(updatedAt).toLocaleDateString() : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {contract.events.some((event) => event.verified?.verifiedWallet) ? (
            <p className="mt-3 text-xs text-neutral-500">
              Verified by{" "}
              {truncateMiddle(
                contract.events.find((event) => event.verified?.verifiedWallet)?.verified?.verifiedWallet ??
                  "",
                8,
                6,
              )}
            </p>
          ) : null}
        </DetailSectionCard>
      ))}
    </div>
  );
}
