// ============================================================
// Joule*Bert — Input Handler
// Captures keyboard and click/tap input; exposes a move queue.
// ============================================================

import { DIR } from './constants.js';

let moveQueue = null;
let keyHandler = null;
let clickHandler = null;
let boundCanvas = null;

// Map keys → diagonal directions (Q*bert style)
// Arrow keys: Up-Left, Up-Right, Down-Left, Down-Right
// WASD / QE equivalents
const KEY_MAP = {
  ArrowLeft:  DIR.UP_LEFT,
  ArrowUp:    DIR.UP_RIGHT,
  ArrowDown:  DIR.DOWN_LEFT,
  ArrowRight: DIR.DOWN_RIGHT,
  q: DIR.UP_LEFT,
  w: DIR.UP_RIGHT,
  a: DIR.DOWN_LEFT,
  s: DIR.DOWN_RIGHT,
  Q: DIR.UP_LEFT,
  W: DIR.UP_RIGHT,
  A: DIR.DOWN_LEFT,
  S: DIR.DOWN_RIGHT,
};

export function initInput(canvas) {
  boundCanvas = canvas;
  moveQueue = null;

  keyHandler = (e) => {
    const dir = KEY_MAP[e.key];
    if (dir) {
      e.preventDefault();
      if (moveQueue === null) moveQueue = dir;
    }
  };

  clickHandler = (e) => {
    if (!boundCanvas) return;
    const rect = boundCanvas.getBoundingClientRect();
    const scaleX = boundCanvas.width / rect.width;
    const scaleY = boundCanvas.height / rect.height;
    const cx = (e.clientX - rect.left) * scaleX;
    const cy = (e.clientY - rect.top) * scaleY;
    // Emit as a canvas click event for higher-level processing
    boundCanvas.dispatchEvent(new CustomEvent('gameClick', { detail: { x: cx, y: cy } }));
  };

  window.addEventListener('keydown', keyHandler);
  canvas.addEventListener('click', clickHandler);
  canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    const touch = e.changedTouches[0];
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const cx = (touch.clientX - rect.left) * scaleX;
    const cy = (touch.clientY - rect.top) * scaleY;
    canvas.dispatchEvent(new CustomEvent('gameClick', { detail: { x: cx, y: cy } }));
  }, { passive: false });
}

export function destroyInput() {
  if (keyHandler) window.removeEventListener('keydown', keyHandler);
  if (clickHandler && boundCanvas) boundCanvas.removeEventListener('click', clickHandler);
  keyHandler = null;
  clickHandler = null;
  boundCanvas = null;
  moveQueue = null;
}

/** Returns the next queued direction, and clears it. */
export function getQueuedMove() {
  const dir = moveQueue;
  moveQueue = null;
  return dir;
}

/** Manually enqueue a direction (used by click-to-move). */
export function enqueueMove(dir) {
  if (moveQueue === null) moveQueue = dir;
}
