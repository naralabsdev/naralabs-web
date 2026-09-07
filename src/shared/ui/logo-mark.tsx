import { Logo, type LogoVariant } from "./logo";

export function LogoMark({
  className,
  variant = "light",
}: {
  className?: string;
  variant?: LogoVariant;
}) {
  return <Logo variant={variant} className={className} />;
}
