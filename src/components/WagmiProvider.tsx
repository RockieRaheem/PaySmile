"use client";

import { WagmiProvider as WagmiProviderBase, createConfig, http } from "wagmi";
import { celo, celoAlfajores } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { injected, walletConnect } from "wagmi/connectors";

// Initialize with Celo testnet for development
const config = createConfig({
  chains: [celoAlfajores, celo],
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
