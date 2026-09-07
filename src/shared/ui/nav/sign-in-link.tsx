"use client";

import { CircleUser } from "@/shared/ui/icons/nucleo";
import { cn } from "@/shared/lib";
import Link from "next/link";

export function SignInLink({
  href,
  className,
}: {
  href: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group/sign-in flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        "text-neutral-700 hover:bg-neutral-900/5 hover:text-neutral-900",
        "dark:text-white/90 dark:hover:bg-white/10 dark:hover:text-white",
        className,
      )}
    >
      <CircleUser
        className="size-[18px] transition-transform duration-300 group-hover/sign-in:scale-110"
        aria-hidden
      />
      Sign In
    </Link>
  );
}
