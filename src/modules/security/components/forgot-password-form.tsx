"use client";

import { AuthTransitionLink } from "@/modules/auth/components/auth-transition-link";
import {
  AUTH_ERROR_CODES,
  AUTH_ERROR_MESSAGES,
  resolveAuthErrorMessage,
} from "@/modules/auth/constants/auth-errors";
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
import { forgotPasswordSchema } from "@/modules/security/lib/password-form-schema";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});

    const parsed = forgotPasswordSchema.safeParse({ email });
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      const field = issue?.path[0]?.toString() ?? "email";
      setFieldErrors({ [field]: issue?.message ?? "Invalid email" });
      toast.error(issue?.message ?? "Invalid email");
      return;
    }

    setIsSubmitting(true);

    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: parsed.data.email }),
    });

    let data: { error?: string; code?: string } = {};
    try {
      data = (await response.json()) as typeof data;
    } catch {
      data = { error: "Unexpected response from server" };
    }

    setIsSubmitting(false);

    if (!response.ok) {
      if (data.code === AUTH_ERROR_CODES.RESET_COOLDOWN) {
        toast.error(AUTH_ERROR_MESSAGES.RESET_COOLDOWN);
        return;
      }

      toast.error(
        resolveAuthErrorMessage(
          data.code,
          data.error,
          "Unable to send reset email. Please try again.",
        ),
      );
      return;
    }

    setSubmitted(true);
    toast.success(SECURITY_COPY.forgotPassword.success);
  }

  if (submitted) {
    return (
      <>
        <h1 className={authPageTitleClass}>{SECURITY_COPY.forgotPassword.title}</h1>
        <p className="mt-3 text-sm text-neutral-600">{SECURITY_COPY.forgotPassword.success}</p>
        <p className={authPageFooterClass}>
          <AuthTransitionLink href="/login">{SECURITY_COPY.forgotPassword.backToLogin}</AuthTransitionLink>
        </p>
      </>
    );
  }

  return (
    <>
      <h1 className={authPageTitleClass}>{SECURITY_COPY.forgotPassword.title}</h1>
      <p className="mt-3 text-sm text-neutral-600">{SECURITY_COPY.forgotPassword.description}</p>

      <div className={authFormSectionClass}>
        <div className={authFormWrapperClass}>
          <form onSubmit={handleSubmit}>
            <div className={authFormFieldsClass}>
              <label>
                <span className={authFieldLabelClass}>Email</span>
                <Input
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                  autoFocus
                  value={email}
                  error={fieldErrors.email}
                  className={authInputClass}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>

              <Button
                type="submit"
                text="Send reset link"
                loading={isSubmitting}
                disabled={isSubmitting}
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
