'use client';

import React, { useState } from 'react';
import { useLeaderboard } from '@/hooks/useLeaderboard';

interface LeaderboardProps {
  onBack: () => void;
}

export default function Leaderboard({ onBack }: LeaderboardProps) {
  const { entries, isLoading } = useLeaderboard();
  const [filter, setFilter] = useState<'all' | 'daily' | 'weekly'>('all');

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-400 to-yellow-500';
    if (rank === 2) return 'from-gray-300 to-gray-400';
    if (rank === 3) return 'from-orange-400 to-orange-500';
    return 'from-leaf-200 to-leaf-300';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-leaf-100 via-leaf-200 to-leaf-300">
      <div className="w-full max-w-2xl">
        <div className="bg-gradient-to-br from-leaf-50 to-leaf-100 rounded-2xl shadow-2xl p-8 border-4 border-leaf-400">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={onBack}
              className="bg-leaf-300 hover:bg-leaf-400 text-leaf-800 font-bold py-2 px-4 rounded-lg transition-colors"
            >
              ← Back
            </button>
            <h2 className="text-2xl font-bold text-leaf-800">🏆 Leaderboard</h2>
            <div className="w-20"></div>
          </div>

          <div className="flex gap-2 mb-6 justify-center">
            {(['all', 'daily', 'weekly'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`
                  px-4 py-2 rounded-lg font-semibold capitalize transition-all
                  ${
                    filter === f
                      ? 'bg-leaf-600 text-white'
                      : 'bg-leaf-300 text-leaf-700 hover:bg-leaf-400'
                  }
                `}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {entries.map((entry, index) => {
              return (
                <div
                  key={index}
                  className={`
                    rounded-lg p-4 flex items-center gap-4
                    bg-gradient-to-r ${getRankColor(entry.rank)}
                    border-2 border-leaf-400
                    transition-all hover:scale-102 hover:shadow-md
                  `}
                >
                  <div className="text-3xl font-bold w-16 text-center">
                    {getRankEmoji(entry.rank)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-leaf-900">{entry.address.slice(0, 6)}...{entry.address.slice(-4)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-leaf-900">{entry.winRate}%</div>
                    <div className="text-xs text-leaf-700">
                      {entry.wins}W - {entry.losses}L
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 text-center text-xs text-leaf-600">
            <p>Rankings updated every 5 minutes • Based on PvP matches only</p>
          </div>
        </div>
      </div>
    </div>
  );
}
