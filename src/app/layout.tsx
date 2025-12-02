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
  openGraph: {
    title: 'xTicTacToe - Play for USDC on Base',
    description: 'AI Mode (FREE) or PvP Mode ($1 USDC) - Win $1.70 USDC prizes!',
    images: ['/logo.png'],
    type: 'website',
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://xtictactoe-farcaster.vercel.app/logo.png',
    'fc:frame:button:1': '🎮 Play Free AI Mode',
    'fc:frame:button:2': '💰 Play PvP for USDC',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': 'https://xtictactoe-farcaster.vercel.app',
    'fc:frame:button:2:action': 'link',
    'fc:frame:button:2:target': 'https://xtictactoe-farcaster.vercel.app',
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
        {/* Decorative floating X and O elements */}
        <div className="decorative-x" style={{ fontSize: '150px' }}>X</div>
        <div className="decorative-o" style={{ fontSize: '150px' }}>O</div>
        
        <AppKitProviderWrapper>
          {children}
        </AppKitProviderWrapper>
      </body>
    </html>
  );
}
