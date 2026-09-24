import { type VariantProps } from "class-variance-authority";
import Link from "next/link";
import type { ComponentProps } from "react";
import { buttonVariants } from "@/shared/ui/button";
import { cn } from "@/shared/lib/cn";

export function ButtonLink({
  variant = "primary",
  className,
  ...rest
}: VariantProps<typeof buttonVariants> & ComponentProps<typeof Link>) {
  return (
    <Link
      {...rest}
      data-naralabs-variant={variant ?? "primary"}
      className={cn(
        "flex h-10 w-fit items-center whitespace-nowrap rounded-lg border px-5 text-base font-medium opacity-100",
        buttonVariants({ variant }),
        className,
      )}
    />
  );
}
