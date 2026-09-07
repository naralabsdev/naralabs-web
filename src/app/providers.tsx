"use client";

import { NavigationProgressScript } from "@/app/navigation-progress-script";
import { TooltipProvider } from "@/shared/ui/tooltip";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <NavigationProgressScript />
      {children}
    </TooltipProvider>
  );
}
