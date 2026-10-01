// ============================================================
// Joule*Bert — The Hallucinator
// Moves randomly; teleports to a random tile every 3–7 moves.
// Causes life loss on contact.
// ============================================================

import { createEnemy, drawEnemyBase, tickEnemyAnim } from './enemy.js';
import { getTile, getTileCentre } from '../pyramid.js';
import {
  COLOR_HALLUCINATOR, COLOR_HALLUCINATOR_DARK,
  HALLUCINATOR_MOVE_MS, PYRAMID_ROWS,
  TELEPORT_MIN_MOVES, TELEPORT_MAX_MOVES,
} from '../constants.js';

const DIRS = [
  { dr: -1, dc: -1 }, // UP_LEFT
  { dr: -1, dc: 0  }, // UP_RIGHT
  { dr:  1, dc: 0  }, // DOWN_LEFT
  { dr:  1, dc: 1  }, // DOWN_RIGHT
];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function createHallucinator(tiles, moveInterval = HALLUCINATOR_MOVE_MS) {
  // Spawn at a random tile
  const row = randInt(0, PYRAMID_ROWS - 1);
  const col = randInt(0, row);
  return {
    ...createEnemy('hallucinator', row, col, tiles, moveInterval),
    moveCount: 0,
    nextTeleport: randInt(TELEPORT_MIN_MOVES, TELEPORT_MAX_MOVES),
    flashTimer: 0,
    flashTile: null,
  };
}

export function updateHallucinator(enemy, tiles, deltaTime) {
  tickEnemyAnim(enemy, deltaTime);
  if (enemy.flashTimer > 0) enemy.flashTimer -= deltaTime;

  enemy.moveTimer += deltaTime;
  if (enemy.moveTimer < enemy.moveInterval) return;
  enemy.moveTimer = 0;

  enemy.moveCount++;

  // Teleport check
  if (enemy.moveCount >= enemy.nextTeleport) {
    enemy.moveCount = 0;
    enemy.nextTeleport = randInt(TELEPORT_MIN_MOVES, TELEPORT_MAX_MOVES);

    // Flash source tile
    enemy.flashTile = { row: enemy.row, col: enemy.col };
    enemy.flashTimer = 250;

    // Jump to random tile
    const newRow = randInt(0, PYRAMID_ROWS - 1);
    const newCol = randInt(0, newRow);
    enemy.row = newRow;
    enemy.col = newCol;
    const tile = tiles[newRow][newCol];
    const c = getTileCentre(tile);
    enemy.screenX = c.x;
    enemy.screenY = c.y;
    return;
  }

  // Random move
  const shuffled = [...DIRS].sort(() => Math.random() - 0.5);
  for (const { dr, dc } of shuffled) {
    const newRow = enemy.row + dr;
    const newCol = enemy.col + dc;
    const tile = getTile(tiles, newRow, newCol);
    if (tile) {
      enemy.row = newRow;
      enemy.col = newCol;
      const c = getTileCentre(tile);
      enemy.screenX = c.x;
      enemy.screenY = c.y;
      return;
    }
  }
}

function drawHallucinatorIcon(ctx, size) {
  // Wavy top
  ctx.strokeStyle = '#FF69B4';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = -size; i <= size; i += 4) {
    const wave = Math.sin(i * 0.5) * 3;
    if (i === -size) ctx.moveTo(i, -size + wave);
    else ctx.lineTo(i, -size + wave);
  }
  ctx.stroke();

  // Glitchy eyes
  ctx.fillStyle = '#fff';
  ctx.fillRect(-8, -6, 6, 6);
  ctx.fillRect(2, -6, 6, 6);
  ctx.fillStyle = '#FF00FF';
  ctx.fillRect(-6, -4, 3, 3);
  ctx.fillRect(4, -4, 3, 3);

  // "?" symbol
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 14px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('?', 0, 12);
}

export function drawHallucinator(ctx, enemy) {
  // Glitch effect: slight jitter when flashTimer > 0
  const jitter = enemy.flashTimer > 0 ? (Math.random() - 0.5) * 6 : 0;
  const saved = { sx: enemy.screenX, sy: enemy.screenY };
  enemy.screenX += jitter;
  enemy.screenY += jitter;
  drawEnemyBase(ctx, enemy, COLOR_HALLUCINATOR, COLOR_HALLUCINATOR_DARK, drawHallucinatorIcon);
  enemy.screenX = saved.sx;
  enemy.screenY = saved.sy;
}
