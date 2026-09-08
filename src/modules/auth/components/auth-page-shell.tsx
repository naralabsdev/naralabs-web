import { Footer } from "@/modules/landing/components/chrome/footer";
import { HeroNav } from "@/modules/landing/components/hero/hero-nav";
import { inter, satoshi } from "@/modules/landing/fonts";
import "@/modules/landing/styles/marketing.css";
import { AuthPageTransitionProvider } from "@/modules/auth/components/auth-page-transition";
import { authPageContainerClass } from "@/modules/auth/styles/auth-styles";
import { cn } from "@/shared/lib/cn";

export function AuthPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        satoshi.variable,
        inter.variable,
        "marketing-theme font-default flex min-h-screen flex-col bg-white",
      )}
    >
      <header className="border-b border-neutral-200/80 bg-white">
        <HeroNav theme="light" />
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <AuthPageTransitionProvider>
          <div className={authPageContainerClass}>{children}</div>
        </AuthPageTransitionProvider>
      </main>

      <Footer />
    </div>
  );
}
