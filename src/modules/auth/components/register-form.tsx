"use client";

import { AuthTransitionLink } from "@/modules/auth/components/auth-transition-link";
import Link from "next/link";

import {
  AUTH_ERROR_CODES,
  AUTH_ERROR_MESSAGES,
} from "@/modules/auth/constants/auth-errors";
import { PasswordRequirements } from "@/modules/auth/components/password-requirements";
import {
  isStrongPassword,
  STRONG_PASSWORD_MESSAGE,
} from "@/modules/auth/lib/password-validation";
import {
  authButtonClass,
  authFieldLabelClass,
  authFormFieldsClass,
  authFormSectionClass,
  authFormWrapperClass,
  authInputClass,
  authPageFooterClass,
  authPageLinkClass,
  authPageTitleClass,
} from "@/modules/auth/styles/auth-styles";
import { AnimatedSizeContainer } from "@/shared/ui/animated-size-container";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Input } from "@/shared/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Invalid email");

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
    STRONG_PASSWORD_MESSAGE,
  );

const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    acceptedTerms: z.boolean().refine((value) => value, {
      message: "You must accept the Terms of Service and Privacy Policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});

    if (!showPasswordFields) {
      const parsedEmail = emailSchema.safeParse(email);
      if (!parsedEmail.success) {
        const message =
          parsedEmail.error.issues[0]?.message ?? "Invalid email";
        setFieldErrors({ email: message });
        toast.error(message);
        return;
      }
      setShowPasswordFields(true);
      return;
    }

    const parsed = registerSchema.safeParse({
      email,
      password,
      confirmPassword,
      acceptedTerms,
    });

    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      const field = issue?.path[0]?.toString() ?? "form";
      setFieldErrors({ [field]: issue?.message ?? "Invalid form data" });
      toast.error(issue?.message ?? "Invalid form data");
      return;
    }

    setIsSubmitting(true);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: parsed.data.email,
        password: parsed.data.password,
        callbackUrl,
      }),
    });

    let data: { error?: string; code?: string } = {};
    try {
      data = (await response.json()) as typeof data;
    } catch {
      data = { error: "Unexpected response from server" };
    }

    setIsSubmitting(false);

    if (!response.ok) {
      if (
        response.status === 404 ||
        response.status === 502 ||
        response.status === 503
      ) {
        toast.error(
          "Registration service unavailable. Restart Atlas server (docker compose up -d --build server).",
        );
        return;
      }

      if (data.code === AUTH_ERROR_CODES.EMAIL_EXISTS) {
        toast.error(AUTH_ERROR_MESSAGES.EMAIL_EXISTS);
        return;
      }

      toast.error(data.error ?? "Unable to create account. Please try again.");
      return;
    }

    toast.success("Check your email to verify your account");
    router.push(
      `/verify-email?email=${encodeURIComponent(parsed.data.email)}&pending=1&callbackUrl=${encodeURIComponent(callbackUrl)}`,
    );
  }

  return (
    <>
      <h1 className={authPageTitleClass}>Create your NaraLabs account</h1>

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
                    autoFocus={!showPasswordFields}
                    value={email}
                    error={fieldErrors.email}
                    className={authInputClass}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </label>

                {showPasswordFields ? (
                  <div className={authFormFieldsClass}>
                    <label>
                      <span className={authFieldLabelClass}>Password</span>
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
                      <span className={authFieldLabelClass}>
                        Confirm password
                      </span>
                      <Input
                        type="password"
                        name="confirmPassword"
                        autoComplete="new-password"
                        required
                        minLength={8}
                        value={confirmPassword}
                        error={fieldErrors.confirmPassword}
                        className={authInputClass}
                        onChange={(event) =>
                          setConfirmPassword(event.target.value)
                        }
                      />
                    </label>

                    <label className="flex items-start gap-3">
                      <Checkbox
                        checked={acceptedTerms}
                        onCheckedChange={(checked) =>
                          setAcceptedTerms(checked === true)
                        }
                        className="mt-0.5"
                        aria-describedby="register-terms-copy"
                      />
                      <span
                        id="register-terms-copy"
                        className="text-sm leading-5 text-neutral-600"
                      >
                        I agree to NaraLabs&apos;s{" "}
                        <Link href="/terms" className={authPageLinkClass}>
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className={authPageLinkClass}>
                          Privacy Policy
                        </Link>
                      </span>
                    </label>
                    {fieldErrors.acceptedTerms ? (
                      <p className="text-sm text-red-600">
                        {fieldErrors.acceptedTerms}
                      </p>
                    ) : null}
                  </div>
                ) : null}

                <Button
                  type="submit"
                  text={isSubmitting ? "Submitting..." : "Sign up"}
                  loading={isSubmitting}
                  disabled={
                    isSubmitting ||
                    (showPasswordFields &&
                      (!acceptedTerms ||
                        !isStrongPassword(password) ||
                        password !== confirmPassword ||
                        confirmPassword.length === 0))
                  }
                  className={authButtonClass}
                />
              </div>
            </form>
          </div>
        </AnimatedSizeContainer>
      </div>

      <p className={authPageFooterClass}>
        Already have an account?{" "}
        <AuthTransitionLink
          href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
        >
          Log in
        </AuthTransitionLink>
      </p>
    </>
  );
}
