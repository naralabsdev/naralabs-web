"use client";

import { getEmailDisplayName } from "@/modules/auth/lib/auth-user";
import { cn } from "@/shared/lib";
import { ChevronDown, CircleUser } from "@/shared/ui/icons/nucleo";
import * as Popover from "@radix-ui/react-popover";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type UserMenuProps = {
  email: string;
  className?: string;
  theme?: "light" | "dark";
};

const dropdownContentClassName =
  "z-50 min-w-[11rem] rounded-lg border border-neutral-100 bg-white p-1 shadow-md outline-none animate-slide-up-fade";

const dropdownItemClassName =
  "block w-full rounded-md px-3 py-2 text-left text-sm font-medium text-neutral-500 transition-colors hover:bg-white hover:text-neutral-500";

const triggerClassNameByTheme = {
  light:
    "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-600 [&_svg]:text-current",
  dark: "text-white/90 hover:bg-white/10 hover:text-white [&_svg]:text-current",
} as const;

const chevronClassNameByTheme = {
  light: "text-neutral-400",
  dark: "text-white/70",
} as const;

export function UserMenu({ email, className, theme = "light" }: UserMenuProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const displayName = getEmailDisplayName(email);

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

  async function handleLogout() {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    setOpen(false);

    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <div
        className={cn("relative", className)}
        onMouseEnter={openMenu}
        onMouseLeave={scheduleClose}
      >
        <Popover.Trigger asChild>
          <button
            type="button"
            className={cn(
              "group/user-menu flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              triggerClassNameByTheme[theme],
            )}
            onPointerDown={(event) => event.preventDefault()}
          >
            <CircleUser
              className="size-[18px] transition-transform duration-300 group-hover/user-menu:scale-110"
              aria-hidden
            />
            <span className="max-w-[9rem] truncate">{displayName}</span>
            <ChevronDown
              className={cn(
                "size-3.5 transition-transform duration-150",
                chevronClassNameByTheme[theme],
                open && "rotate-180",
              )}
              aria-hidden
            />
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            align="end"
            sideOffset={8}
            onMouseEnter={openMenu}
            onMouseLeave={scheduleClose}
            className={dropdownContentClassName}
          >
            <Link
              href="/dashboard"
              className={dropdownItemClassName}
              onClick={() => setOpen(false)}
            >
              Account Overview
            </Link>
            <Link
              href="/dashboard/settings/profile"
              className={dropdownItemClassName}
              onClick={() => setOpen(false)}
            >
              Profile
            </Link>
            <Link
              href="/dashboard/developers"
              className={dropdownItemClassName}
              onClick={() => setOpen(false)}
            >
              API Dashboard
            </Link>
            <button
              type="button"
              className={dropdownItemClassName}
              onClick={() => void handleLogout()}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </Popover.Content>
        </Popover.Portal>
      </div>
    </Popover.Root>
  );
}
