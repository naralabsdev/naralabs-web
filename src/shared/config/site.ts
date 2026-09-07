import { publicEnv } from "@/shared/config/public-env";

export const siteConfig = {
  docsUrl: publicEnv.docsUrl ?? "https://docs.naralabs.com",
  githubUrl: publicEnv.githubUrl ?? "https://github.com/naralabsdev/naralabs-web",
  appUrl: publicEnv.appUrl ?? "https://naralabs.io",
} as const;

export function getDocsUrl() {
  return siteConfig.docsUrl;
}

export function getGithubUrl() {
  return siteConfig.githubUrl;
}

export function getAppUrl() {
  return siteConfig.appUrl;
}
