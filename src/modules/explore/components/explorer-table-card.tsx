import { landingElevatedCardClass } from "@/shared/ui/landing-card-surface";
import { cn } from "@/shared/lib/cn";
import type { ReactNode } from "react";

export function ExplorerTableCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn(landingElevatedCardClass, className)}>{children}</section>
  );
}
