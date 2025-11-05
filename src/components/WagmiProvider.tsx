"use client";

import { WagmiProvider as WagmiProviderBase, createConfig, http } from "wagmi";
import { localhost } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { injected } from "wagmi/connectors";
import { defineChain } from "viem";

// Define Celo Sepolia Testnet (Chain ID: 11142220)
export const celoSepolia = defineChain({
  id: 11142220,
  name: "Celo Sepolia Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "CELO",
    symbol: "CELO",
  },
  rpcUrls: {
    default: {
      http: ["https://forno.celo-sepolia.celo-testnet.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "CeloScan",
      url: "https://sepolia.celoscan.io",
    },
  },
  testnet: true,
});

// Initialize with Celo Sepolia testnet
const config = createConfig({
  chains: [celoSepolia, localhost],
  connectors: [
    // Injected wallets (MetaMask, etc.)
    injected({
      shimDisconnect: true,
    }),
  ],
  transports: {
    [localhost.id]: http("http://127.0.0.1:8545", {
      timeout: 60_000, // 60 second timeout
    }),
    [celoSepolia.id]: http("https://forno.celo-sepolia.celo-testnet.org", {
      timeout: 60_000, // 60 second timeout
      retryCount: 3,
      retryDelay: 1000,
    }),
  },
  ssr: true,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function WagmiProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProviderBase config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProviderBase>
  );
}
