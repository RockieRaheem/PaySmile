"use client";

import { WagmiProvider as WagmiProviderBase, createConfig, http } from "wagmi";
import { celo, celoAlfajores, localhost } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { injected, walletConnect } from "wagmi/connectors";

// Initialize with localhost for development, Celo testnet for testing
const config = createConfig({
  chains: [localhost, celoAlfajores, celo],
  connectors: [
    injected({
      target: {
        id: "valora",
        name: "Valora",
        provider: (window as any)?.ethereum,
      },
    }),
    injected({
      target: {
        id: "celo",
        name: "Celo Wallet",
        provider: (window as any)?.celo,
      },
    }),
    // Fallback to standard injected provider
    injected(),
  ],
  transports: {
    [localhost.id]: http("http://127.0.0.1:8545"),
    [celo.id]: http("https://forno.celo.org"),
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
