'use client';

import React, { useState } from 'react';
import ModeSelector from '@/components/ModeSelector';
import GameBoard from '@/components/GameBoard';
import MatchmakingLobby from '@/components/MatchmakingLobby';
import PvPGame from '@/components/PvPGame';
import Leaderboard from '@/components/Leaderboard';
import WalletButton from '@/components/WalletButton';
import { GameMode, AIDifficulty } from '@/utils/game';
import { soundManager, vibrateClick } from '@/utils/sound';

type Screen = 'menu' | 'game' | 'matchmaking' | 'pvpgame' | 'leaderboard';

export default function Home() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [mode, setMode] = useState<GameMode>('ai');
  const [difficulty, setDifficulty] = useState<AIDifficulty>('medium');
  const [gameId, setGameId] = useState<bigint | null>(null);
  const [playerSymbol, setPlayerSymbol] = useState<'X' | 'O'>('X');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleSelectMode = (selectedMode: GameMode) => {
    setMode(selectedMode);
    if (selectedMode === 'ai') {
      setScreen('game');
    } else {
      setScreen('matchmaking');
    }
  };

  const handleGameCreated = (id: bigint, symbol: 'X' | 'O') => {
    setGameId(id);
    setPlayerSymbol(symbol);
    setScreen('pvpgame');
  };

  const handleBack = () => {
    setScreen('menu');
    setGameId(null);
  };

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    soundManager.setEnabled(newState);
    soundManager.playClick();
    vibrateClick();
  };

  const showLeaderboard = () => {
    setScreen('leaderboard');
    soundManager.playClick();
    vibrateClick();
  };

  return (
    <main className="relative">
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={toggleSound}
          className="bg-wood-600 hover:bg-wood-500 text-white font-bold p-3 rounded-lg shadow-lg transition-all border border-wood-400"
          title={soundEnabled ? 'Mute' : 'Unmute'}
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>
        {screen === 'menu' && (
          <button
            onClick={showLeaderboard}
            className="bg-wood-600 hover:bg-wood-500 text-white font-bold p-3 rounded-lg shadow-lg transition-all border border-wood-400"
            title="Leaderboard"
          >
            🏆
          </button>
        )}
        <WalletButton />
      </div>

      {screen === 'menu' && (
        <ModeSelector
          onSelectMode={handleSelectMode}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
        />
      )}

      {screen === 'game' && (
        <GameBoard
          mode={mode}
          difficulty={difficulty}
          onBack={handleBack}
        />
      )}

      {screen === 'matchmaking' && (
        <MatchmakingLobby
          onBack={handleBack}
          onGameStart={handleGameCreated}
        />
      )}

      {screen === 'pvpgame' && gameId && (
        <PvPGame
          gameId={gameId.toString()}
          playerSymbol={playerSymbol}
          onBack={handleBack}
        />
      )}

      {screen === 'leaderboard' && (
        <Leaderboard
          onBack={handleBack}
        />
      )}
    </main>
  );
}
