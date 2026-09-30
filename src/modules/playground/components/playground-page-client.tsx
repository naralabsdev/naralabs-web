"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { PlaygroundCodePane } from "@/modules/playground/components/playground-code-pane";
import { PlaygroundContractIdField } from "@/modules/playground/components/playground-contract-id-field";
import type { DecodeResult, PlaygroundCustomPrefill } from "@/modules/playground/types";
import { fetchSchemaContractsList } from "@/modules/registry/services/fetch-schema-contracts-list";
import { cn } from "@/shared/lib/cn";
import { Tooltip } from "@/shared/ui/tooltip";

const DEFAULT_JSON_PAYLOAD = `{
  "topicsJson": [
    { "symbol": "cntr" },
    { "symbol": "incr" }
  ],
  "valueJson": { "u32": 42 }
}`;

const DEFAULT_XDR_PAYLOAD = `{
  "topics_xdr": [
    "AAAADAAAAAE=",
    "AAAADAAAAAI="
  ],
  "value_xdr": "AAAAAwAAAAE="
}`;

type PayloadMode = "json" | "xdr";

export function PlaygroundPageClient({
  customPrefill,
}: {
  customPrefill?: PlaygroundCustomPrefill | null;
}) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DecodeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [contractId, setContractId] = useState("");
  const contractSearchSeed = customPrefill?.contractId ?? "";
  const [payloadMode, setPayloadMode] = useState<PayloadMode>(
    customPrefill?.payloadMode ?? "json",
  );
  const [payloadText, setPayloadText] = useState(
    customPrefill?.payloadJson ??
      (customPrefill?.payloadMode === "xdr" ? DEFAULT_XDR_PAYLOAD : DEFAULT_JSON_PAYLOAD),
  );

  const outputText = useMemo(
    () => (result ? JSON.stringify(result, null, 2) : ""),
    [result],
  );

  const contractIdTrimmed = contractId.trim();
  const canDecode = Boolean(contractIdTrimmed);

  useEffect(() => {
    const hint = customPrefill?.contractId?.trim();
    if (!hint) {
      return;
    }

    let cancelled = false;
    void fetchSchemaContractsList({
      network: "testnet",
      search: hint,
      pageSize: 20,
    }).then(({ items }) => {
      if (cancelled) {
        return;
      }
      const match = items.find((item) => item.contractId === hint);
      if (match) {
        setContractId(match.contractId);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [customPrefill?.contractId]);

  const decode = useCallback(async () => {
    setError(null);
    if (!contractIdTrimmed) {
      return;
    }
    setLoading(true);

    try {
      try {
        JSON.parse(payloadText);
      } catch {
        toast.error("Payload JSON is invalid");
        return;
      }

      const res = await fetch("/api/playground/decode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractId: contractIdTrimmed,
          payloadMode,
          payloadText,
        }),
      });
      const data = (await res.json()) as DecodeResult & { error?: string; message?: string };
      if (!res.ok) {
        throw new Error(data.message ?? data.error ?? "Decode failed");
      }
      setResult(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Decode failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [contractIdTrimmed, payloadMode, payloadText]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        if (!canDecode || loading) {
          return;
        }
        event.preventDefault();
        void decode();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [canDecode, decode, loading]);

  const onPayloadModeChange = (mode: PayloadMode) => {
    setPayloadMode(mode);
    if (mode === "xdr" && payloadText === DEFAULT_JSON_PAYLOAD) {
      setPayloadText(DEFAULT_XDR_PAYLOAD);
    } else if (mode === "json" && payloadText === DEFAULT_XDR_PAYLOAD) {
      setPayloadText(DEFAULT_JSON_PAYLOAD);
    }
  };

  return (
    <div className="playground-theme flex h-dvh flex-col overflow-hidden">
      <header className="flex h-11 shrink-0 items-center gap-3 border-b border-[#333] bg-[#252526] px-4">
        <Link
          href="/events"
          className="shrink-0 text-sm font-semibold tracking-tight text-[#cccccc] hover:text-white"
        >
          Naralabs
        </Link>
        <span className="text-[#858585]">/</span>
        <span className="text-sm text-[#cccccc]">Decode Playground</span>
        <span className="rounded bg-[#3c3c3c] px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-[var(--brand-lilac)]">
          testnet
        </span>

        <div className="ml-auto flex items-center gap-3">
          <span className="hidden text-[11px] text-[#858585] sm:inline">⌘ / Ctrl + Enter</span>
          <Tooltip
            content="Pilih contract ID dari daftar terlebih dahulu."
            disabled={canDecode || loading}
          >
            <span className="inline-flex">
              <button
                type="button"
                disabled={!canDecode || loading}
                onClick={() => void decode()}
                className="inline-flex h-8 items-center rounded-md bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? "Decoding…" : "Decode"}
              </button>
            </span>
          </Tooltip>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <section className="flex min-h-[45dvh] flex-1 flex-col border-b border-[#333] lg:min-h-0 lg:min-w-0 lg:flex-1 lg:border-b-0 lg:border-r">
          <div className="shrink-0 border-b border-[#333] bg-[#252526] px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#cccccc]">
                  Contract ID
                </p>
                <p className="mt-0.5 text-[11px] leading-snug text-[#858585]">
                  Pick a contract with a published schema from the registry list.
                </p>
              </div>
              {contractIdTrimmed ? (
                <span className="shrink-0 rounded bg-[#2d4a2d] px-1.5 py-0.5 font-mono text-[10px] text-[#89d185]">
                  Selected
                </span>
              ) : null}
            </div>
            <PlaygroundContractIdField
              value={contractId}
              onChange={setContractId}
              searchSeed={contractSearchSeed}
            />
          </div>

          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex shrink-0 items-end border-b border-[#333] bg-[#2d2d2d]">
              <div
                className="flex border-r border-[#333] bg-[#1e1e1e] px-3 py-2 text-xs text-[#cccccc]"
                role="presentation"
              >
                <span className="font-medium">payload</span>
                <span className="ml-1.5 text-[#858585]">
                  .{payloadMode === "json" ? "json" : "xdr"}
                </span>
              </div>
              <div className="ml-auto flex gap-0.5 p-1">
                {(["json", "xdr"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => onPayloadModeChange(mode)}
                    className={cn(
                      "rounded px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide",
                      payloadMode === mode
                        ? "bg-primary text-primary-foreground"
                        : "text-[#858585] hover:bg-[#333] hover:text-[#cccccc]",
                    )}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <PlaygroundCodePane value={payloadText} onChange={setPayloadText} />
          </div>
        </section>

        <section className="flex min-h-[45dvh] flex-1 flex-col lg:min-h-0 lg:min-w-0 lg:flex-1">
          <div className="flex h-[41px] shrink-0 items-center gap-2 border-b border-[#333] bg-[#2d2d2d] px-4">
            <span className="text-xs font-medium text-[#cccccc]">response.json</span>
            {result ? (
              <span
                className={cn(
                  "rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                  result.decodeStatus === "decoded"
                    ? "bg-emerald-900/60 text-emerald-300"
                    : "bg-amber-900/50 text-amber-200",
                )}
              >
                {result.decodeStatus === "decoded" ? "Decoded" : "Raw"}
              </span>
            ) : null}
            {result?.summary ? (
              <span className="min-w-0 truncate text-[11px] text-[#858585]">{result.summary}</span>
            ) : null}
          </div>

          <div className="flex min-h-0 flex-1 flex-col">
            <PlaygroundCodePane
              value={outputText}
              readOnly
              placeholder="// Decode output appears here"
            />
          </div>

          {error ? (
            <p className="shrink-0 border-t border-[#5a1d1d] bg-[#3a1f1f] px-4 py-2.5 text-xs text-[#f48771]">
              {error}
            </p>
          ) : null}
        </section>
      </div>
    </div>
  );
}
