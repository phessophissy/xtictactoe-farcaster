'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Player, Board, checkWinner, checkDraw } from '@/utils/game';
import { soundManager, vibrateMove, vibrateWin, vibrateLose } from '@/utils/sound';
import { Message } from '@farcaster/frame-sdk';

interface PvPGameProps {
  gameId: string;
  playerSymbol: Player;
  opponentName?: string;
  onBack: () => void;
  onGameEnd?: (winner: Player | 'draw') => void;
}

export default function PvPGame({ gameId, playerSymbol, opponentName, onBack, onGameEnd }: PvPGameProps) {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentTurn, setCurrentTurn] = useState<Player>('X');
  const [winner, setWinner] = useState<Player>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isLoaded, setIsLoaded] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const isMyTurn = currentTurn === playerSymbol;

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (winner || isDraw) return;
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setCurrentTurn(prev => prev === 'X' ? 'O' : 'X');
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [winner, isDraw, currentTurn]);

  const handleMove = useCallback((index: number) => {
    if (board[index] || !isMyTurn || winner || isDraw) return;
    
    const newBoard = [...board];
    newBoard[index] = currentTurn;
    setBoard(newBoard);
    soundManager.playMove();
    vibrateMove();
    setCurrentTurn(prev => prev === 'X' ? 'O' : 'X');
    setTimeLeft(30);
  }, [board, currentTurn, isMyTurn, winner, isDraw]);

  useEffect(() => {
    const result = checkWinner(board);
    if (result.winner) {
      setWinner(result.winner);
      setWinningLine(result.winningLine);
      if (result.winner === playerSymbol) {
        soundManager.playWin();
        vibrateWin();
      } else {
        soundManager.playLose();
        vibrateLose();
      }
      if (onGameEnd) onGameEnd(result.winner);
    } else if (checkDraw(board)) {
      setIsDraw(true);
      soundManager.playDraw();
      if (onGameEnd) onGameEnd('draw');
    }
  }, [board, playerSymbol, onGameEnd]);

  const isWinningCell = (index: number) => winningLine?.includes(index);

  const getCellDelayClass = (index: number) => {
    const delays = ['animation-delay-100', 'animation-delay-200', 'animation-delay-300', 
                    'animation-delay-400', 'animation-delay-500', 'animation-delay-600',
                    'animation-delay-700', 'animation-delay-800', 'animation-delay-900'];
    return delays[index] || '';
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-obsidian-50 via-obsidian-100 to-obsidian-200 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
      <div className={`w-full max-w-md ${isLoaded ? 'animate-slide-up' : 'opacity-0'}`}>
        <div className="metal-card p-8 animate-glow-gold">
          <div className="flex justify-between items-center mb-6">
            <button onClick={onBack} className="metal-btn text-sm hover:animate-wiggle">
              ← Back
            </button>
            <h2 className="text-2xl font-bold metal-text animate-gold-shimmer">⚔️ PvP Match</h2>
            <div className={`metal-timer ${timeLeft <= 10 ? 'animate-flash' : ''}`}>
              <span className={`metal-timer-text ${timeLeft <= 5 ? 'text-red-400' : ''}`}>
                {timeLeft}s
              </span>
            </div>
          </div>

          <div className="flex justify-between mb-4">
            <div className={`metal-badge ${playerSymbol === 'X' ? 'animate-glow-gold' : ''}`}>
              You ({playerSymbol})
            </div>
            <div className={`metal-badge ${playerSymbol === 'O' ? 'animate-glow-gold' : ''}`}>
              {opponentName || 'Opponent'} ({playerSymbol === 'X' ? 'O' : 'X'})
            </div>
          </div>

          <div className="mb-4 text-center">
            {winner ? (
              <p className={`text-2xl font-bold ${winner === playerSymbol ? 'metal-victory animate-tada' : 'metal-defeat animate-shake'}`}>
                {winner === playerSymbol ? '🎉 Victory!' : '😔 Defeat!'}
              </p>
            ) : isDraw ? (
              <p className="text-2xl font-bold metal-text animate-shake">🤝 Draw!</p>
            ) : (
              <p className={`text-xl metal-text ${isMyTurn ? 'animate-pulse-gold metal-turn' : ''}`}>
                {isMyTurn ? '✨ Your Turn!' : '⏳ Opponent\'s Turn...'}
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {board.map((cell, index) => (
              <button
                key={index}
                onClick={() => handleMove(index)}
                disabled={!!cell || !isMyTurn || !!winner || isDraw}
                className={`
                  aspect-square metal-cell
                  flex items-center justify-center text-5xl font-bold
                  transition-all duration-200 transform
                  ${isLoaded ? `animate-scale-in ${getCellDelayClass(index)}` : 'opacity-0'}
                  ${cell ? 'cursor-default' : isMyTurn ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed'}
                  ${isWinningCell(index) ? 'metal-cell-win animate-victory-glow' : ''}
                  ${!cell && isMyTurn && !winner && !isDraw ? 'hover:animate-glow-gold' : ''}
                `}
              >
                {cell && (
                  <span className={`metal-place ${cell === 'X' ? 'metal-x' : 'metal-o'}`}>
                    {cell}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="text-center text-sm text-gold-500 animate-fade-in">
            Game ID: <span className="font-mono text-gold-400">{gameId.slice(0, 8)}...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
