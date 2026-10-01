// ============================================================
// Joule*Bert — The Legacy Blocker
// Moves slowly; reverts visited tiles back to unvisited.
// Does NOT cause life loss — just undoes progress.
// ============================================================

import { createEnemy, drawEnemyBase, tickEnemyAnim } from './enemy.js';
import { getTile, getTileCentre } from '../pyramid.js';
import {
  COLOR_LEGACY, COLOR_LEGACY_DARK,
  LEGACY_MOVE_MS, PYRAMID_ROWS,
} from '../constants.js';

const DIRS = [
  { dr: -1, dc: -1 },
  { dr: -1, dc: 0  },
  { dr:  1, dc: 0  },
  { dr:  1, dc: 1  },
];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function createLegacyBlocker(tiles, moveInterval = LEGACY_MOVE_MS) {
  // Spawn somewhere in the lower half
  const row = randInt(Math.floor(PYRAMID_ROWS / 2), PYRAMID_ROWS - 1);
  const col = randInt(0, row);
  return {
    ...createEnemy('legacy', row, col, tiles, moveInterval),
    waddle: 0, // alternating left/right offset for animation
  };
}

export function updateLegacyBlocker(enemy, tiles, deltaTime) {
  tickEnemyAnim(enemy, deltaTime);

  enemy.moveTimer += deltaTime;
  if (enemy.moveTimer < enemy.moveInterval) return;
  enemy.moveTimer = 0;

  // Random move (biased downward)
  const options = [];
  for (const { dr, dc } of DIRS) {
    const newRow = enemy.row + dr;
    const newCol = enemy.col + dc;
    const tile = getTile(tiles, newRow, newCol);
    if (tile) options.push({ newRow, newCol, tile });
  }

  if (options.length === 0) return;

  // Pick random destination
  const chosen = options[Math.floor(Math.random() * options.length)];
  enemy.row = chosen.newRow;
  enemy.col = chosen.newCol;

  // Revert tile if visited
  if (chosen.tile.visited) {
    chosen.tile.visited = false;
    chosen.tile.flashTimer = 300; // brief flash to indicate revert
  }

  const c = getTileCentre(chosen.tile);
  enemy.screenX = c.x;
  enemy.screenY = c.y;
  enemy.waddle = 1 - enemy.waddle;
}

function drawLegacyBlockerIcon(ctx, size) {
  // Floppy disk shape
  ctx.fillStyle = '#5C4A2A';
  ctx.fillRect(-size + 3, -size + 3, (size - 3) * 2, (size - 3) * 2 - 4);

  // Floppy label area
  ctx.fillStyle = '#c8aa80';
  ctx.fillRect(-size + 5, -size + 5, (size - 5) * 2, 10);

  // Metal shutter
  ctx.fillStyle = '#888';
  ctx.fillRect(-4, size - 14, 8, 8);

  // Lines on label
  ctx.strokeStyle = '#8B7355';
  ctx.lineWidth = 1;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(-size + 7, -size + 8 + i * 3);
    ctx.lineTo(size - 7, -size + 8 + i * 3);
    ctx.stroke();
  }

  // "OLD" text
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 7px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('OLD', 0, 13);
}

export function drawLegacyBlocker(ctx, enemy) {
  // Waddle offset
  const waddleX = enemy.waddle ? 2 : -2;
  enemy.screenX += waddleX;
  drawEnemyBase(ctx, enemy, COLOR_LEGACY, COLOR_LEGACY_DARK, drawLegacyBlockerIcon);
  enemy.screenX -= waddleX;
}
