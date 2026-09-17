"use client";

import { HeroSearchDropdown, type HeroSearchFilter } from "@/modules/landing/components/hero/hero-search-dropdown";
import { EXPLORER_HERO } from "@/modules/landing/constants/homepage-content";
import type {
  ActiveContractRow,
  RecentEventRow,
} from "@/modules/landing/domain/home-view-model";
import { cn } from "@/shared/lib/cn";
import { isSorobanContractId } from "@/shared/lib/soroban-contract-id";
import { InputSearch } from "@/shared/ui/icons/nucleo";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function resolveSearchHref(query: string) {
  const trimmed = query.trim();
  if (!trimmed) {
    return null;
  }

  if (isSorobanContractId(trimmed)) {
    return `/contracts/${trimmed}`;
  }

  return `/events?search=${encodeURIComponent(trimmed)}`;
}

export function HeroSearchBlock({
  recentEvents,
  activeContracts,
  onOpenChange,
}: {
  recentEvents: RecentEventRow[];
  activeContracts: ActiveContractRow[];
  onOpenChange?: (open: boolean) => void;
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<HeroSearchFilter>("all");

  useEffect(() => {
    function focusSearch(event: KeyboardEvent) {
      const target = event.target as HTMLElement;

      if (
        event.key === "/" &&
        target.tagName !== "INPUT" &&
        target.tagName !== "TEXTAREA" &&
        !target.isContentEditable
      ) {
        event.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    }

    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  useEffect(() => {
    onOpenChange?.(open);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  function closeDropdown() {
    setOpen(false);
  }

  function submitSearch() {
    const href = resolveSearchHref(query);
    if (!href) {
      return;
    }

    closeDropdown();
    router.push(href);
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <form
        className="w-full"
        onSubmit={(event) => {
          event.preventDefault();
          submitSearch();
        }}
      >
        <label className="sr-only" htmlFor="explorer-query">
          {EXPLORER_HERO.searchPlaceholder}
        </label>
        <div
          className={cn(
            "overflow-hidden rounded-lg bg-white transition-[border-radius,box-shadow,border-color] duration-300 ease-out",
            open
              ? "rounded-b-none border border-b-0 border-neutral-200/90 shadow-[0_12px_40px_rgba(15,23,42,0.08)]"
              : "border border-transparent",
          )}
        >
          <div className="hero-search-field flex h-11 items-center gap-2.5 px-4">
            <input
            ref={inputRef}
            id="explorer-query"
            type="text"
            inputMode="search"
            enterKeyHint="search"
            autoComplete="off"
            value={query}
            onFocus={() => setOpen(true)}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
            placeholder={EXPLORER_HERO.searchPlaceholder}
              className="min-w-0 flex-1 bg-white text-sm text-neutral-900 placeholder:text-neutral-400"
            />
            <button
              type="submit"
              className="shrink-0 text-neutral-400 transition-colors hover:text-neutral-600"
              aria-label={EXPLORER_HERO.searchButton}
            >
              <InputSearch className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      </form>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="hero-search-dropdown"
            initial={{ opacity: 0, y: -8, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.985 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 right-0 top-full z-50 origin-top"
          >
            <div className="overflow-hidden rounded-b-lg border border-t-0 border-neutral-200/90 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
              <HeroSearchDropdown
                query={query}
                filter={filter}
                onFilterChange={setFilter}
                recentEvents={recentEvents}
                activeContracts={activeContracts}
                onNavigate={closeDropdown}
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
