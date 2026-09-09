import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { getPageMap } from "nextra/page-map";
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { getGithubUrl } from "@/shared/config/site";

export const metadata: Metadata = {
  title: {
    default: "NaraLabs Docs",
    template: "%s | NaraLabs Docs",
  },
  description: "Documentation for the NaraLabs Stellar Soroban explorer and Atlas API",
};

export const viewport: Viewport = {
  themeColor: "#fafafa",
};

const navbar = (
  <Navbar
    logo={
      <Link href="/docs" className="flex items-center gap-2 no-underline">
        <span className="font-semibold tracking-tight text-neutral-900">NaraLabs</span>
        <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-xs font-medium text-neutral-600">
          Docs
        </span>
      </Link>
    }
    logoLink="/docs"
    projectLink={getGithubUrl()}
  >
    <Link
      href="/"
      className="x:px-3 x:py-2 x:text-sm x:font-medium x:text-neutral-600 x:hover:text-neutral-900"
    >
      Explorer
    </Link>
    <Link
      href="/dashboard/developers"
      className="x:px-3 x:py-2 x:text-sm x:font-medium x:text-neutral-600 x:hover:text-neutral-900"
    >
      API Dashboard
    </Link>
  </Navbar>
);

const footer = (
  <Footer>
    MIT {new Date().getFullYear()} © NaraLabs — Stellar Soroban explorer
  </Footer>
);

export default async function DocsRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="/nextra-docs.css" />
        {/* Loaded after Nextra base styles so overrides always win */}
        <link rel="stylesheet" href="/docs-theme.css" />
      </head>
      <body>
        <Layout
          navbar={navbar}
          footer={footer}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/naralabsdev/naralabs-web/tree/main/naralabs-frontend/src/content"
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          editLink="Edit this page on GitHub"
          darkMode={false}
          nextThemes={{
            forcedTheme: "light",
            defaultTheme: "light",
            attribute: "class",
            disableTransitionOnChange: true,
          }}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
