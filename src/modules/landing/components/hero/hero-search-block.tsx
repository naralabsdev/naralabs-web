"use client";

import { EXPLORER_HERO } from "@/modules/landing/constants/homepage-content";
import { InputSearch } from "@/shared/ui/icons/nucleo";
import { useEffect, useRef, useState } from "react";

export function HeroSearchBlock() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

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
      }
    }

    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  return (
    <form
      className="w-full"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <label className="sr-only" htmlFor="explorer-query">
        {EXPLORER_HERO.searchPlaceholder}
      </label>
      <div className="hero-search-field flex h-11 items-center gap-2.5 rounded-lg bg-white px-4">
        <input
          ref={inputRef}
          id="explorer-query"
          type="text"
          inputMode="search"
          enterKeyHint="search"
          autoComplete="off"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
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
    </form>
  );
}
