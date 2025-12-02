'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, ESCROW_ABI } from '@/config/contracts';
import { Player, Board, checkWinner, checkDraw } from '@/utils/game';
import { soundManager, vibrateMove, vibrateWin, vibrateLose } from '@/utils/sound';
import { usePayout } from '@/hooks/useContract';
import { formatUnits } from 'viem';

interface PvPGameProps {
  gameId: bigint;
  onBack: () => void;
}

export default function PvPGame({ gameId, onBack }: PvPGameProps) {
  const { address } = useAccount();
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [winner, setWinner] = useState<Player>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  const { payout, isPending: isPayoutPending } = usePayout();

  // Read game state from contract
  const { data: gameData, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ESCROW_ABI,
    functionName: 'games',
    args: [gameId],
  });

  const player1 = gameData?.[0] as `0x${string}` | undefined;
  const player2 = gameData?.[1] as `0x${string}` | undefined;
  const boardState = gameData?.[2] as number[] | undefined;
  const currentTurn = gameData?.[3] as number | undefined;
  const gameWinner = gameData?.[4] as `0x${string}` | undefined;
  const isActive = gameData?.[5] as boolean | undefined;

  const isPlayer1 = address?.toLowerCase() === player1?.toLowerCase();
  const isPlayer2 = address?.toLowerCase() === player2?.toLowerCase();
  const isMyTurn = (currentTurn === 1 && isPlayer1) || (currentTurn === 2 && isPlayer2);
  const mySymbol: Player = isPlayer1 ? 'X' : 'O';

  // Convert contract board state (0,1,2) to our format (null, X, O)
  useEffect(() => {
    if (boardState) {
      const convertedBoard: Board = boardState.map(cell => {
        if (cell === 0) return null;
        if (cell === 1) return 'X';
        return 'O';
      });
      setBoard(convertedBoard);
    }
  }, [boardState]);

  // Check for winner locally
  useEffect(() => {
    const result = checkWinner(board);
    if (result.winner) {
      setWinner(result.winner);
      setWinningLine(result.winningLine);
      const didIWin = (result.winner === 'X' && isPlayer1) || (result.winner === 'O' && isPlayer2);
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
  }, [board, isPlayer1, isPlayer2]);

  // Poll for updates every 2 seconds
  useEffect(() => {
    if (!isActive || winner || isDraw) return;
    const interval = setInterval(() => {
      refetch();
    }, 2000);
    return () => clearInterval(interval);
  }, [isActive, winner, isDraw, refetch]);

  const handleMove = async (index: number) => {
    if (board[index] || winner || isDraw || !isMyTurn || !isActive) return;

    // Optimistically update UI
    const newBoard = [...board];
    newBoard[index] = mySymbol;
    setBoard(newBoard);
    soundManager.playMove();
    vibrateMove();

    // TODO: Call contract to record move
    // This requires adding a makeMove function to the smart contract
    // For now, this is a demonstration of the UI flow
  };

  const handleClaimWin = async () => {
    if (!winner || !address) return;
    const winnerAddress = winner === 'X' ? player1 : player2;
    if (winnerAddress) {
      await payout(gameId, winnerAddress);
    }
  };

  const isWinningCell = (index: number) => {
    return winningLine?.includes(index);
  };

  if (!player1 || !player2) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-xl text-carton-700">Waiting for opponent...</p>
          <button onClick={onBack} className="mt-4 bg-carton-400 hover:bg-carton-500 text-white font-bold py-2 px-6 rounded-lg">
            Back
          </button>
        </div>
      </div>
    );
  }

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
                  {((winner === 'X' && isPlayer1) || (winner === 'O' && isPlayer2)) ? '🎉 You Win!' : '😔 You Lose!'}
                </p>
                {((winner === 'X' && isPlayer1) || (winner === 'O' && isPlayer2)) && !gameWinner && (
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

          <div className="text-xs text-center text-carton-600">
            {!isActive && 'Game ended'}
            {isActive && !winner && !isDraw && 'Syncing with blockchain...'}
          </div>
        </div>
      </div>
    </div>
  );
}
