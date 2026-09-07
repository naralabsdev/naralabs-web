import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const monorepoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)));

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    root: monorepoRoot,
  },
  ...(isDev
    ? {
        // Avoid Turbopack persisting a stale module graph between soft reloads.
        experimental: {
          turbopackFileSystemCacheForDev: false,
        },
      }
    : {}),
  async headers() {
    if (!isDev) {
      return [];
    }

    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
