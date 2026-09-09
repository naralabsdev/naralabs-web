import { Suspense } from "react";

import { AuthPageShell } from "@/modules/auth/components/auth-page-shell";
import { RegisterForm } from "@/modules/auth/components/register-form";

export default function RegisterPage() {
  return (
    <AuthPageShell spaciousLayout>
      <Suspense
        fallback={
          <div className="h-64 w-full animate-pulse rounded-xl bg-neutral-100" />
        }
      >
        <RegisterForm />
      </Suspense>
    </AuthPageShell>
  );
}
