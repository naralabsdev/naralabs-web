"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { useAuthSession } from "@/modules/auth/hooks/use-auth-session";
import {
  PLAYGROUND_SAMPLE_LIST,
  getSampleFormPrefill,
} from "@/modules/playground/constants/samples";
import type { DecodeResult, PlaygroundCustomPrefill } from "@/modules/playground/types";
import { ExplorerPageShell } from "@/modules/explore/components/explorer-page-shell";
import { ExplorerListSection } from "@/modules/explore/components/explorer-list-section";
import { ExplorerPageHeader } from "@/modules/explore/components/explorer-page-header";
import { explorerHeroZoneClass } from "@/modules/explore/components/explorer-aurora-backdrop";
import { cn } from "@/shared/lib/cn";
import { fieldInputClass } from "@/shared/ui/field-styles";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

const API_KEY_STORAGE_KEY = "naralabs_playground_api_key";

const DEFAULT_PAYLOAD =
  '{\n  "topicsJson": [\n    { "symbol": "cntr" },\n    { "symbol": "incr" }\n  ],\n  "valueJson": { "u32": 42 }\n}';

const labelClass = "mb-1 block text-sm text-neutral-600";

export function PlaygroundPageClient({
  customPrefill,
}: {
  initialTab?: "samples" | "custom";
  customPrefill?: PlaygroundCustomPrefill | null;
}) {
  const { user, isLoading: authLoading } = useAuthSession();

  const [exampleId, setExampleId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DecodeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [network, setNetwork] = useState(customPrefill?.network ?? "testnet");
  const [contractId, setContractId] = useState(customPrefill?.contractId ?? "");
  const [payloadJson, setPayloadJson] = useState(customPrefill?.payloadJson ?? DEFAULT_PAYLOAD);
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const stored = window.sessionStorage.getItem(API_KEY_STORAGE_KEY);
    if (stored) {
      setApiKey(stored);
    }
  }, []);

  const persistApiKey = useCallback((value: string) => {
    setApiKey(value);
    if (typeof window !== "undefined") {
      if (value.trim()) {
        window.sessionStorage.setItem(API_KEY_STORAGE_KEY, value.trim());
      } else {
        window.sessionStorage.removeItem(API_KEY_STORAGE_KEY);
      }
    }
  }, []);

  const onExampleChange = (id: string) => {
    setExampleId(id);
    if (!id) {
      return;
    }
    const prefill = getSampleFormPrefill(id);
    if (prefill) {
      setNetwork(prefill.network);
      setContractId(prefill.contractId);
      setPayloadJson(prefill.payloadJson);
    }
  };

  const decode = useCallback(async () => {
    setError(null);
    setLoading(true);

    const canUseCustom = Boolean(user && apiKey.trim());
    const useSample = exampleId && !canUseCustom;

    try {
      if (useSample) {
        const res = await fetch("/api/playground/decode", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sampleId: exampleId }),
        });
        const data = (await res.json()) as DecodeResult & { error?: string };
        if (!res.ok) {
          throw new Error(data.error ?? "Decode failed");
        }
        setResult(data);
        return;
      }

      if (!user) {
        setError("Sign in to decode your own payload, or pick an example above.");
        return;
      }

      if (!apiKey.trim()) {
        setError("Add your Atlas API key, or pick an example to run without a key.");
        return;
      }

      let payloadPart: Record<string, unknown>;
      try {
        payloadPart = JSON.parse(payloadJson) as Record<string, unknown>;
      } catch {
        toast.error("Payload JSON is invalid");
        return;
      }

      const res = await fetch("/api/playground/decode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          network: network.trim(),
          contractId: contractId.trim(),
          apiKey: apiKey.trim(),
          ...payloadPart,
        }),
      });
      const data = (await res.json()) as DecodeResult & { error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "Decode failed");
      }
      setResult(data);
      persistApiKey(apiKey.trim());
    } catch (err) {
      const message = err instanceof Error ? err.message : "Decode failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [apiKey, contractId, exampleId, network, payloadJson, persistApiKey, user]);

  return (
    <ExplorerPageShell auroraTheme="contracts">
      <section className="pb-16">
        <div className={cn(explorerHeroZoneClass, "flex items-center")}>
          <ExplorerPageHeader
            title="Decode Playground"
            description="Paste a Soroban event payload and decode it with Atlas."
          />
        </div>

        <ExplorerListSection className="pt-10 sm:pt-12">
          <div className="mx-auto max-w-xl space-y-8">
            <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
              <div>
                <label htmlFor="playground-example" className={labelClass}>
                  Example
                </label>
                <select
                  id="playground-example"
                  value={exampleId}
                  onChange={(event) => onExampleChange(event.target.value)}
                  className={cn(fieldInputClass, "max-w-none font-normal")}
                >
                  <option value="">None — use your own payload</option>
                  {PLAYGROUND_SAMPLE_LIST.map((sample) => (
                    <option key={sample.id} value={sample.id}>
                      {sample.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="playground-network" className={labelClass}>
                  Network
                </label>
                <Input
                  id="playground-network"
                  value={network}
                  onChange={(event) => setNetwork(event.target.value)}
                  className="max-w-none font-mono text-sm"
                />
              </div>

              <div>
                <label htmlFor="playground-contract" className={labelClass}>
                  Contract ID
                </label>
                <Input
                  id="playground-contract"
                  value={contractId}
                  onChange={(event) => setContractId(event.target.value)}
                  placeholder="C…"
                  className="max-w-none font-mono text-sm"
                />
              </div>

              <div>
                <label htmlFor="playground-payload" className={labelClass}>
                  Payload JSON
                </label>
                <textarea
                  id="playground-payload"
                  value={payloadJson}
                  onChange={(event) => setPayloadJson(event.target.value)}
                  rows={10}
                  spellCheck={false}
                  className={cn(
                    fieldInputClass,
                    "max-w-none min-h-[160px] resize-y font-mono text-xs leading-relaxed",
                  )}
                />
              </div>

              {!authLoading && user ? (
                <div>
                  <label htmlFor="playground-api-key" className={labelClass}>
                    API key
                  </label>
                  <Input
                    id="playground-api-key"
                    type="password"
                    autoComplete="off"
                    value={apiKey}
                    onChange={(event) => persistApiKey(event.target.value)}
                    placeholder="nl_api_…"
                    className="max-w-none font-mono text-sm"
                  />
                </div>
              ) : !authLoading ? (
                <p className="text-sm text-neutral-600">
                  <Link href={`/login?next=${encodeURIComponent("/playground")}`} className="underline">
                    Sign in
                  </Link>{" "}
                  with an API key to decode your payload. Examples work without an account.
                </p>
              ) : null}

              <Button type="button" disabled={loading} className="w-full sm:w-auto" onClick={() => void decode()}>
                {loading ? "Decoding…" : "Decode"}
              </Button>

              {error ? <p className="text-sm text-red-600">{error}</p> : null}
            </div>

            {result ? (
              <div className="space-y-2">
                <p className="text-sm text-neutral-700">
                  <span className="font-medium text-neutral-900">
                    {result.decodeStatus === "decoded" ? "Decoded" : "Raw"}
                  </span>
                  {result.summary ? ` — ${result.summary}` : null}
                </p>
                <pre className="overflow-x-auto rounded-2xl border border-neutral-200 bg-neutral-50 p-4 font-mono text-xs leading-relaxed text-neutral-800">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            ) : null}
          </div>
        </ExplorerListSection>
      </section>
    </ExplorerPageShell>
  );
}
