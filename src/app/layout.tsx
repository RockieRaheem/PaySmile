'use client';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { CeloProvider, Alfajores } from '@celo/react-celo';
import '@celo/react-celo/lib/styles.css';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CeloProvider
      dapp={{
        name: 'PaySmile',
        description: 'Small Payments, Big Smiles.',
        url: 'https://app.paysmile.org',
        icon: 'https://app.paysmile.org/favicon.ico',
      }}
      network={Alfajores}
    >
      <html lang="en" className="light">
        <head>
          <title>PaySmile</title>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;700;800&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
        </head>
        <body className="antialiased">
          {children}
          <Toaster />
        </body>
      </html>
    </CeloProvider>
  );
}
