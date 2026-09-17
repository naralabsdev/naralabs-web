"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import type { SchemaProject, SchemaProjectList } from "@/modules/registry/types";
import { Button } from "@/shared/ui/button";
import { DetailSectionCard } from "@/shared/ui/detail-section-card";
import { Input } from "@/shared/ui/input";
import { Modal } from "@/shared/ui/modal";
import { StatusBadge } from "@/shared/ui/status-badge";

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function statusVariant(status: SchemaProject["status"]) {
  if (status === "published") return "success" as const;
  if (status === "draft") return "pending" as const;
  return "neutral" as const;
}

export function SchemaListPage({ initialProjects }: { initialProjects: SchemaProjectList }) {
  const router = useRouter();
  const [projects] = useState(initialProjects.items);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);

  async function handleCreate() {
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      toast.error("Schema name must be at least 2 characters");
      return;
    }

    setCreating(true);
    try {
      const res = await fetch("/api/registry/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Unable to create schema");
      }

      setShowCreate(false);
      setName("");
      router.push(`/dashboard/schemas/${data.id}`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to create schema");
    } finally {
      setCreating(false);
    }
  }

  return (
    <>
      <DetailSectionCard
        title="Schemas"
        description="Create and publish Soroban event schemas with the CLI."
        flushContent
        action={
          <Button
            type="button"
            text="+ Add"
            className="h-9 rounded-lg px-4"
            onClick={() => setShowCreate(true)}
          />
        }
      >
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-12 text-center sm:px-8 sm:py-14">
            <p className="text-sm font-medium text-neutral-900">No schemas yet</p>
            <p className="mt-2 max-w-sm text-sm text-neutral-500">
              Add a schema to get CLI setup instructions.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-neutral-100 bg-neutral-50/80 text-xs text-neutral-500">
                <tr>
                  <th className="px-5 py-3 font-medium sm:px-6">Name</th>
                  <th className="px-5 py-3 font-medium sm:px-6">Status</th>
                  <th className="px-5 py-3 font-medium sm:px-6">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {projects.map((project) => (
                  <tr key={project.id} className="text-neutral-700">
                    <td className="px-5 py-3.5 sm:px-6">
                      <Link
                        href={`/dashboard/schemas/${project.id}`}
                        className="font-medium text-neutral-900 hover:text-primary"
                      >
                        {project.name}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 sm:px-6">
                      <StatusBadge variant={statusVariant(project.status)} size="sm">
                        {project.status}
                      </StatusBadge>
                    </td>
                    <td className="px-5 py-3.5 text-neutral-500 sm:px-6">
                      {formatDate(project.updatedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DetailSectionCard>

      <Modal
        showModal={showCreate}
        setShowModal={setShowCreate}
        onClose={() => {
          setShowCreate(false);
          setName("");
        }}
        desktopOnly
        className="max-w-md"
      >
        <div className="p-6">
          <h3 className="text-base font-semibold text-neutral-900">New schema</h3>
          <p className="mt-1 text-sm text-neutral-500">Enter a name for your schema project.</p>

          <div className="mt-4">
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="My contract schema"
              className="h-10"
              autoFocus
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  void handleCreate();
                }
              }}
            />
          </div>

          <div className="mt-5 flex gap-2">
            <Button
              type="button"
              variant="secondary"
              text="Cancel"
              className="h-9 flex-1 rounded-lg"
              onClick={() => {
                setShowCreate(false);
                setName("");
              }}
            />
            <Button
              type="button"
              text="Create"
              className="h-9 flex-1 rounded-lg"
              loading={creating}
              onClick={() => void handleCreate()}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
