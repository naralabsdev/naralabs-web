"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  DASHBOARD_NAV_GROUPS,
  dashboardBreadcrumbCurrentClass,
  dashboardBreadcrumbLinkClass,
  dashboardBreadcrumbNavClass,
  dashboardBreadcrumbSeparatorClass,
  dashboardContentColumnClass,
  dashboardPageHeaderClass,
  dashboardPageTitleClass,
  dashboardSidebarColumnClass,
  getDashboardPageMeta,
  type DashboardNavItem,
} from "@/app/(site)/dashboard/constants";
import { getEmailDisplayName, type AuthUser } from "@/modules/auth/lib/auth-user";
import { MarketingChrome } from "@/modules/landing/components/chrome/marketing-chrome";
import { MarketingContent } from "@/modules/landing/components/chrome/marketing-content";
import { AuroraBackground } from "@/modules/landing/components/hero/aurora-background";
import { HeroNav } from "@/modules/landing/components/hero/hero-nav";
import { inter, satoshi } from "@/modules/landing/fonts";
import "@/modules/landing/styles/marketing.css";
import { DetailSummaryCard } from "@/shared/ui/detail-summary-card";
import { cn } from "@/shared/lib/cn";

function isActivePath(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function DashboardPageHeader({ pathname }: { pathname: string }) {
  const { title, breadcrumb } = getDashboardPageMeta(pathname);
  const isOverview = pathname === "/dashboard";

  return (
    <div className={dashboardPageHeaderClass}>
      <nav aria-label="Breadcrumb" className={dashboardBreadcrumbNavClass}>
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className={dashboardBreadcrumbLinkClass}>
              Home
            </Link>
          </li>
          <li aria-hidden className={dashboardBreadcrumbSeparatorClass}>
            /
          </li>
          {isOverview ? (
            <li className={dashboardBreadcrumbCurrentClass}>{breadcrumb}</li>
          ) : (
            <>
              <li>
                <Link href="/dashboard" className={dashboardBreadcrumbLinkClass}>
                  My Account
                </Link>
              </li>
              <li aria-hidden className={dashboardBreadcrumbSeparatorClass}>
                /
              </li>
              <li className={dashboardBreadcrumbCurrentClass}>{breadcrumb}</li>
            </>
          )}
        </ol>
      </nav>

      <h1 className={dashboardPageTitleClass}>{title}</h1>
    </div>
  );
}

export function DashboardLayoutClient({
  user,
  children,
}: {
  user: AuthUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const displayName = getEmailDisplayName(user.email);

  return (
    <div
      className={cn(
        satoshi.variable,
        inter.variable,
        "marketing-theme font-default flex min-h-screen flex-col overflow-x-hidden",
      )}
      style={{ backgroundColor: "#fafbfd" }}
    >
      <MarketingChrome>
        <header className="relative z-30 bg-white">
          <HeroNav theme="light" />
        </header>

        <div className="relative flex-1 bg-[#fafbfd]">
          <div className="hero-aurora hero-aurora--ready pointer-events-none absolute inset-x-0 top-0 z-0 h-44 overflow-hidden sm:h-52">
            <AuroraBackground />
          </div>

          <main className="relative z-10 pb-14 pt-6 sm:pt-8">
            <MarketingContent>
              <DashboardPageHeader pathname={pathname} />

              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
                <aside className={dashboardSidebarColumnClass}>
                  <DetailSummaryCard className="sticky top-24">
                    <div className="border-b border-neutral-100 px-5 py-4 sm:px-6">
                      <Link
                        href="/"
                        className="text-xs font-semibold uppercase tracking-wide text-neutral-500 transition-colors hover:text-neutral-900"
                      >
                        Back Home
                      </Link>
                      <p className="mt-3 text-base font-semibold text-neutral-900">
                        {displayName}
                      </p>
                      <p className="mt-1 break-all text-sm text-neutral-500">
                        {user.email}
                      </p>
                    </div>

                    <nav className="space-y-5 px-3 py-4">
                      {DASHBOARD_NAV_GROUPS.map((group) => (
                        <div key={group.title}>
                          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-400">
                            {group.title}
                          </p>
                          <div className="space-y-1">
                            {group.items.map((item: DashboardNavItem) => {
                              const Icon = item.icon;
                              const active = isActivePath(pathname, item.href);

                              return (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  className={cn(
                                    "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900",
                                    active &&
                                      "bg-neutral-100 text-neutral-900 hover:bg-neutral-100",
                                  )}
                                >
                                  <Icon
                                    className="size-4 shrink-0 text-neutral-400"
                                    aria-hidden
                                  />
                                  <span>{item.label}</span>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </nav>
                  </DetailSummaryCard>
                </aside>

                <div className={dashboardContentColumnClass}>{children}</div>
              </div>
            </MarketingContent>
          </main>
        </div>
      </MarketingChrome>
    </div>
  );
}
