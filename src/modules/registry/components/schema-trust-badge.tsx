import { StatusBadge } from "@/shared/ui/status-badge";

export function SchemaTrustBadge({ verified }: { verified: boolean }) {
  return (
    <StatusBadge variant={verified ? "success" : "neutral"} size="sm">
      {verified ? "Verified" : "Community"}
    </StatusBadge>
  );
}
