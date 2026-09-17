import type { ComponentType } from "react";

import {
  BracketsCurly,
  DatabaseKey,
  Page2,
  ShieldKeyhole,
  UserCheck,
} from "@/shared/ui/icons/nucleo";

export type DashboardNavItem = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
};

export type DashboardNavGroup = {
  title: string;
  items: DashboardNavItem[];
};

export const DASHBOARD_NAV_GROUPS: DashboardNavGroup[] = [
  {
    title: "Developer",
    items: [
      { label: "Schema Registry", href: "/dashboard/schemas", icon: BracketsCurly },
      { label: "API Dashboard", href: "/dashboard/developers", icon: DatabaseKey },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Account Overview", href: "/dashboard", icon: Page2 },
      {
        label: "Profile Settings",
        href: "/dashboard/settings/profile",
        icon: UserCheck,
      },
      {
        label: "Security Settings",
        href: "/dashboard/settings/security",
        icon: ShieldKeyhole,
      },
    ],
  },
];

export const DASHBOARD_USAGE_LIMITS = {
  apiKeys: 3,
  publishTokens: 5,
} as const;

export const DETAIL_ROW_CLASS =
  "grid gap-3 border-b border-neutral-100 px-5 py-3.5 last:border-b-0 sm:grid-cols-[220px_minmax(0,1fr)] sm:items-start sm:gap-6 sm:px-6 sm:py-4";

export const dashboardBreadcrumbNavClass = "text-sm text-white/75";

export const dashboardBreadcrumbLinkClass =
  "transition-colors hover:text-white";

export const dashboardBreadcrumbSeparatorClass = "text-white/35";

export const dashboardBreadcrumbCurrentClass = "text-white";

export const dashboardPageTitleClass =
  "mt-1.5 text-xl font-semibold tracking-tight text-white sm:text-2xl";

export const dashboardPageHeaderClass = "mb-7 sm:mb-8";

/** Grey panel header for dashboard content cards — distinct from page bg (#fafbfd). */
export const dashboardSectionCardHeaderClass =
  "border-neutral-200 bg-neutral-100";

/** Aligns content cards with sidebar; DetailSectionCard's default mt-3 is reset here. */
export const dashboardContentColumnClass =
  "min-w-0 flex-1 flex flex-col gap-3 [&>section]:mt-0";

/** Full-width dashboard content (no sidebar), e.g. schema detail. */
export const dashboardFullWidthContentClass =
  "min-w-0 w-full flex flex-col gap-3 [&>section]:mt-0";

export function isDashboardFullWidthPath(pathname: string) {
  return /^\/dashboard\/schemas\/[^/]+$/.test(pathname);
}

export const dashboardSidebarColumnClass = "w-full shrink-0 lg:w-[280px]";

const DASHBOARD_PAGE_META: Record<string, { title: string; breadcrumb: string }> = {
  "/dashboard": { title: "Account Overview", breadcrumb: "My Account" },
  "/dashboard/developers": { title: "API Dashboard", breadcrumb: "API Dashboard" },
  "/dashboard/schemas": { title: "Schema Registry", breadcrumb: "Schema Registry" },
  "/dashboard/settings/profile": {
    title: "Profile Settings",
    breadcrumb: "Profile Settings",
  },
  "/dashboard/settings/security": {
    title: "Security Settings",
    breadcrumb: "Security Settings",
  },
};

export function getDashboardPageMeta(pathname: string) {
  if (pathname.startsWith("/dashboard/schemas/") && pathname !== "/dashboard/schemas") {
    return { title: "Schema Details", breadcrumb: "Schema Registry" };
  }

  return (
    DASHBOARD_PAGE_META[pathname] ?? {
      title: "My Account",
      breadcrumb: "My Account",
    }
  );
}
