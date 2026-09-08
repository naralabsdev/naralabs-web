export type AuthUser = {
  id: string;
  email: string;
  emailVerified: boolean;
};

export function getEmailDisplayName(email: string): string {
  const trimmed = email.trim();
  const atIndex = trimmed.indexOf("@");
  if (atIndex <= 0) {
    return trimmed;
  }

  return trimmed.slice(0, atIndex);
}
