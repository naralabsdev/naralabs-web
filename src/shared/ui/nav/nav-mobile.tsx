"use client";

import { cn, createHref, getMarketingAuthUrls } from "@/shared/lib";
import {
  ArrowUpRight,
  ChevronDown,
  CircleUser,
  Menu3,
  Xmark,
} from "@/shared/ui/icons/nucleo";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ComponentProps, ReactNode, useEffect, useState } from "react";
import { AnimatedSizeContainer } from "../animated-size-container";
import { ButtonProps, buttonVariants } from "../button";
import { NavItemChild, NavItemChildren } from "../content";
import {
  DubAnalyticsIcon,
  DubApiIcon,
  DubLinksIcon,
  DubPartnersIcon,
} from "../icons";
import {
  getEmailDisplayName,
  type AuthUser,
} from "@/modules/auth/lib/auth-user";
import { navItems, type NavItem, type NavTheme } from "./nav";
import { UserMenu } from "./user-menu";

const specialIcons: Record<string, ReactNode> = {
  "Dub Links": (
    <div className="flex size-5 items-center justify-center rounded bg-orange-400">
      <DubLinksIcon className="size-3 text-orange-900" />
    </div>
  ),
  "Dub Partners": (
    <div className="flex size-5 items-center justify-center rounded bg-violet-400">
      <DubPartnersIcon className="size-3 text-violet-900" />
    </div>
  ),
  "Dub Analytics": (
    <div className="flex size-5 items-center justify-center rounded bg-green-400">
      <DubAnalyticsIcon className="size-3 text-green-900" />
    </div>
  ),
  "Dub API": (
    <div className="flex size-5 items-center justify-center rounded bg-neutral-400">
      <DubApiIcon className="size-3 text-neutral-900" />
    </div>
  ),
};

export function NavMobile({
  theme = "light",
  staticDomain,
  navItems: items = navItems,
  isAuthenticated = false,
  user = null,
}: {
  theme?: NavTheme;
  staticDomain?: string;
  navItems?: NavItem[];
  isAuthenticated?: boolean;
  user?: AuthUser | null;
}) {
  let { domain = "dub.co" } = useParams() as { domain: string };
  if (staticDomain) {
    domain = staticDomain;
  }

  const [open, setOpen] = useState(false);
  // prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  const authUrls = getMarketingAuthUrls(domain);

  return (
    <div
      className={cn(
        "fixed right-0 top-0 z-40 flex items-center gap-4 p-2.5 lg:hidden",
        theme === "dark" && "dark",
      )}
    >
      {user ? (
        <div className="max-[280px]:hidden">
          <UserMenu
            email={user.email}
            theme={theme}
            className={cn(
              theme === "dark" &&
                "[&_button]:border-transparent [&_button]:bg-transparent [&_button]:text-neutral-500 [&_button]:shadow-none [&_button]:hover:bg-neutral-50 [&_button]:hover:text-neutral-600",
            )}
          />
        </div>
      ) : !isAuthenticated ? (
        <AuthButton
          href={authUrls.login}
          variant="secondary"
          className={cn(
            "max-[280px]:hidden gap-1.5 border-transparent bg-transparent px-2 text-white/90 shadow-none hover:bg-white/10 hover:text-white",
            "dark:border-transparent dark:bg-transparent dark:text-white/90 dark:hover:bg-white/10 dark:hover:text-white",
          )}
        >
          <CircleUser className="size-[18px]" aria-hidden />
          Sign In
        </AuthButton>
      ) : null}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "z-30 rounded-full p-2 transition-colors duration-200 hover:bg-neutral-200 focus:outline-none active:bg-neutral-300 dark:hover:bg-white/20 dark:active:bg-white/30",
          open && "hover:bg-neutral-100 active:bg-neutral-200",
        )}
      >
        {open ? (
          <Xmark className="h-5 w-5 text-neutral-600 dark:text-white/70" />
        ) : (
          <Menu3 className="h-5 w-5 text-neutral-600 dark:text-white/70" />
        )}
      </button>
      <nav
        className={cn(
          "fixed inset-0 z-20 hidden max-h-screen w-full overflow-y-auto bg-white px-5 py-16 lg:hidden dark:bg-black dark:text-white/70",
          open && "block",
        )}
      >
        <ul className="grid divide-y divide-neutral-200 dark:divide-white/[0.15]">
          {items.map(({ name, href, childItems, dropdownVariant, target, external }, idx) => (
            <MobileNavItem
              key={idx}
              name={name}
              href={href}
              childItems={childItems}
              dropdownVariant={dropdownVariant}
              target={target}
              external={external}
              setOpen={setOpen}
            />
          ))}

          {user ? (
            <li className="py-3 min-[281px]:hidden">
              <div className="flex items-center gap-1.5 font-semibold">
                <CircleUser className="size-[18px]" aria-hidden />
                {getEmailDisplayName(user.email)}
              </div>
              <div className="mt-3 space-y-1 border-l border-neutral-100 pl-4">
                <Link
                  href="/dashboard"
                  className="block py-1.5 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-500"
                  onClick={() => setOpen(false)}
                >
                  Account Overview
                </Link>
                <Link
                  href="/dashboard/settings/profile"
                  className="block py-1.5 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-500"
                  onClick={() => setOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  href="/dashboard/developers"
                  className="block py-1.5 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-500"
                  onClick={() => setOpen(false)}
                >
                  API Dashboard
                </Link>
                <button
                  type="button"
                  className="block py-1.5 text-left text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-500"
                  onClick={async () => {
                    setOpen(false);
                    await fetch("/api/auth/logout", { method: "POST" });
                    window.location.href = "/";
                  }}
                >
                  Logout
                </button>
              </div>
            </li>
          ) : !isAuthenticated ? (
            <li className="py-3 min-[281px]:hidden">
              <Link
                href={authUrls.login}
                className="flex w-full items-center gap-1.5 font-semibold"
              >
                <CircleUser className="size-[18px]" aria-hidden />
                Sign In
              </Link>
            </li>
          ) : null}
        </ul>
      </nav>
    </div>
  );
}

