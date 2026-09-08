"use client";

import { NavigationProgressScript } from "@/app/navigation-progress-script";
import { TooltipProvider } from "@/shared/ui/tooltip";
import { Toaster } from "sonner";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <NavigationProgressScript />
      <Toaster richColors closeButton position="top-center" />
      {children}
    </TooltipProvider>
  );
}
