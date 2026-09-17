"use client";

import { useState } from "react";

import { CopyFeedbackButton } from "@/shared/ui/copy-feedback-button";
import { cn } from "@/shared/lib/cn";

export function CliCommandBlock({
  command,
  maskedCommand,
  copyValue,
  className,
}: {
  command: string;
  maskedCommand?: string;
  copyValue?: string;
  className?: string;
}) {
  const [revealed, setRevealed] = useState(false);
  const display = revealed || !maskedCommand ? command : maskedCommand;
  const copy = copyValue ?? command;

  return (
    <div className={cn("relative overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50", className)}>
      <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
        {maskedCommand ? (
          <button
            type="button"
            onClick={() => setRevealed((value) => !value)}
            className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-600 shadow-sm transition-colors hover:border-neutral-300 hover:text-neutral-900"
          >
            {revealed ? "Hide" : "Show"}
          </button>
        ) : null}
        <CopyFeedbackButton
          value={copy}
          successMessage="Copied command"
          className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-600 shadow-sm transition-colors hover:border-neutral-300 hover:text-neutral-900"
          copiedClassName="border-emerald-200 bg-emerald-50 text-emerald-700 hover:text-emerald-700"
        >
          Copy
        </CopyFeedbackButton>
      </div>

      <pre className="overflow-x-auto bg-white p-4 pr-32 font-mono text-[13px] leading-6 text-neutral-800">
        <code>{display}</code>
      </pre>
    </div>
  );
}
