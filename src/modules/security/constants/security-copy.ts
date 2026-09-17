export const SECURITY_COPY = {
  changePassword: {
    title: "Change password",
    description:
      "Use a strong password with at least 8 characters, including uppercase, lowercase, and a number.",
    success: "Your password has been updated.",
  },
  forgotPassword: {
    title: "Forgot your password?",
    description:
      "Enter the email for your NaraLabs account and we will send you a reset link.",
    success:
      "If an account exists for that email, a password reset link has been sent.",
    backToLogin: "Back to login",
  },
  resetPassword: {
    title: "Choose a new password",
    description: "Enter a new password for your NaraLabs account.",
    success: "Your password has been reset. You are now signed in.",
    invalidLink: "This reset link is invalid or has expired.",
    requestNewLink: "Request a new reset link",
  },
  securitySettings: {
    pageTitle: "Security Settings",
    changePasswordTitle: "Change password",
    changePasswordDescription:
      "Enter your current password, then choose a new one that meets the requirements below.",
  },
} as const;
