"use client";

import { truncateMiddle } from "@/modules/landing/components/activity/borderless-table";
import { CopyFeedbackButton } from "@/shared/ui/copy-feedback-button";

export function CopyableAddress({ value }: { value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-xs text-neutral-600">
      <span>{truncateMiddle(value, 8, 6)}</span>
      <CopyFeedbackButton
        value={value}
        label="Copy address"
        successMessage="Copied address"
        iconClassName="size-3"
      />
    </span>
  );
}
