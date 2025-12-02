import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const buttonIndex = body?.untrustedData?.buttonIndex || 1;

    // Return Frame response
    return NextResponse.json({
      type: 'frame',
      version: 'vNext',
      image: 'https://xtictactoe-farcaster.vercel.app/frame-image.svg',
      buttons: [
        {
          label: '🎮 Play Free AI Mode',
          action: 'link',
          target: 'https://xtictactoe-farcaster.vercel.app'
        },
        {
          label: '💰 Play PvP for USDC',
          action: 'link',
          target: 'https://xtictactoe-farcaster.vercel.app'
        }
      ]
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({
    name: 'xTicTacToe',
    version: '0.0.1',
    description: 'Play TicTacToe vs AI (FREE) or compete for $1.70 USDC prizes in PvP mode'
  });
}
