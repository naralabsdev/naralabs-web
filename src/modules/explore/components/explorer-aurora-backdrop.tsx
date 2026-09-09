"use client";

import { AuroraBackground } from "@/modules/landing/components/hero/aurora-background";

/** Short aurora strip behind explorer content — matches dashboard layout. */
export function ExplorerAuroraBackdrop() {
  return (
    <div className="hero-aurora hero-aurora--ready pointer-events-none absolute inset-x-0 top-0 z-0 h-44 overflow-hidden sm:h-52">
      <AuroraBackground />
    </div>
  );
}
