import { isDevelopment } from "@/shared/config/public-env";
import Image from "next/image";
import { cn } from "@/shared/lib/cn";

const LOGO_HEIGHT = 32;

const LOGO_ASSETS = {
  /** Light-colored logo for dark backgrounds */
  dark: {
    src: "/logo-dark.png",
    width: Math.round((LOGO_HEIGHT * 2877) / 900),
    height: LOGO_HEIGHT,
  },
  /** Dark-colored logo for light backgrounds */
  light: {
    src: "/logo-light.png",
    width: Math.round((LOGO_HEIGHT * 2856) / 853),
    height: LOGO_HEIGHT,
  },
} as const;

export type LogoVariant = keyof typeof LOGO_ASSETS;

export function Logo({
  variant = "light",
  className,
  ...props
}: Omit<React.ComponentPropsWithoutRef<typeof Image>, "src" | "alt" | "width" | "height"> & {
  variant?: LogoVariant;
}) {
  const logo = LOGO_ASSETS[variant];

  return (
    <Image
      src={logo.src}
      alt="Naralabs"
      width={logo.width}
      height={logo.height}
      unoptimized={isDevelopment}
      className={cn("h-8 w-auto object-contain", className)}
      {...props}
    />
  );
}
