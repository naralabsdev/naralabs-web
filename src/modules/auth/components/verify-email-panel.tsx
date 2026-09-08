"use client";

import {
  AUTH_ERROR_CODES,
  AUTH_ERROR_MESSAGES,
} from "@/modules/auth/constants/auth-errors";
import {
  authButtonClass,
  authFieldLabelClass,
  authFormFieldsClass,
  authFormSectionClass,
  authFormWrapperClass,
  authInputClass,
  authPageBodyClass,
  authPageFooterClass,
  authPageLinkClass,
  authPageTitleClass,
} from "@/modules/auth/styles/auth-styles";
import { AnimatedSizeContainer } from "@/shared/ui/animated-size-container";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function VerifyEmailPanel() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") ?? "";
  const isPending = searchParams.get("pending") === "1";
  const linkError = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [email, setEmail] = useState(initialEmail);
  const [isResending, setIsResending] = useState(false);

  const linkErrorMessage =
    linkError === "expired"
      ? AUTH_ERROR_MESSAGES.TOKEN_EXPIRED
      : linkError === "invalid"
        ? AUTH_ERROR_MESSAGES.INVALID_TOKEN
        : null;

  async function handleResend() {
    if (!email.trim()) {
      toast.error("Enter your email before requesting a new verification link.");
      return;
    }

    setIsResending(true);

    const response = await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), callbackUrl }),
    });

    const data = (await response.json()) as {
      error?: string;
      code?: string;
      sent?: boolean;
      alreadyVerified?: boolean;
    };

    setIsResending(false);

    if (!response.ok) {
      if (data.code === AUTH_ERROR_CODES.RESEND_COOLDOWN) {
        toast.error(AUTH_ERROR_MESSAGES.RESEND_COOLDOWN);
        return;
      }

      toast.error(data.error ?? "Unable to resend verification email.");
      return;
    }

    if (data.alreadyVerified) {
      toast.success("This email is already verified. You can sign in now.");
      return;
    }

    toast.success("Verification email sent");
  }

  return (
    <>
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className={authPageTitleClass}>Check your email</h1>
        <p className={authPageBodyClass}>
          {isPending
            ? "We sent a verification link to your email. Open it to verify your account and continue."
            : "Open the verification link we sent to your email to continue."}
        </p>
      </div>

      <div className={authFormSectionClass}>
        <AnimatedSizeContainer height className="w-full">
          <div className={authFormWrapperClass}>
            <div className={authFormFieldsClass}>
              {linkErrorMessage ? (
                <p className="text-center text-sm font-medium text-neutral-500">
                  {linkErrorMessage}
                </p>
              ) : null}

              <label>
                <span className={authFieldLabelClass}>Email</span>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  className={authInputClass}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>

              <Button
                type="button"
                variant="secondary"
                text="Resend verification email"
                onClick={() => void handleResend()}
                loading={isResending}
                disabled={isResending}
                className={authButtonClass}
              />
            </div>
          </div>
        </AnimatedSizeContainer>
      </div>

      <p className={authPageFooterClass}>
        <Link href="/login" className={authPageLinkClass}>
          Back to sign in
        </Link>
      </p>
    </>
  );
}
