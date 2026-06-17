import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const frontendRoot = path.dirname(fileURLToPath(import.meta.url));

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGitHubPages ? "/AegisSOC-frontend" : "";

const backendUrl =
  process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

const nextConfig: NextConfig = {
  ...(isGitHubPages
    ? {
        output: "export",
        basePath,
        trailingSlash: true,
      }
    : { output: "standalone" }),
  images: { unoptimized: true },
  turbopack: {
    root: frontendRoot,
  },
  ...(!isGitHubPages && backendUrl
    ? {
        async rewrites() {
          return [
            {
              source: "/api/backend/:path*",
              destination: `${backendUrl}/:path*`,
            },
          ];
        },
      }
    : {}),
};

export default nextConfig;
