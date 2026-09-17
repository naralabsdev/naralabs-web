"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  allowAllModules,
  StellarWalletsKit,
  WalletNetwork,
} from "@creit.tech/stellar-wallets-kit";
import { Networks } from "@stellar/stellar-sdk";

import { publicEnv } from "@/shared/config/public-env";

type SchemaWalletContextValue = {
  ready: boolean;
  connect: () => Promise<string>;
  signMessage: (message: string) => Promise<{ address: string; signature: string }>;
};

const SchemaWalletContext = createContext<SchemaWalletContextValue | null>(null);

function resolveWalletNetwork(): WalletNetwork {
  const network = publicEnv.stellarNetwork?.toLowerCase() ?? "testnet";
  if (network === "mainnet" || network === "public") {
    return WalletNetwork.PUBLIC;
  }
  if (network === "futurenet") {
    return WalletNetwork.FUTURENET;
  }
  return WalletNetwork.TESTNET;
}

function resolveNetworkPassphrase(): string {
  const network = publicEnv.stellarNetwork?.toLowerCase() ?? "testnet";
  if (network === "mainnet" || network === "public") {
    return Networks.PUBLIC;
  }
  if (network === "futurenet") {
    return Networks.FUTURENET;
  }
  return Networks.TESTNET;
}

export function SchemaWalletProvider({ children }: { children: ReactNode }) {
  const [kit, setKit] = useState<StellarWalletsKit | null>(null);

  useEffect(() => {
    const instance = new StellarWalletsKit({
      network: resolveWalletNetwork(),
      modules: allowAllModules(),
    });
    setKit(instance);

    return () => {
      void instance.disconnect();
    };
  }, []);

  const connect = useCallback(async () => {
    if (!kit) {
      throw new Error("Wallet kit is still loading");
    }

    return await new Promise<string>((resolve, reject) => {
      void kit
        .openModal({
          modalTitle: "Connect wallet to verify",
          onWalletSelected: (option) => {
            kit.setWallet(option.id);
            void kit
              .getAddress()
              .then(({ address }) => resolve(address))
              .catch(reject);
          },
          onClosed: (error) => {
            if (error) {
              reject(error);
            }
          },
        })
        .catch(reject);
    });
  }, [kit]);

  const signMessage = useCallback(
    async (message: string) => {
      if (!kit) {
        throw new Error("Wallet kit is still loading");
      }

      const { address } = await kit.getAddress();
      const { signedMessage } = await kit.signMessage(message, {
        address,
        networkPassphrase: resolveNetworkPassphrase(),
      });

      return { address, signature: signedMessage };
    },
    [kit],
  );

  const value = useMemo<SchemaWalletContextValue>(
    () => ({
      ready: kit != null,
      connect,
      signMessage,
    }),
    [kit, connect, signMessage],
  );

  return <SchemaWalletContext.Provider value={value}>{children}</SchemaWalletContext.Provider>;
}

export function useSchemaWallet() {
  const context = useContext(SchemaWalletContext);
  if (!context) {
    throw new Error("useSchemaWallet must be used within SchemaWalletProvider");
  }
  return context;
}
