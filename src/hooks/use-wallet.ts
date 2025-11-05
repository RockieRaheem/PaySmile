import { useAccount } from "wagmi";
import { useEffect, useState } from "react";

/**
 * Custom hook that handles both Web3 wallets (via wagmi) and simple wallets (localStorage)
 * Returns the active wallet address and connection status
 */
export function useWallet() {
  const { address: wagmiAddress, isConnected: isWagmiConnected } = useAccount();
  const [simpleWalletAddress, setSimpleWalletAddress] = useState<string | null>(
    null
  );
  const [walletType, setWalletType] = useState<"web3" | "simple" | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const updateWalletFromStorage = () => {
      const savedWalletType = localStorage.getItem("paysmile_wallet_type");
      const savedAddress = localStorage.getItem("paysmile_connected_address");

      if (savedWalletType === "simple" && savedAddress) {
        setWalletType("simple");
        setSimpleWalletAddress(savedAddress);
      } else if (savedWalletType === "web3") {
        setWalletType("web3");
        setSimpleWalletAddress(null);
      } else {
        setWalletType(null);
        setSimpleWalletAddress(null);
      }

      setIsLoading(false);
    };

    // Initial load
    updateWalletFromStorage();

    // Listen for storage changes (e.g., when wallet is cleared or changed)
    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === "paysmile_wallet_type" ||
        e.key === "paysmile_connected_address" ||
        e.key === "paysmile_simple_wallet"
      ) {
        updateWalletFromStorage();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Use simple wallet address if available, otherwise use wagmi address
  const address = simpleWalletAddress || wagmiAddress;
  const isConnected =
    (walletType === "simple" && !!simpleWalletAddress) || isWagmiConnected;

  return {
    address: address as `0x${string}` | undefined,
    isConnected,
    walletType,
    isLoading,
  };
}
