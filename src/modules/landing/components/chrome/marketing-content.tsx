import { cn } from "@/shared/lib/cn";
import { MaxWidthWrapper } from "@/shared/ui/max-width-wrapper";
import type { ReactNode } from "react";

export const MARKETING_CONTENT_CLASS = "max-w-[1440px] px-4 sm:px-6 lg:px-10 xl:px-12";

export function MarketingContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <MaxWidthWrapper className={cn(MARKETING_CONTENT_CLASS, className)}>
      {children}
    </MaxWidthWrapper>
  );
}
