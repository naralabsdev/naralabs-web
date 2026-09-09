import { Suspense } from "react";

import { AuthPageShell } from "@/modules/auth/components/auth-page-shell";
import { LoginForm } from "@/modules/auth/components/login-form";

export default function LoginPage() {
  return (
    <AuthPageShell spaciousLayout>
      <Suspense
        fallback={
          <div className="h-64 w-full animate-pulse rounded-xl bg-neutral-100" />
        }
      >
        <LoginForm />
      </Suspense>
    </AuthPageShell>
  );
}
