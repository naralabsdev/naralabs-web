export function isDocsHref(href: string | undefined | null): boolean {
  if (!href) {
    return false;
  }

  if (href === "/docs" || href.startsWith("/docs/")) {
    return true;
  }

  try {
    const { pathname } = new URL(href, "http://localhost");
    return pathname === "/docs" || pathname.startsWith("/docs/");
  } catch {
    return false;
  }
}

export function getDocsLinkProps(href: string): {
  target?: "_blank";
  rel?: "noreferrer";
  external?: boolean;
} {
  if (!isDocsHref(href)) {
    return {};
  }

  return {
    target: "_blank",
    rel: "noreferrer",
    external: true,
  };
}

export function resolveExternalLinkProps(
  href: string,
  target?: string,
  external?: boolean,
): {
  target?: string;
  rel?: string;
  external: boolean;
} {
  const docsProps = getDocsLinkProps(href);
  const resolvedTarget = target ?? docsProps.target;
  const resolvedExternal = external ?? docsProps.external ?? false;

  return {
    target: resolvedTarget,
    rel: resolvedTarget === "_blank" ? "noreferrer" : undefined,
    external: resolvedExternal,
  };
}
