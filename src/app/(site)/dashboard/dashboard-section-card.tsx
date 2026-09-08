import type { ComponentProps } from "react";

import { dashboardSectionCardHeaderClass } from "@/app/(site)/dashboard/constants";
import { DetailSectionCard } from "@/shared/ui/detail-section-card";
import { cn } from "@/shared/lib/cn";

export function DashboardSectionCard({
  headerClassName,
  ...props
}: ComponentProps<typeof DetailSectionCard>) {
  return (
    <DetailSectionCard
      {...props}
      headerClassName={cn(dashboardSectionCardHeaderClass, headerClassName)}
    />
  );
}
