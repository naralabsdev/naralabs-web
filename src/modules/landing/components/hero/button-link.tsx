import { type VariantProps } from "class-variance-authority";
import Link from "next/link";
import type { ComponentProps } from "react";
import { buttonVariants } from "@/shared/ui/button";
import { cn } from "@/shared/lib/cn";

export function ButtonLink({
  variant,
  className,
  ...rest
}: VariantProps<typeof buttonVariants> & ComponentProps<typeof Link>) {
  return (
    <Link
      {...rest}
      className={cn(
        "flex h-10 w-fit items-center whitespace-nowrap rounded-lg border px-5 text-base font-medium",
        buttonVariants({ variant }),
        className,
      )}
    />
  );
}
