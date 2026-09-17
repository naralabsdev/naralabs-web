"use client";

import { AuthTransitionLink } from "@/modules/auth/components/auth-transition-link";
import { PasswordRequirements } from "@/modules/auth/components/password-requirements";
import {
  AUTH_ERROR_CODES,
  AUTH_ERROR_MESSAGES,
  resolveAuthErrorMessage,
} from "@/modules/auth/constants/auth-errors";
import { isStrongPassword } from "@/modules/auth/lib/password-validation";
import {
  authButtonClass,
  authFieldLabelClass,
  authFormFieldsClass,
  authFormSectionClass,
  authFormWrapperClass,
  authInputClass,
  authPageFooterClass,
  authPageTitleClass,
} from "@/modules/auth/styles/auth-styles";
import { SECURITY_COPY } from "@/modules/security/constants/security-copy";
import { resetPasswordSchema } from "@/modules/security/lib/password-form-schema";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invalidToken, setInvalidToken] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});

    const parsed = resetPasswordSchema.safeParse({
      password,
      confirmPassword,
    });

    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      const field = issue?.path[0]?.toString() ?? "form";
      setFieldErrors({ [field]: issue?.message ?? "Invalid form data" });
      toast.error(issue?.message ?? "Invalid form data");
      return;
    }

    setIsSubmitting(true);

    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        password: parsed.data.password,
      }),
    });

    let data: { error?: string; code?: string; redirectTo?: string } = {};
    try {
      data = (await response.json()) as typeof data;
    } catch {
      data = { error: "Unexpected response from server" };
    }

    setIsSubmitting(false);

    if (!response.ok) {
      if (
        data.code === AUTH_ERROR_CODES.INVALID_TOKEN ||
        data.code === AUTH_ERROR_CODES.TOKEN_EXPIRED
      ) {
        setInvalidToken(true);
        toast.error(
          data.code === AUTH_ERROR_CODES.TOKEN_EXPIRED
            ? AUTH_ERROR_MESSAGES.TOKEN_EXPIRED
            : AUTH_ERROR_MESSAGES.INVALID_TOKEN,
        );
        return;
      }

      toast.error(
        resolveAuthErrorMessage(
          data.code,
          data.error,
          "Unable to reset password. Please try again.",
        ),
      );
      return;
    }

    toast.success(SECURITY_COPY.resetPassword.success);
    router.push(data.redirectTo ?? "/dashboard");
    router.refresh();
  }

  if (!token.trim()) {
    return (
      <>
        <h1 className={authPageTitleClass}>{SECURITY_COPY.resetPassword.title}</h1>
        <p className="mt-3 text-sm text-red-600">{SECURITY_COPY.resetPassword.invalidLink}</p>
        <p className={authPageFooterClass}>
          <AuthTransitionLink href="/forgot-password">
            {SECURITY_COPY.resetPassword.requestNewLink}
          </AuthTransitionLink>
        </p>
      </>
    );
  }

  if (invalidToken) {
    return (
      <>
        <h1 className={authPageTitleClass}>{SECURITY_COPY.resetPassword.title}</h1>
        <p className="mt-3 text-sm text-red-600">{SECURITY_COPY.resetPassword.invalidLink}</p>
        <p className={authPageFooterClass}>
          <AuthTransitionLink href="/forgot-password">
            {SECURITY_COPY.resetPassword.requestNewLink}
          </AuthTransitionLink>
        </p>
      </>
    );
  }

  return (
    <>
      <h1 className={authPageTitleClass}>{SECURITY_COPY.resetPassword.title}</h1>
      <p className="mt-3 text-sm text-neutral-600">{SECURITY_COPY.resetPassword.description}</p>

      <div className={authFormSectionClass}>
        <div className={authFormWrapperClass}>
          <form onSubmit={handleSubmit}>
            <div className={authFormFieldsClass}>
              <label>
                <span className={authFieldLabelClass}>New password</span>
                <Input
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  required
                  autoFocus
                  minLength={8}
                  value={password}
                  error={fieldErrors.password}
                  className={authInputClass}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <PasswordRequirements
                  password={password}
                  hasError={Boolean(fieldErrors.password)}
                />
              </label>

              <label>
                <span className={authFieldLabelClass}>Confirm password</span>
                <Input
                  type="password"
                  name="confirmPassword"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  error={fieldErrors.confirmPassword}
                  className={authInputClass}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
              </label>

              <Button
                type="submit"
                text="Reset password"
                loading={isSubmitting}
                disabled={
                  isSubmitting ||
                  !isStrongPassword(password) ||
                  password !== confirmPassword ||
                  confirmPassword.length === 0
                }
                className={authButtonClass}
              />
            </div>
          </form>
        </div>
      </div>

      <p className={authPageFooterClass}>
        <AuthTransitionLink href="/login">{SECURITY_COPY.forgotPassword.backToLogin}</AuthTransitionLink>
      </p>
    </>
  );
}
