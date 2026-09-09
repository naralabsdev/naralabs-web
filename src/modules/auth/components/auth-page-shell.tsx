import { Footer } from "@/modules/landing/components/chrome/footer";
import { HeroNav } from "@/modules/landing/components/hero/hero-nav";
import { inter, satoshi } from "@/modules/landing/fonts";
import "@/modules/landing/styles/marketing.css";
import { AuthPageTransitionProvider } from "@/modules/auth/components/auth-page-transition";
import { authPageContainerClass, authPageFooterSpacerClass, authPageFooterTopSpacingClass, authPageSpaciousOffsetClass } from "@/modules/auth/styles/auth-styles";
import { cn } from "@/shared/lib/cn";

export function AuthPageShell({ children, spaciousLayout = false }: { children: React.ReactNode; spaciousLayout?: boolean }) {
  return (
    <div className={cn(satoshi.variable, inter.variable, "marketing-theme font-default flex flex-col bg-white", !spaciousLayout && "min-h-screen")}>
      <header className="border-b border-neutral-200/80 bg-white">
        <HeroNav theme="light" />
      </header>

      <main className={cn("flex w-full flex-col items-center px-4", !spaciousLayout && "flex-1 justify-center py-12")}>
        <AuthPageTransitionProvider>
          <div className={cn(authPageContainerClass, spaciousLayout && authPageSpaciousOffsetClass)}>{children}</div>
        </AuthPageTransitionProvider>
      </main>

      {spaciousLayout ? <div className={cn("w-full shrink-0", authPageFooterSpacerClass)} aria-hidden /> : null}

      <Footer className={spaciousLayout ? authPageFooterTopSpacingClass : undefined} />
    </div>
  );
}
