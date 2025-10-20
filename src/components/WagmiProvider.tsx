"use client";

import { WagmiProvider as WagmiProviderBase, createConfig, http } from "wagmi";
import { celo, celoAlfajores, localhost } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { injected, walletConnect } from "wagmi/connectors";

// WalletConnect project ID from environment variable
// Get yours from https://cloud.walletconnect.com (free!)
const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo-project-id";

// Initialize with localhost for development, Celo testnet for testing
const config = createConfig({
  chains: [localhost, celoAlfajores, celo],
  connectors: [
    // WalletConnect - Opens wallets natively (TrustWallet, Valora, MetaMask app)
    walletConnect({
      projectId,
      metadata: {
        name: "PaySmile",
        description:
          "Round up your transactions and donate to meaningful projects",
        url: "https://paysmile.app",
        icons: ["https://avatars.githubusercontent.com/u/37784886"],
      },
      showQrModal: true, // Show QR for desktop users
    }),
    // Fallback to injected for browser extensions
    injected({
      shimDisconnect: true,
    }),
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
