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

    // Fetch game moves to determine winner
    let winner: string | null = null;
    let moves: string[] = [];
    
    try {
      const movesResponse = await fetch(`${request.nextUrl.origin}/api/game/${params.id}/moves`);
      if (movesResponse.ok) {
        const movesData = await movesResponse.json();
        moves = movesData.moves || [];
        
        // Determine winner from moves
        if (game.completed && moves.length >= 5) {
          const board = Array(9).fill(null);
          moves.forEach((move: string, index: number) => {
            const player = index % 2 === 0 ? 'X' : 'O';
            board[parseInt(move)] = player;
          });
          
          // Check winning combinations
          const winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
          ];
          
          for (const combo of winningCombos) {
            const [a, b, c] = combo;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
              winner = board[a] === 'X' ? game.player1 : game.player2;
              break;
            }
          }
          
          // If no winner and board is full, it's a draw
          if (!winner && moves.length === 9) {
            winner = 'draw';
          }
        }
      }
    } catch {
      // If moves fetch fails, continue without winner info
    }

    return NextResponse.json({
      id: params.id,
      player1: game.player1,
      player2: game.player2,
      pot: game.pot.toString(),
      active: game.active,
      completed: game.completed,
      winner,
      moves,
    });
  } catch (error) {
    console.error('Error fetching game:', error);
    return NextResponse.json({ error: 'Failed to fetch game' }, { status: 500 });
  }
}
