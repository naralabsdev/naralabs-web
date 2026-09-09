import { cn } from "@/shared/lib/cn";

export const authPageTitleClass = "text-center text-xl font-semibold";

export const authPageBodyClass = "text-base font-medium text-neutral-500";

export const authPageFooterClass =
  "mt-6 text-center text-sm font-medium text-neutral-500";

export const authPageLinkClass =
  "font-semibold text-neutral-700 transition-colors hover:text-neutral-900";

export const authFormSectionClass = "mt-8";

export const authFieldLabelClass =
  "text-content-emphasis mb-2 block text-sm font-medium leading-none";

export const authFormFieldsClass = "flex flex-col gap-y-6";

export const authFormWrapperClass = "flex flex-col gap-3 p-1";

export const authPageContainerClass = "w-full max-w-sm";

/** Top offset for login/register content */
export const authPageSpaciousOffsetClass =
  "mt-[clamp(5.25rem,21vh,10.5rem)]";

/** Gap between auth form and footer — explicit height spacer (reliable vs main mb) */
export const authPageFooterSpacerClass = "h-80 sm:h-[26rem]";

export const authPageFooterTopSpacingClass = "mt-0";

export const authInputClass = "w-full max-w-none";

export const authButtonClass = cn("auth-button h-10 w-full rounded-lg");
