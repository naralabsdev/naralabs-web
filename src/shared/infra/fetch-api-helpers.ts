export function checkEnv(): string | null {
  if (!process.env.ATLAS_API_URL && process.env.NODE_ENV === "production") {
    return "ATLAS_API_URL is not defined";
  }
  return null;
}

export function jsonResponse(data: unknown, status = 200): Response {
  return Response.json(data, {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function errorResponse({
  status = 500,
  message = "Internal server error",
}: {
  status?: number;
  message?: string;
} = {}): Response {
  return jsonResponse({ error: message }, status);
}
