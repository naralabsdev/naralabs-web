import type { ComponentType } from "react";

import {
  BadgeCheck,
  DatabaseKey,
  Eye,
  InputSearch,
  Page2,
  Receipt2,
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
    title: "Account",
    items: [
      { label: "Account Overview", href: "/dashboard", icon: Page2 },
      { label: "Watch List", href: "/dashboard/watchlist", icon: Eye },
    ],
  },
  {
    title: "Tools",
    items: [
      { label: "Private Name Tags", href: "/dashboard/tags", icon: InputSearch },
      { label: "Txn Private Notes", href: "/dashboard/notes", icon: Receipt2 },
      {
        label: "Verified Addresses",
        href: "/dashboard/verified-addresses",
        icon: BadgeCheck,
      },
    ],
  },
  {
    title: "Others",
    items: [
      { label: "API Dashboard", href: "/dashboard/developers", icon: DatabaseKey },
      {
        label: "Profile Settings",
        href: "/dashboard/settings/profile",
        icon: UserCheck,
      },
    ],
  },
];

export const DASHBOARD_USAGE_LIMITS = {
  emailNotificationsDaily: 100,
  watchListAddresses: 50,
  txnPrivateNotes: 2000,
  addressTags: 1000,
  apiKeys: 3,
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

/** Aligns content cards with sidebar; DetailSectionCard's default mt-3 is reset here. */
export const dashboardContentColumnClass =
  "min-w-0 flex-1 flex flex-col gap-3 [&>section]:mt-0";

export const dashboardSidebarColumnClass = "w-full shrink-0 lg:w-[280px]";

const DASHBOARD_PAGE_META: Record<string, { title: string; breadcrumb: string }> = {
  "/dashboard": { title: "Account Overview", breadcrumb: "My Account" },
  "/dashboard/watchlist": { title: "Watch List", breadcrumb: "Watch List" },
  "/dashboard/tags": { title: "Private Name Tags", breadcrumb: "Private Name Tags" },
  "/dashboard/notes": { title: "Txn Private Notes", breadcrumb: "Txn Private Notes" },
  "/dashboard/verified-addresses": {
    title: "Verified Addresses",
    breadcrumb: "Verified Addresses",
  },
  "/dashboard/developers": { title: "API Dashboard", breadcrumb: "API Dashboard" },
  "/dashboard/settings/profile": {
    title: "Profile Settings",
    breadcrumb: "Profile Settings",
  },
};

export function getDashboardPageMeta(pathname: string) {
  return (
    DASHBOARD_PAGE_META[pathname] ?? {
      title: "My Account",
      breadcrumb: "My Account",
    }
  );
}
