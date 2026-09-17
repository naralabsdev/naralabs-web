"use client";

import { useMemo, useRef } from "react";

type RowWithId = { id: string };

/**
 * Returns IDs that were added since the previous render.
 * Full list refreshes (e.g. WS snapshot) reset without marking every row as new.
 */
export function useAppendedRowIds(rows: RowWithId[]): Set<string> {
  const seenRef = useRef(new Set<string>());
  const initializedRef = useRef(false);

  return useMemo(() => {
    const currentIds = rows.map((row) => row.id);
    const appended = new Set<string>();

    if (!initializedRef.current) {
      initializedRef.current = true;
      seenRef.current = new Set(currentIds);
      return appended;
    }

    for (const id of currentIds) {
      if (!seenRef.current.has(id)) {
        appended.add(id);
      }
    }

    if (appended.size > 0 && appended.size >= Math.ceil(currentIds.length * 0.5)) {
      seenRef.current = new Set(currentIds);
      return new Set<string>();
    }

    seenRef.current = new Set(currentIds);
    return appended;
  }, [rows]);
}
