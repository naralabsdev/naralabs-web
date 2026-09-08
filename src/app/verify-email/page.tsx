import { Suspense } from "react";

import { AuthPageShell } from "@/modules/auth/components/auth-page-shell";
import { VerifyEmailPanel } from "@/modules/auth/components/verify-email-panel";

export default function VerifyEmailPage() {
  return (
    <AuthPageShell>
      <Suspense
        fallback={
          <div className="h-64 w-full animate-pulse rounded-xl bg-neutral-100" />
        }
      >
        <VerifyEmailPanel />
      </Suspense>
    </AuthPageShell>
  );
}
