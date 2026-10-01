// ============================================================
// Joule*Bert — Enemy Base
// Shared structure and rendering helper for all gremlins.
// ============================================================

import { getTileCentre } from '../pyramid.js';

let nextId = 1;

/**
 * Create a base enemy object.
 */
export function createEnemy(type, row, col, tiles, moveInterval) {
  const tile = tiles[row][col];
  const centre = getTileCentre(tile);
  return {
    id: nextId++,
    type,          // 'bugbot' | 'hallucinator' | 'legacy'
    row,
    col,
    screenX: centre.x,
    screenY: centre.y,
    moveTimer: Math.random() * moveInterval, // stagger start
    moveInterval,
    // Animation
    animTimer: 0,
    animFrame: 0,
  };
}

/**
 * Shared drawing helper — draws a rounded square with a label icon.
 */
export function drawEnemyBase(ctx, enemy, color, darkColor, iconFn) {
  const { screenX, screenY, animFrame } = enemy;
  const size = 18;
  const bob = Math.sin(animFrame * 0.1) * 2; // idle bob

  ctx.save();
  ctx.translate(screenX, screenY - size - bob);

  // Body
  ctx.beginPath();
  ctx.roundRect(-size, -size, size * 2, size * 2, 5);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = darkColor;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Custom icon drawn by the caller
  if (iconFn) iconFn(ctx, size);

  ctx.restore();
}

/**
 * Update enemy animation timer.
 */
export function tickEnemyAnim(enemy, deltaTime) {
  enemy.animTimer += deltaTime;
  enemy.animFrame = Math.floor(enemy.animTimer / 80);
}
