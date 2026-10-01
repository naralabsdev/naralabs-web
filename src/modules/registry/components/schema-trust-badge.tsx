import { StatusBadge } from "@/shared/ui/status-badge";

const PLACEHOLDER_WALLET = "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF";

export function SchemaTrustBadge({
  verified,
  verifiedWallet,
}: {
  verified: boolean;
  verifiedWallet?: string | null;
}) {
  const operatorReviewed =
    verified && (!verifiedWallet || verifiedWallet === PLACEHOLDER_WALLET);

  return (
    <StatusBadge variant={verified ? "success" : "neutral"} size="sm">
      {verified ? (operatorReviewed ? "Reviewed" : "Verified") : "Community"}
    </StatusBadge>
  );
}
