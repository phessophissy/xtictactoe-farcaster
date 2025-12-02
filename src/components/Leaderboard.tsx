'use client';

import React, { useState, useEffect } from 'react';
import { LeaderboardEntry, calculateWinRate } from '@/utils/game';

interface LeaderboardProps {
  onBack: () => void;
}

export default function Leaderboard({ onBack }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [filter, setFilter] = useState<'all' | 'daily' | 'weekly'>('all');

  useEffect(() => {
    // Mock leaderboard data - in production, fetch from contract or subgraph
    const mockEntries: LeaderboardEntry[] = [
      {
        address: '0x1234...5678',
        username: 'CryptoKing',
        wins: 45,
        losses: 12,
        winRate: calculateWinRate(45, 12),
        rank: 1,
      },
      {
        address: '0xabcd...ef01',
        username: 'TicTacPro',
        wins: 38,
        losses: 15,
        winRate: calculateWinRate(38, 15),
        rank: 2,
      },
      {
        address: '0x9876...4321',
        username: 'ChainMaster',
        wins: 32,
        losses: 18,
        winRate: calculateWinRate(32, 18),
        rank: 3,
      },
      {
        address: '0x5555...6666',
        username: 'BlockWarrior',
        wins: 28,
        losses: 22,
        winRate: calculateWinRate(28, 22),
        rank: 4,
      },
      {
        address: '0x7777...8888',
        username: 'Web3Gamer',
        wins: 25,
        losses: 20,
        winRate: calculateWinRate(25, 20),
        rank: 5,
      },
    ];
    setEntries(mockEntries);
  }, [filter]);

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
    return 'from-carton-200 to-carton-300';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-carton-100 via-carton-200 to-carton-300">
      <div className="w-full max-w-2xl">
        <div className="bg-gradient-to-br from-carton-50 to-carton-100 rounded-2xl shadow-2xl p-8 border-4 border-carton-400">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={onBack}
              className="bg-carton-300 hover:bg-carton-400 text-carton-800 font-bold py-2 px-4 rounded-lg transition-colors"
            >
              ← Back
            </button>
            <h2 className="text-2xl font-bold text-carton-800">🏆 Leaderboard</h2>
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
                      ? 'bg-carton-600 text-white'
                      : 'bg-carton-300 text-carton-700 hover:bg-carton-400'
                  }
                `}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {entries.map((entry, index) => {
              const isCurrentUser = entry.address === currentAddress;
              return (
                <div
                  key={index}
                  className={`
                    rounded-lg p-4 flex items-center gap-4
                    bg-gradient-to-r ${getRankColor(entry.rank)}
                    border-2 ${isCurrentUser ? 'border-carton-700 shadow-lg' : 'border-carton-400'}
                    transition-all hover:scale-102 hover:shadow-md
                  `}
                >
                  <div className="text-3xl font-bold w-16 text-center">
                    {getRankEmoji(entry.rank)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-carton-900">{entry.username}</span>
                      {isCurrentUser && (
                        <span className="bg-carton-700 text-white text-xs px-2 py-1 rounded">YOU</span>
                      )}
                    </div>
                    <div className="text-sm text-carton-700">{entry.address}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-carton-900">{entry.winRate}%</div>
                    <div className="text-xs text-carton-700">
                      {entry.wins}W - {entry.losses}L
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 text-center text-xs text-carton-600">
            <p>Rankings updated every 5 minutes • Based on PvP matches only</p>
          </div>
        </div>
      </div>
    </div>
  );
}
