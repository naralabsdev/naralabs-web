"use client";

import {
  AUTH_ERROR_CODES,
  AUTH_ERROR_MESSAGES,
  resolveAuthErrorMessage,
} from "@/modules/auth/constants/auth-errors";
import { PasswordRequirements } from "@/modules/auth/components/password-requirements";
import { isStrongPassword } from "@/modules/auth/lib/password-validation";
import { changePasswordSchema } from "@/modules/security/lib/password-form-schema";
import { SECURITY_COPY } from "@/modules/security/constants/security-copy";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});

    const parsed = changePasswordSchema.safeParse({
      currentPassword,
      newPassword,
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

    const response = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: parsed.data.currentPassword,
        newPassword: parsed.data.newPassword,
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
      if (data.code === AUTH_ERROR_CODES.INVALID_CREDENTIALS) {
        setFieldErrors({ currentPassword: AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS });
      }

      toast.error(
        resolveAuthErrorMessage(
          data.code,
          data.error,
          "Unable to update password. Please try again.",
        ),
      );
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    toast.success(SECURITY_COPY.changePassword.success);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
      <label>
        <span className="mb-1.5 block text-sm font-medium text-neutral-900">
          Current password
        </span>
        <Input
          type="password"
          name="currentPassword"
          autoComplete="current-password"
          required
          value={currentPassword}
          error={fieldErrors.currentPassword}
          className="w-full max-w-none"
          onChange={(event) => setCurrentPassword(event.target.value)}
        />
      </label>

      <label>
        <span className="mb-1.5 block text-sm font-medium text-neutral-900">
          New password
        </span>
        <Input
          type="password"
          name="newPassword"
          autoComplete="new-password"
          required
          minLength={8}
          value={newPassword}
          error={fieldErrors.newPassword}
          className="w-full max-w-none"
          onChange={(event) => setNewPassword(event.target.value)}
        />
        <PasswordRequirements
          password={newPassword}
          hasError={Boolean(fieldErrors.newPassword)}
        />
      </label>

      <label>
        <span className="mb-1.5 block text-sm font-medium text-neutral-900">
          Confirm new password
        </span>
        <Input
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          required
          minLength={8}
          value={confirmPassword}
          error={fieldErrors.confirmPassword}
          className="w-full max-w-none"
          onChange={(event) => setConfirmPassword(event.target.value)}
        />
      </label>

      <Button
        type="submit"
        text="Update password"
        loading={isSubmitting}
        disabled={
          isSubmitting ||
          !isStrongPassword(newPassword) ||
          newPassword !== confirmPassword ||
          confirmPassword.length === 0 ||
          currentPassword.length === 0
        }
        className="h-10 w-full max-w-xs rounded-lg"
      />
    </form>
  );
}
