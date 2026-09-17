import {
  STRONG_PASSWORD_MESSAGE,
  STRONG_PASSWORD_REGEX,
} from "@/modules/auth/lib/password-validation";
import { z } from "zod";

export const emailFieldSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Invalid email");

export const newPasswordFieldSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(STRONG_PASSWORD_REGEX, STRONG_PASSWORD_MESSAGE);

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: newPasswordFieldSchema,
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: emailFieldSchema,
});

export const resetPasswordSchema = z
  .object({
    password: newPasswordFieldSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
