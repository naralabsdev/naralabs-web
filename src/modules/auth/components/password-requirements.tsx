"use client";

import { memo } from "react";

import { cn } from "@/shared/lib/cn";
import { CircleCheck } from "@/shared/ui/icons/nucleo/circle-check";

const REQUIREMENTS: {
  name: string;
  mobileName?: string;
  check: (password: string) => boolean;
}[] = [
  {
    name: "Number",
    check: (password) => /\d/.test(password),
  },
  {
    name: "Uppercase letter",
    mobileName: "Uppercase",
    check: (password) => /[A-Z]/.test(password),
  },
  {
    name: "Lowercase letter",
    mobileName: "Lowercase",
    check: (password) => /[a-z]/.test(password),
  },
  {
    name: "8 chars",
    check: (password) => password.length >= 8,
  },
];

export const PasswordRequirements = memo(function PasswordRequirements({
  password = "",
  hasError = false,
  className,
}: {
  password?: string;
  hasError?: boolean;
  className?: string;
}) {
  return (
    <ul className={cn("mt-2 flex flex-wrap items-center gap-3", className)}>
      {REQUIREMENTS.map(({ name, mobileName, check }) => {
        const checked = password.length > 0 && check(password);

        return (
          <li
            key={name}
            className={cn(
              "flex items-center gap-1 text-xs text-neutral-400 transition-colors",
              checked ? "text-green-600" : hasError && "text-red-600",
            )}
          >
            <CircleCheck
              variant="fill"
              className={cn(
                "size-2.5 shrink-0 transition-opacity",
                checked
                  ? "animate-scale-in text-green-600 [--from-scale:1] [--to-scale:1.2] [animation-direction:alternate] [animation-duration:150ms] [animation-iteration-count:2] [animation-timing-function:ease-in-out]"
                  : hasError
                    ? "text-red-600"
                    : "text-neutral-200",
              )}
            />
            {mobileName ? (
              <>
                <span className="max-[420px]:hidden">{name}</span>
                <span className="hidden max-[420px]:inline">{mobileName}</span>
              </>
            ) : (
              <span>{name}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
});
