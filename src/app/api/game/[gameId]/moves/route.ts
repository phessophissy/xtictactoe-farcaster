import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for game moves (in production, use Redis or database)
const gameMovesStore = new Map<string, GameMove[]>();

interface GameMove {
  position: number;
  player: 'X' | 'O';
  timestamp: number;
  address: string;
}

// GET /api/game/[gameId]/moves - Fetch all moves for a game
export async function GET(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  try {
    const gameId = params.gameId;
    const moves = gameMovesStore.get(gameId) || [];
    
    return NextResponse.json({ 
      success: true, 
      moves,
      count: moves.length 
    });
  } catch (error) {
    console.error('Error fetching moves:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch moves' },
      { status: 500 }
    );
  }
}

// POST /api/game/[gameId]/moves - Submit a new move
export async function POST(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  try {
    const gameId = params.gameId;
    const body = await request.json();
    const { position, player, address } = body;

    // Validate input
    if (typeof position !== 'number' || position < 0 || position > 8) {
      return NextResponse.json(
        { success: false, error: 'Invalid position' },
        { status: 400 }
      );
    }

    if (player !== 'X' && player !== 'O') {
      return NextResponse.json(
        { success: false, error: 'Invalid player' },
        { status: 400 }
      );
    }

    if (!address || typeof address !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid address' },
        { status: 400 }
      );
    }

    // Get existing moves
    const moves = gameMovesStore.get(gameId) || [];

    // Check if position is already taken
    const positionTaken = moves.some(move => move.position === position);
    if (positionTaken) {
      return NextResponse.json(
        { success: false, error: 'Position already taken' },
        { status: 400 }
      );
    }

    // Validate turn order (X always goes first, then alternates)
    const expectedPlayer = moves.length % 2 === 0 ? 'X' : 'O';
    if (player !== expectedPlayer) {
      return NextResponse.json(
        { success: false, error: 'Not your turn' },
        { status: 400 }
      );
    }

    // Add new move
    const newMove: GameMove = {
      position,
      player,
      timestamp: Date.now(),
      address: address.toLowerCase()
    };

    moves.push(newMove);
    gameMovesStore.set(gameId, moves);

    return NextResponse.json({ 
      success: true, 
      move: newMove,
      totalMoves: moves.length 
    });
  } catch (error) {
    console.error('Error submitting move:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit move' },
      { status: 500 }
    );
  }
}

// DELETE /api/game/[gameId]/moves - Reset game (optional, for testing)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  try {
    const gameId = params.gameId;
    gameMovesStore.delete(gameId);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Game moves reset' 
    });
  } catch (error) {
    console.error('Error resetting moves:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reset moves' },
      { status: 500 }
    );
  }
}
