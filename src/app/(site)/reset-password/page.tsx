import { Suspense } from "react";

import { AuthPageShell } from "@/modules/auth/components/auth-page-shell";
import { ResetPasswordForm } from "@/modules/security/components/reset-password-form";

type PageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const { token = "" } = await searchParams;

  return (
    <AuthPageShell spaciousLayout>
      <Suspense
        fallback={
          <div className="h-64 w-full animate-pulse rounded-xl bg-neutral-100" />
        }
      >
        <ResetPasswordForm token={token} />
      </Suspense>
    </AuthPageShell>
  );
}
