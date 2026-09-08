"use client";

import { MarketingChrome } from "@/modules/landing/components/chrome/marketing-chrome";
import { MarketingContent } from "@/modules/landing/components/chrome/marketing-content";
import { HeroNav } from "@/modules/landing/components/hero/hero-nav";
import { inter, satoshi } from "@/modules/landing/fonts";
import "@/modules/landing/styles/marketing.css";
import { cn } from "@/shared/lib/cn";
import type { ReactNode } from "react";

export function ExplorerPageShell({ children }: { children: ReactNode }) {
  return (
    <div
      className={cn(
        satoshi.variable,
        inter.variable,
        "marketing-theme font-default flex min-h-screen flex-col overflow-x-hidden",
      )}
      style={{ backgroundColor: "#fafbfd" }}
    >
      <MarketingChrome>
        <header className="bg-white">
          <HeroNav theme="light" />
        </header>

        <main className="pb-14 pt-12">
          <MarketingContent>{children}</MarketingContent>
        </main>
      </MarketingChrome>
    </div>
  );
}
