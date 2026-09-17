"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { DASHBOARD_USAGE_LIMITS } from "@/app/(site)/dashboard/constants";
import type { APIKeyCreateResult, APIKeyPublic } from "@/modules/developers/types";
import { Button } from "@/shared/ui/button";
import { DetailSectionCard } from "@/shared/ui/detail-section-card";
import { Input } from "@/shared/ui/input";
import { Modal } from "@/shared/ui/modal";

function formatDate(value?: string) {
  if (!value) {
    return "Never";
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function DevelopersDashboard({ initialKeys }: { initialKeys: APIKeyPublic[] }) {
  const router = useRouter();
  const [keys, setKeys] = useState(initialKeys);
  const [showCreate, setShowCreate] = useState(false);
  const [label, setLabel] = useState("");
  const [creating, setCreating] = useState(false);
  const [createdKey, setCreatedKey] = useState<APIKeyCreateResult | null>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  async function handleCreate() {
    setCreating(true);
    try {
      const res = await fetch("/api/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: label.trim() || "Default" }),
      });
      const data = (await res.json()) as APIKeyCreateResult & { error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "Unable to create API key");
      }

      setCreatedKey(data);
      setShowCreate(false);
      setLabel("");
      setKeys((current) => [
        {
          id: data.id,
          label: data.label,
          prefix: data.prefix,
          createdAt: data.createdAt,
        },
        ...current,
      ]);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to create API key");
    } finally {
      setCreating(false);
    }
  }

  async function handleRevoke(key: APIKeyPublic) {
    if (!window.confirm(`Revoke API key "${key.label}"? This cannot be undone.`)) {
      return;
    }

    setRevokingId(key.id);
    try {
      const res = await fetch(`/api/api-keys/${key.id}`, { method: "DELETE" });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "Unable to revoke API key");
      }

      setKeys((current) => current.filter((item) => item.id !== key.id));
      toast.success("API key revoked");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to revoke API key");
    } finally {
      setRevokingId(null);
    }
  }

  async function copyCreatedKey() {
    if (!createdKey?.key) {
      return;
    }

    await navigator.clipboard.writeText(createdKey.key);
    toast.success("API key copied");
  }

  const atLimit = keys.length >= DASHBOARD_USAGE_LIMITS.apiKeys;

  return (
    <>
      <DetailSectionCard
        title="My API Keys"
        description={`Create and manage keys for programmatic API access. Each account is limited to ${DASHBOARD_USAGE_LIMITS.apiKeys} active keys. For usage guides, see Atlas API in Docs.`}
        flushContent
        action={
          <Button
            type="button"
            text="+ Create key"
            className="h-9 rounded-lg px-4"
            disabled={atLimit}
            onClick={() => setShowCreate(true)}
          />
        }
      >
        {keys.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-12 text-center sm:px-8 sm:py-14">
            <p className="text-sm font-medium text-neutral-900">No API keys found</p>
            <p className="mt-2 max-w-md text-sm text-neutral-500">
              Create a key to connect your app or backend to Naralabs Atlas.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-neutral-100 bg-neutral-50/80 text-xs text-neutral-500">
                <tr>
                  <th className="px-5 py-3 font-medium sm:px-6">Label</th>
                  <th className="px-5 py-3 font-medium sm:px-6">Prefix</th>
                  <th className="px-5 py-3 font-medium sm:px-6">Last used</th>
                  <th className="px-5 py-3 font-medium sm:px-6">Created</th>
                  <th className="px-5 py-3 font-medium sm:px-6" />
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {keys.map((key) => (
                  <tr key={key.id} className="text-neutral-700">
                    <td className="px-5 py-3.5 font-medium text-neutral-900 sm:px-6">{key.label}</td>
                    <td className="px-5 py-3.5 font-mono text-xs sm:px-6">{key.prefix}</td>
                    <td className="px-5 py-3.5 sm:px-6">{formatDate(key.lastUsedAt)}</td>
                    <td className="px-5 py-3.5 sm:px-6">{formatDate(key.createdAt)}</td>
                    <td className="px-5 py-3.5 text-right sm:px-6">
                      <button
                        type="button"
                        className="text-sm font-medium text-red-600 transition-colors hover:text-red-700 disabled:opacity-50"
                        disabled={revokingId === key.id}
                        onClick={() => void handleRevoke(key)}
                      >
                        {revokingId === key.id ? "Revoking..." : "Revoke"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DetailSectionCard>

      <Modal showModal={showCreate} setShowModal={setShowCreate}>
        <div className="space-y-4 p-6">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Create API key</h2>
            <p className="mt-1 text-sm text-neutral-500">
              Give this key a label so you can identify it later.
            </p>
          </div>
          <Input
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            placeholder="Production app"
            aria-label="API key label"
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              text="Cancel"
              className="h-9 w-auto rounded-lg px-4"
              onClick={() => setShowCreate(false)}
            />
            <Button
              type="button"
              text={creating ? "Creating..." : "Create key"}
              loading={creating}
              className="h-9 w-auto rounded-lg px-4"
              onClick={() => void handleCreate()}
            />
          </div>
        </div>
      </Modal>

      <Modal showModal={createdKey != null} setShowModal={(open) => !open && setCreatedKey(null)}>
        {createdKey ? (
          <div className="space-y-4 p-6">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">Save your API key</h2>
              <p className="mt-1 text-sm text-neutral-500">
                This key is shown only once. Copy it now and store it securely.
              </p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
              <code className="block break-all font-mono text-xs text-neutral-800">{createdKey.key}</code>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                text="Copy key"
                className="h-9 w-auto rounded-lg px-4"
                onClick={() => void copyCreatedKey()}
              />
              <Button
                type="button"
                text="Done"
                className="h-9 w-auto rounded-lg px-4"
                onClick={() => setCreatedKey(null)}
              />
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
