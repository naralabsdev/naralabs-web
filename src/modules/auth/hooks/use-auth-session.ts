"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import type { AuthUser } from "@/modules/auth/lib/auth-user";

export function useAuthSession() {
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      setIsLoading(true);

      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        const data = (await response.json()) as { user?: AuthUser | null };

        if (!cancelled) {
          setUser(data.user ?? null);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadSession();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return { user, isLoading, isAuthenticated: Boolean(user) };
}
