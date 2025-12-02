'use client';

import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { useApproveUSDC, useCreateGame, useUSDCAllowance, useUSDCBalance } from '@/hooks/useContract';
import { formatUnits, parseUnits, isAddress } from 'viem';
import { soundManager, vibrateClick } from '@/utils/sound';

interface MatchmakingLobbyProps {
  onBack: () => void;
  onGameCreated: (gameId: bigint) => void;
}

export default function MatchmakingLobby({ onBack, onGameCreated }: MatchmakingLobbyProps) {
  const { address } = useAccount();
  const [opponentAddress, setOpponentAddress] = useState('');
  const { balance } = useUSDCBalance();
  const { allowance, refetch: refetchAllowance } = useUSDCAllowance();
  const { approve, isPending: isApproving, isSuccess: isApproved } = useApproveUSDC();
  const { createGame, isPending: isCreating, isSuccess: isGameCreated, hash } = useCreateGame();

  const hasEnoughBalance = balance >= parseUnits('1', 6);
  const hasApproval = allowance >= parseUnits('1', 6);
  const isValidOpponent = opponentAddress && isAddress(opponentAddress) && opponentAddress.toLowerCase() !== address?.toLowerCase();

  const handleApprove = async () => {
    await approve();
    soundManager.playClick();
    vibrateClick();
  };

  const handleCreateGame = async () => {
    if (!isValidOpponent) return;
    await createGame(opponentAddress as `0x${string}`);
    soundManager.playClick();
    vibrateClick();
  };

  // Refetch allowance after approval
  React.useEffect(() => {
    if (isApproved) {
      setTimeout(() => refetchAllowance(), 2000);
    }
  }, [isApproved, refetchAllowance]);

  // Extract game ID from transaction and navigate
  React.useEffect(() => {
    if (isGameCreated && hash) {
      // In a real implementation, you'd parse the transaction logs to get the game ID
      // For now, we'll use a placeholder
      soundManager.playMatchFound();
      setTimeout(() => {
        // This is a simplified version - in production, parse event logs
        onGameCreated(1n); // Placeholder game ID
      }, 2000);
    }
  }, [isGameCreated, hash, onGameCreated]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-carton-100 via-carton-200 to-carton-300">
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-br from-carton-50 to-carton-100 rounded-2xl shadow-2xl p-8 border-4 border-carton-400">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={onBack}
              className="bg-carton-300 hover:bg-carton-400 text-carton-800 font-bold py-2 px-4 rounded-lg transition-colors"
            >
              ← Back
            </button>
            <h2 className="text-2xl font-bold text-carton-800">🎮 Create PvP Game</h2>
            <div className="w-20"></div>
          </div>

          {!address ? (
            <div className="text-center py-8">
              <p className="text-carton-700 mb-4">Connect your wallet to play</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Balance Check */}
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
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-yellow-800">Entry Fee:</span>
                    <span className="font-bold text-yellow-900">$1.00 USDC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-800">Winner Prize:</span>
                    <span className="font-bold text-green-600">$1.70 USDC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-800">Platform Fee:</span>
                    <span className="font-bold text-yellow-900">$0.30 USDC</span>
                  </div>
                </div>
              </div>

              {/* Opponent Address Input */}
              <div>
                <label className="block text-sm font-bold text-carton-800 mb-2">
                  Opponent Wallet Address
                </label>
                <input
                  type="text"
                  value={opponentAddress}
                  onChange={(e) => setOpponentAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-4 py-3 rounded-lg border-2 border-carton-300 focus:border-carton-500 outline-none font-mono text-sm"
                />
                {opponentAddress && !isAddress(opponentAddress) && (
                  <p className="text-xs text-red-600 mt-1">Invalid Ethereum address</p>
                )}
                {opponentAddress && opponentAddress.toLowerCase() === address?.toLowerCase() && (
                  <p className="text-xs text-red-600 mt-1">You cannot play against yourself</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {!hasApproval && hasEnoughBalance && (
                  <button
                    onClick={handleApprove}
                    disabled={isApproving}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isApproving ? '⏳ Approving USDC...' : '1️⃣ Approve $1 USDC'}
                  </button>
                )}

                {hasApproval && (
                  <button
                    onClick={handleCreateGame}
                    disabled={!isValidOpponent || isCreating || !hasEnoughBalance}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreating ? '⏳ Creating Game...' : '2️⃣ Create Game ($1 USDC)'}
                  </button>
                )}
              </div>

              {isGameCreated && (
                <div className="bg-green-100 border-2 border-green-500 rounded-lg p-4 text-center">
                  <p className="text-green-800 font-bold">✅ Game Created!</p>
                  <p className="text-sm text-green-700 mt-1">Waiting for opponent to join...</p>
                </div>
              )}

              {/* Instructions */}
              <div className="bg-carton-200 rounded-lg p-4 text-xs text-carton-700 space-y-2">
                <p className="font-bold text-carton-800">How it works:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>You pay $1 USDC to create a game</li>
                  <li>Your opponent pays $1 USDC to join</li>
                  <li>Winner gets $1.70 USDC automatically</li>
                  <li>All moves recorded on Base blockchain</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
