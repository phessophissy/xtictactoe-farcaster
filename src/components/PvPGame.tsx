'use client';

import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { Player, Board, checkWinner, checkDraw } from '@/utils/game';
import { soundManager, vibrateMove, vibrateWin, vibrateLose } from '@/utils/sound';
import { usePayout } from '@/hooks/useContract';

interface PvPGameProps {
  gameId: bigint;
  onBack: () => void;
}

export default function PvPGame({ gameId, onBack }: PvPGameProps) {
  const { address } = useAccount();
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  const { payout, isPending: isPayoutPending } = usePayout();

  // For demo: Player 1 is always X, Player 2 is always O
  // In production, you'd track this via WebSocket or database
  const player1Address = '0x0000000000000000000000000000000000000000'; // Placeholder
  const player2Address = '0x0000000000000000000000000000000000000001'; // Placeholder
  
  const isPlayer1 = true; // Simplified for demo
  const mySymbol: Player = isPlayer1 ? 'X' : 'O';
  const isMyTurn = currentPlayer === mySymbol;

  // Check for winner
  React.useEffect(() => {
    const result = checkWinner(board);
    if (result.winner) {
      setWinner(result.winner);
      setWinningLine(result.winningLine);
      const didIWin = result.winner === mySymbol;
      if (didIWin) {
        soundManager.playWin();
        vibrateWin();
      } else {
        soundManager.playLose();
        vibrateLose();
      }
    } else if (checkDraw(board)) {
      setIsDraw(true);
      soundManager.playDraw();
    }
  }, [board, mySymbol]);

  const handleMove = (index: number) => {
    if (board[index] || winner || isDraw || !isMyTurn) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    soundManager.playMove();
    vibrateMove();
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');

    // TODO: In production, send move to backend/WebSocket
    // await sendMove(gameId, index, currentPlayer);
  };

  const handleClaimWin = async () => {
    if (!winner || !address) return;
    // TODO: Determine winner address from game state
    const winnerAddress = winner === 'X' ? player1Address : player2Address;
    await payout(gameId, winnerAddress as `0x${string}`);
  };

  const isWinningCell = (index: number) => {
    return winningLine?.includes(index);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-carton-100 via-carton-200 to-carton-300">
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-br from-carton-50 to-carton-100 rounded-2xl shadow-2xl p-8 border-4 border-carton-400">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={onBack}
              className="bg-carton-300 hover:bg-carton-400 text-carton-800 font-bold py-2 px-4 rounded-lg transition-colors"
            >
              ← Back
            </button>
            <h2 className="text-2xl font-bold text-carton-800">⚔️ PvP</h2>
            <div className="text-sm text-carton-600">
              Game #{gameId.toString()}
            </div>
          </div>

          <div className="mb-4 space-y-2 text-sm text-carton-700">
            <div className="flex justify-between">
              <span>You are:</span>
              <span className="font-bold text-carton-800">{mySymbol}</span>
            </div>
            <div className="flex justify-between">
              <span>Prize Pool:</span>
              <span className="font-bold text-green-600">$1.70 USDC</span>
            </div>
          </div>

          <div className="mb-6 text-center">
            {winner ? (
              <div className="space-y-2">
                <p className="text-2xl font-bold text-carton-800 animate-bounce-in">
                  {winner === mySymbol ? '🎉 You Win!' : '😔 You Lose!'}
                </p>
                {winner === mySymbol && (
                  <button
                    onClick={handleClaimWin}
                    disabled={isPayoutPending}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isPayoutPending ? 'Claiming...' : 'Claim $1.70 USDC'}
                  </button>
                )}
              </div>
            ) : isDraw ? (
              <p className="text-2xl font-bold text-carton-700">🤝 Draw!</p>
            ) : (
              <p className="text-xl text-carton-700">
                {isMyTurn ? '✨ Your Turn' : '⏳ Opponent Turn'}
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {board.map((cell, index) => (
              <button
                key={index}
                onClick={() => handleMove(index)}
                disabled={!!cell || !!winner || isDraw || !isMyTurn}
                className={`
                  aspect-square bg-gradient-to-br from-carton-200 to-carton-300
                  rounded-xl shadow-lg hover:shadow-xl
                  flex items-center justify-center text-5xl font-bold
                  transition-all duration-200 transform
                  border-2 border-carton-400
                  ${cell ? 'cursor-default' : 'cursor-pointer'}
                  ${isWinningCell(index) ? 'animate-cell-win bg-gradient-to-br from-carton-400 to-carton-500' : ''}
                  ${!cell && !winner && !isDraw && isMyTurn ? 'hover:bg-gradient-to-br hover:from-carton-300 hover:to-carton-400 hover:scale-105' : ''}
                  ${!isMyTurn && !cell ? 'opacity-60' : ''}
                `}
              >
                {cell && (
                  <span className={`animate-bounce-in ${cell === 'X' ? 'text-carton-800' : 'text-carton-700'}`}>
                    {cell}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-3 text-center">
            <p className="text-xs text-yellow-800">
              <strong>Demo Mode:</strong> In production, moves would sync via WebSocket for real-time multiplayer.
              Currently showing local gameplay only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
