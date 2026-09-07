import type { Metadata } from "next";
import { AppProviders } from "@/app/providers";

import { siteConfig } from "@/shared/config/site";

import "./globals.css";

export const metadata: Metadata = {
  title: "Naralabs Explorer",
  description: "Stellar blockchain explorer for ledgers, transactions, and Soroban contracts",
  metadataBase: new URL(siteConfig.appUrl),
  icons: {
    icon: {
      url: "/icon.png",
      type: "image/png",
      sizes: "32x32",
    },
    apple: {
      url: "/apple-icon.png",
      type: "image/png",
      sizes: "180x180",
    },
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
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
