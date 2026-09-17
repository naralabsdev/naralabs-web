import type { Metadata } from "next";

export const FAVICON_MANIFEST_PATH = "/favicon/site.webmanifest";

export const SITE_FAVICONS: Metadata["icons"] = {
  icon: [
    {
      url: "/favicon/favicon-16x16.png",
      sizes: "16x16",
      type: "image/png",
    },
    {
      url: "/favicon/favicon-32x32.png",
      sizes: "32x32",
      type: "image/png",
    },
  ],
  apple: {
    url: "/favicon/apple-touch-icon.png",
    sizes: "180x180",
    type: "image/png",
  },
  shortcut: "/favicon/favicon.ico",
};
