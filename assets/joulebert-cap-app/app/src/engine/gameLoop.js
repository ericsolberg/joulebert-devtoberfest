// ============================================================
// Joule*Bert — Game Loop
// Orchestrates update → render each frame.
// ============================================================

import { updatePlayer, hopPlayer, drawPlayer, hitPlayer, placePlayerAtTop } from './player.js';
import { drawPyramid, updatePyramid } from './pyramid.js';
import { updateEnemies, drawEnemies, checkCollisions } from './enemies/spawner.js';
import { checkAndAdvanceLevel, tickTransition } from './levelManager.js';
import { getQueuedMove, enqueueMove } from './input.js';
import { getTile, getTileCentre } from './pyramid.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT, COLOR_BG, TILE_WIDTH } from './constants.js';
import { playGameOver } from './audio.js';

export class GameLoop {
  constructor(canvas, lm, onStateChange) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.lm = lm;                  // LevelManager ref
    this.onStateChange = onStateChange; // callback({ score, lives, level, gameOver, transitioning })
    this.rafId = null;
    this.lastTime = null;
    this.gameOver = false;
    this._setupClickToMove();
  }

  start() {
    this.lastTime = performance.now();
    this._loop(this.lastTime);
  }

  stop() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = null;
  }

  _loop(timestamp) {
    const delta = Math.min(timestamp - this.lastTime, 100); // cap at 100ms
    this.lastTime = timestamp;

    this._update(delta);
    this._render();
    this._notifyState();

    if (!this.gameOver) {
      this.rafId = requestAnimationFrame((t) => this._loop(t));
    }
  }

  _update(delta) {
    const { lm } = this;
    if (lm.transitioning) {
      tickTransition(lm, delta);
      return;
    }

    const { player, tiles, enemies } = lm;

    // Process input → hop
    if (!player.isHopping && !player.invincible) {
      const dir = getQueuedMove();
      if (dir) hopPlayer(player, dir, tiles);
    }

    // Update player
    const result = updatePlayer(player, tiles, delta);
    if (result === 'fellOff') {
      const gameOver = hitPlayer(player, tiles);
      if (gameOver) { this._triggerGameOver(); return; }
    }

    // Update pyramid flash timers
    updatePyramid(tiles, delta);

    // Update enemies
    updateEnemies(enemies, tiles, delta);

    // Collision detection (only while not hopping and not invincible)
    if (!player.isHopping && !player.invincible) {
      const hit = checkCollisions(player, enemies);
      if (hit) {
        const gameOver = hitPlayer(player, tiles);
        if (gameOver) { this._triggerGameOver(); return; }
      }
    }

    // Level complete?
    checkAndAdvanceLevel(lm);
  }

  _render() {
    const { ctx, canvas, lm } = this;
    const { player, tiles, enemies, transitioning, currentLevel, transitionTimer, TRANSITION_DURATION } = lm;

    // Clear
    ctx.fillStyle = COLOR_BG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Pyramid
    drawPyramid(ctx, tiles);

    // Enemies
    drawEnemies(ctx, enemies);

    // Player
    drawPlayer(ctx, player);

    // Level transition overlay
    if (transitioning) {
      const alpha = Math.min(1, (TRANSITION_DURATION - transitionTimer) / 400);
      ctx.fillStyle = `rgba(26, 13, 46, ${alpha * 0.85})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.textAlign = 'center';
      ctx.fillStyle = `rgba(196, 168, 232, ${alpha})`;
      ctx.font = 'bold 64px "Segoe UI", sans-serif';
      ctx.fillText(`LEVEL ${currentLevel >= 4 ? '4+' : currentLevel + 1}`, canvas.width / 2, canvas.height / 2);
      ctx.font = '24px "Segoe UI", sans-serif';
      ctx.fillStyle = `rgba(155, 124, 199, ${alpha})`;
      ctx.fillText('Get ready!', canvas.width / 2, canvas.height / 2 + 50);
      ctx.restore();
    }
  }

  _triggerGameOver() {
    this.gameOver = true;
    this.stop();
    playGameOver();
    this.onStateChange({ gameOver: true });
    // Final render with game-over overlay
    const { ctx, canvas } = this;
    ctx.fillStyle = 'rgba(26, 13, 46, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  _notifyState() {
    const { lm, gameOver } = this;
    this.onStateChange({
      score: lm.player?.score ?? 0,
      lives: lm.player?.lives ?? 0,
      level: lm.currentLevel,
      gameOver,
      transitioning: lm.transitioning,
    });
  }

  _setupClickToMove() {
    this.canvas.addEventListener('gameClick', (e) => {
      const { x, y } = e.detail;
      const { lm } = this;
      if (!lm.player || lm.player.isHopping || lm.transitioning) return;

      // Find which adjacent tile was clicked
      const { row, col } = lm.player;
      const adjacents = [
        { dir: 'UP_LEFT',    nr: row - 1, nc: col - 1 },
        { dir: 'UP_RIGHT',   nr: row - 1, nc: col     },
        { dir: 'DOWN_LEFT',  nr: row + 1, nc: col     },
        { dir: 'DOWN_RIGHT', nr: row + 1, nc: col + 1 },
      ];

      let closestDir = null;
      let closestDist = Infinity;
      for (const { dir, nr, nc } of adjacents) {
        const tile = getTile(lm.tiles, nr, nc);
        if (!tile) continue;
        const c = getTileCentre(tile);
        const dist = Math.hypot(x - c.x, y - c.y);
        if (dist < closestDist) {
          closestDist = dist;
          closestDir = dir;
        }
      }

      if (closestDir && closestDist < TILE_WIDTH) {
        enqueueMove(closestDir);
      }
    });
  }
}
