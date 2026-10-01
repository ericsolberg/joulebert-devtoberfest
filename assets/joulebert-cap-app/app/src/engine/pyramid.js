// ============================================================
// Joule*Bert — Isometric Pyramid
// Builds the tile grid and renders 3-face isometric cubes.
// ============================================================

import {
  PYRAMID_ROWS,
  TILE_WIDTH,
  TILE_HEIGHT,
  TILE_DEPTH,
  CANVAS_WIDTH,
  COLOR_TILE_UNVISITED_TOP,
  COLOR_TILE_UNVISITED_LEFT,
  COLOR_TILE_UNVISITED_RIGHT,
  COLOR_TILE_VISITED_TOP,
  COLOR_TILE_VISITED_LEFT,
  COLOR_TILE_VISITED_RIGHT,
  COLOR_TILE_FLASH,
} from './constants.js';

/**
 * Build a fresh pyramid grid.
 * Row 0 = top (1 tile), Row n-1 = bottom (n tiles).
 * Each tile: { row, col, visited, flashTimer, x, y }
 * x,y = screen coords of the top-left corner of the tile's top face (rhombus).
 */
export function buildPyramid(rows = PYRAMID_ROWS) {
  const tiles = [];
  // Centre the pyramid horizontally
  const totalWidth = (rows - 1) * (TILE_WIDTH / 2) + TILE_WIDTH;
  const startX = (CANVAS_WIDTH - totalWidth) / 2;
  const startY = 40; // top padding

  for (let r = 0; r < rows; r++) {
    const rowTiles = [];
    for (let c = 0; c <= r; c++) {
      // Isometric position:
      // Each row shifts down by TILE_HEIGHT/2 + TILE_DEPTH
      // Each column in a row shifts right by TILE_WIDTH/2 from the left edge
      const x = startX + (rows - 1 - r) * (TILE_WIDTH / 2) + c * TILE_WIDTH;
      const y = startY + r * (TILE_HEIGHT / 2 + TILE_DEPTH);
      rowTiles.push({ row: r, col: c, visited: false, flashTimer: 0, x, y });
    }
    tiles.push(rowTiles);
  }
  return tiles;
}

/**
 * Get a tile at (row, col), or null if out of bounds.
 */
export function getTile(tiles, row, col) {
  if (row < 0 || row >= tiles.length) return null;
  if (col < 0 || col > row) return null;
  return tiles[row][col];
}

/**
 * Check if ALL tiles are visited (level complete).
 */
export function isLevelComplete(tiles) {
  return tiles.every(row => row.every(t => t.visited));
}

/**
 * Draw one isometric cube at tile position.
 * The "cube" has a top face (rhombus), left face, and right face.
 */
function drawTile(ctx, tile) {
  const { x, y, visited, flashTimer } = tile;
  const hw = TILE_WIDTH / 2;   // half-width
  const hh = TILE_HEIGHT / 2;  // half-height of rhombus
  const d  = TILE_DEPTH;

  const isFlashing = flashTimer > 0;

  const topColor   = isFlashing ? COLOR_TILE_FLASH : (visited ? COLOR_TILE_VISITED_TOP   : COLOR_TILE_UNVISITED_TOP);
  const leftColor  = isFlashing ? COLOR_TILE_FLASH : (visited ? COLOR_TILE_VISITED_LEFT  : COLOR_TILE_UNVISITED_LEFT);
  const rightColor = isFlashing ? COLOR_TILE_FLASH : (visited ? COLOR_TILE_VISITED_RIGHT : COLOR_TILE_UNVISITED_RIGHT);

  ctx.save();

  // Top face — rhombus
  // Points: top, right, bottom, left
  ctx.beginPath();
  ctx.moveTo(x + hw, y);          // top
  ctx.lineTo(x + TILE_WIDTH, y + hh); // right
  ctx.lineTo(x + hw, y + TILE_HEIGHT); // bottom
  ctx.lineTo(x, y + hh);          // left
  ctx.closePath();
  ctx.fillStyle = topColor;
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Left face — parallelogram below left half of top
  ctx.beginPath();
  ctx.moveTo(x, y + hh);
  ctx.lineTo(x + hw, y + TILE_HEIGHT);
  ctx.lineTo(x + hw, y + TILE_HEIGHT + d);
  ctx.lineTo(x, y + hh + d);
  ctx.closePath();
  ctx.fillStyle = leftColor;
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx.stroke();

  // Right face — parallelogram below right half of top
  ctx.beginPath();
  ctx.moveTo(x + hw, y + TILE_HEIGHT);
  ctx.lineTo(x + TILE_WIDTH, y + hh);
  ctx.lineTo(x + TILE_WIDTH, y + hh + d);
  ctx.lineTo(x + hw, y + TILE_HEIGHT + d);
  ctx.closePath();
  ctx.fillStyle = rightColor;
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx.stroke();

  ctx.restore();
}

/**
 * Draw the full pyramid. Tiles drawn top-to-bottom, left-to-right
 * so later rows naturally appear "in front".
 */
export function drawPyramid(ctx, tiles) {
  for (let r = 0; r < tiles.length; r++) {
    for (let c = 0; c < tiles[r].length; c++) {
      drawTile(ctx, tiles[r][c]);
    }
  }
}

/**
 * Update flash timers (call each frame with deltaTime in ms).
 */
export function updatePyramid(tiles, deltaTime) {
  for (const row of tiles) {
    for (const tile of row) {
      if (tile.flashTimer > 0) {
        tile.flashTimer = Math.max(0, tile.flashTimer - deltaTime);
      }
    }
  }
}

/**
 * Get the screen centre (x, y) of a tile's top face — used for character positioning.
 */
export function getTileCentre(tile) {
  return {
    x: tile.x + TILE_WIDTH / 2,
    y: tile.y + TILE_HEIGHT / 2,
  };
}