const MobileNavItem = ({
  name,
  href,
  childItems,
  dropdownVariant,
  target,
  external,
  setOpen,
}: {
  name: string;
  href?: string;
  childItems?: NavItemChildren;
  dropdownVariant?: "simple" | "mega";
  target?: string;
  external?: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const { domain = "dub.co" } = useParams() as { domain: string };
  const [expanded, setExpanded] = useState(false);

  if (childItems) {
    const flatItems = childItems.flatMap((item) =>
      "items" in item ? item.items : [item],
    );

    return (
      <li className="py-3">
        <AnimatedSizeContainer height>
          <button
            className="flex w-full items-center justify-between"
            onClick={() => setExpanded(!expanded)}
            type="button"
          >
            <p className="font-semibold">{name}</p>
            <ChevronDown
              className={cn(
                "h-5 w-5 text-neutral-500 transition-all dark:text-white/50",
                expanded && "rotate-180",
              )}
            />
          </button>
          {expanded ? (
            dropdownVariant === "simple" ? (
              <ul className="mt-3 space-y-1 border-l border-neutral-200 pl-4 dark:border-white/10">
                {flatItems.map(({ title, href: itemHref }) => (
                  <li key={itemHref}>
                    <Link
                      href={createHref(itemHref, domain, {
                        utm_source: "Custom Domain",
                        utm_medium: "Navbar",
                        utm_campaign: domain,
                        utm_content: title,
                      })}
                      onClick={() => setOpen(false)}
                      className="block py-1.5 text-sm text-neutral-600 hover:text-neutral-900 dark:text-white/70 dark:hover:text-white"
                    >
                      {title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="grid grid-cols-1 gap-4 overflow-hidden py-4">
                {childItems.map((item, idx) =>
                  "items" in item ? (
                    <div key={idx} className="grid grid-cols-1 gap-3">
                      <span className="text-xs font-medium uppercase text-neutral-500 dark:text-white/50">
                        {item.label}
                      </span>
                      {item.items.map((childItem, childIdx) => (
                        <ChildItem
                          key={childIdx}
                          item={childItem}
                          setOpen={setOpen}
                          size="small"
                        />
                      ))}
                    </div>
                  ) : (
                    <ChildItem key={idx} item={item} setOpen={setOpen} />
                  ),
                )}
              </div>
            )
          ) : null}
        </AnimatedSizeContainer>
      </li>
    );
  }

  if (!href) {
    return null;
  }

  return (
    <li className="py-3">
      <Link
        href={createHref(href, domain, {
          utm_source: "Custom Domain",
          utm_medium: "Navbar",
          utm_campaign: domain,
          utm_content: name,
        })}
        target={target}
        rel={target === "_blank" ? "noreferrer" : undefined}
        onClick={() => setOpen(false)}
        className={cn(
          "flex w-full items-center font-semibold capitalize",
          external && "gap-1.5",
        )}
      >
        {name}
        {external ? <ArrowUpRight className="size-4" /> : null}
      </Link>
    </li>
  );
};

const ChildItem = ({
  item: { title, description, href, icon: Icon },
  setOpen,
  size = "normal",
}: {
  item: NavItemChild;
  setOpen: (open: boolean) => void;
  size?: "normal" | "small";
}) => {
  const { domain = "dub.co" } = useParams() as { domain: string };

  const SpecialIcon = specialIcons?.[title];

  return (
    <Link
      href={createHref(href, domain, {
        utm_source: "Custom Domain",
        utm_medium: "Navbar",
        utm_campaign: domain,
        utm_content: title,
      })}
      onClick={() => setOpen(false)}
      className="flex w-full items-center gap-3"
    >
      <div
        className={cn(
          "flex size-10 items-center justify-center rounded-lg border border-neutral-200 bg-gradient-to-t from-neutral-100",
          size === "small" && "size-8",
        )}
      >
        {SpecialIcon ?? (
          <Icon
            className={cn(
              "size-5 text-neutral-700 grayscale",
              size === "small" && "size-4",
            )}
          />
        )}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium text-neutral-900">{title}</h2>
        </div>
        {description && (
          <p className="text-sm text-neutral-500">{description}</p>
        )}
      </div>
    </Link>
  );
};

export function AuthButton({
  variant,
  className,
  ...rest
}: Pick<ButtonProps, "variant"> & ComponentProps<typeof Link>) {
  return (
    <Link
      {...rest}
      className={cn(
        "flex h-8 w-fit items-center whitespace-nowrap rounded-lg border px-3 text-[0.8125rem]",
        buttonVariants({ variant }),
        className,
      )}
    />
  );
}
