// ============================================================
// Joule*Bert — Game Canvas Component
// Mounts the game loop onto the canvas ref.
// ============================================================

import React, { useRef, useEffect, useCallback } from 'react';
import { GameLoop } from '../engine/gameLoop.js';
import { initInput, destroyInput } from '../engine/input.js';
import { createLevelManager, startLevel } from '../engine/levelManager.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../engine/constants.js';

export default function GameCanvas({ onStateChange, gameKey }) {
  const canvasRef = useRef(null);
  const loopRef   = useRef(null);

  const stateCallback = useCallback((state) => {
    onStateChange(state);
  }, [onStateChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set logical canvas size
    canvas.width  = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    // Init input
    initInput(canvas);

    // Init level manager and start level 1
    const lm = createLevelManager();
    startLevel(lm, 1);

    // Create and start game loop
    const loop = new GameLoop(canvas, lm, stateCallback);
    loopRef.current = loop;
    loop.start();

    return () => {
      loop.stop();
      destroyInput();
      loopRef.current = null;
    };
  }, [gameKey, stateCallback]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        cursor: 'pointer',
      }}
    />
  );
}
