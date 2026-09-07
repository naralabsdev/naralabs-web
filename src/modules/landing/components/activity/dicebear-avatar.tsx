import { cn } from "@/shared/lib/cn";

export type DicebearAvatarStyle = "waves" | "triangles";

function getDicebearAvatarUrl(seed: string, style: DicebearAvatarStyle) {
  const params = new URLSearchParams({
    seed,
    size: "56",
    borderRadius: "50",
  });

  return `https://api.dicebear.com/10.x/${style}/svg?${params.toString()}`;
}

export function DicebearAvatar({
  seed,
  style = "waves",
  className,
}: {
  seed: string;
  style?: DicebearAvatarStyle;
  className?: string;
}) {
  return (
    <img
      src={getDicebearAvatarUrl(seed, style)}
      alt=""
      className={cn("size-7 shrink-0 rounded-full", className)}
      draggable={false}
    />
  );
}
