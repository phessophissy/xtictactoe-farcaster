import type { Metadata } from 'next';
import './globals.css';
import AppKitProviderWrapper from '@/components/AppKitProviderWrapper';

export const metadata: Metadata = {
  title: 'xTicTacToe - Play for USDC on Base',
  description: 'Play xTicTacToe with AI or compete for USDC prizes on Base blockchain',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: '/logo.png',
  },
  openGraph: {
    title: 'xTicTacToe - Play for USDC on Base',
    description: 'AI Mode (FREE) or PvP Mode ($1 USDC) - Win $1.70 USDC prizes!',
    images: ['/frame-image.svg'],
    type: 'website',
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://xtictactoe-farcaster.vercel.app/frame-image.svg',
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
        <div className="decorative-x" style={{ fontSize: '150px', top: '10%', left: '15%', opacity: 0.08 }}>X</div>
        <div className="decorative-o" style={{ fontSize: '180px', top: '60%', right: '10%', opacity: 0.06 }}>O</div>
        <div className="decorative-x" style={{ fontSize: '120px', bottom: '15%', right: '20%', opacity: 0.07 }}>X</div>
        <div className="decorative-o" style={{ fontSize: '140px', top: '30%', left: '5%', opacity: 0.05 }}>O</div>
        
        <AppKitProviderWrapper>
          {children}
        </AppKitProviderWrapper>
      </body>
    </html>
  );
}
