'use client';

import React from 'react';

interface Move {
  player: 'X' | 'O';
  position: number;
  timestamp: number;
}

interface MoveHistoryProps {
  moves: Move[];
  currentPlayer: 'X' | 'O';
}

export default function MoveHistory({ moves, currentPlayer }: MoveHistoryProps) {
  if (moves.length === 0) {
    return (
      <div className="bg-carton-200 rounded-lg p-4 border-2 border-carton-300">
        <h4 className="font-bold text-carton-800 mb-2 flex items-center gap-2">
          📜 Move History
        </h4>
        <p className="text-sm text-carton-600 text-center py-4">
          No moves yet. {currentPlayer === 'X' ? "You're" : "Opponent's"} turn!
        </p>
      </div>
    );
  }

  const getPositionLabel = (pos: number): string => {
    const row = Math.floor(pos / 3) + 1;
    const col = (pos % 3) + 1;
    return `Row ${row}, Col ${col}`;
  };

  const recentMoves = moves.slice(-10); // Show last 10 moves

  return (
    <div className="bg-carton-200 rounded-lg p-4 border-2 border-carton-300">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-bold text-carton-800 flex items-center gap-2">
          📜 Move History
        </h4>
        <span className="text-xs text-carton-600 bg-carton-300 px-2 py-1 rounded-full">
          {moves.length} moves
        </span>
      </div>

      <div className="max-h-48 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
        {[...recentMoves].reverse().map((move, index) => {
          const actualIndex = moves.length - 1 - index;
          const isLatest = index === 0;
          
          return (
            <div
              key={actualIndex}
              className={`
                flex items-center gap-2 p-2 rounded-lg text-sm
                ${isLatest 
                  ? 'bg-carton-400 animate-pulse' 
                  : 'bg-carton-100'
                }
              `}
            >
              <span className={`
                font-bold w-6 h-6 rounded-full flex items-center justify-center text-xs
                ${move.player === 'X' 
                  ? 'bg-carton-800 text-carton-100' 
                  : 'bg-carton-700 text-carton-200'
                }
              `}>
                {move.player}
              </span>
              <span className="text-carton-700 flex-1">
                {getPositionLabel(move.position)}
              </span>
              <span className="text-xs text-carton-500">
                #{actualIndex + 1}
              </span>
            </div>
          );
        })}
      </div>

      {moves.length > 10 && (
        <p className="text-xs text-carton-600 text-center mt-2">
          Showing last 10 of {moves.length} moves
        </p>
      )}
    </div>
  );
}
