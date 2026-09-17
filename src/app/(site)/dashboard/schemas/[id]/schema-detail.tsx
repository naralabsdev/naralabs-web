"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import type { SchemaProjectDetail } from "@/modules/registry/types";
import { SchemaGettingStarted } from "@/modules/registry/components/schema-getting-started";
import { SchemaPublications } from "@/modules/registry/components/schema-publications";
import { SchemaWalletProvider } from "@/modules/registry/components/schema-wallet-provider";
import {
  dashboardBreadcrumbLinkClass,
  dashboardBreadcrumbNavClass,
} from "@/app/(site)/dashboard/constants";
import { Button } from "@/shared/ui/button";
import { DetailSectionCard } from "@/shared/ui/detail-section-card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { StatusBadge } from "@/shared/ui/status-badge";
import { cn } from "@/shared/lib/cn";

export function SchemaDetailPage({ project: initialProject }: { project: SchemaProjectDetail }) {
  const [project, setProject] = useState(initialProject);
  const [name, setName] = useState(initialProject.name);
  const [description, setDescription] = useState(initialProject.description ?? "");
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setProject(initialProject);
    setName(initialProject.name);
    setDescription(initialProject.description ?? "");
    setDirty(false);
  }, [initialProject]);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/registry/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), description: description.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Unable to save changes");
      }

      setProject(data as SchemaProjectDetail);
      setDirty(false);
      toast.success("Saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save changes");
    } finally {
      setSaving(false);
    }
  }

  return (
    <SchemaWalletProvider>
      <div className="flex flex-col gap-3">
        <Link
          href="/dashboard/schemas"
          className={cn(
            dashboardBreadcrumbNavClass,
            dashboardBreadcrumbLinkClass,
            "inline-flex w-fit font-medium",
          )}
        >
          ← Back to schemas
        </Link>

        <div className="grid gap-3 lg:grid-cols-2 lg:items-start [&>section]:mt-0">
          <div className="flex flex-col gap-3">
            <DetailSectionCard
              title="Schema"
              description="Project details and status."
              action={
                <StatusBadge variant={project.status === "draft" ? "pending" : "success"} size="sm">
                  {project.status}
                </StatusBadge>
              }
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="schema-name">Schema name</Label>
                  <Input
                    id="schema-name"
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                      setDirty(true);
                    }}
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schema-description">
                    Description <span className="text-neutral-400">(optional)</span>
                  </Label>
                  <textarea
                    id="schema-description"
                    value={description}
                    onChange={(event) => {
                      setDescription(event.target.value);
                      setDirty(true);
                    }}
                    rows={3}
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-400"
                    placeholder="What does this schema cover?"
                  />
                </div>
              </div>

              <div className="mt-4 border-t border-neutral-100 pt-4">
                <Button
                  type="button"
                  text="Save"
                  className="h-9 rounded-lg px-4"
                  loading={saving}
                  disabled={!dirty}
                  onClick={() => void handleSave()}
                />
              </div>
            </DetailSectionCard>

            <SchemaPublications projectId={project.id} />
          </div>

          <DetailSectionCard title="Getting started" description="Publish with the NaraLabs CLI.">
            <SchemaGettingStarted project={project} />
          </DetailSectionCard>
        </div>
      </div>
    </SchemaWalletProvider>
  );
}
