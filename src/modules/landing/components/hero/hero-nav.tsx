"use client";

import { MARKETING_CONTENT_CLASS } from "@/modules/landing/components/chrome/marketing-content";
import { naralabsNavItems } from "@/modules/landing/components/chrome/nav-items";
import { Logo } from "@/shared/ui/logo";
import { Nav, NavMobile } from "@/shared/ui/nav";
import Link from "next/link";

function NaralabsLogoLink({ theme = "dark" }: { theme?: "dark" | "light" }) {
  return (
    <Link
      href="/"
      className={`block w-fit rounded-lg py-2 pr-2 outline-none transition-opacity focus-visible:ring-2 ${
        theme === "dark" ? "focus-visible:ring-white/30" : "focus-visible:ring-black/20"
      }`}
    >
      <Logo variant={theme} className="h-10 w-auto" />
    </Link>
  );
}

export function HeroNav({ theme = "dark" }: { theme?: "dark" | "light" }) {
  return (
    <>
      <NavMobile staticDomain="naralabs.io" navItems={naralabsNavItems} theme={theme} />
      <Nav
        staticDomain="naralabs.io"
        navItems={naralabsNavItems}
        maxWidthWrapperClassName={MARKETING_CONTENT_CLASS}
        logo={<NaralabsLogoLink theme={theme} />}
        theme={theme}
        sticky={false}
        transparent
      />
    </>
  );
}
