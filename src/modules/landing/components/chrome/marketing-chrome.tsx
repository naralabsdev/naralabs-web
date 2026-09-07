import { Footer } from "@/modules/landing/components/chrome/footer";

export function MarketingChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
