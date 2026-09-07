"use client";

import { cn, createHref, getMarketingAuthUrls } from "@/shared/lib";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import * as Popover from "@radix-ui/react-popover";
import { ArrowUpRight2 } from "@/shared/ui/icons";
import { ChevronDown } from "@/shared/ui/icons/nucleo";
import { LayoutGroup } from "motion/react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  ComponentType,
  PropsWithChildren,
  ReactNode,
  SVGProps,
  createContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import {
  FEATURES_LIST,
  RESOURCES,
  SOLUTIONS,
  type NavItemChildren,
} from "../content";
import { useScroll } from "../hooks";
import { MaxWidthWrapper } from "../max-width-wrapper";
import { NavWordmark } from "../nav-wordmark";
import { SignInLink } from "./sign-in-link";
import { ProductContent } from "./content/product-content";
import { ResourcesContent } from "./content/resources-content";
import { SolutionsContent } from "./content/solutions-content";

export type NavTheme = "light" | "dark";

export const NavContext = createContext<{ theme: NavTheme }>({
  theme: "light",
});

export type NavItem = {
  name: string;
  href?: string;
  segments?: string[];
  content?: ComponentType<{ domain: string }>;
  childItems?: NavItemChildren;
  dropdownVariant?: "simple" | "mega";
  target?: string;
  external?: boolean;
};

export const navItems = [
  {
    name: "Product",
    content: ProductContent,
    childItems: FEATURES_LIST,
    segments: [
      "/links",
      "/analytics",
      "/partners",
      "/integrations",
      "/compare",
      "/features",
    ],
  },
  {
    name: "Solutions",
    content: SolutionsContent,
    childItems: SOLUTIONS,
    segments: ["/solutions", "/sdks"],
  },
  {
    name: "Resources",
    content: ResourcesContent,
    childItems: RESOURCES,
    segments: [
      "/help",
      "/docs",
      "/about",
      "/careers",
      "/brand",
      "/blog",
      "/changelog",
      "/contact",
    ],
  },
  {
    name: "Enterprise",
    href: "/enterprise",
    segments: ["/enterprise"],
  },
  {
    name: "Customers",
    href: "/customers",
    segments: ["/customers"],
  },
  {
    name: "Pricing",
    href: "/pricing",
    segments: ["/pricing"],
  },
];

const navItemClassName = cn(
  "relative group/item flex items-center rounded-md px-4 py-2 text-sm rounded-lg font-medium text-neutral-700 hover:text-neutral-900 transition-colors",
  "border border-transparent outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0",
  "dark:text-white/90 dark:hover:text-white",
  "hover:bg-neutral-900/5 dark:hover:bg-white/10",
  "data-[active=true]:bg-neutral-900/5 dark:data-[active=true]:bg-white/10",
  "data-[state=open]:border-transparent data-[state=open]:outline-none data-[state=open]:ring-0",

  // Hide active state when another item is hovered
  "group-has-[:hover]:data-[active=true]:[&:not(:hover)]:bg-transparent",
);

