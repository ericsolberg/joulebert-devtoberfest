// ============================================================
// Joule*Bert — Game Constants
// All magic numbers live here — never hard-code values in game logic.
// ============================================================

// Canvas dimensions (logical size — CSS scales it)
export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;

// Pyramid geometry
export const PYRAMID_ROWS = 7;          // number of rows (row 0 = top = 1 tile)
export const TILE_WIDTH = 80;           // width of the isometric tile top face
export const TILE_HEIGHT = 40;          // height of the isometric tile top face
export const TILE_DEPTH = 20;           // height of the visible left/right cube faces

// Player timing
export const HOP_DURATION_MS = 180;    // time (ms) for one hop animation
export const INVINCIBILITY_MS = 1200;  // invincibility window after life loss

// Lavender color palette
export const COLOR_BG            = '#1a0d2e';   // deep space purple background
export const COLOR_TILE_UNVISITED_TOP   = '#4a3570';
export const COLOR_TILE_UNVISITED_LEFT  = '#2e1f4a';
export const COLOR_TILE_UNVISITED_RIGHT = '#392860';
export const COLOR_TILE_VISITED_TOP     = '#9B7CC7';
export const COLOR_TILE_VISITED_LEFT    = '#6B4E9B';
export const COLOR_TILE_VISITED_RIGHT   = '#8060b8';
export const COLOR_TILE_FLASH           = '#ffffff';  // flash on revert / hit
export const COLOR_PLAYER_MAIN          = '#C4A8E8';  // light lavender gem
export const COLOR_PLAYER_FACET         = '#9B7CC7';  // mid lavender
export const COLOR_PLAYER_SHADOW        = '#6B4E9B';  // dark facet

// Enemy colors
export const COLOR_BUGBOT          = '#FF6B35';   // orange-red robot
export const COLOR_BUGBOT_DARK     = '#CC4400';
export const COLOR_HALLUCINATOR    = '#FF69B4';   // hot pink glitch ghost
export const COLOR_HALLUCINATOR_DARK = '#CC1177';
export const COLOR_LEGACY          = '#8B7355';   // brown floppy disk
export const COLOR_LEGACY_DARK     = '#5C4A2A';

// HUD
export const COLOR_HUD_TEXT        = '#F0E8FF';
export const COLOR_HUD_BG          = 'rgba(26, 13, 46, 0.85)';

// Scoring
export const SCORE_PER_TILE        = 25;
export const SCORE_LEVEL_BONUS     = 500;

// Enemy base move intervals (ms) — lower = faster
export const BUGBOT_MOVE_MS        = 700;
export const HALLUCINATOR_MOVE_MS  = 900;
export const LEGACY_MOVE_MS        = 1400;
export const TELEPORT_MIN_MOVES    = 3;
export const TELEPORT_MAX_MOVES    = 7;
export const LEVEL4_SPEED_MULT     = 0.65;  // Level 4 enemies move at 65% of base interval

// Game directions (diagonal hops — Q*bert style)
export const DIR = {
  UP_LEFT:    'UP_LEFT',
  UP_RIGHT:   'UP_RIGHT',
  DOWN_LEFT:  'DOWN_LEFT',
  DOWN_RIGHT: 'DOWN_RIGHT',
};
