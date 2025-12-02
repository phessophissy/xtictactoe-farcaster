import { useState, useEffect, useCallback } from 'react';
import { Player, Board } from '@/utils/game';

interface GameMove {
  position: number;
  player: 'X' | 'O';
  timestamp: number;
  address: string;
}

interface UseGameMovesProps {
  gameId: bigint;
  myAddress?: string;
  mySymbol: Player;
  enabled: boolean; // Only sync when game has started (player2 joined)
}

export function useGameMoves({ gameId, myAddress, mySymbol, enabled }: UseGameMovesProps) {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastMoveCount, setLastMoveCount] = useState(0);

  const gameIdStr = gameId.toString();

  // Fetch moves from API
  const fetchMoves = useCallback(async () => {
    if (!enabled) return;

    try {
      const response = await fetch(`/api/game/${gameIdStr}/moves`);
      const data = await response.json();

      if (data.success && data.moves) {
        const moves: GameMove[] = data.moves;
        
        // Only update if move count changed
        if (moves.length !== lastMoveCount) {
          // Build board from moves
          const newBoard: Board = Array(9).fill(null);
          moves.forEach(move => {
            newBoard[move.position] = move.player;
          });

          setBoard(newBoard);
          setCurrentPlayer(moves.length % 2 === 0 ? 'X' : 'O');
          setLastMoveCount(moves.length);
        }
      }
    } catch (error) {
      console.error('Error fetching moves:', error);
    }
  }, [enabled, gameIdStr, lastMoveCount]);

  // Poll for updates every 2 seconds
  useEffect(() => {
    if (!enabled) {
      // Reset board when not enabled
      setBoard(Array(9).fill(null));
      setCurrentPlayer('X');
      setLastMoveCount(0);
      return;
    }

    // Initial fetch
    fetchMoves();

    // Poll every 2 seconds
    const interval = setInterval(fetchMoves, 2000);

    return () => clearInterval(interval);
  }, [enabled, fetchMoves]);

  // Submit a move
  const makeMove = useCallback(async (position: number): Promise<boolean> => {
    if (!enabled || !myAddress || isSubmitting) return false;

    // Check if position is empty
    if (board[position] !== null) return false;

    // Check if it's my turn
    if (currentPlayer !== mySymbol) return false;

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/game/${gameIdStr}/moves`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          position,
          player: mySymbol,
          address: myAddress,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Immediately update local state for better UX
        const newBoard = [...board];
        newBoard[position] = mySymbol;
        setBoard(newBoard);
        setCurrentPlayer(mySymbol === 'X' ? 'O' : 'X');
        setLastMoveCount(lastMoveCount + 1);
        
        // Fetch latest state to ensure sync
        setTimeout(fetchMoves, 200);
        
        return true;
      } else {
        console.error('Move rejected:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Error submitting move:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [enabled, myAddress, mySymbol, board, currentPlayer, gameIdStr, lastMoveCount, fetchMoves, isSubmitting]);

  return {
    board,
    currentPlayer,
    makeMove,
    isSubmitting,
  };
}
