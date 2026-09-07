import { cn } from "@/shared/lib/cn";
import { ArrowRight, CircleInfo } from "@/shared/ui/icons/nucleo";
import Link from "next/link";
import type { ReactNode } from "react";

export function BorderlessTableSection({
  title,
  viewAllHref,
  children,
  className,
}: {
  title: string;
  viewAllHref: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("bg-white px-5 py-5 sm:px-6", className)}>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold tracking-tight text-neutral-900">{title}</h2>
        <Link
          href={viewAllHref}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View all
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </div>
      <div className="overflow-x-auto">{children}</div>
    </section>
  );
}

export function BorderlessTable({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <table className={cn("w-full border-collapse text-sm", className)}>
      {children}
    </table>
  );
}

export function BorderlessTableHead({ children }: { children: ReactNode }) {
  return <thead>{children}</thead>;
}

const rowDividerClass =
  "bg-[linear-gradient(to_right,transparent_12px,rgba(0,0,0,0.06)_12px,rgba(0,0,0,0.06)_calc(100%-12px),transparent_calc(100%-12px))] bg-[length:100%_1px] bg-[position:0_100%] bg-no-repeat sm:bg-[linear-gradient(to_right,transparent_16px,rgba(0,0,0,0.06)_16px,rgba(0,0,0,0.06)_calc(100%-16px),transparent_calc(100%-16px))]";

export function BorderlessTableBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function BorderlessHeaderRow({ children }: { children: ReactNode }) {
  return (
    <tr className={cn("text-left text-xs font-medium text-neutral-500", rowDividerClass)}>
      {children}
    </tr>
  );
}

export function BorderlessHeaderCell({
  children,
  className,
  withInfo,
}: {
  children: ReactNode;
  className?: string;
  withInfo?: boolean;
}) {
  return (
    <th className={cn("pb-3 pr-4 font-medium last:pr-0", className)}>
      <span className="inline-flex items-center gap-1.5">
        {withInfo ? <CircleInfo className="size-3.5 text-neutral-400" aria-hidden /> : null}
        {children}
      </span>
    </th>
  );
}

export function BorderlessRow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <tr
      className={cn(
        "text-neutral-800 transition-colors hover:bg-neutral-50/80",
        rowDividerClass,
        "last:bg-none",
        className,
      )}
    >
      {children}
    </tr>
  );
}

export function BorderlessCell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <td className={cn("py-3.5 pr-4 align-top last:pr-0", className)}>{children}</td>
  );
}

export function truncateMiddle(value: string, start = 6, end = 4) {
  if (value.length <= start + end + 3) return value;
  return `${value.slice(0, start)}...${value.slice(-end)}`;
}
