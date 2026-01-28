'use client';

import React, { useState, useEffect } from 'react';
import { useLeaderboard } from '@/hooks/useLeaderboard';

interface LeaderboardProps {
  onBack: () => void;
}

export default function Leaderboard({ onBack }: LeaderboardProps) {
  const { entries, isLoading } = useLeaderboard();
  const [filter, setFilter] = useState<'all' | 'daily' | 'weekly'>('all');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-500 to-amber-600';
    if (rank === 2) return 'from-gray-400 to-gray-500';
    if (rank === 3) return 'from-amber-600 to-orange-600';
    return 'from-obsidian-300 to-obsidian-400';
  };

  const getRowDelayClass = (index: number) => {
    const delays = ['animation-delay-100', 'animation-delay-200', 'animation-delay-300',
      'animation-delay-400', 'animation-delay-500', 'animation-delay-600',
      'animation-delay-700', 'animation-delay-800', 'animation-delay-900',
      'animation-delay-1000'];
    return delays[index] || 'animation-delay-1000';
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
      <div className={`w-full max-w-2xl ${isLoaded ? 'animate-slide-up' : 'opacity-0'}`}>
        <div className="metal-card p-8 animate-glow-pulse-metal">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={onBack}
              className="metal-btn text-sm hover:animate-wiggle"
            >
              ← Back
            </button>
            <h2 className="text-2xl font-bold metal-text animate-metal-shimmer">🏆 Leaderboard</h2>
            <div className="w-20"></div>
          </div>

          <div className={`flex gap-2 mb-6 justify-center ${isLoaded ? 'animate-scale-in animation-delay-200' : 'opacity-0'}`}>
            {(['all', 'daily', 'weekly'] as const).map((f, idx) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`
                  px-4 py-2 rounded-lg font-semibold capitalize transition-all
                  ${filter === f
                    ? 'metal-btn animate-glow-pulse-metal'
                    : 'bg-metal-700 text-wood-300 hover:bg-metal-600 hover:animate-wiggle border border-metal-500'
                  }
                `}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="metal-spinner animate-metal-spin"></div>
              </div>
            ) : (
              entries.map((entry, index) => (
                <div
                  key={index}
                  className={`
                    metal-row rounded-lg p-4 flex items-center gap-4
                    bg-gradient-to-r ${getRankColor(entry.rank)}
                    border border-wood-500/30
                    transition-all hover:scale-102 hover:animate-glow-pulse-metal
                    ${isLoaded ? `animate-slide-right ${getRowDelayClass(index)}` : 'opacity-0'}
                  `}
                >
                  <div className={`text-3xl font-bold w-16 text-center ${index < 3 ? 'animate-bounce-in' : ''}`}>
                    {getRankEmoji(entry.rank)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-wood-200">{entry.address.slice(0, 6)}...{entry.address.slice(-4)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold metal-text animate-metal-shimmer">{entry.winRate}%</div>
                    <div className="text-xs text-wood-400">
                      {entry.wins}W - {entry.losses}L
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className={`mt-6 text-center text-xs text-wood-500 font-mono ${isLoaded ? 'animate-fade-in animation-delay-1000' : 'opacity-0'}`}>
            <p>Rankings updated every 5 minutes • Based on PvP matches only</p>
          </div>
        </div>
      </div>
    </div>
  );
}
