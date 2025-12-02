'use client';

import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { base } from 'viem/chains';
import { cookieStorage, createStorage } from 'wagmi';

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || '';

const metadata = {
  name: 'xTicTacToe',
  description: 'Play xTicTacToe on Base',
  url: 'https://xtictactoe.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

export const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  projectId,
  networks: [base]
});

createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [base],
  defaultNetwork: base,
  metadata,
  features: {
    analytics: false,
    email: false,
    socials: false,
    swaps: false,
    onramp: false
  },
  enableAnalytics: false,
  themeMode: 'light',
  themeVariables: {
    '--w3m-accent': '#ba8c52',
    '--w3m-border-radius-master': '8px'
  },
  allowUnsupportedChain: false
});
