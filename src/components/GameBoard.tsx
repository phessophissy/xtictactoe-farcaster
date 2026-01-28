'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Player, Board, checkWinner, checkDraw, getAIMove, AIDifficulty } from '@/utils/game';
import { soundManager, vibrateMove, vibrateWin, vibrateLose } from '@/utils/sound';

interface GameBoardProps {
  mode: 'ai' | 'pvp';
  difficulty: AIDifficulty;
  onBack: () => void;
  onWin?: (winner: Player) => void;
}

export default function GameBoard({ mode, difficulty, onBack, onWin }: GameBoardProps) {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleMove = useCallback((index: number) => {
    setBoard(prevBoard => {
      if (prevBoard[index]) return prevBoard;
      const newBoard = [...prevBoard];
      newBoard[index] = currentPlayer;
      soundManager.playMove();
      vibrateMove();
      return newBoard;
    });
    setCurrentPlayer(prev => prev === 'X' ? 'O' : 'X');
  }, [currentPlayer]);

  useEffect(() => {
    if (mode === 'ai' && currentPlayer === 'O' && !winner && !isDraw) {
      const timer = setTimeout(() => {
        const move = getAIMove(board, difficulty);
        if (move !== -1) {
          handleMove(move);
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, mode, winner, isDraw, board, difficulty, handleMove]);

  useEffect(() => {
    const result = checkWinner(board);
    if (result.winner) {
      setWinner(result.winner);
      setWinningLine(result.winningLine);
      if (result.winner === 'X') {
        soundManager.playWin();
        vibrateWin();
      } else {
        soundManager.playLose();
        vibrateLose();
      }
      if (onWin) onWin(result.winner);
    } else if (checkDraw(board)) {
      setIsDraw(true);
      soundManager.playDraw();
    }
  }, [board, onWin]);

  const handleReset = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setWinningLine(null);
    setIsDraw(false);
    soundManager.playClick();
  };

  const isWinningCell = (index: number) => {
    return winningLine?.includes(index);
  };

  const getCellDelayClass = (index: number) => {
    const delays = ['animation-delay-100', 'animation-delay-200', 'animation-delay-300',
      'animation-delay-400', 'animation-delay-500', 'animation-delay-600',
      'animation-delay-700', 'animation-delay-800', 'animation-delay-900'];
    return delays[index] || '';
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
      <div className={`w-full max-w-md ${isLoaded ? 'animate-slide-up' : 'opacity-0'}`}>
        <div className="metal-card p-8 animate-glow-pulse-metal">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={onBack}
              className="metal-btn text-sm hover:animate-wiggle"
            >
              ← Back
            </button>
            <h2 className="text-2xl font-bold metal-text animate-metal-shimmer">
              {mode === 'ai' ? '🤖 AI Mode' : '⚔️ PvP Mode'}
            </h2>
            <button
              onClick={handleReset}
              className="metal-btn text-sm hover:animate-rotate-in"
            >
              🔄
            </button>
          </div>

          <div className="mb-6 text-center">
            {winner ? (
              <p className="text-2xl font-bold metal-text animate-tada">
                {winner === 'X' ? '🎉 You Win!' : '😔 You Lose!'}
              </p>
            ) : isDraw ? (
              <p className="text-2xl font-bold metal-text animate-shake">🤝 Draw!</p>
            ) : (
              <p className="text-xl metal-text animate-pulse-metal font-mono">
                {currentPlayer === 'X' ? 'Your Turn' : mode === 'ai' ? 'AI Thinking...' : 'Opponent Turn'}
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {board.map((cell, index) => (
              <button
                key={index}
                onClick={() => handleMove(index)}
                disabled={!!cell || !!winner || isDraw || (mode === 'ai' && currentPlayer === 'O')}
                className={`
                  aspect-square metal-cell
                  flex items-center justify-center text-5xl font-bold
                  transition-all duration-200 transform
                  ${isLoaded ? `animate-scale-in ${getCellDelayClass(index)}` : 'opacity-0'}
                  ${cell ? 'cursor-default' : 'cursor-pointer hover:scale-105'}
                  ${isWinningCell(index) ? 'metal-cell-win animate-victory-glow' : ''}
                  ${!cell && !winner && !isDraw ? 'hover:animate-glow-pulse-metal' : ''}
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

          {mode === 'ai' && (
            <div className="text-center text-sm text-wood-400 animate-fade-in font-mono">
              Difficulty: <span className="font-bold text-wood-300 capitalize animate-metal-shimmer">{difficulty}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
