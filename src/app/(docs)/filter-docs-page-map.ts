import type { PageMapItem } from "nextra";

function isMetaJsonFile(item: PageMapItem): boolean {
  return "data" in item && !("route" in item);
}

function isExternalOrMenuItem(item: PageMapItem): boolean {
  if ("type" in item && (item.type === "menu" || item.type === "page")) {
    return true;
  }
  if ("href" in item && typeof item.href === "string" && !item.href.startsWith("/docs")) {
    return true;
  }
  return false;
}

/** Nextra indexes all app route pages (login, explorer, etc.); hide non-doc routes in the sidebar. */
function isNonDocsRoute(item: PageMapItem): boolean {
  if (isMetaJsonFile(item)) {
    return false;
  }
  if ("route" in item && typeof item.route === "string") {
    return item.route !== "/docs" && !item.route.startsWith("/docs/");
  }
  return false;
}

function shouldDropFromDocsSidebar(item: PageMapItem): boolean {
  return isExternalOrMenuItem(item) || isNonDocsRoute(item);
}

/** Docs sidebar: only routes under /docs plus meta; no app auth or explorer pages. */
export function filterDocsPageMap(items: PageMapItem[]): PageMapItem[] {
  return items
    .filter((item) => !shouldDropFromDocsSidebar(item))
    .map((item) => {
      if ("children" in item && Array.isArray(item.children)) {
        const children = filterDocsPageMap(item.children);
        return { ...item, children };
      }
      return item;
    })
    .filter((item) => {
      if ("children" in item && Array.isArray(item.children)) {
        return item.children.length > 0;
      }
      return true;
    });
}
