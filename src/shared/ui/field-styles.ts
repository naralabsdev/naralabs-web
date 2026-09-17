import { cn } from "@/shared/lib/cn";

export const fieldInputClass = cn(
  "rounded-lg border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400",
  "transition-[border-color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
  "hover:border-neutral-300",
  "focus:border-neutral-300 focus:outline-none focus:ring-4 focus:ring-neutral-100",
  "read-only:bg-neutral-50 read-only:text-neutral-500",
  "sm:text-sm",
);

export const fieldTriggerClass = cn(
  "h-9 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900",
  "transition-[border-color,box-shadow,transform] duration-150 ease-out motion-reduce:transition-none",
  "hover:border-neutral-300",
  "focus-visible:border-neutral-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neutral-100",
  "data-[state=open]:border-neutral-300 data-[state=open]:ring-4 data-[state=open]:ring-neutral-100",
  "active:scale-[0.99] motion-reduce:active:scale-100",
);

export const fieldMenuItemClass = cn(
  "flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-neutral-700",
  "outline-none transition-colors duration-100 ease-out",
  "data-[selected=true]:bg-neutral-50 data-[selected=true]:text-neutral-900",
);

export const fieldMenuContentClass =
  "w-[var(--radix-popover-trigger-width)] border-neutral-200 p-1 shadow-[0_8px_30px_rgba(0,0,0,0.08)]";
