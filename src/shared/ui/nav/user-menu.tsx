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
              "text-neutral-700 hover:bg-neutral-900/5 hover:text-neutral-900",
              "dark:text-white/90 dark:hover:bg-white/10 dark:hover:text-white",
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
                "size-3.5 text-neutral-500 transition-transform duration-150 dark:text-white/70",
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
            className={cn(
              "z-50 min-w-[11rem] rounded-lg bg-white p-1 shadow-md outline-none animate-slide-up-fade",
              theme === "dark" && "dark border border-white/10 bg-neutral-950",
            )}
          >
            <Link
              href="/dashboard"
              className="block rounded-md px-3 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-neutral-900 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white"
              onClick={() => setOpen(false)}
            >
              Account Overview
            </Link>
            <Link
              href="/dashboard/settings/profile"
              className="block rounded-md px-3 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-neutral-900 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white"
              onClick={() => setOpen(false)}
            >
              Profile
            </Link>
            <Link
              href="/dashboard/developers"
              className="block rounded-md px-3 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-neutral-900 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white"
              onClick={() => setOpen(false)}
            >
              API Dashboard
            </Link>
            <button
              type="button"
              className="block w-full rounded-md px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-500/10 dark:hover:text-red-300"
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
