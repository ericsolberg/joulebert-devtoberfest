// ============================================================
// Joule*Bert — Game Over Screen
// ============================================================

import React, { useEffect } from 'react';

const overlay = {
  position: 'absolute', inset: 0,
  display: 'flex', flexDirection: 'column',
  alignItems: 'center', justifyContent: 'center',
  background: 'rgba(26, 13, 46, 0.92)',
  zIndex: 20,
  animation: 'fadeIn 0.6s ease-out',
};

const titleStyle = {
  fontSize: 'clamp(40px, 6vw, 64px)',
  fontWeight: 900,
  color: '#FF69B4',
  letterSpacing: '0.05em',
  marginBottom: '16px',
  fontFamily: '"Segoe UI", Arial, sans-serif',
  textShadow: '0 0 30px rgba(255,105,180,0.6)',
};

const scoreBoxStyle = {
  background: 'rgba(155,124,199,0.15)',
  border: '2px solid rgba(155,124,199,0.4)',
  borderRadius: '16px',
  padding: '24px 48px',
  marginBottom: '32px',
  textAlign: 'center',
};

const scoreLabelStyle = {
  color: '#9B7CC7',
  fontSize: '14px',
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  marginBottom: '8px',
  fontFamily: '"Segoe UI", Arial, sans-serif',
};

const scoreValueStyle = {
  color: '#F0E8FF',
  fontSize: '48px',
  fontWeight: 900,
  fontFamily: '"Segoe UI", Arial, sans-serif',
};

const btnStyle = {
  background: 'linear-gradient(135deg, #9B7CC7, #6B4E9B)',
  color: '#fff',
  border: 'none',
  borderRadius: '12px',
  padding: '14px 48px',
  fontSize: '20px',
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: '"Segoe UI", Arial, sans-serif',
  boxShadow: '0 4px 24px rgba(155,124,199,0.5)',
  transition: 'transform 0.1s, box-shadow 0.1s',
};

export default function GameOverScreen({ score, onRestart }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onRestart(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onRestart]);

  return (
    <div style={overlay}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>💀</div>
      <h1 style={titleStyle}>GAME OVER</h1>
      <div style={scoreBoxStyle}>
        <div style={scoreLabelStyle}>Final Score</div>
        <div style={scoreValueStyle}>{score.toLocaleString()}</div>
      </div>
      <button
        style={btnStyle}
        onClick={onRestart}
        onMouseEnter={e => { e.target.style.transform = 'scale(1.05)'; e.target.style.boxShadow = '0 6px 32px rgba(155,124,199,0.7)'; }}
        onMouseLeave={e => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 4px 24px rgba(155,124,199,0.5)'; }}
      >
        ↺ PLAY AGAIN
      </button>
      <p style={{ color: '#6B4E9B', fontSize: '12px', marginTop: '16px', fontFamily: '"Segoe UI", Arial, sans-serif' }}>
        Press Enter or Space to restart
      </p>
    </div>
  );
}
