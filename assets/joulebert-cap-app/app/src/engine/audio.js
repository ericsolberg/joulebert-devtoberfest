// ============================================================
// Joule*Bert — Audio Engine (Web Audio API, no files needed)
// All sounds generated procedurally via oscillators.
// ============================================================

let audioCtx = null;
let muted = false;

// Load mute preference from localStorage
try {
  muted = localStorage.getItem('joulebert-mute') === 'true';
} catch (_) {}

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Resume if browser suspended it
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function playTone(frequency, type = 'sine', duration = 0.15, volume = 0.3, startDelay = 0) {
  if (muted) return;
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime + startDelay);
    gain.gain.setValueAtTime(volume, ctx.currentTime + startDelay);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startDelay + duration);
    osc.start(ctx.currentTime + startDelay);
    osc.stop(ctx.currentTime + startDelay + duration + 0.05);
  } catch (_) {}
}

/** Short ascending chime when a tile is activated */
export function playTileActivate() {
  playTone(523, 'sine', 0.12, 0.25);
  playTone(659, 'sine', 0.10, 0.2, 0.08);
}

/** Descending "bwop" when player is hit */
export function playPlayerHit() {
  playTone(300, 'sawtooth', 0.18, 0.35);
  playTone(180, 'sawtooth', 0.22, 0.3, 0.1);
}

/** Short fanfare on level complete */
export function playLevelComplete() {
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => playTone(freq, 'triangle', 0.15, 0.3, i * 0.1));
}

/** Sad descending tones on game over */
export function playGameOver() {
  const notes = [440, 370, 311, 261];
  notes.forEach((freq, i) => playTone(freq, 'sawtooth', 0.3, 0.35, i * 0.18));
}

/** Toggle mute state; persists to localStorage */
export function toggleMute() {
  muted = !muted;
  try { localStorage.setItem('joulebert-mute', String(muted)); } catch (_) {}
  return muted;
}

export function isMuted() { return muted; }
