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
  authPageFooterClass,
  authPageTitleClass,
} from "@/modules/auth/styles/auth-styles";
import { AnimatedSizeContainer } from "@/shared/ui/animated-size-container";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { AuthTransitionLink } from "@/modules/auth/components/auth-transition-link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Invalid email");

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!showPassword) {
      const parsedEmail = emailSchema.safeParse(email);
      if (!parsedEmail.success) {
        toast.error(parsedEmail.error.issues[0]?.message ?? "Invalid email");
        return;
      }
      setShowPassword(true);
      return;
    }

    setIsSubmitting(true);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, callbackUrl }),
    });

    const data = (await response.json()) as {
      error?: string;
      code?: string;
      redirectTo?: string;
    };

    setIsSubmitting(false);

    if (!response.ok) {
      if (data.code === AUTH_ERROR_CODES.EMAIL_NOT_VERIFIED) {
        router.push(
          `/verify-email?email=${encodeURIComponent(email)}&pending=1&callbackUrl=${encodeURIComponent(callbackUrl)}`,
        );
        return;
      }

      toast.error(
        data.error ?? AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS,
      );
      return;
    }

    toast.success("Welcome back");
    router.push(data.redirectTo ?? callbackUrl);
    router.refresh();
  }

  return (
    <>
      <h1 className={authPageTitleClass}>Log in to your NaraLabs account</h1>

      <div className={authFormSectionClass}>
        <AnimatedSizeContainer height className="w-full">
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
                    autoFocus={!showPassword}
                    value={email}
                    className={authInputClass}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </label>

                {showPassword ? (
                  <div className={authFormFieldsClass}>
                    <label>
                      <span className={authFieldLabelClass}>Password</span>
                      <Input
                        type="password"
                        name="password"
                        autoComplete="current-password"
                        required
                        autoFocus
                        minLength={8}
                        value={password}
                        className={authInputClass}
                        onChange={(event) => setPassword(event.target.value)}
                      />
                    </label>
                  </div>
                ) : null}

                <Button
                  type="submit"
                  text={`Log in with ${showPassword ? "password" : "email"}`}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  className={authButtonClass}
                />
              </div>
            </form>
          </div>
        </AnimatedSizeContainer>
      </div>

      <p className={authPageFooterClass}>
        Don&apos;t have an account?{" "}
        <AuthTransitionLink
          href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
        >
          Sign up
        </AuthTransitionLink>
      </p>
    </>
  );
}
