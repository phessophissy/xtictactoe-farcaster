'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useWatchContractEvent, useReadContract, useChainId, useSwitchChain } from 'wagmi';
import { useApproveUSDC, useCreateGame, useJoinGame, useUSDCAllowance, useUSDCBalance } from '@/hooks/useContract';
import { formatUnits, parseUnits } from 'viem';
import { soundManager, vibrateClick } from '@/utils/sound';
import { CONTRACT_ADDRESS, ESCROW_ABI } from '@/config/contracts';

interface MatchmakingLobbyProps {
  onBack: () => void;
  onGameStart: (gameId: bigint) => void;
}

interface OpenGame {
  gameId: bigint;
  player1: string;
  pot: bigint;
  active: boolean;
  completed: boolean;
}

export default function MatchmakingLobby({ onBack, onGameStart }: MatchmakingLobbyProps) {
  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const isWrongNetwork = address && chainId !== 8453;
  const [openGames, setOpenGames] = useState<OpenGame[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const { balance } = useUSDCBalance();
  const { allowance, refetch: refetchAllowance } = useUSDCAllowance();
  const { approve, isPending: isApproving } = useApproveUSDC();
  const { createGame, isPending: isCreating } = useCreateGame();
  const { joinGame, isPending: isJoining } = useJoinGame();

  const hasEnoughBalance = balance >= parseUnits('1', 6);
  const hasApproval = allowance >= parseUnits('1', 6);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const { data: gameCounter } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: ESCROW_ABI,
    functionName: 'gameCounter',
  });

  useWatchContractEvent({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: ESCROW_ABI,
    eventName: 'GameCreated',
    onLogs: () => {
      setRefreshTrigger(prev => prev + 1);
    },
  });

  useWatchContractEvent({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: ESCROW_ABI,
    eventName: 'GameJoined',
    onLogs: async (logs) => {
      setRefreshTrigger(prev => prev + 1);
      
      for (const log of logs) {
        if (log.args?.gameId && address) {
          try {
            const response = await fetch(`/api/contract/game/${log.args.gameId}`);
            if (response.ok) {
              const gameData = await response.json();
              if (gameData.player1?.toLowerCase() === address.toLowerCase()) {
                soundManager.playMatchFound();
                vibrateClick();
                setTimeout(() => onGameStart(log.args.gameId as bigint), 1500);
                break;
              }
            }
          } catch (error) {
            console.error('Error checking game:', error);
          }
        }
      }
    },
  });

  useEffect(() => {
    const fetchOpenGames = async () => {
      if (!gameCounter) return;

      const games: OpenGame[] = [];
      const counter = Number(gameCounter);

      const gamesToFetch = Math.min(counter, 100);
      const startId = Math.max(1, counter - gamesToFetch + 1);
      
      for (let i = counter; i >= startId; i--) {
        try {
          const response = await fetch(`/api/contract/game/${i}`);
          if (!response.ok) continue;
          
          const game = await response.json();
          
          const isWaitingForPlayer2 = game.player2 === '0x0000000000000000000000000000000000000000' ||
                                      game.player2 === '0x0' ||
                                      !game.player2;
          
          if (game.active && !game.completed && isWaitingForPlayer2) {
            games.push({
              gameId: BigInt(i),
              player1: game.player1,
              pot: BigInt(game.pot),
              active: game.active,
              completed: game.completed,
            });
          }
        } catch (error) {
          console.error(`Error fetching game ${i}:`, error);
        }
      }

      setOpenGames(games);
    };

    fetchOpenGames();
  }, [gameCounter, refreshTrigger]);

  const handleApprove = async () => {
    await approve();
    soundManager.playClick();
    vibrateClick();
    setTimeout(() => refetchAllowance(), 2000);
  };

  const handleCreateOpenGame = async () => {
    if (!address) return;
    
    await createGame('0x0000000000000000000000000000000000000000');
    soundManager.playClick();
    vibrateClick();
    setTimeout(() => setRefreshTrigger(prev => prev + 1), 2000);
    
  };

  const handleJoinGame = async (gameId: bigint) => {
    if (!address) return;
    
    setOpenGames(prevGames => prevGames.filter(game => game.gameId !== gameId));
    
    try {
      await joinGame(gameId);
      soundManager.playMatchFound();
      vibrateClick();
      
      setTimeout(() => onGameStart(gameId), 2000);
    } catch (error) {
      console.error('Error joining game:', error);
      soundManager.playLose();
      
      setRefreshTrigger(prev => prev + 1);
      
      alert('Failed to join game. It may already be full or the transaction was rejected.');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-obsidian-900 via-obsidian-800 to-obsidian-900 transition-all duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`w-full max-w-4xl transition-all duration-700 ${isLoaded ? 'animate-fade-in' : ''}`}>
        <div className="metal-card p-8">
          <div className={`flex justify-between items-center mb-6 ${isLoaded ? 'animate-slide-down' : ''}`} style={{ animationDelay: '100ms' }}>
            <button
              onClick={onBack}
              className="metal-btn py-2 px-4"
            >
              ← Back
            </button>
            <h2 className="text-2xl font-bold metal-text animate-gold-glow">🎮 Matchmaking Lobby</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gold-400">Open Games: {openGames.length}</span>
              <button
                onClick={() => setRefreshTrigger(prev => prev + 1)}
                className="metal-btn p-2 hover:animate-spin-slow"
              >
                🔄
              </button>
            </div>
          </div>

          {isWrongNetwork ? (
            <div className={`text-center py-8 ${isLoaded ? 'animate-fade-in' : ''}`} style={{ animationDelay: '200ms' }}>
              <p className="text-gold-400 mb-4">Please switch to Base network to play</p>
              <button
                onClick={() => switchChain({ chainId: 8453 })}
                className="metal-btn py-3 px-6 animate-pulse-gold"
              >
                Switch to Base
              </button>
            </div>
          ) : !address ? (
            <div className={`text-center py-8 ${isLoaded ? 'animate-fade-in' : ''}`} style={{ animationDelay: '200ms' }}>
              <p className="text-gold-400">Connect your wallet to play</p>
            </div>
          ) : (
            <>
              <div className={`mb-6 metal-stats ${isLoaded ? 'animate-slide-up' : ''}`} style={{ animationDelay: '200ms' }}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gold-400 font-semibold">Your Balance:</p>
                    <p className="text-2xl font-bold metal-text">{formatUnits(balance, 6)} USDC</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gold-500 text-sm">Entry Fee: 1 USDC</p>
                    <p className="text-gold-500 text-sm">Prize: 1.70 USDC</p>
                  </div>
                </div>
              </div>

              {!hasEnoughBalance ? (
                <div className={`text-center py-4 bg-red-900/50 rounded-lg border-2 border-red-500 mb-6 ${isLoaded ? 'animate-shake' : ''}`} style={{ animationDelay: '300ms' }}>
                  <p className="text-red-400">Insufficient USDC balance. You need at least 1 USDC to play.</p>
                </div>
              ) : !hasApproval ? (
                <div className={`text-center py-4 mb-6 ${isLoaded ? 'animate-fade-in' : ''}`} style={{ animationDelay: '300ms' }}>
                  <p className="text-gold-400 mb-4">Approve USDC spending to create or join games</p>
                  <button
                    onClick={handleApprove}
                    disabled={isApproving}
                    className="metal-btn py-3 px-8 disabled:opacity-50"
                  >
                    {isApproving ? (
                      <span className="flex items-center gap-2">
                        <span className="metal-spinner"></span>
                        Approving...
                      </span>
                    ) : 'Approve USDC'}
                  </button>
                </div>
              ) : (
                <>
                  <div className={`mb-6 ${isLoaded ? 'animate-scale-in' : ''}`} style={{ animationDelay: '300ms' }}>
                    <button
                      onClick={handleCreateOpenGame}
                      disabled={isCreating}
                      className="w-full metal-btn py-4 px-6 text-lg animate-glow-pulse disabled:opacity-50"
                    >
                      {isCreating ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="metal-spinner"></span>
                          Creating Game...
                        </span>
                      ) : '🎮 Create New Game'}
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    <h3 className={`text-lg font-bold metal-text mb-3 ${isLoaded ? 'animate-fade-in' : ''}`} style={{ animationDelay: '400ms' }}>Open Games</h3>
                    {openGames.length === 0 ? (
                      <p className={`text-center text-gold-500 py-8 ${isLoaded ? 'animate-fade-in' : ''}`} style={{ animationDelay: '500ms' }}>No open games. Create one!</p>
                    ) : (
                      openGames.map((game, index) => (
                        <div
                          key={game.gameId.toString()}
                          className={`flex items-center justify-between p-4 metal-stats hover:border-gold-400 transition-all duration-300 ${isLoaded ? 'animate-slide-right' : ''}`}
                          style={{ animationDelay: `${500 + index * 100}ms` }}
                        >
                          <div>
                            <p className="font-bold metal-text">Game #{game.gameId.toString()}</p>
                            <p className="text-sm text-gold-500">
                              Creator: {game.player1.slice(0, 6)}...{game.player1.slice(-4)}
                            </p>
                          </div>
                          <button
                            onClick={() => handleJoinGame(game.gameId)}
                            disabled={isJoining || game.player1.toLowerCase() === address?.toLowerCase()}
                            className="metal-btn py-2 px-6 disabled:opacity-50"
                          >
                            {isJoining ? 'Joining...' : game.player1.toLowerCase() === address?.toLowerCase() ? 'Your Game' : 'Join'}
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </>
          )}

          <div className={`mt-6 text-center text-xs text-gold-600 ${isLoaded ? 'animate-fade-in' : ''}`} style={{ animationDelay: '600ms' }}>
            <p>Games are played on Base • Smart contract secured</p>
          </div>
        </div>
      </div>
    </div>
  );
}
