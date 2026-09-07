"use client";

import { cn } from "@/shared/lib";
import * as Popover from "@radix-ui/react-popover";
import { Crosshairs3, GridPlus, Window } from "@/shared/ui/icons/nucleo";
import { useParams } from "next/navigation";
import { MouseEvent, useCallback, useContext, useState } from "react";
import { toast } from "sonner";
import { Button, ButtonProps } from "./button";
import { useCopyToClipboard } from "./hooks";
import { Logo, type LogoVariant } from "./logo";
import { NavContext } from "./nav";

/**
 * Naralabs logo with a custom context menu for copying/navigation,
 * for use in the top site nav
 */
export function NavWordmark({
  variant = "full",
  isInApp,
  className,
}: {
  variant?: "full" | "symbol";
  isInApp?: boolean;
  className?: string;
}) {
  const { domain = "dub.co" } = useParams() as { domain: string };

  const { theme } = useContext(NavContext);
  const logoVariant: LogoVariant = theme === "dark" ? "dark" : "light";

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleContextMenu = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsPopoverOpen(true);
  }, []);

  const [, copyToClipboard] = useCopyToClipboard();

  function copy(text: string) {
    toast.promise(copyToClipboard(text), {
      success: "Copied to clipboard!",
      error: "Failed to copy to clipboard",
    });
  }

  function copyLogoAsset(path: string) {
    copy(`${window.location.origin}${path}`);
  }

  return (
    <Popover.Root open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <Popover.Anchor asChild>
        <div onContextMenu={handleContextMenu} className="max-w-fit">
          <Logo
            variant={logoVariant}
            className={cn(
              variant === "symbol" ? "h-8 w-8" : "h-8 w-auto",
              "transition-all duration-75 active:scale-95",
              className,
            )}
          />
        </div>
      </Popover.Anchor>
      <Popover.Portal>
        <Popover.Content
          sideOffset={14}
          align="start"
          className={cn(
            "z-50 -mt-1.5",
            !isInApp && "-translate-x-8",
            theme === "dark" && "dark",
          )}
          onClick={(e) => {
            e.stopPropagation();
            setIsPopoverOpen(false);
          }}
        >
          <div className="grid gap-1 rounded-lg border border-neutral-200 bg-white p-2 drop-shadow-sm sm:min-w-[240px] dark:border-white/[0.15] dark:bg-black">
            <ContextMenuButton
              text="Copy dark logo URL"
              variant="outline"
              onClick={() => copyLogoAsset("/logo-dark.png")}
              icon={<Logo variant="dark" className="h-4 w-4" />}
            />
            <ContextMenuButton
              text="Copy light logo URL"
              variant="outline"
              onClick={() => copyLogoAsset("/logo-light.png")}
              icon={<Logo variant="light" className="h-4 w-4" />}
            />
            <ContextMenuButton
              text="Brand Guidelines"
              variant="outline"
              onClick={() => window.open("https://dub.co/brand", "_blank")}
              icon={<Crosshairs3 className="h-4 w-4" />}
            />
            {isInApp || domain != "dub.co" ? (
              <ContextMenuButton
                text="Home Page"
                variant="outline"
                onClick={() =>
                  window.open(
                    `https://dub.co${isInApp ? "/home" : ""}`,
                    "_blank",
                  )
                }
                icon={<Window className="h-4 w-4" />}
              />
            ) : (
              <ContextMenuButton
                text="Dashboard"
                variant="outline"
                onClick={() => window.open("https://app.dub.co", "_blank")}
                icon={<GridPlus className="h-4 w-4" />}
              />
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function ContextMenuButton({ className, ...rest }: ButtonProps) {
  return (
    <Button
      className={cn(
        "h-9 justify-start px-3 font-medium hover:text-neutral-700 dark:text-white/70 dark:hover:bg-white/[0.15] dark:hover:text-white",
        className,
      )}
      {...rest}
    />
  );
}
