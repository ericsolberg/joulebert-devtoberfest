// ============================================================
// Joule*Bert — Player (Joule Jewel)
// Manages player state, hop animation, and drawing the gem.
// ============================================================

import {
  DIR,
  HOP_DURATION_MS,
  INVINCIBILITY_MS,
  SCORE_PER_TILE,
  COLOR_PLAYER_MAIN,
  COLOR_PLAYER_FACET,
  COLOR_PLAYER_SHADOW,
  TILE_WIDTH,
  TILE_HEIGHT,
} from './constants.js';
import { getTile, getTileCentre } from './pyramid.js';
import { playTileActivate, playPlayerHit } from './audio.js';

/**
 * Create a fresh player state anchored to the top tile.
 */
export function initPlayer() {
  return {
    row: 0,
    col: 0,
    // Screen position (interpolated during hop)
    screenX: 0,
    screenY: 0,
    // Hop animation
    isHopping: false,
    hopProgress: 0,       // 0..1
    hopDir: null,
    fromX: 0,
    fromY: 0,
    toX: 0,
    toY: 0,
    // Stats
    lives: 3,
    score: 0,
    // Invincibility after hit
    invincible: false,
    invincibleTimer: 0,
    // Fell off edge?
    fellOff: false,
  };
}

/**
 * Place player at top tile of the given pyramid grid.
 */
export function placePlayerAtTop(player, tiles) {
  const topTile = tiles[0][0];
  const centre = getTileCentre(topTile);
  player.row = 0;
  player.col = 0;
  player.screenX = centre.x;
  player.screenY = centre.y;
  player.isHopping = false;
  player.hopProgress = 0;
  player.fellOff = false;
}

/**
 * Determine destination (row, col) for a given direction from current position.
 */
function getDestination(row, col, dir) {
  switch (dir) {
    case DIR.UP_LEFT:    return { row: row - 1, col: col - 1 };
    case DIR.UP_RIGHT:   return { row: row - 1, col: col };
    case DIR.DOWN_LEFT:  return { row: row + 1, col: col };
    case DIR.DOWN_RIGHT: return { row: row + 1, col: col + 1 };
    default:             return { row, col };
  }
}

/**
 * Start a hop in the given direction. Returns false if already hopping.
 */
export function hopPlayer(player, dir, tiles) {
  if (player.isHopping) return false;

  const dest = getDestination(player.row, player.col, dir);
  const fromTile = getTile(tiles, player.row, player.col);
  const fromCentre = getTileCentre(fromTile);

  // Check if destination is valid (on the pyramid)
  const destTile = getTile(tiles, dest.row, dest.col);

  player.isHopping = true;
  player.hopProgress = 0;
  player.hopDir = dir;
  player.fromX = fromCentre.x;
  player.fromY = fromCentre.y;

  if (!destTile) {
    // Fell off the pyramid
    player.toX = fromCentre.x + (dest.col - player.col) * TILE_WIDTH;
    player.toY = fromCentre.y + (dest.row - player.row) * (TILE_HEIGHT / 2 + 20);
    player.fellOff = true;
  } else {
    const toCentre = getTileCentre(destTile);
    player.toX = toCentre.x;
    player.toY = toCentre.y;
    player.fellOff = false;
    player.row = dest.row;
    player.col = dest.col;
  }

  return true;
}

/**
 * Update player each frame.
 * Returns 'tileActivated' | 'fellOff' | 'normal' | 'invincible'
 */
