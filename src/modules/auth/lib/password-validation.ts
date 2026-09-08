export const STRONG_PASSWORD_REGEX =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

export const STRONG_PASSWORD_MESSAGE =
  "Password must contain at least one number, one uppercase, and one lowercase letter";

export const PASSWORD_REQUIREMENTS = [
  {
    name: "Number",
    mobileName: "Number",
    check: (password: string) => /\d/.test(password),
  },
  {
    name: "Uppercase letter",
    mobileName: "Uppercase",
    check: (password: string) => /[A-Z]/.test(password),
  },
  {
    name: "Lowercase letter",
    mobileName: "Lowercase",
    check: (password: string) => /[a-z]/.test(password),
  },
  {
    name: "8 chars",
    check: (password: string) => password.length >= 8,
  },
] as const;

export function isStrongPassword(password: string): boolean {
  return STRONG_PASSWORD_REGEX.test(password);
}
