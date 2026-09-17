export async function logout(redirectTo = "/"): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
  window.location.assign(redirectTo);
}
