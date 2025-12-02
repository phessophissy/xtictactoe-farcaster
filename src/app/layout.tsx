import type { Metadata } from 'next';
import './globals.css';
import AppKitProviderWrapper from '@/components/AppKitProviderWrapper';

export const metadata: Metadata = {
  title: 'xTicTacToe - Play for USDC on Base',
  description: 'Play xTicTacToe with AI or compete for USDC prizes on Base blockchain',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body>
        <AppKitProviderWrapper>
          {children}
        </AppKitProviderWrapper>
      </body>
    </html>
  );
}
