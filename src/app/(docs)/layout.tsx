import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { getPageMap } from "nextra/page-map";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { filterDocsPageMap } from "@/app/(docs)/filter-docs-page-map";
import { FAVICON_MANIFEST_PATH, SITE_FAVICONS } from "@/shared/config/favicons";
import { getGithubUrl } from "@/shared/config/site";
import { Logo } from "@/shared/ui/logo";

export const metadata: Metadata = {
  title: {
    default: "NaraLabs Docs",
    template: "%s | NaraLabs Docs",
  },
  description: "Documentation for the NaraLabs Stellar Soroban explorer and Atlas API",
  manifest: FAVICON_MANIFEST_PATH,
  icons: SITE_FAVICONS,
};

export const viewport: Viewport = {
  themeColor: "#fafafa",
};

const navbar = (
  <Navbar
    logo={<Logo variant="light" className="h-9 w-auto" priority />}
    logoLink="/docs"
    projectLink={getGithubUrl()}
  />
);

const footer = (
  <Footer>
    MIT {new Date().getFullYear()} © NaraLabs — Stellar Soroban explorer
  </Footer>
);

export default async function DocsRootLayout({ children }: { children: ReactNode }) {
  const pageMap = filterDocsPageMap(await getPageMap());

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
          pageMap={pageMap}
          docsRepositoryBase="https://github.com/naralabsdev/naralabs-web/tree/main/naralabs-frontend/src/content"
          sidebar={{ defaultMenuCollapseLevel: 2, autoCollapse: false, toggleButton: true }}
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
