"use client";

import { cn } from "@/shared/lib/cn";
import {
  formatLocalTimestamp,
  formatUnixTimestamp,
  formatUtcTimestamp,
  getTimestampFormats,
} from "@/shared/lib/functions/format-timestamp-formats";
import { timeAgo } from "@/shared/lib/functions/time-ago";
import { CopyFeedbackButton } from "@/shared/ui/copy-feedback-button";
import {
  ChevronDown,
  CircleHalfDottedClock,
} from "@/shared/ui/icons/nucleo";
import * as Popover from "@radix-ui/react-popover";
import { useEffect, useMemo, useState } from "react";

type TimestampFormatsPopoverProps = {
  timestamp: string | Date;
  className?: string;
};

type FormatRow = {
  label: string;
  value: string;
  mono?: boolean;
};

export function TimestampFormatsPopover({
  timestamp,
  className,
}: TimestampFormatsPopoverProps) {
  const [open, setOpen] = useState(false);
  const [relativeLabel, setRelativeLabel] = useState<string | null>(null);
  const date = useMemo(() => new Date(timestamp), [timestamp]);
  const formats = useMemo(() => getTimestampFormats(date), [date]);

  useEffect(() => {
    const update = () => setRelativeLabel(timeAgo(date, { withAgo: true }));
    update();
    const timer = window.setInterval(update, 30_000);
    return () => window.clearInterval(timer);
  }, [date]);

  if (!formats || Number.isNaN(date.getTime())) {
    return <span className="text-sm text-neutral-900">—</span>;
  }

  const relativeDisplay = relativeLabel ?? formatUtcTimestamp(date);

  const rows: FormatRow[] = [
    { label: "UTC", value: formats.utc },
    { label: "Local", value: formats.local },
    { label: "Unix Timestamp", value: formats.unix, mono: true },
  ];

  return (
    <div className={cn("inline-flex flex-wrap items-center gap-2", className)}>
      <span className="inline-flex items-center gap-1.5 text-sm text-neutral-900">
        <CircleHalfDottedClock className="size-3.5 shrink-0 text-neutral-400" aria-hidden />
        {relativeDisplay}
      </span>

      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-2 py-1 text-sm text-neutral-900 transition-colors hover:border-neutral-300"
            aria-label="Show time formats"
          >
            <span>{formatUtcTimestamp(date)}</span>
            <ChevronDown
              className={cn(
                "size-3.5 shrink-0 text-neutral-400 transition-transform",
                open && "rotate-180",
              )}
              aria-hidden
            />
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={6}
            className="z-50 w-[min(100vw-2rem,360px)] overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg outline-none animate-slide-up-fade"
          >
            <div className="border-b border-neutral-100 px-4 py-2">
              <p className="text-sm font-semibold text-neutral-900">Time Formats</p>
            </div>

            <div className="divide-y divide-neutral-100">
              {rows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-start justify-between gap-3 px-4 py-2"
                >
                  <div className="min-w-0">
                    <p className="text-xs text-neutral-500">{row.label}</p>
                    <p
                      className={cn(
                        "break-all text-sm text-neutral-900",
                        row.mono && "font-mono",
                      )}
                    >
                      {row.value}
                    </p>
                  </div>
                  <CopyFeedbackButton
                    value={row.value}
                    label={`Copy ${row.label}`}
                    successMessage={`Copied ${row.label}`}
                  />
                </div>
              ))}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
