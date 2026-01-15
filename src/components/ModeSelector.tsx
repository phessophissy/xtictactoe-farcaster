'use client';

import { GameMode, AIDifficulty } from '@/utils/game';
import { soundManager, vibrateClick } from '@/utils/sound';

interface ModeSelectorProps {
  onSelectMode: (mode: GameMode) => void;
  difficulty: AIDifficulty;
  onDifficultyChange: (difficulty: AIDifficulty) => void;
}

export default function ModeSelector({ onSelectMode, difficulty, onDifficultyChange }: ModeSelectorProps) {
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-leaf-100 via-leaf-200 to-leaf-300">
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-br from-leaf-50 to-leaf-100 rounded-2xl shadow-2xl p-8 border-4 border-leaf-400">
          <h1 className="text-4xl font-bold text-center mb-2 text-leaf-800 drop-shadow-md">
            xTicTacToe
          </h1>
          <p className="text-center text-leaf-600 mb-8">Choose Your Battle</p>

          <div className="space-y-4 mb-8">
            <button
              onClick={() => handleModeSelect('ai')}
              className="w-full bg-gradient-to-r from-leaf-400 to-leaf-500 hover:from-leaf-500 hover:to-leaf-600 text-white font-bold py-6 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-2 border-leaf-600"
            >
              <div className="text-2xl mb-1">🤖 AI Mode</div>
              <div className="text-sm opacity-90">Free Practice</div>
            </button>

            {/* Quick Play Button */}
            <button
              onClick={() => handleModeSelect('ai')}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-102 transition-all duration-200 border-2 border-green-700 flex items-center justify-center gap-2"
            >
              <span className="text-xl">⚡</span>
              <div className="text-center">
                <div className="text-lg">Quick Play</div>
                <div className="text-xs opacity-90">Instant AI game • Last 30s</div>
              </div>
            </button>

            <button
              onClick={() => handleModeSelect('pvp')}
              className="w-full bg-gradient-to-r from-leaf-600 to-leaf-700 hover:from-leaf-700 hover:to-leaf-800 text-white font-bold py-6 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-2 border-leaf-800 animate-glow-pulse"
            >
              <div className="text-2xl mb-1">⚔️ PvP Mode</div>
              <div className="text-sm opacity-90">$1 USDC Entry</div>
            </button>
          </div>

          <div className="bg-leaf-200 rounded-xl p-6 border-2 border-leaf-300">
            <label className="block text-leaf-800 font-semibold mb-4 text-center">
              AI Difficulty
            </label>
            <input
              type="range"
              min="0"
              max="2"
              value={difficultyValue}
              onChange={handleDifficultyChange}
              className="w-full h-3 bg-leaf-300 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #22c55e 0%, #22c55e ${difficultyValue * 50}%, #bbf7d0 ${difficultyValue * 50}%, #bbf7d0 100%)`
              }}
            />
            <div className="flex justify-between mt-2 text-sm text-leaf-700">
              {difficultyLabels.map((label, idx) => (
                <span
                  key={label}
                  className={`font-medium ${idx === difficultyValue ? 'text-leaf-900 font-bold' : ''}`}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-leaf-600">
            <p>PvP: Winner takes 1.70 USDC • Creator fee: 0.30 USDC</p>
          </div>
        </div>
      </div>
    </div>
  );
}
