export function getSafePostAuthRedirect(
  callbackUrl?: string | null,
  fallback = "/",
): string {
  if (
    !callbackUrl ||
    !callbackUrl.startsWith("/") ||
    callbackUrl.startsWith("//")
  ) {
    return fallback;
  }

  return callbackUrl;
}
