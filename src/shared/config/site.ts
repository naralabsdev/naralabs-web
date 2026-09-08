export function getDocsUrl() {
  return process.env.NEXT_PUBLIC_DOCS_URL ?? "/docs";
}

export function getGithubUrl() {
  return (
    process.env.NEXT_PUBLIC_GITHUB_URL ??
    "https://github.com/naralabsdev/naralabs-web"
  );
}

export function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "https://naralabs.io";
}

export const siteConfig = {
  docsUrl: getDocsUrl(),
  githubUrl: getGithubUrl(),
  appUrl: getAppUrl(),
} as const;
