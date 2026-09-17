"use client";

import { Command } from "cmdk";
import { useState } from "react";

import { cn } from "@/shared/lib/cn";
import { Check } from "@/shared/ui/icons";
import { ChevronDown } from "@/shared/ui/icons/nucleo";

import {
  fieldMenuContentClass,
  fieldMenuItemClass,
  fieldTriggerClass,
} from "./field-styles";
import { Popover } from "./popover";

export type SimpleSelectOption = {
  value: string;
  label: string;
};

export function SimpleSelect({
  value,
  onValueChange,
  options,
  placeholder = "Select...",
  className,
  "aria-label": ariaLabel,
}: {
  value: string;
  onValueChange: (value: string) => void;
  options: SimpleSelectOption[];
  placeholder?: string;
  className?: string;
  "aria-label"?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <Popover
      openPopover={open}
      setOpenPopover={setOpen}
      align="start"
      sideOffset={6}
      forceDropdown
      popoverContentClassName={fieldMenuContentClass}
      content={
        <Command loop>
          <Command.List className="max-h-[min(240px,50vh)] overflow-y-auto">
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <Command.Item
                  key={option.value || "__empty__"}
                  value={option.label}
                  onSelect={() => {
                    onValueChange(option.value);
                    setOpen(false);
                  }}
                  className={fieldMenuItemClass}
                >
                  <span className="min-w-0 flex-1 truncate">{option.label}</span>
                  {isSelected ? (
                    <Check className="size-4 shrink-0 text-neutral-500" aria-hidden />
                  ) : null}
                </Command.Item>
              );
            })}
          </Command.List>
        </Command>
      }
    >
      <button
        type="button"
        aria-label={ariaLabel}
        data-state={open ? "open" : "closed"}
        className={cn(fieldTriggerClass, "flex w-full items-center gap-2", className)}
      >
        <span
          className={cn(
            "min-w-0 flex-1 truncate text-left",
            !selected && "text-neutral-400",
          )}
        >
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-neutral-400 transition-transform duration-150 ease-out",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>
    </Popover>
  );
}