export function updatePlayer(player, tiles, deltaTime) {
  if (player.invincible) {
    player.invincibleTimer -= deltaTime;
    if (player.invincibleTimer <= 0) {
      player.invincible = false;
      player.invincibleTimer = 0;
    }
  }

  if (!player.isHopping) return 'idle';

  player.hopProgress += deltaTime / HOP_DURATION_MS;
  if (player.hopProgress >= 1) {
    player.hopProgress = 1;
    player.isHopping = false;

    if (player.fellOff) {
      return 'fellOff';
    }

    // Snap to tile centre
    const tile = getTile(tiles, player.row, player.col);
    if (tile) {
      const centre = getTileCentre(tile);
      player.screenX = centre.x;
      player.screenY = centre.y;

      // Activate tile if not yet visited
      if (!tile.visited) {
        tile.visited = true;
        player.score += SCORE_PER_TILE;
        playTileActivate();
        return 'tileActivated';
      }
    }
    return 'landed';
  }

  // Interpolate screen position with a sine bounce arc
  const t = player.hopProgress;
  player.screenX = player.fromX + (player.toX - player.fromX) * t;
  // Parabolic arc: offset reaches peak at t=0.5
  const arc = Math.sin(t * Math.PI) * 28;
  player.screenY = player.fromY + (player.toY - player.fromY) * t - arc;

  return 'hopping';
}

/**
 * Trigger a life loss. Returns true if game over.
 */
export function hitPlayer(player, tiles) {
  if (player.invincible) return false;
  player.lives -= 1;
  playPlayerHit();
  if (player.lives <= 0) return true; // game over
  // Respawn at top
  placePlayerAtTop(player, tiles);
  player.invincible = true;
  player.invincibleTimer = INVINCIBILITY_MS;
  return false;
}

/**
 * Draw the Joule jewel (multi-faceted lavender gem).
 */
export function drawPlayer(ctx, player) {
  const { screenX, screenY, invincible, invincibleTimer } = player;

  // Blink during invincibility
  if (invincible && Math.floor(invincibleTimer / 100) % 2 === 0) return;

  const size = 22;
  ctx.save();
  ctx.translate(screenX, screenY - size * 0.6);

  // Outer gem shape (diamond/hexagon)
  ctx.beginPath();
  ctx.moveTo(0, -size);           // top point
  ctx.lineTo(size * 0.7, -size * 0.2); // upper right
  ctx.lineTo(size * 0.55, size * 0.6); // lower right
  ctx.lineTo(0, size);            // bottom point
  ctx.lineTo(-size * 0.55, size * 0.6);// lower left
  ctx.lineTo(-size * 0.7, -size * 0.2);// upper left
  ctx.closePath();

  // Gradient fill
  const grad = ctx.createLinearGradient(-size, -size, size * 0.5, size);
  grad.addColorStop(0, COLOR_PLAYER_MAIN);
  grad.addColorStop(0.4, COLOR_PLAYER_FACET);
  grad.addColorStop(1, COLOR_PLAYER_SHADOW);
  ctx.fillStyle = grad;
  ctx.fill();

  // Inner facet lines (jewel cut)
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 1;
  // Horizontal girdle line
  ctx.beginPath();
  ctx.moveTo(-size * 0.7, -size * 0.2);
  ctx.lineTo(size * 0.7, -size * 0.2);
  ctx.stroke();
  // Left facet
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.lineTo(-size * 0.2, -size * 0.1);
  ctx.lineTo(0, size);
  ctx.stroke();
  // Right facet
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.lineTo(size * 0.2, -size * 0.1);
  ctx.lineTo(0, size);
  ctx.stroke();
  // Top highlight
  ctx.beginPath();
  ctx.moveTo(-size * 0.3, -size * 0.55);
  ctx.lineTo(0, -size * 0.75);
  ctx.lineTo(size * 0.3, -size * 0.55);
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.stroke();

  // Outer border
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.lineTo(size * 0.7, -size * 0.2);
  ctx.lineTo(size * 0.55, size * 0.6);
  ctx.lineTo(0, size);
  ctx.lineTo(-size * 0.55, size * 0.6);
  ctx.lineTo(-size * 0.7, -size * 0.2);
  ctx.closePath();
  ctx.strokeStyle = 'rgba(155,124,199,0.8)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.restore();
}
