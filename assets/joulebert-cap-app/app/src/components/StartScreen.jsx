// ============================================================
// Joule*Bert — Start Screen
// ============================================================

import React, { useEffect } from 'react';

const overlay = {
  position: 'absolute', inset: 0,
  display: 'flex', flexDirection: 'column',
  alignItems: 'center', justifyContent: 'center',
  background: 'linear-gradient(160deg, #1a0d2e 0%, #2e1a4a 60%, #1a0d2e 100%)',
  zIndex: 20,
  animation: 'fadeIn 0.5s ease-out',
};

const titleStyle = {
  fontSize: 'clamp(40px, 7vw, 72px)',
  fontWeight: 900,
  background: 'linear-gradient(135deg, #C4A8E8 0%, #9B7CC7 40%, #FF69B4 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  letterSpacing: '-0.02em',
  animation: 'pulse 2.5s ease-in-out infinite',
  marginBottom: '8px',
  fontFamily: '"Segoe UI", Arial, sans-serif',
};

const subtitleStyle = {
  color: '#9B7CC7',
  fontSize: '16px',
  marginBottom: '32px',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  fontFamily: '"Segoe UI", Arial, sans-serif',
};

const gemSvg = (
  <svg width="80" height="100" viewBox="0 0 80 100" style={{ animation: 'float 2.8s ease-in-out infinite', marginBottom: '24px' }}>
    <defs>
      <linearGradient id="gemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#C4A8E8"/>
        <stop offset="40%" stopColor="#9B7CC7"/>
        <stop offset="100%" stopColor="#6B4E9B"/>
      </linearGradient>
    </defs>
    <polygon points="40,4 76,28 64,88 16,88 4,28" fill="url(#gemGrad)" stroke="#C4A8E8" strokeWidth="1.5"/>
    <line x1="40" y1="4" x2="40" y2="88" stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
    <line x1="4" y1="28" x2="76" y2="28" stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
    <polygon points="40,4 20,28 40,38 60,28" fill="rgba(255,255,255,0.15)"/>
  </svg>
);

const instructionStyle = {
  background: 'rgba(155,124,199,0.12)',
  border: '1px solid rgba(155,124,199,0.3)',
  borderRadius: '12px',
  padding: '16px 28px',
  marginBottom: '32px',
  maxWidth: '360px',
  width: '90%',
};

const instrRow = {
  display: 'flex', justifyContent: 'space-between',
  alignItems: 'center', gap: '16px',
  color: '#C4A8E8', fontSize: '14px',
  fontFamily: '"Segoe UI", Arial, sans-serif',
  marginBottom: '8px',
};

const keyBadge = {
  background: 'rgba(155,124,199,0.2)',
  border: '1px solid rgba(155,124,199,0.4)',
  borderRadius: '6px',
  padding: '2px 8px',
  fontSize: '12px',
  fontFamily: 'monospace',
  color: '#F0E8FF',
};

const playBtnStyle = {
  background: 'linear-gradient(135deg, #9B7CC7, #6B4E9B)',
  color: '#fff',
  border: 'none',
  borderRadius: '12px',
  padding: '14px 48px',
  fontSize: '20px',
  fontWeight: 700,
  cursor: 'pointer',
  letterSpacing: '0.05em',
  fontFamily: '"Segoe UI", Arial, sans-serif',
  boxShadow: '0 4px 24px rgba(155,124,199,0.5)',
  transition: 'transform 0.1s, box-shadow 0.1s',
};

export default function StartScreen({ onPlay }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPlay(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onPlay]);

  return (
    <div style={overlay}>
      {gemSvg}
      <h1 style={titleStyle}>Joule*Bert</h1>
      <p style={subtitleStyle}>A Q*bert adventure for the Joule Studio team</p>

      <div style={instructionStyle}>
        <div style={instrRow}>
          <span>Hop to colour all tiles</span>
          <span style={keyBadge}>Objective</span>
        </div>
        <div style={instrRow}>
          <span>Move diagonally</span>
          <span style={keyBadge}>↑ ↓ ← → or WASD</span>
        </div>
        <div style={{ ...instrRow, marginBottom: 0 }}>
          <span>Avoid the gremlins!</span>
          <span style={{ fontSize: '16px' }}>👾</span>
        </div>
      </div>

      <button
        style={playBtnStyle}
        onClick={onPlay}
        onMouseEnter={e => { e.target.style.transform = 'scale(1.05)'; e.target.style.boxShadow = '0 6px 32px rgba(155,124,199,0.7)'; }}
        onMouseLeave={e => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 4px 24px rgba(155,124,199,0.5)'; }}
      >
        ▶ PLAY
      </button>
      <p style={{ color: '#6B4E9B', fontSize: '12px', marginTop: '16px', fontFamily: '"Segoe UI", Arial, sans-serif' }}>
        Press Enter or Space to start
      </p>
    </div>
  );
}
