"use client";

import { useAccount, useSwitchChain } from "wagmi";
import { localhost, celoAlfajores } from "wagmi/chains";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function NetworkChecker() {
  const { chain, isConnected } = useAccount();
  const { switchChain } = useSwitchChain();

  // Expected network for development
  const expectedChainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "31337");

  const getExpectedNetwork = () => {
    switch (expectedChainId) {
      case 31337:
        return { name: "Hardhat Localhost", chain: localhost };
      case 44787:
        return { name: "Celo Sepolia Testnet", chain: celoAlfajores };
      default:
        return { name: "Hardhat Localhost", chain: localhost };
    }
  };

  const expectedNetwork = getExpectedNetwork();

  // Check if user is on wrong network
  const isWrongNetwork = isConnected && chain && chain.id !== expectedChainId;

  if (!isConnected) {
    return null;
  }

  if (!isWrongNetwork) {
    return null;
  }

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Wrong Network</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-3">
          You're connected to{" "}
          <strong>{chain?.name || "Unknown Network"}</strong> but PaySmile
          contracts are deployed on <strong>{expectedNetwork.name}</strong>.
        </p>
        <Button
          size="sm"
          variant="outline"
          onClick={() => switchChain({ chainId: expectedChainId })}
        >
          Switch to {expectedNetwork.name}
        </Button>
      </AlertDescription>
    </Alert>
  );
}
