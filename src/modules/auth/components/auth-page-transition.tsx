"use client";

import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

import {
  PAGE_EXIT_DURATION_MS,
  WhiteFadeOverlay,
} from "@/shared/ui/transitions/white-fade-overlay";

type AuthPageTransitionContextValue = {
  navigateWithFade: (href: string) => void;
  isExiting: boolean;
};

const AuthPageTransitionContext =
  createContext<AuthPageTransitionContextValue | null>(null);

export function AuthPageTransitionProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);

  const navigateWithFade = useCallback(
    (href: string) => {
      if (isExiting) {
        return;
      }

      setIsExiting(true);

      window.setTimeout(() => {
        router.push(href);
        setIsExiting(false);
      }, PAGE_EXIT_DURATION_MS);
    },
    [isExiting, router],
  );

  return (
    <AuthPageTransitionContext.Provider value={{ navigateWithFade, isExiting }}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: isExiting ? 0 : 1,
          y: isExiting ? -6 : 0,
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
      <WhiteFadeOverlay visible={isExiting} zIndex={70} />
    </AuthPageTransitionContext.Provider>
  );
}

export function useAuthPageTransition() {
  const context = useContext(AuthPageTransitionContext);

  if (!context) {
    throw new Error(
      "useAuthPageTransition must be used within AuthPageTransitionProvider",
    );
  }

  return context;
}
