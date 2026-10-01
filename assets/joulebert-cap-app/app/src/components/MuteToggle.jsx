// ============================================================
// Joule*Bert — Mute Toggle Button
// ============================================================

import React, { useState } from 'react';
import { toggleMute, isMuted } from '../engine/audio.js';

export default function MuteToggle() {
  const [muted, setMuted] = useState(isMuted());

  const handleToggle = () => {
    const newMuted = toggleMute();
    setMuted(newMuted);
  };

  return (
    <button
      onClick={handleToggle}
      title={muted ? 'Unmute' : 'Mute'}
      style={{
        position: 'absolute',
        bottom: '12px',
        right: '12px',
        background: 'rgba(36, 18, 60, 0.85)',
        border: '1px solid rgba(155,124,199,0.4)',
        borderRadius: '8px',
        color: '#C4A8E8',
        fontSize: '18px',
        width: '36px',
        height: '36px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 15,
        transition: 'background 0.2s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(155,124,199,0.3)'}
      onMouseLeave={e => e.currentTarget.style.background = 'rgba(36, 18, 60, 0.85)'}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  );
}
