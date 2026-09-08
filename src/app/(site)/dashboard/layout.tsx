import { redirect } from "next/navigation";

import { DashboardLayoutClient } from "@/app/(site)/dashboard/layout-client";
import { getAuthSession } from "@/modules/auth/lib/session.server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthSession();

  if (!user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  return <DashboardLayoutClient user={user}>{children}</DashboardLayoutClient>;
}
