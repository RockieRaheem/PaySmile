"use client";

import { WagmiProvider as WagmiProviderBase, createConfig, http } from "wagmi";
import { celoAlfajores, localhost } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { injected } from "wagmi/connectors";

// Initialize with Celo Sepolia testnet (formerly Alfajores)
const config = createConfig({
  chains: [celoAlfajores, localhost],
  connectors: [
    // Injected wallets (MetaMask, etc.)
    injected({
      shimDisconnect: true,
    }),
  ],
  transports: {
    [localhost.id]: http("http://127.0.0.1:8545"),
    [celoAlfajores.id]: http("https://alfajores-forno.celo-testnet.org"),
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
