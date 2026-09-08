"use client";

import Script from "next/script";

export function NavigationProgressScript() {
  return (
    <Script
      id="naralabs-navigation-progress"
      src="/navigation-progress.js"
      strategy="afterInteractive"
    />
  );
}
