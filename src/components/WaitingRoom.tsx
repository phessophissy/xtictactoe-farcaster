'use client';

import React from 'react';
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gold-100 via-gold-200 to-gold-300">
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-br from-gold-50 to-gold-100 rounded-2xl shadow-2xl p-8 border-4 border-gold-400">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={onBack}
              className="bg-gold-300 hover:bg-gold-400 text-gold-800 font-bold py-2 px-4 rounded-lg transition-colors"
            >
              ← Back
            </button>
            <h2 className="text-2xl font-bold text-gold-800">Match Setup</h2>
            <div className="w-20"></div>
          </div>

          <div className="mb-6 text-center">
            <div className="bg-gold-200 rounded-xl p-6 mb-4">
              <p className="text-sm text-gold-600 mb-2">Opponent</p>
              <p className="font-bold text-gold-800">{opponent}</p>
            </div>

            <div className="bg-gold-200 rounded-xl p-4 mb-4">
              <label className="flex items-center justify-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useGasSponsored}
                  onChange={(e) => {
                    setUseGasSponsored(e.target.checked);
                    soundManager.playClick();
                  }}
                  className="w-5 h-5 accent-gold-600"
                />
                <span className="text-gold-800 font-semibold">Use Gas-Sponsored Entry ⚡</span>
              </label>
              <p className="text-xs text-gold-600 mt-2">Free gas for this match</p>
            </div>

            {step === 'approve' && (
              <div className="space-y-4">
                <p className="text-gold-700">
                  {useGasSponsored ? 'Ready to create match' : 'Approve USDC to continue'}
                </p>
                <button
                  onClick={handleApprove}
                  disabled={isApproving}
                  className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all disabled:opacity-50"
                >
                  {isApproving ? 'Approving...' : useGasSponsored ? 'Continue' : 'Approve USDC'}
                </button>
              </div>
            )}

            {step === 'waiting' && (
              <div className="space-y-4">
                {isCreator ? (
                  <>
                    <p className="text-gold-700">Create match and wait for opponent</p>
                    <button
                      onClick={handleCreateGame}
                      disabled={isCreating}
                      className="w-full bg-gradient-to-r from-gold-600 to-gold-700 hover:from-gold-700 hover:to-gold-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all disabled:opacity-50 animate-glow-pulse"
                    >
                      {isCreating ? 'Creating...' : 'Create Match'}
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-gold-700">Join the match</p>
                    <button
                      onClick={handleJoinGame}
                      disabled={isJoining}
                      className="w-full bg-gradient-to-r from-gold-600 to-gold-700 hover:from-gold-700 hover:to-gold-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all disabled:opacity-50 animate-glow-pulse"
                    >
                      {isJoining ? 'Joining...' : 'Join Match'}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="text-center text-xs text-gold-600 space-y-1">
            <p>Entry: 1 USDC per player</p>
            <p>Winner receives: 1.70 USDC</p>
            <p>Platform fee: 0.30 USDC</p>
          </div>
        </div>
      </div>
    </div>
  );
}
