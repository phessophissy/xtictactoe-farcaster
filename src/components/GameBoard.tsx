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
            <h2 className="text-2xl font-bold text-gold-800">
              {mode === 'ai' ? '🤖 AI Mode' : '⚔️ PvP Mode'}
            </h2>
            <button
              onClick={handleReset}
              className="bg-gold-300 hover:bg-gold-400 text-gold-800 font-bold py-2 px-4 rounded-lg transition-colors"
            >
              🔄
            </button>
          </div>

          <div className="mb-6 text-center">
            {winner ? (
              <p className="text-2xl font-bold text-gold-800 animate-bounce-in">
                {winner === 'X' ? '🎉 You Win!' : '😔 You Lose!'}
              </p>
            ) : isDraw ? (
              <p className="text-2xl font-bold text-gold-700">🤝 Draw!</p>
            ) : (
              <p className="text-xl text-gold-700">
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
                  aspect-square bg-gradient-to-br from-gold-200 to-gold-300
                  rounded-xl shadow-lg hover:shadow-xl
                  flex items-center justify-center text-5xl font-bold
                  transition-all duration-200 transform hover:scale-105
                  border-2 border-gold-400
                  ${cell ? 'cursor-default' : 'cursor-pointer'}
                  ${isWinningCell(index) ? 'animate-cell-win bg-gradient-to-br from-gold-400 to-gold-500' : ''}
                  ${!cell && !winner && !isDraw ? 'hover:bg-gradient-to-br hover:from-gold-300 hover:to-gold-400' : ''}
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

          {mode === 'ai' && (
            <div className="text-center text-sm text-gold-600">
              Difficulty: <span className="font-bold text-gold-800 capitalize">{difficulty}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
