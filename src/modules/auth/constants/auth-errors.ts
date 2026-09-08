export const AUTH_ERROR_CODES = {
  EMAIL_EXISTS: "EMAIL_EXISTS",
  EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  INVALID_TOKEN: "INVALID_TOKEN",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  RESEND_COOLDOWN: "RESEND_COOLDOWN",
} as const;

export const AUTH_ERROR_MESSAGES = {
  EMAIL_EXISTS: "An account with this email already exists.",
  EMAIL_NOT_VERIFIED: "Please verify your email before signing in.",
  INVALID_CREDENTIALS: "Invalid email or password.",
  INVALID_TOKEN: "This verification link is invalid.",
  TOKEN_EXPIRED: "This verification link has expired.",
  RESEND_COOLDOWN: "Please wait before requesting another verification email.",
} as const;

export type AuthErrorCode =
  (typeof AUTH_ERROR_CODES)[keyof typeof AUTH_ERROR_CODES];

export function resolveAuthErrorMessage(
  code?: string | null,
  message?: string | null,
  defaultMessage = "Something went wrong. Please try again.",
): string {
  if (code && code in AUTH_ERROR_MESSAGES) {
    return AUTH_ERROR_MESSAGES[code as AuthErrorCode];
  }

  const trimmed = message?.trim();
  if (trimmed && trimmed !== "Request failed") {
    return trimmed;
  }

  return defaultMessage;
}
