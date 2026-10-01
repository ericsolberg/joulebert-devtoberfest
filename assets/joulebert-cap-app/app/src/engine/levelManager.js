// ============================================================
// Joule*Bert — Level Manager
// Tracks level progression, resets the board, and
// checks win conditions.
// ============================================================

import { buildPyramid, isLevelComplete } from './pyramid.js';
import { initPlayer, placePlayerAtTop } from './player.js';
import { spawnEnemiesForLevel } from './enemies/spawner.js';
import { playLevelComplete } from './audio.js';
import { SCORE_LEVEL_BONUS } from './constants.js';

export const MAX_LEVEL = 4;

/**
 * Create a fresh LevelManager.
 */
export function createLevelManager() {
  return {
    currentLevel: 1,
    tiles: null,
    enemies: [],
    player: null,
    transitioning: false,
    transitionTimer: 0,
    TRANSITION_DURATION: 2000, // ms
  };
}

/**
 * Start (or restart) a level.
 * Resets tiles, re-spawns enemies, re-places player.
 * Preserves player.score and player.lives across levels.
 */
export function startLevel(lm, level, existingPlayer = null) {
  lm.currentLevel = Math.min(level, MAX_LEVEL);
  lm.tiles = buildPyramid();
  lm.player = existingPlayer || initPlayer();
  placePlayerAtTop(lm.player, lm.tiles);
  lm.enemies = spawnEnemiesForLevel(lm.currentLevel, lm.tiles);
  lm.transitioning = false;
  lm.transitionTimer = 0;
}

/**
 * Check if the current level is complete (all tiles visited).
 * If so, award bonus, mark transition, and return true.
 */
export function checkAndAdvanceLevel(lm) {
  if (lm.transitioning) return false;
  if (!isLevelComplete(lm.tiles)) return false;

  playLevelComplete();
  lm.player.score += SCORE_LEVEL_BONUS;
  lm.transitioning = true;
  lm.transitionTimer = lm.TRANSITION_DURATION;
  return true;
}

/**
 * Tick the transition timer. Returns true when transition is complete.
 */
export function tickTransition(lm, deltaTime) {
  if (!lm.transitioning) return false;
  lm.transitionTimer -= deltaTime;
  if (lm.transitionTimer <= 0) {
    lm.transitioning = false;
    // Advance level (loop back at max)
    const next = lm.currentLevel >= MAX_LEVEL ? MAX_LEVEL : lm.currentLevel + 1;
    startLevel(lm, next, lm.player);
    return true;
  }
  return false;
}