export function Nav({
  theme = "light",
  staticDomain,
  maxWidthWrapperClassName,
  navItems: items = navItems,
  logo,
  sticky = true,
  solidBackground = false,
  transparent = false,
  isAuthenticated = false,
}: {
  theme?: NavTheme;
  staticDomain?: string;
  maxWidthWrapperClassName?: string;
  navItems?: NavItem[];
  logo?: ReactNode;
  sticky?: boolean;
  solidBackground?: boolean;
  transparent?: boolean;
  isAuthenticated?: boolean;
}) {
  let { domain = "dub.co" } = useParams() as { domain: string };
  if (staticDomain) {
    domain = staticDomain;
  }

  const layoutGroupId = useId();

  const scrolled = useScroll(40);
  const pathname = usePathname();

  const authUrls = getMarketingAuthUrls(domain);

  return (
    <NavContext.Provider value={{ theme }}>
      <LayoutGroup id={layoutGroupId}>
        <div
          className={cn(
            sticky ? "sticky inset-x-0 top-0" : "relative",
            "z-30 w-full transition-all",
            theme === "dark" && "dark",
          )}
        >
          {/* Scrolled background */}
          {!transparent ? (
            <div
              className={cn(
                "absolute inset-0 block border-b transition-all",
                solidBackground
                  ? "border-neutral-100 bg-white"
                  : cn(
                      "border-transparent",
                      scrolled &&
                        "border-neutral-100 bg-white/75 backdrop-blur-lg dark:border-white/10 dark:bg-black/75",
                    ),
              )}
            />
          ) : null}
          <MaxWidthWrapper className={cn("relative", maxWidthWrapperClassName)}>
            <div className="flex h-14 items-center justify-between">
              <div className="min-w-0">
                {logo ?? (
                  <Link
                    className="block w-fit py-2 pr-2"
                    href={createHref("/home", domain, {
                      utm_source: "Custom Domain",
                      utm_medium: "Navbar",
                      utm_campaign: domain,
                      utm_content: "Logo",
                    })}
                  >
                    <NavWordmark />
                  </Link>
                )}
              </div>

              <div className="hidden items-center lg:flex">
                <NavigationMenuPrimitive.Root
                  delayDuration={0}
                  className="relative"
                >
                  <NavigationMenuPrimitive.List className="group relative z-0 flex gap-1">
                    {items.map(({ name, href, segments, content: Content, childItems, dropdownVariant, target, external }) => {
                      const isActive = (segments ?? []).some((segment) =>
                        pathname?.startsWith(segment),
                      );

                      if (dropdownVariant === "simple" && childItems) {
                        return (
                          <SimpleNavDropdown
                            key={name}
                            name={name}
                            childItems={childItems}
                            isActive={isActive}
                          />
                        );
                      }

                      return (
                        <NavigationMenuPrimitive.Item key={name}>
                          <WithTrigger trigger={!!Content}>
                            {href !== undefined ? (
                              <Link
                                id={`nav-${href}`}
                                href={createHref(href, domain, {
                                  utm_source: "Custom Domain",
                                  utm_medium: "Navbar",
                                  utm_campaign: domain,
                                  utm_content: name,
                                })}
                                target={target}
                                rel={
                                  target === "_blank" ? "noreferrer" : undefined
                                }
                                className={cn(
                                  navItemClassName,
                                  external && "gap-1",
                                )}
                                data-active={isActive}
                              >
                                {name}
                                {external ? (
                                  <ArrowUpRight2 className="size-3.5" />
                                ) : null}
                              </Link>
                            ) : (
                              <button
                                className={navItemClassName}
                                data-active={isActive}
                              >
                                {name}
                                <AnimatedChevron className="ml-1.5 size-2.5 text-neutral-700 dark:text-white/70" />
                              </button>
                            )}
                          </WithTrigger>

                          {Content && (
                            <NavigationMenuPrimitive.Content className="data-[motion=from-start]:animate-enter-from-left data-[motion=from-end]:animate-enter-from-right data-[motion=to-start]:animate-exit-to-left data-[motion=to-end]:animate-exit-to-right absolute left-0 top-0">
                              <Content domain={domain} />
                            </NavigationMenuPrimitive.Content>
                          )}
                        </NavigationMenuPrimitive.Item>
                      );
                    })}
                  </NavigationMenuPrimitive.List>

                  <div className="absolute left-1/2 top-full mt-3 -translate-x-1/2">
                    <NavigationMenuPrimitive.Viewport
                      className={cn(
                        "relative flex origin-[top_center] justify-start overflow-hidden rounded-[20px] border border-neutral-200 bg-white shadow-md dark:border-white/[0.15] dark:bg-black",
                        "data-[state=closed]:animate-scale-out-content data-[state=open]:animate-scale-in-content",
                        "h-[var(--radix-navigation-menu-viewport-height)] w-[var(--radix-navigation-menu-viewport-width)] transition-[width,height]",
                      )}
                    />
                  </div>
                </NavigationMenuPrimitive.Root>

                {!isAuthenticated ? (
                  <>
                    <div
                      className="mx-2 h-5 w-px bg-neutral-200 dark:bg-white/15"
                      aria-hidden
                    />
                    <SignInLink href={authUrls.login} />
                  </>
                ) : null}
              </div>
            </div>
          </MaxWidthWrapper>
        </div>
      </LayoutGroup>
    </NavContext.Provider>
  );
}

function AnimatedChevron(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="9"
      height="9"
      fill="none"
      viewBox="0 0 9 9"
      {...props}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M7.278 3.389 4.5 6.167 1.722 3.389"
        className="transition-transform duration-150 [transform-box:view-box] [transform-origin:center] [vector-effect:non-scaling-stroke] group-data-[state=open]/item:-scale-y-100"
      />
    </svg>
  );
}

function WithTrigger({
  trigger,
  children,
}: PropsWithChildren<{ trigger: boolean }>) {
  return trigger ? (
    <NavigationMenuPrimitive.Trigger asChild>
      {children}
    </NavigationMenuPrimitive.Trigger>
  ) : (
    children
  );
}

function SimpleNavDropdown({
  name,
  childItems,
  isActive,
}: {
  name: string;
  childItems: NavItemChildren;
  isActive: boolean;
}) {
  const [open, setOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flatItems = childItems.flatMap((item) =>
    "items" in item ? item.items : [item],
  );

  const cancelClose = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const openMenu = () => {
    cancelClose();
    setOpen(true);
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimerRef.current = setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => () => cancelClose(), []);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <div className="relative" onMouseEnter={openMenu} onMouseLeave={scheduleClose}>
        <Popover.Trigger asChild>
          <button
            className={navItemClassName}
            data-active={isActive}
            type="button"
            onPointerDown={(event) => event.preventDefault()}
          >
            {name}
            <ChevronDown
              className={cn(
                "ml-1.5 size-3.5 text-neutral-500 transition-transform duration-150 dark:text-white/70",
                open && "rotate-180",
              )}
              aria-hidden
            />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={8}
            onMouseEnter={openMenu}
            onMouseLeave={scheduleClose}
            className="z-50 min-w-[10rem] rounded-lg bg-white p-1 shadow-md outline-none animate-slide-up-fade dark:bg-neutral-950"
          >
            {flatItems.map(({ title, href }) => (
              <Link
                key={href}
                href={href}
                className="block rounded-md px-3 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-neutral-900 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white"
                onClick={() => setOpen(false)}
              >
                {title}
              </Link>
            ))}
          </Popover.Content>
        </Popover.Portal>
      </div>
    </Popover.Root>
  );
}
