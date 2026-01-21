'use client';

import { useState, useEffect } from 'react';
import { GameMode, AIDifficulty } from '@/utils/game';
import { soundManager, vibrateClick } from '@/utils/sound';

interface ModeSelectorProps {
  onSelectMode: (mode: GameMode) => void;
  difficulty: AIDifficulty;
  onDifficultyChange: (difficulty: AIDifficulty) => void;
}

export default function ModeSelector({ onSelectMode, difficulty, onDifficultyChange }: ModeSelectorProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleModeSelect = (mode: GameMode) => {
    soundManager.playClick();
    vibrateClick();
    onSelectMode(mode);
  };

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    const diff: AIDifficulty = value === 0 ? 'easy' : value === 1 ? 'medium' : 'hard';
    onDifficultyChange(diff);
    soundManager.playClick();
    vibrateClick();
  };

  const difficultyValue = difficulty === 'easy' ? 0 : difficulty === 'medium' ? 1 : 2;
  const difficultyLabels = ['Easy', 'Medium', 'Hard'];

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-obsidian-50 via-obsidian-100 to-obsidian-200 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
      <div className={`w-full max-w-md ${isLoaded ? 'animate-slide-up' : 'opacity-0'}`}>
        <div className="metal-card p-8 animate-glow-gold">
          <h1 className="text-4xl font-bold text-center mb-2 metal-text animate-gold-shimmer drop-shadow-md">
            xTicTacToe
          </h1>
          <p className="text-center text-gold-400 mb-8 animate-fade-in animation-delay-200">Choose Your Battle</p>

          <div className="space-y-4 mb-8">
            <button
              onClick={() => handleModeSelect('ai')}
              className={`w-full metal-btn py-6 px-6 hover:animate-wiggle ${isLoaded ? 'animate-scale-in animation-delay-300' : 'opacity-0'}`}
            >
              <div className="text-2xl mb-1">🤖 AI Mode</div>
              <div className="text-sm opacity-90">Free Practice</div>
            </button>

            <button
              onClick={() => handleModeSelect('pvp')}
              className={`w-full metal-btn py-6 px-6 animate-glow-gold hover:animate-heartbeat ${isLoaded ? 'animate-scale-in animation-delay-500' : 'opacity-0'}`}
            >
              <div className="text-2xl mb-1">⚔️ PvP Mode</div>
              <div className="text-sm opacity-90">$1 USDC Entry</div>
            </button>
          </div>

          <div className={`metal-stats animate-glow-gold ${isLoaded ? 'animate-slide-up animation-delay-700' : 'opacity-0'}`}>
            <label className="block text-gold-300 font-semibold mb-4 text-center metal-text">
              AI Difficulty
            </label>
            <input
              type="range"
              min="0"
              max="2"
              value={difficultyValue}
              onChange={handleDifficultyChange}
              className="w-full h-3 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between mt-2 text-sm text-gold-400">
              {difficultyLabels.map((label, idx) => (
                <span
                  key={label}
                  className={`font-medium transition-all duration-300 ${idx === difficultyValue ? 'text-gold-200 font-bold animate-gold-shimmer scale-110' : ''}`}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className={`mt-6 text-center text-xs text-gold-500 ${isLoaded ? 'animate-fade-in animation-delay-900' : 'opacity-0'}`}>
            <p>PvP: Winner takes 1.70 USDC • Creator fee: 0.30 USDC</p>
          </div>
        </div>
      </div>
    </div>
  );
}
