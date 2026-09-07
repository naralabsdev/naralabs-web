import { Logo, type LogoVariant } from "./logo";

export function CompositeLogo({
  className,
  variant = "light",
}: {
  className?: string;
  variant?: LogoVariant;
}) {
  return <Logo variant={variant} className={className} />;
}
