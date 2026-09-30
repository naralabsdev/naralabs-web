import type { Metadata } from "next";

import { AppProviders } from "@/app/(site)/providers";
import { FAVICON_MANIFEST_PATH, SITE_FAVICONS } from "@/shared/config/favicons";
import { siteConfig } from "@/shared/config/site";

import "../globals.css";

export const metadata: Metadata = {
  title: "Decode Playground · Naralabs",
  description: "Try Atlas event decoding on Soroban payloads (testnet)",
  metadataBase: new URL(siteConfig.appUrl),
  manifest: FAVICON_MANIFEST_PATH,
  icons: SITE_FAVICONS,
};

export default function PlaygroundRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full overflow-hidden bg-[#1e1e1e] antialiased text-[#d4d4d4]">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
