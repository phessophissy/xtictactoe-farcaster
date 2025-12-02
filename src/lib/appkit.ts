'use client';

import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { base } from 'viem/chains';
import { cookieStorage, createStorage } from 'wagmi';

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || '7f100a30681d28871c0aaa5d1f6d1121';

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
    email: true,
    socials: ['google', 'x', 'discord', 'farcaster', 'github'],
    swaps: false,
    onramp: false
  },
  themeMode: 'light',
  themeVariables: {
    '--w3m-accent': '#ba8c52',
    '--w3m-border-radius-master': '8px'
  },
  allowUnsupportedChain: false
});
