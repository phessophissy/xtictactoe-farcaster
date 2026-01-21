'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract, useBlockNumber } from 'wagmi';
import { CONTRACT_ADDRESS, ESCROW_ABI } from '@/config/contracts';
import { Player, checkWinner, checkDraw } from '@/utils/game';
import { soundManager, vibrateMove, vibrateWin, vibrateLose } from '@/utils/sound';
import { usePayout } from '@/hooks/useContract';
import { useGameMoves } from '@/hooks/useGameMoves';

interface PvPGameProps {
  gameId: bigint;
  onBack: () => void;
}

export default function PvPGame({ gameId, onBack }: PvPGameProps) {
  const { address } = useAccount();
  const [winner, setWinner] = useState<Player>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [turnTimeLeft, setTurnTimeLeft] = useState(120);
  const [hasSkippedTurn, setHasSkippedTurn] = useState(false);
  const { payout, isPending: isPayoutPending } = usePayout();

  const { data: blockNumber } = useBlockNumber({ watch: true });
  
  const { data: gameData, refetch } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: ESCROW_ABI,
    functionName: 'games',
    args: [gameId],
    query: {
      refetchInterval: 2000,
    },
  });

  useEffect(() => {
    if (blockNumber) {
      refetch();
    }
  }, [blockNumber, refetch]);

  const player1Address = gameData && Array.isArray(gameData) ? gameData[0] : null;
  const player2Address = gameData && Array.isArray(gameData) ? gameData[1] : null;
  const isActive = gameData && Array.isArray(gameData) ? gameData[3] : false;
  const isCompleted = gameData && Array.isArray(gameData) ? gameData[4] : false;
  
  const isPlayer1 = address?.toLowerCase() === player1Address?.toLowerCase();
  const isPlayer2 = address?.toLowerCase() === player2Address?.toLowerCase();
  const mySymbol: Player = isPlayer1 ? 'X' : 'O';
  
  const isWaitingForPlayer2 = !player2Address || player2Address === '0x0000000000000000000000000000000000000000';
  
  useEffect(() => {
    if (!gameData || !address) return;
    
    if (!isWaitingForPlayer2 && !isPlayer1 && !isPlayer2) {
      console.warn('User is not a player in this game, redirecting to lobby');
      alert('You are not a player in this game.');
      onBack();
    }
  }, [gameData, address, isPlayer1, isPlayer2, isWaitingForPlayer2, onBack]);
  
  useEffect(() => {
    if (isWaitingForPlayer2) {
      const pollInterval = setInterval(() => {
        refetch();
      }, 1000);
      
      return () => clearInterval(pollInterval);
    }
  }, [isWaitingForPlayer2, refetch]);

  const { board, currentPlayer, makeMove, isSubmitting, lastMoveTimestamp, skipTurn } = useGameMoves({
    gameId,
    myAddress: address,
    mySymbol,
    enabled: !isWaitingForPlayer2,
  });

  const isMyTurn = currentPlayer === mySymbol;

  useEffect(() => {
    if (gameData && Array.isArray(gameData)) {
      const [player1, player2, pot, active, completed] = gameData;
      
      if (player2 && player2 !== '0x0000000000000000000000000000000000000000' && !gameStartTime) {
        setGameStartTime(Date.now());
      }
    }
  }, [gameData, gameStartTime]);

  useEffect(() => {
    if (!gameStartTime) return;
    
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - gameStartTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStartTime]);

  useEffect(() => {
    if (isWaitingForPlayer2 || winner || isDraw) {
      setTurnTimeLeft(120);
      setHasSkippedTurn(false);
      return;
    }

    const turnStartTime = lastMoveTimestamp || gameStartTime || Date.now();
    const timeElapsed = Math.floor((Date.now() - turnStartTime) / 1000);
    const timeLeft = Math.max(0, 120 - timeElapsed);
    
    setTurnTimeLeft(timeLeft);
    setHasSkippedTurn(false);
    
    console.log(`Turn timer reset: ${timeLeft}s remaining, currentPlayer: ${currentPlayer}, timestamp: ${new Date(turnStartTime).toISOString()}`);
    
    let skipAttempted = false;
    
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - turnStartTime) / 1000);
      const remaining = Math.max(0, 120 - elapsed);
      setTurnTimeLeft(remaining);

      if (remaining === 0 && !winner && !isDraw && !skipAttempted) {
        skipAttempted = true;
        console.log(`Turn timer expired for ${currentPlayer}, attempting skip...`);
        skipTurn().then(success => {
          if (success) {
            soundManager.playMove();
            console.log('Turn automatically skipped due to timeout');
          }
        }).catch(err => {
          console.error('Skip turn failed:', err);
          skipAttempted = false;
        });
      }
    }, 1000);

    return () => {
      clearInterval(timer);
      console.log('Turn timer cleared');
    };
  }, [gameStartTime, isWaitingForPlayer2, lastMoveTimestamp, currentPlayer, winner, isDraw, skipTurn]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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

  const handleMove = async (index: number) => {
    if (board[index] || winner || isDraw || !isMyTurn || isWaitingForPlayer2 || isSubmitting) return;
    
    const success = await makeMove(index);
    if (success) {
      soundManager.playMove();
      vibrateMove();
    }
  };

  const handleClaimWin = async () => {
    if (!winner || !address) return;
    const winnerAddress = winner === 'X' ? player1Address : player2Address;
    await payout(gameId, winnerAddress as `0x${string}`);
  };

  const isWinningCell = (index: number) => {
    return winningLine?.includes(index);
  };

  if (isWaitingForPlayer2) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gold-100 via-gold-200 to-gold-300">
        <div className="w-full max-w-md">
          <div className="bg-gradient-to-br from-gold-50 to-gold-100 rounded-2xl shadow-2xl p-8 border-4 border-gold-400">
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={onBack}
                className="bg-gold-300 hover:bg-gold-400 text-gold-800 font-bold py-2 px-4 rounded-lg transition-colors"
              >
                ← Back
              </button>
              <h2 className="text-2xl font-bold text-gold-800">⚔️ PvP</h2>
              <div className="w-20"></div>
            </div>

            <div className="text-center space-y-6">
              <div className="text-6xl animate-bounce">⏳</div>
              <h3 className="text-2xl font-bold text-gold-800">Waiting for Opponent...</h3>
              <p className="text-gold-600">Game #{gameId.toString()}</p>
              <p className="text-sm text-gold-500">Share this game link with a friend to start playing!</p>
              
              <div className="bg-gold-200 rounded-lg p-4 border-2 border-gold-300">
                <p className="text-xs text-gold-700 mb-2">Your Address:</p>
                <p className="text-sm font-mono text-gold-900 break-all">
                  {player1Address || 'Loading...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gold-100 via-gold-200 to-gold-300">
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-br from-gold-50 to-gold-100 rounded-2xl shadow-2xl p-8 border-4 border-gold-400">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={onBack}
              className="bg-gold-300 hover:bg-gold-400 text-gold-800 font-bold py-2 px-4 rounded-lg transition-colors"
            >
              ← Back
            </button>
            <h2 className="text-2xl font-bold text-gold-800">⚔️ PvP</h2>
            <div className="text-sm text-gold-600">
              Game #{gameId.toString()}
            </div>
          </div>

          {gameStartTime && (
            <div className="mb-4 text-center">
              <div className="inline-block bg-gradient-to-r from-gold-500 to-gold-600 text-white font-bold py-2 px-6 rounded-full text-2xl">
                ⏱️ {formatTime(elapsedTime)}
              </div>
            </div>
          )}

          <div className="mb-4 space-y-2 text-sm text-gold-700">
            <div className="flex justify-between">
              <span>You are:</span>
              <span className="font-bold text-gold-800">{mySymbol}</span>
            </div>
            <div className="flex justify-between">
              <span>Prize Pool:</span>
              <span className="font-bold text-green-600">$1.70 USDC</span>
            </div>
            <div className="flex justify-between">
              <span>Opponent:</span>
              <span className="font-mono text-xs text-gold-600">
                {isPlayer1 ? `${player2Address?.slice(0, 6)}...${player2Address?.slice(-4)}` : `${player1Address?.slice(0, 6)}...${player1Address?.slice(-4)}`}
              </span>
            </div>
          </div>

          <div className="mb-6 text-center">
            {winner ? (
              <div className="space-y-2">
                <p className="text-2xl font-bold text-gold-800 animate-bounce-in">
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
              <p className="text-2xl font-bold text-gold-700">🤝 Draw!</p>
            ) : (
              <div className="space-y-2">
                <p className="text-xl text-gold-700">
                  {isMyTurn ? '✨ Your Turn' : '⏳ Opponent Turn'}
                </p>
                <div className={`text-lg font-bold ${turnTimeLeft <= 30 ? 'text-red-600 animate-pulse' : 'text-gold-600'}`}>
                  ⏱️ {formatTime(turnTimeLeft)}
                </div>
                {turnTimeLeft <= 30 && (
                  <p className="text-xs text-red-500">Hurry! Time running out!</p>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {board.map((cell, index) => (
              <button
                key={index}
                onClick={() => handleMove(index)}
                disabled={!!cell || !!winner || isDraw || !isMyTurn || isSubmitting}
                className={`
                  aspect-square bg-gradient-to-br from-gold-200 to-gold-300
                  rounded-xl shadow-lg hover:shadow-xl
                  flex items-center justify-center text-5xl font-bold
                  transition-all duration-200 transform
                  border-2 border-gold-400
                  ${cell ? 'cursor-default' : 'cursor-pointer'}
                  ${isWinningCell(index) ? 'animate-cell-win bg-gradient-to-br from-gold-400 to-gold-500' : ''}
                  ${!cell && !winner && !isDraw && isMyTurn && !isSubmitting ? 'hover:bg-gradient-to-br hover:from-gold-300 hover:to-gold-400 hover:scale-105' : ''}
                  ${(!isMyTurn || isSubmitting) && !cell ? 'opacity-60' : ''}
                `}
              >
                {cell && (
                  <span className={`animate-bounce-in ${cell === 'X' ? 'text-gold-800' : 'text-gold-700'}`}>
                    {cell}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="bg-gold-100 border-2 border-gold-400 rounded-lg p-3 text-center">
            <p className="text-xs text-gold-800">
              <strong>✅ Real-time Sync Active:</strong> Moves sync between players every 2 seconds via backend API.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
