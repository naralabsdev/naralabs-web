import type { Metadata } from "next";

import { AppProviders } from "@/app/(site)/providers";
import { FAVICON_MANIFEST_PATH, SITE_FAVICONS } from "@/shared/config/favicons";
import { siteConfig } from "@/shared/config/site";

import "../globals.css";

export const metadata: Metadata = {
  title: "Naralabs Explorer",
  description: "Stellar blockchain explorer for ledgers, transactions, and Soroban contracts",
  metadataBase: new URL(siteConfig.appUrl),
  manifest: FAVICON_MANIFEST_PATH,
  icons: SITE_FAVICONS,
};

export default function SiteRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
