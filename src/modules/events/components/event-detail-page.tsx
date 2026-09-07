"use client";

import { cn } from "@/shared/lib/cn";

import { MarketingChrome } from "@/modules/landing/components/chrome/marketing-chrome";
import { MarketingContent } from "@/modules/landing/components/chrome/marketing-content";
import { HeroNav } from "@/modules/landing/components/hero/hero-nav";
import { EventDetailTabs } from "@/modules/events/components/event-detail-tabs";
import type { EventDetailViewModel } from "@/modules/events/domain/event-view-model";
import { inter, satoshi } from "@/modules/landing/fonts";
import "@/modules/landing/styles/marketing.css";

export function EventDetailPage({ event }: { event: EventDetailViewModel }) {
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
          <MarketingContent>
            <EventDetailTabs event={event} />
          </MarketingContent>
        </main>
      </MarketingChrome>
    </div>
  );
}
