"use client";

import { DicebearAvatar } from "@/modules/landing/components/activity/dicebear-avatar";
import { fetchSchemaContractsList } from "@/modules/registry/services/fetch-schema-contracts-list";
import type { SchemaContractListRow } from "@/modules/registry/domain/schema-view-model";
import { cn } from "@/shared/lib/cn";
import { truncateMiddle } from "@/shared/ui/explorer-table/borderless-table";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import useSWR from "swr";

const PLAYGROUND_NETWORK = "testnet";
const PAGE_SIZE = 12;

function loadSchemaContracts(search: string) {
  return fetchSchemaContractsList({
    network: PLAYGROUND_NETWORK,
    search: search.trim() || undefined,
    pageSize: PAGE_SIZE,
    page: 1,
  });
}

export function PlaygroundContractIdField({
  value,
  onChange,
  searchSeed,
}: {
  /** Set only when user picks from the registry helper list. */
  value: string;
  onChange: (contractId: string) => void;
  /** Optional initial filter text (e.g. from event prefill). Does not select until user picks. */
  searchSeed?: string;
}) {
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(searchSeed ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchSeed ?? "");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (searchSeed?.trim()) {
      setSearch(searchSeed);
      setDebouncedSearch(searchSeed);
    }
  }, [searchSeed]);

  useEffect(() => {
    if (value) {
      setSearch(value);
    }
  }, [value]);

  useEffect(() => {
    const handle = window.setTimeout(() => setDebouncedSearch(search), 220);
    return () => window.clearTimeout(handle);
  }, [search]);

  const { data, isLoading, error } = useSWR(
    open ? ["playground-schema-contracts", debouncedSearch] : null,
    () => loadSchemaContracts(debouncedSearch),
    { revalidateOnFocus: false, dedupingInterval: 30_000 },
  );

  const items = data?.items ?? [];
  const hasSelection = Boolean(value.trim());

  const close = useCallback(() => {
    setOpen(false);
    setActiveIndex(0);
    if (value) {
      setSearch(value);
    }
  }, [value]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        close();
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
        inputRef.current?.blur();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [close, open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [debouncedSearch, items.length]);

  const selectContract = useCallback(
    (contract: SchemaContractListRow) => {
      onChange(contract.contractId);
      setSearch(contract.contractId);
      setDebouncedSearch(contract.contractId);
      close();
      inputRef.current?.blur();
    },
    [close, onChange],
  );

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && open && items[activeIndex]) {
      event.preventDefault();
      selectContract(items[activeIndex]);
      return;
    }

    if (!open && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      setOpen(true);
      return;
    }

    if (!open || items.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % items.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + items.length) % items.length);
    }
  };

  return (
    <div ref={containerRef} className="relative mt-2.5">
      <div className="relative">
        <input
          ref={inputRef}
          id="playground-contract"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-required
          value={open ? search : value || search}
          onFocus={() => {
            setOpen(true);
            if (value) {
              setSearch(value);
            }
          }}
          onChange={(event) => {
            const next = event.target.value;
            setSearch(next);
            if (hasSelection && next !== value) {
              onChange("");
            }
            setOpen(true);
          }}
          onKeyDown={onInputKeyDown}
          placeholder="Search registry contracts…"
          spellCheck={false}
          autoComplete="off"
          className={cn(
            "w-full rounded-md border bg-[#1e1e1e] px-3 py-2.5 font-mono text-sm leading-snug text-[var(--brand-lilac)] shadow-inner outline-none ring-0 transition-colors placeholder:text-[#5a5a5a] focus:border-primary focus:ring-1 focus:ring-primary",
            open && "rounded-b-none border-primary ring-1 ring-primary",
            hasSelection ? "border-[#2d4a2d]" : "border-[#3c3c3c]",
          )}
        />

        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-0 right-0 top-full z-50 overflow-hidden rounded-b-md border border-t-0 border-primary bg-[#252526] shadow-[0_16px_40px_rgba(0,0,0,0.45)]"
            >
              <p className="border-b border-[#333] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#858585]">
                Published schema contracts · testnet
              </p>

              <div
                id={listboxId}
                role="listbox"
                className="playground-code-pane max-h-[min(18rem,40vh)] overflow-y-auto"
              >
                {isLoading && items.length === 0 ? (
                  <p className="px-3 py-6 text-center text-xs text-[#858585]">Loading registry…</p>
                ) : null}

                {error ? (
                  <p className="px-3 py-6 text-center text-xs text-[#f48771]">
                    Could not load schema contracts.
                  </p>
                ) : null}

                {!isLoading && !error && items.length === 0 ? (
                  <p className="px-3 py-6 text-center text-xs text-[#858585]">
                    No contracts match. Browse{" "}
                    <Link
                      href="/schemas"
                      className="text-[var(--brand-lilac)] underline-offset-2 hover:underline"
                      onClick={close}
                    >
                      Schemas
                    </Link>{" "}
                    or try another search.
                  </p>
                ) : null}

                {items.map((contract, index) => (
                  <button
                    key={contract.contractId}
                    type="button"
                    role="option"
                    aria-selected={value === contract.contractId || index === activeIndex}
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => selectContract(contract)}
                    className={cn(
                      "flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors",
                      index === activeIndex || value === contract.contractId
                        ? "bg-[#2a2d2e]"
                        : "hover:bg-[#2a2d2e]/70",
                    )}
                  >
                    <DicebearAvatar
                      seed={contract.contractId}
                      style="triangles"
                      className="size-8 shrink-0 rounded-md"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-mono text-xs font-medium text-[#cccccc]">
                          {truncateMiddle(contract.contractId, 10, 8)}
                        </p>
                        <span
                          className={cn(
                            "shrink-0 rounded px-1 py-px text-[9px] font-semibold uppercase tracking-wide",
                            contract.isVerified
                              ? "bg-emerald-950/80 text-emerald-400"
                              : "bg-[#3c3c3c] text-[#858585]",
                          )}
                        >
                          {contract.trustLabel}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-[11px] text-[#858585]">
                        {contract.schemaCount} schema{contract.schemaCount === 1 ? "" : "s"} ·{" "}
                        {contract.eventCount.toLocaleString()} indexed events
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between gap-2 border-t border-[#333] px-3 py-2 text-[10px] text-[#666]">
                <span>
                  <kbd className="rounded border border-[#3c3c3c] bg-[#1e1e1e] px-1 font-sans text-[#858585]">
                    ↵
                  </kbd>{" "}
                  select
                </span>
                <span>
                  <kbd className="rounded border border-[#3c3c3c] bg-[#1e1e1e] px-1 font-sans text-[#858585]">
                    esc
                  </kbd>{" "}
                  close
                </span>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {hasSelection ? (
        <p className="mt-1.5 text-[10px] text-[#89d185]">Selected from schema registry</p>
      ) : null}
    </div>
  );
}
