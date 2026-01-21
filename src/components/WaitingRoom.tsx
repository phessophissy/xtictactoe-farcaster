'use client';

import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useApproveUSDC, useCreateGameSponsored, useJoinGameSponsored } from '@/hooks/useContract';
import { soundManager, vibrateClick } from '@/utils/sound';

interface WaitingRoomProps {
  opponent: string;
  onBack: () => void;
  onGameStart: (gameId: bigint) => void;
  isCreator: boolean;
}

export default function WaitingRoom({ opponent, onBack, onGameStart, isCreator }: WaitingRoomProps) {
  const { address } = useAccount();
  const { approve, isPending: isApproving } = useApproveUSDC();
  const { createGameSponsored, isPending: isCreating } = useCreateGameSponsored();
  const { joinGameSponsored, isPending: isJoining } = useJoinGameSponsored();
  const [step, setStep] = React.useState<'approve' | 'waiting' | 'ready'>('approve');
  const [useGasSponsored, setUseGasSponsored] = React.useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleApprove = async () => {
    if (!useGasSponsored) {
      await approve();
      soundManager.playClick();
      vibrateClick();
      setStep('waiting');
    } else {
      setStep('waiting');
    }
  };

  const handleCreateGame = async () => {
    if (!address) return;
    soundManager.playClick();
    vibrateClick();
    if (useGasSponsored) {
      const mockGameId = BigInt(Math.floor(Math.random() * 1000));
      setTimeout(() => onGameStart(mockGameId), 1000);
    }
  };

  const handleJoinGame = async () => {
    soundManager.playClick();
    vibrateClick();
    if (useGasSponsored) {
      const mockGameId = BigInt(1);
      setTimeout(() => onGameStart(mockGameId), 1000);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-obsidian-50 via-obsidian-100 to-obsidian-200 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
      <div className={`w-full max-w-md ${isLoaded ? 'animate-slide-up' : 'opacity-0'}`}>
        <div className="metal-card p-8 animate-glow-gold">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={onBack}
              className="metal-btn text-sm hover:animate-wiggle"
            >
              ← Back
            </button>
            <h2 className="text-2xl font-bold metal-text animate-gold-shimmer">Match Setup</h2>
            <div className="w-20"></div>
          </div>

          <div className="mb-6 text-center">
            <div className={`metal-stats rounded-xl p-6 mb-4 ${isLoaded ? 'animate-scale-in animation-delay-200' : 'opacity-0'}`}>
              <p className="text-sm text-gold-500 mb-2">Opponent</p>
              <p className="font-bold metal-text animate-gold-shimmer">{opponent}</p>
            </div>

            <div className={`metal-stats rounded-xl p-4 mb-4 ${isLoaded ? 'animate-scale-in animation-delay-300' : 'opacity-0'}`}>
              <label className="flex items-center justify-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useGasSponsored}
                  onChange={(e) => {
                    setUseGasSponsored(e.target.checked);
                    soundManager.playClick();
                  }}
                  className="w-5 h-5 accent-gold-500"
                />
                <span className="text-gold-300 font-semibold">Use Gas-Sponsored Entry ⚡</span>
              </label>
              <p className="text-xs text-gold-500 mt-2">Free gas for this match</p>
            </div>

            {step === 'approve' && (
              <div className={`space-y-4 ${isLoaded ? 'animate-fade-in animation-delay-400' : 'opacity-0'}`}>
                <p className="text-gold-400">
                  {useGasSponsored ? 'Ready to create match' : 'Approve USDC to continue'}
                </p>
                <button
                  onClick={handleApprove}
                  disabled={isApproving}
                  className="w-full metal-btn py-4 px-6 hover:animate-heartbeat disabled:opacity-50"
                >
                  {isApproving ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="metal-spinner w-5 h-5"></span> Approving...
                    </span>
                  ) : (
                    useGasSponsored ? 'Continue' : 'Approve USDC'
                  )}
                </button>
              </div>
            )}

            {step === 'waiting' && (
              <div className={`space-y-4 ${isLoaded ? 'animate-slide-up' : 'opacity-0'}`}>
                {isCreator ? (
                  <>
                    <p className="text-gold-400 animate-pulse-gold">Create match and wait for opponent</p>
                    <button
                      onClick={handleCreateGame}
                      disabled={isCreating}
                      className="w-full metal-btn py-4 px-6 animate-glow-gold hover:animate-tada disabled:opacity-50"
                    >
                      {isCreating ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="metal-spinner w-5 h-5"></span> Creating...
                        </span>
                      ) : (
                        'Create Match'
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-gold-400 animate-pulse-gold">Join the match</p>
                    <button
                      onClick={handleJoinGame}
                      disabled={isJoining}
                      className="w-full metal-btn py-4 px-6 animate-glow-gold hover:animate-tada disabled:opacity-50"
                    >
                      {isJoining ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="metal-spinner w-5 h-5"></span> Joining...
                        </span>
                      ) : (
                        'Join Match'
                      )}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <div className={`text-center text-xs text-gold-500 space-y-1 ${isLoaded ? 'animate-fade-in animation-delay-500' : 'opacity-0'}`}>
            <p>Entry: 1 USDC per player</p>
            <p className="text-gold-400">Winner receives: 1.70 USDC</p>
            <p>Platform fee: 0.30 USDC</p>
          </div>
        </div>
      </div>
    </div>
  );
}
