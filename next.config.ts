import nextra from "nextra";
import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const monorepoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const isDev = process.env.NODE_ENV === "development";

const withNextra = nextra({
  contentDirBasePath: "/docs",
});

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    root: monorepoRoot,
  },
  webpack(config, { isServer }) {
    // Webpack dev can resolve the react-server entry for client libraries (floating-ui, swr).
    // Alias to package dirs (not index.js) so watchpack and react/jsx-runtime keep working.
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        react: path.join(monorepoRoot, "node_modules/react"),
        "react-dom": path.join(monorepoRoot, "node_modules/react-dom"),
      };
    }

    return config;
  },
  ...(isDev
    ? {
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

export default withNextra(nextConfig);
