"use client";

import { AuroraBackground } from "@/modules/landing/components/hero/aurora-background";
import type { AuroraTheme } from "@/modules/landing/components/hero/aurora-themes";
import { AURORA_THEMES } from "@/modules/landing/components/hero/aurora-themes";
import { cn } from "@/shared/lib/cn";

export const explorerAuroraHeightClass = "h-48";

/** Matches aurora strip height — list content starts immediately below. */
export const explorerHeroZoneClass = explorerAuroraHeightClass;

/** Short aurora strip behind explorer content — color varies by module. */
export function ExplorerAuroraBackdrop({ theme = "default" }: { theme?: AuroraTheme }) {
  const { fallback } = AURORA_THEMES[theme];

  return (
    <div
      className={cn(
        "explorer-aurora-strip hero-aurora--ready pointer-events-none absolute inset-x-0 top-0 z-0 overflow-hidden",
        explorerAuroraHeightClass,
      )}
      data-aurora-theme={theme}
      style={{ backgroundColor: fallback }}
    >
      <AuroraBackground theme={theme} />
    </div>
  );
}
