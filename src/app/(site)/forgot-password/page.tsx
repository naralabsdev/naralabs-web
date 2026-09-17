import { Suspense } from "react";

import { AuthPageShell } from "@/modules/auth/components/auth-page-shell";
import { ForgotPasswordForm } from "@/modules/security/components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthPageShell spaciousLayout>
      <Suspense
        fallback={
          <div className="h-64 w-full animate-pulse rounded-xl bg-neutral-100" />
        }
      >
        <ForgotPasswordForm />
      </Suspense>
    </AuthPageShell>
  );
}
