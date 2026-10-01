// ============================================================
// Joule*Bert — Enemy Spawner
// Returns the correct set of enemies for each level.
// Also handles collision detection between player and enemies.
// ============================================================

import { createBugBot, updateBugBot, drawBugBot } from './bugBot.js';
import { createHallucinator, updateHallucinator, drawHallucinator } from './hallucinator.js';
import { createLegacyBlocker, updateLegacyBlocker, drawLegacyBlocker } from './legacyBlocker.js';
import {
  BUGBOT_MOVE_MS, HALLUCINATOR_MOVE_MS, LEGACY_MOVE_MS, LEVEL4_SPEED_MULT,
} from '../constants.js';

/**
 * Return the set of enemies for the given level (1–4).
 * Level 4 loops with increased speed.
 */
export function spawnEnemiesForLevel(level, tiles) {
  const fast = level >= 4;
  const speedMult = fast ? LEVEL4_SPEED_MULT : 1.0;

  const enemies = [];

  if (level >= 1) {
    enemies.push(createBugBot(tiles, BUGBOT_MOVE_MS * speedMult));
  }
  if (level >= 2) {
    enemies.push(createHallucinator(tiles, HALLUCINATOR_MOVE_MS * speedMult));
  }
  if (level >= 3) {
    enemies.push(createLegacyBlocker(tiles, LEGACY_MOVE_MS * speedMult));
  }
  if (level >= 4) {
    // Extra Bug Bot + extra Hallucinator at level 4
    enemies.push(createBugBot(tiles, BUGBOT_MOVE_MS * speedMult));
    enemies.push(createHallucinator(tiles, HALLUCINATOR_MOVE_MS * speedMult));
  }

  return enemies;
}

/**
 * Update all enemies for one frame.
 */
export function updateEnemies(enemies, tiles, deltaTime) {
  for (const e of enemies) {
    switch (e.type) {
      case 'bugbot':      updateBugBot(e, tiles, deltaTime);      break;
      case 'hallucinator': updateHallucinator(e, tiles, deltaTime); break;
      case 'legacy':      updateLegacyBlocker(e, tiles, deltaTime); break;
    }
  }
}

/**
 * Draw all enemies.
 */
export function drawEnemies(ctx, enemies) {
  for (const e of enemies) {
    switch (e.type) {
      case 'bugbot':      drawBugBot(ctx, e);      break;
      case 'hallucinator': drawHallucinator(ctx, e); break;
      case 'legacy':      drawLegacyBlocker(ctx, e); break;
    }
  }
}

/**
 * Check if any lethal enemy (bugbot, hallucinator) overlaps with the player.
 * Returns the colliding enemy or null.
 * Collision radius: 30px.
 */
export function checkCollisions(player, enemies) {
  const RADIUS = 30;
  for (const e of enemies) {
    if (e.type === 'legacy') continue; // Legacy Blocker doesn't kill
    const dx = player.screenX - e.screenX;
    const dy = player.screenY - e.screenY;
    if (Math.sqrt(dx * dx + dy * dy) < RADIUS) {
      return e;
    }
  }
  return null;
}
