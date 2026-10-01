// ============================================================
// Joule*Bert — The Bug Bot
// Spawns at top, bounces methodically downward (DOWN_LEFT or DOWN_RIGHT).
// Causes immediate life loss on contact with player.
// ============================================================

import { createEnemy, drawEnemyBase, tickEnemyAnim } from './enemy.js';
import { getTile, getTileCentre } from '../pyramid.js';
import { COLOR_BUGBOT, COLOR_BUGBOT_DARK, BUGBOT_MOVE_MS, PYRAMID_ROWS } from '../constants.js';

export function createBugBot(tiles, moveInterval = BUGBOT_MOVE_MS) {
  return {
    ...createEnemy('bugbot', 0, 0, tiles, moveInterval),
    goRight: Math.random() < 0.5, // alternates direction preference
  };
}

/**
 * Move the Bug Bot one step downward.
 */
export function updateBugBot(enemy, tiles, deltaTime) {
  tickEnemyAnim(enemy, deltaTime);
  enemy.moveTimer += deltaTime;
  if (enemy.moveTimer < enemy.moveInterval) return;
  enemy.moveTimer = 0;

  const { row, col } = enemy;

  // At bottom row — respawn at top
  if (row >= PYRAMID_ROWS - 1) {
    enemy.row = 0;
    enemy.col = 0;
    enemy.goRight = Math.random() < 0.5;
    const tile = tiles[0][0];
    const c = getTileCentre(tile);
    enemy.screenX = c.x;
    enemy.screenY = c.y;
    return;
  }

  // Prefer diagonal direction; fall back to the other if unavailable
  let newRow = row + 1;
  let newCol = enemy.goRight ? col + 1 : col;
  let destTile = getTile(tiles, newRow, newCol);

  if (!destTile) {
    // Try the other direction
    newCol = enemy.goRight ? col : col + 1;
    destTile = getTile(tiles, newRow, newCol);
  }

  if (!destTile) {
    // Shouldn't happen; respawn
    enemy.row = 0; enemy.col = 0;
    return;
  }

  enemy.row = newRow;
  enemy.col = newCol;
  enemy.goRight = !enemy.goRight; // alternate each step
  const c = getTileCentre(destTile);
  enemy.screenX = c.x;
  enemy.screenY = c.y;
}

function drawBugBotIcon(ctx, size) {
  // Antenna
  ctx.strokeStyle = '#FF6B35';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.lineTo(0, -size - 8);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, -size - 10, 3, 0, Math.PI * 2);
  ctx.fillStyle = '#FFD700';
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#FF0000';
  ctx.fillRect(-7, -8, 5, 5);
  ctx.fillRect(2, -8, 5, 5);

  // Mouth (pixel grid)
  ctx.fillStyle = '#330000';
  for (let i = -6; i <= 6; i += 3) {
    ctx.fillRect(i, 2, 2, 3);
  }

  // "BUG" label
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 7px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('BUG', 0, 14);
}

export function drawBugBot(ctx, enemy) {
  drawEnemyBase(ctx, enemy, COLOR_BUGBOT, COLOR_BUGBOT_DARK, drawBugBotIcon);
}
