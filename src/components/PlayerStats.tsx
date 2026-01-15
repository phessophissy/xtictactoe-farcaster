'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { CONTRACT_ADDRESS, ESCROW_ABI } from '@/config/contracts';

interface PlayerStats {
  wins: number;
  losses: number;
  totalGames: number;
  winRate: number;
  totalWinnings: string;
}

export default function PlayerStats() {
  const { address } = useAccount();
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get player stats from contract
  const { data: rawStats } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: ESCROW_ABI,
    functionName: 'getPlayerStats',
    args: address ? [address as `0x${string}`] : undefined,
    query: {
      enabled: !!address,
    },
  });

  useEffect(() => {
    if (rawStats && Array.isArray(rawStats) && rawStats.length >= 3) {
      const wins = Number(rawStats[0]);
      const losses = Number(rawStats[1]);
      const totalGames = wins + losses;
      const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0;
      
      setStats({
        wins,
        losses,
        totalGames,
        winRate: Math.round(winRate * 10) / 10,
        totalWinnings: formatUnits(rawStats[2] as bigint, 6),
      });
    } else {
      // Default stats for new players
      setStats({
        wins: 0,
        losses: 0,
        totalGames: 0,
        winRate: 0,
        totalWinnings: '0',
      });
    }
    setIsLoading(false);
  }, [rawStats]);

  if (!address) {
    return (
      <div className="bg-carton-200 rounded-xl p-4 border-2 border-carton-300">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-carton-300 rounded-full flex items-center justify-center text-2xl">
            👤
          </div>
          <div>
            <div className="font-bold text-carton-800">Connect Wallet</div>
            <div className="text-sm text-carton-600">View your stats</div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-carton-200 rounded-xl p-4 border-2 border-carton-300 animate-pulse">
        <div className="h-6 bg-carton-300 rounded w-1/2 mb-2"></div>
        <div className="grid grid-cols-3 gap-2">
          <div className="h-16 bg-carton-300 rounded"></div>
          <div className="h-16 bg-carton-300 rounded"></div>
          <div className="h-16 bg-carton-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-carton-200 to-carton-300 rounded-xl p-4 border-2 border-carton-400 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-carton-400 to-carton-500 rounded-full flex items-center justify-center text-2xl shadow-md">
          👤
        </div>
        <div>
          <div className="font-bold text-carton-800">Your Stats</div>
          <div className="text-xs text-carton-600 font-mono">
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-carton-100 rounded-lg p-2 text-center border border-carton-300">
          <div className="text-2xl font-bold text-green-600">{stats?.wins || 0}</div>
          <div className="text-xs text-carton-700">Wins 🏆</div>
        </div>
        <div className="bg-carton-100 rounded-lg p-2 text-center border border-carton-300">
          <div className="text-2xl font-bold text-red-600">{stats?.losses || 0}</div>
          <div className="text-xs text-carton-700">Losses 💔</div>
        </div>
        <div className="bg-carton-100 rounded-lg p-2 text-center border border-carton-300">
          <div className="text-2xl font-bold text-carton-800">{stats?.winRate || 0}%</div>
          <div className="text-xs text-carton-700">Win Rate 📊</div>
        </div>
      </div>

      <div className="flex justify-between items-center text-sm bg-carton-100 rounded-lg px-3 py-2 border border-carton-300">
        <span className="text-carton-700">Total Winnings</span>
        <span className="font-bold text-green-600">${stats?.totalWinnings || '0'} USDC</span>
      </div>

      {stats && stats.totalGames === 0 && (
        <div className="mt-3 text-center text-xs text-carton-600 bg-carton-100 rounded-lg py-2">
          🎮 Play your first PvP game to start tracking stats!
        </div>
      )}
    </div>
  );
}
