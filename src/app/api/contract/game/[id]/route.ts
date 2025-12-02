import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import { CONTRACT_ADDRESS, ESCROW_ABI } from '@/config/contracts';

const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gameId = BigInt(params.id);

    const game = await publicClient.readContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: ESCROW_ABI,
      functionName: 'getGame',
      args: [gameId],
    });

    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    return NextResponse.json({
      player1: game.player1,
      player2: game.player2,
      pot: game.pot.toString(),
      active: game.active,
      completed: game.completed,
    });
  } catch (error) {
    console.error('Error fetching game:', error);
    return NextResponse.json({ error: 'Failed to fetch game' }, { status: 500 });
  }
}
