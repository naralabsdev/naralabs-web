"use client";

import type { DetailFieldRow } from "@/modules/events/domain/event-view-model";
import { cn } from "@/shared/lib/cn";
import { CopyFeedbackButton } from "@/shared/ui/copy-feedback-button";
import { TimestampFormatsPopover } from "@/shared/ui/timestamp-formats-popover";
import { CircleInfo } from "@/shared/ui/icons/nucleo";
import { Tooltip } from "@/shared/ui/tooltip";
import Link from "next/link";

function FieldLabelTip({ tip }: { tip: string }) {
  return (
    <Tooltip
      content={
        <p className="max-w-[240px] px-3 py-2 text-left text-xs leading-relaxed text-neutral-700">
          {tip}
        </p>
      }
      side="top"
    >
      <button
        type="button"
        className="inline-flex shrink-0 rounded-sm text-neutral-400 transition-colors hover:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300"
        aria-label={tip}
      >
        <CircleInfo className="size-3.5" aria-hidden />
      </button>
    </Tooltip>
  );
}

function StatusBadge({
  badge,
}: {
  badge: NonNullable<DetailFieldRow["badge"]>;
}) {
  const toneClass =
    badge.tone === "success"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : badge.tone === "warning"
        ? "bg-amber-50 text-amber-700 ring-amber-200"
        : "bg-neutral-100 text-neutral-600 ring-neutral-200";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        toneClass,
      )}
    >
      {badge.text}
    </span>
  );
}

function CopyValue({ value, mono, label }: { value: string; mono?: boolean; label?: string }) {
  return (
    <span className="inline-flex max-w-full items-start gap-2">
      <span className={cn("break-all text-sm text-neutral-900", mono && "font-mono")}>
        {value}
      </span>
      <CopyFeedbackButton value={value} label={label} successMessage={`Copied ${label ?? "value"}`} />
    </span>
  );
}

function LinkCopyValue({
  href,
  value,
}: {
  href: string;
  value: string;
}) {
  return (
    <span className="inline-flex max-w-full items-start gap-2">
      <Link
        href={href}
        className="break-all font-mono text-sm text-primary hover:underline"
      >
        {value}
      </Link>
      <CopyFeedbackButton value={value} label="Copy address" successMessage="Copied address" />
    </span>
  );
}

function FieldValue({ row }: { row: DetailFieldRow }) {
  if (row.timestampIso) {
    return <TimestampFormatsPopover timestamp={row.timestampIso} />;
  }

  if (row.badge) {
    return <StatusBadge badge={row.badge} />;
  }

  if (row.href && row.copyValue) {
    return <LinkCopyValue href={row.href} value={row.copyValue} />;
  }

  if (row.copyValue && !row.href) {
    return <CopyValue value={row.copyValue} mono={row.mono} label={`${row.label}`} />;
  }

  const valueClass = cn(
    "break-all text-sm text-neutral-900",
    row.mono && "font-mono",
  );

  if (row.href) {
    return (
      <Link href={row.href} className={cn(valueClass, "text-primary hover:underline")}>
        {row.value}
      </Link>
    );
  }

  return <span className={valueClass}>{row.value}</span>;
}

export function DetailFieldRowView({ row }: { row: DetailFieldRow }) {
  return (
    <div className="grid gap-3 border-b border-neutral-100 px-5 py-3.5 last:border-b-0 sm:grid-cols-[220px_minmax(0,1fr)] sm:items-start sm:gap-6 sm:px-6 sm:py-4">
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-medium text-neutral-500">{row.label}</span>
        {row.tip ? <FieldLabelTip tip={row.tip} /> : null}
      </div>
      <div className="min-w-0">
        <FieldValue row={row} />
        {row.secondary ? (
          <p className="mt-1 text-xs text-neutral-500">{row.secondary}</p>
        ) : null}
      </div>
    </div>
  );
}

export function DetailFieldList({ rows }: { rows: DetailFieldRow[] }) {
  return (
    <div className="divide-y divide-neutral-100">
      {rows.map((row) => (
        <DetailFieldRowView key={row.label} row={row} />
      ))}
    </div>
  );
}

export function EventActionBanner({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-neutral-100 px-6 py-5 sm:px-8 sm:py-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
        {title}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-neutral-800">{description}</p>
    </div>
  );
}
