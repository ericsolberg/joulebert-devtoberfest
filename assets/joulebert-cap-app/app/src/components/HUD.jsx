// ============================================================
// Joule*Bert — HUD Overlay
// Shows score, lives, and current level.
// ============================================================

import React from 'react';

const hudStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 20px',
  background: 'rgba(26, 13, 46, 0.88)',
  borderBottom: '1px solid rgba(155,124,199,0.3)',
  color: '#F0E8FF',
  fontFamily: '"Segoe UI", Arial, sans-serif',
  fontSize: '16px',
  fontWeight: 600,
  zIndex: 10,
  userSelect: 'none',
};

const sectionStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const labelStyle = {
  color: '#9B7CC7',
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
};

const valueStyle = {
  color: '#F0E8FF',
  fontSize: '18px',
  fontWeight: 700,
  minWidth: '60px',
};

const gemIcon = (filled) => (
  <svg key={Math.random()} width="16" height="20" viewBox="0 0 16 20">
    <polygon
      points="8,1 15,6 12,18 4,18 1,6"
      fill={filled ? '#C4A8E8' : 'rgba(155,124,199,0.25)'}
      stroke="#9B7CC7"
      strokeWidth="1"
    />
    <line x1="8" y1="1" x2="8" y2="18" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"/>
    <line x1="1" y1="6" x2="15" y2="6" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"/>
  </svg>
);

export default function HUD({ score, lives, level, maxLives = 3 }) {
  return (
    <div style={hudStyle}>
      <div style={sectionStyle}>
        <span style={labelStyle}>Score</span>
        <span style={valueStyle}>{score.toLocaleString()}</span>
      </div>
      <div style={sectionStyle}>
        <span style={labelStyle}>Lives</span>
        <div style={{ display: 'flex', gap: '3px' }}>
          {Array.from({ length: maxLives }).map((_, i) => gemIcon(i < lives))}
        </div>
      </div>
      <div style={sectionStyle}>
        <span style={labelStyle}>Level</span>
        <span style={{ ...valueStyle, color: '#C4A8E8', minWidth: '30px' }}>{level}</span>
      </div>
    </div>
  );
}
