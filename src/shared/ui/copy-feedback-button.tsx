"use client";

import { cn } from "@/shared/lib/cn";
import { useCopyToClipboard } from "@/shared/ui/hooks/use-copy-to-clipboard";
import { Check2, Duplicate } from "@/shared/ui/icons/nucleo";
import type { ReactNode } from "react";
import { toast } from "sonner";

type CopyFeedbackButtonProps = {
  value: string;
  label?: string;
  className?: string;
  iconClassName?: string;
  successMessage?: string;
  showToast?: boolean;
  copiedClassName?: string;
  children?: ReactNode;
};

function CopyFeedbackIcon({
  copied,
  iconClassName,
}: {
  copied: boolean;
  iconClassName: string;
}) {
  return (
    <span className="relative inline-flex items-center justify-center">
      {copied ? (
        <Check2
          key="copied"
          className={cn(iconClassName, "animate-copy-check-pop text-emerald-600")}
          aria-hidden
        />
      ) : (
        <Duplicate key="copy" className={iconClassName} aria-hidden />
      )}
    </span>
  );
}

export function CopyFeedbackButton({
  value,
  label = "Copy value",
  className,
  iconClassName = "size-3.5",
  successMessage,
  showToast = true,
  copiedClassName = "text-emerald-600",
  children,
}: CopyFeedbackButtonProps) {
  const [copied, copyToClipboard] = useCopyToClipboard();

  return (
    <button
      type="button"
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 text-neutral-400 transition-colors hover:text-neutral-700",
        copied && copiedClassName,
        className,
      )}
      aria-label={copied ? "Copied" : label}
      onClick={() => {
        void copyToClipboard(value, {
          onSuccess: showToast
            ? () => {
                toast.success(successMessage ?? "Copied to clipboard");
              }
            : undefined,
        });
      }}
    >
      <CopyFeedbackIcon copied={copied} iconClassName={iconClassName} />
      {children ? (copied ? "Copied" : children) : null}
    </button>
  );
}
