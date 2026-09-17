"use client";

import { useState } from "react";
import { toast } from "sonner";

import { useSchemaWallet } from "@/modules/registry/components/schema-wallet-provider";
import type { ContractPublication } from "@/modules/registry/types";
import { Button } from "@/shared/ui/button";

type SchemaVerifyButtonProps = {
  projectId: string;
  contract: ContractPublication;
  onVerified: () => void;
};

export function SchemaVerifyButton({ projectId, contract, onVerified }: SchemaVerifyButtonProps) {
  const wallet = useSchemaWallet();
  const [loading, setLoading] = useState(false);

  async function handleVerify() {
    if (!wallet.ready) {
      toast.error("Wallet kit is still loading");
      return;
    }

    setLoading(true);
    try {
      const challengeRes = await fetch(
        `/api/registry/projects/${projectId}/verify/challenge`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contractId: contract.contractId,
            network: contract.network,
          }),
        },
      );
      const challengeData = await challengeRes.json();
      if (!challengeRes.ok) {
        throw new Error(challengeData.error ?? "Unable to start verification");
      }

      await wallet.connect();
      const { address, signature } = await wallet.signMessage(challengeData.message as string);

      const verifyRes = await fetch(`/api/registry/projects/${projectId}/verify/contract`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractId: contract.contractId,
          network: contract.network,
          wallet: address,
          signature,
          nonce: challengeData.nonce,
        }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        throw new Error(verifyData.error ?? "Verification failed");
      }

      toast.success("Contract verified");
      onVerified();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      text="Verify with wallet"
      className="h-9 rounded-lg px-4"
      loading={loading}
      disabled={!contract.canVerify || loading}
      onClick={() => void handleVerify()}
    />
  );
}
