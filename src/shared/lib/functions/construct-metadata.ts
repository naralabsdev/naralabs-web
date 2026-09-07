import { Metadata } from "next";

export function constructMetadata({
  title,
  fullTitle,
  description = "Naralabs is the Soroban events infrastructure and SDK for modern apps.",
  image = "https://naralabs.io/thumbnail.jpg",
  video,
  icons = [
    {
      rel: "apple-touch-icon",
      url: "/apple-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      url: "/icon.png",
    },
    {
      rel: "shortcut icon",
      url: "/favicon.ico",
    },
  ],
  url,
  canonicalUrl,
  noIndex = false,
  manifest,
}: {
  title?: string;
  fullTitle?: string;
  description?: string;
  image?: string | null;
  video?: string | null;
  icons?: Metadata["icons"];
  url?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  manifest?: string | URL | null;
} = {}): Metadata {
  return {
    title:
      fullTitle ||
      (title ? `${title} | Naralabs` : "Naralabs - Soroban events infrastructure and SDK"),
    description,
    openGraph: {
      title,
      description,
      ...(image && {
        images: image,
      }),
      url,
      ...(video && {
        videos: video,
      }),
    },
    twitter: {
      title,
      description,
      ...(image && {
        card: "summary_large_image",
        images: [image],
      }),
      ...(video && {
        player: video,
      }),
      creator: "@naralabs",
    },
    icons,
    metadataBase: new URL("https://naralabs.io"),
    ...((url || canonicalUrl) && {
      alternates: {
        canonical: url || canonicalUrl,
      },
    }),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
    ...(manifest && {
      manifest,
    }),
  };
}
