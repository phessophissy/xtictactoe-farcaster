import { useState, useEffect } from 'react';
import { useReadContract, useBlockNumber } from 'wagmi';
import { CONTRACT_ADDRESS, ESCROW_ABI } from '@/config/contracts';

export interface LeaderboardEntry {
  address: string;
  wins: number;
  losses: number;
  totalGames: number;
  winRate: number;
  rank: number;
}

export function useLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { data: gameCounter } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: ESCROW_ABI,
    functionName: 'gameCounter',
  });

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!gameCounter) return;
      
      setIsLoading(true);
      const playerStats = new Map<string, { wins: number; losses: number; total: number }>();
      
      try {
        const totalGames = Number(gameCounter);
        
        for (let i = 1; i <= Math.min(totalGames, 100); i++) {
          try {
            const response = await fetch(`/api/contract/game/${i}`);
            if (!response.ok) continue;
            
            const game = await response.json();
            if (!game || !game.completed) continue;
            
            if (game.player1 && game.player2) {
              const p1 = game.player1.toLowerCase();
              const p2 = game.player2.toLowerCase();
              
              if (!playerStats.has(p1)) playerStats.set(p1, { wins: 0, losses: 0, total: 0 });
              if (!playerStats.has(p2)) playerStats.set(p2, { wins: 0, losses: 0, total: 0 });
              
              playerStats.get(p1)!.total++;
              playerStats.get(p2)!.total++;
              
              // Track wins and losses based on winner
              if (game.winner) {
                if (game.winner === 'draw') {
                  // Draw - no wins or losses for either player
                } else if (game.winner.toLowerCase() === p1) {
                  playerStats.get(p1)!.wins++;
                  playerStats.get(p2)!.losses++;
                } else if (game.winner.toLowerCase() === p2) {
                  playerStats.get(p2)!.wins++;
                  playerStats.get(p1)!.losses++;
                }
              }
            }
          } catch (err) {
            continue;
          }
        }
        
        const leaderboardData: LeaderboardEntry[] = Array.from(playerStats.entries())
          .map(([address, stats]) => ({
            address,
            wins: stats.wins,
            losses: stats.losses,
            totalGames: stats.total,
            winRate: stats.total > 0 ? (stats.wins / stats.total) * 100 : 0,
            rank: 0,
          }))
          .sort((a, b) => b.wins - a.wins)
          .slice(0, 10)
          .map((entry, index) => ({ ...entry, rank: index + 1 }));
        
        setEntries(leaderboardData);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, [gameCounter, blockNumber]);
  
  return { entries, isLoading };
}
