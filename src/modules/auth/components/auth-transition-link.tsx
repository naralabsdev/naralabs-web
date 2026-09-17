"use client";

import { cn } from "@/shared/lib";
import { useAuthPageTransition } from "@/modules/auth/components/auth-page-transition";
import { authPageLinkClass } from "@/modules/auth/styles/auth-styles";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type AuthTransitionLinkProps = {
  href: ComponentProps<typeof Link>["href"];
  className?: string;
  children: ReactNode;
};

export function AuthTransitionLink({
  href,
  className,
  children,
}: AuthTransitionLinkProps) {
  const { navigateWithFade, isExiting } = useAuthPageTransition();

  return (
    <Link
      href={href}
      className={cn(authPageLinkClass, className)}
      aria-disabled={isExiting}
      onClick={(event) => {
        event.preventDefault();
        navigateWithFade(typeof href === "string" ? href : href.toString());
      }}
    >
      {children}
    </Link>
  );
}
