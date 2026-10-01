// ============================================================
// Joule*Bert — Root App Component
// Manages game state machine: start → playing → gameOver
// Wraps everything in the SAP UI5 Shell Bar.
// ============================================================

import React, { useState, useCallback } from 'react';
import '@ui5/webcomponents-fiori/dist/ShellBar.js';
import '@ui5/webcomponents/dist/Button.js';

import GameCanvas from './components/GameCanvas.jsx';
import StartScreen from './components/StartScreen.jsx';
import GameOverScreen from './components/GameOverScreen.jsx';
import HUD from './components/HUD.jsx';
import MuteToggle from './components/MuteToggle.jsx';

const GAME_STATE = { START: 'start', PLAYING: 'playing', GAMEOVER: 'gameover' };

const shellBarStyle = {
  '--_ui5-shellbar-color': '#C4A8E8',
  '--_ui5-shellbar-background': '#1a0d2e',
  '--_ui5-shellbar-border-bottom': '1px solid rgba(155,124,199,0.3)',
};

// Joule gem as a tiny inline SVG for the shell bar logo
const jouleGemLogo = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><polygon points="16,2 30,10 25,28 7,28 2,10" fill="#9B7CC7" stroke="#C4A8E8" stroke-width="1"/><line x1="16" y1="2" x2="16" y2="28" stroke="rgba(255,255,255,0.35)" stroke-width="0.8"/><line x1="2" y1="10" x2="30" y2="10" stroke="rgba(255,255,255,0.35)" stroke-width="0.8"/></svg>`)}`;

export default function App() {
  const [gameState, setGameState] = useState(GAME_STATE.START);
  const [gameKey, setGameKey]     = useState(0);
  const [hudData, setHudData]     = useState({ score: 0, lives: 3, level: 1 });

  const handleStateChange = useCallback((state) => {
    if (state.gameOver) {
      setGameState(GAME_STATE.GAMEOVER);
    }
    setHudData(prev => ({
      score: state.score  ?? prev.score,
      lives: state.lives  ?? prev.lives,
      level: state.level  ?? prev.level,
    }));
  }, []);

  const handlePlay = () => {
    setHudData({ score: 0, lives: 3, level: 1 });
    setGameKey(k => k + 1);
    setGameState(GAME_STATE.PLAYING);
  };

  const handleRestart = () => {
    handlePlay();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#1a0d2e' }}>
      {/* SAP UI5 Shell Bar */}
      <ui5-shell-bar
        primary-title="Joule*Bert"
        secondary-title="Q*Bert for the Joule Studio Team"
        logo={jouleGemLogo}
        style={shellBarStyle}
      />

      {/* Game area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

        {/* Canvas — always mounted while playing to preserve the loop */}
        {gameState === GAME_STATE.PLAYING && (
          <>
            <GameCanvas
              onStateChange={handleStateChange}
              gameKey={gameKey}
            />
            <HUD
              score={hudData.score}
              lives={hudData.lives}
              level={hudData.level}
            />
            <MuteToggle />
          </>
        )}

        {/* Screens */}
        {gameState === GAME_STATE.START    && <StartScreen   onPlay={handlePlay} />}
        {gameState === GAME_STATE.GAMEOVER && (
          <GameOverScreen
            score={hudData.score}
            onRestart={handleRestart}
          />
        )}
      </div>

      {/* Enemy legend strip */}
      {gameState === GAME_STATE.PLAYING && (
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '24px',
          padding: '6px 20px',
          background: 'rgba(26, 13, 46, 0.9)',
          borderTop: '1px solid rgba(155,124,199,0.2)',
          fontSize: '12px', color: '#9B7CC7',
          fontFamily: '"Segoe UI", Arial, sans-serif',
        }}>
          <span>🤖 <strong style={{ color: '#FF6B35' }}>Bug Bot</strong> — avoid!</span>
          <span>👻 <strong style={{ color: '#FF69B4' }}>Hallucinator</strong> — avoid!</span>
          <span>💾 <strong style={{ color: '#8B7355' }}>Legacy Blocker</strong> — reverts tiles</span>
        </div>
      )}
    </div>
  );
}
