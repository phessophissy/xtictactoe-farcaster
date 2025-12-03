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
  const isWrongNetwork = address && chainId !== 8453; // Base chainId
  const [openGames, setOpenGames] = useState<OpenGame[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { balance } = useUSDCBalance();
  const { allowance, refetch: refetchAllowance } = useUSDCAllowance();
  const { approve, isPending: isApproving } = useApproveUSDC();
  const { createGame, isPending: isCreating } = useCreateGame();
  const { joinGame, isPending: isJoining } = useJoinGame();

  const hasEnoughBalance = balance >= parseUnits('1', 6);
  const hasApproval = allowance >= parseUnits('1', 6);

  // Get total game count
  const { data: gameCounter } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: ESCROW_ABI,
    functionName: 'gameCounter',
  });

  // Watch for new games created
  useWatchContractEvent({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: ESCROW_ABI,
    eventName: 'GameCreated',
    onLogs: () => {
      setRefreshTrigger(prev => prev + 1);
    },
  });

  // Watch for games joined
  useWatchContractEvent({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: ESCROW_ABI,
    eventName: 'GameJoined',
    onLogs: async (logs) => {
      setRefreshTrigger(prev => prev + 1);
      
      // Check if any of these joined games belong to current user as player1
      for (const log of logs) {
        if (log.args?.gameId && address) {
          try {
            // Fetch game data to check if current user is player1
            const response = await fetch(`/api/contract/game/${log.args.gameId}`);
            if (response.ok) {
              const gameData = await response.json();
              if (gameData.player1?.toLowerCase() === address.toLowerCase()) {
                // Current user is player1, navigate to game
                soundManager.playMatchFound();
                vibrateClick();
                setTimeout(() => onGameStart(log.args.gameId as bigint), 1500);
                break; // Only navigate once
              }
            }
          } catch (error) {
            console.error('Error checking game:', error);
          }
        }
      }
    },
  });

  // Fetch open games from contract
  useEffect(() => {
    const fetchOpenGames = async () => {
      if (!gameCounter) return;

      const games: OpenGame[] = [];
      const counter = Number(gameCounter);

      // Fetch ALL games (up to 100 for performance)
      const gamesToFetch = Math.min(counter, 100);
      const startId = Math.max(1, counter - gamesToFetch + 1);
      
      for (let i = counter; i >= startId; i--) {
        try {
          const response = await fetch(`/api/contract/game/${i}`);
          if (!response.ok) continue;
          
          const game = await response.json();
          
          // Only show games that are:
          // 1. Active (not completed)
          // 2. Waiting for player2 (player2 is still address(0))
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
    
    // Create game with address(0) as opponent (open lobby)
    await createGame('0x0000000000000000000000000000000000000000');
    soundManager.playClick();
    vibrateClick();
    setTimeout(() => setRefreshTrigger(prev => prev + 1), 2000);
    
  };

  const handleJoinGame = async (gameId: bigint) => {
    if (!address) return;
    
    // Immediately remove the game from the list (optimistic update)
    setOpenGames(prevGames => prevGames.filter(game => game.gameId !== gameId));
    
    try {
      await joinGame(gameId);
      soundManager.playMatchFound();
      vibrateClick();
      
      // Wait a bit for transaction to be confirmed before navigating
      setTimeout(() => onGameStart(gameId), 2000);
    } catch (error) {
      console.error('Error joining game:', error);
      soundManager.playLose();
      
      // Restore the game to the list if join failed
      setRefreshTrigger(prev => prev + 1);
      
      // Show error message to user
      alert('Failed to join game. It may already be full or the transaction was rejected.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-carton-100 via-carton-200 to-carton-300">
      <div className="w-full max-w-4xl">
        <div className="bg-gradient-to-br from-carton-50 to-carton-100 rounded-2xl shadow-2xl p-8 border-4 border-carton-400">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={onBack}
              className="bg-carton-300 hover:bg-carton-400 text-carton-800 font-bold py-2 px-4 rounded-lg transition-colors"
            >
              ← Back
            </button>
            <h2 className="text-2xl font-bold text-carton-800">🎮 Matchmaking Lobby</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-carton-700">Open Games: {openGames.length}</span>
              <button
                onClick={() => setRefreshTrigger(prev => prev + 1)}
                className="bg-carton-200 hover:bg-carton-300 text-carton-800 p-2 rounded-lg transition-colors"
              >
                🔄
              </button>
            </div>
          </div>

          {isWrongNetwork ? (
            <div className="bg-gradient-to-br from-red-100 to-red-200 rounded-xl p-12 text-center border-4 border-red-400 shadow-xl">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold text-red-900 mb-3">Wrong Network Detected</h3>
              <p className="text-red-700 mb-6 text-lg">You're connected to the wrong network. Please switch to Base.</p>
              <button
                onClick={() => switchChain({ chainId: 8453 })}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg"
              >
                Switch to Base Network
              </button>
              <div className="bg-red-50 rounded-lg p-4 text-sm text-red-800 mt-6">
                <p>💡 Current Network: {chainId === 1 ? 'Ethereum' : chainId === 137 ? 'Polygon' : chainId === 42161 ? 'Arbitrum' : `Chain ${chainId}`}</p>
                <p className="mt-1">✅ Required: Base (Chain 8453)</p>
              </div>
            </div>
          ) : !address ? (
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-12 text-center border-4 border-blue-400 shadow-xl">
              <div className="text-6xl mb-4">👛</div>
              <h3 className="text-2xl font-bold text-blue-900 mb-3">Wallet Not Connected</h3>
              <p className="text-blue-700 mb-6 text-lg">Connect your wallet using the button in the top-right corner to start playing!</p>
              <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
                <p>💡 You'll need:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>A wallet connected to Base network</li>
                  <li>At least 1 USDC to play PvP</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Balance & Approval Section */}
              <div className="bg-carton-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-carton-700">Your USDC Balance:</span>
                  <span className={`font-bold ${hasEnoughBalance ? 'text-green-600' : 'text-red-600'}`}>
                    ${formatUnits(balance, 6)} USDC
                  </span>
                </div>
                {!hasEnoughBalance && (
                  <p className="text-xs text-red-600">You need at least $1 USDC to play</p>
                )}
              </div>

              {/* Entry Fee Info */}
              <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg p-4 border-2 border-yellow-400">
                <div className="grid grid-cols-3 gap-4 text-sm text-center">
                  <div>
                    <div className="text-yellow-800 font-bold">Entry Fee</div>
                    <div className="text-2xl font-bold text-yellow-900">$1.00</div>
                  </div>
                  <div>
                    <div className="text-green-800 font-bold">Winner Prize</div>
                    <div className="text-2xl font-bold text-green-600">$1.70</div>
                  </div>
                  <div>
                    <div className="text-yellow-800 font-bold">Platform Fee</div>
                    <div className="text-2xl font-bold text-yellow-900">$0.30</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                {!hasApproval && hasEnoughBalance && (
                  <button
                    onClick={handleApprove}
                    disabled={isApproving}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isApproving ? '⏳ Approving...' : '1️⃣ Approve $1 USDC'}
                  </button>
                )}

                {hasApproval && (
                  <button
                    onClick={handleCreateOpenGame}
                    disabled={isCreating || !hasEnoughBalance}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreating ? '⏳ Creating...' : '➕ Create Open Game ($1)'}
                  </button>
                )}
              </div>

              {/* Open Games List */}
              <div>
                <h3 className="text-lg font-bold text-carton-800 mb-3">
                  Open Games Waiting for Opponents
                </h3>
                
                {openGames.length === 0 ? (
                  <div className="bg-carton-200 rounded-lg p-8 text-center">
                    <p className="text-carton-700 text-lg mb-2">🎮 No open games</p>
                    <p className="text-sm text-carton-600">Be the first to create one!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {openGames.map((game) => (
                      <div
                        key={game.gameId.toString()}
                        className="bg-white rounded-lg p-4 border-2 border-carton-300 flex justify-between items-center hover:border-carton-500 transition-colors"
                      >
                        <div>
                          <div className="font-bold text-carton-900">Game #{game.gameId.toString()}</div>
                          <div className="text-sm text-carton-600">
                            Player: {game.player1.slice(0, 6)}...{game.player1.slice(-4)}
                          </div>
                          <div className="text-xs text-green-600 mt-1">
                            💰 Prize Pool: ${formatUnits(game.pot, 6)} USDC
                          </div>
                        </div>
                        
                        {game.player1.toLowerCase() === address?.toLowerCase() ? (
                          <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold">
                            ⏳ Your Game (Waiting...)
                          </div>
                        ) : (
                          <button
                            onClick={() => handleJoinGame(game.gameId)}
                            disabled={isJoining || !hasApproval || !hasEnoughBalance}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isJoining ? '⏳ Joining...' : '⚔️ Join Game ($1)'}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="bg-carton-200 rounded-lg p-4 text-xs text-carton-700 space-y-2">
                <p className="font-bold text-carton-800">How Auto-Matchmaking Works:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Create an open game or join an existing one</li>
                  <li>Both players pay $1 USDC entry fee</li>
                  <li>Play your moves - game syncs via blockchain</li>
                  <li>Winner automatically receives $1.70 USDC</li>
                  <li>All moves are permanent on Base blockchain</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
