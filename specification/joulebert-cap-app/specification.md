# Joule*Bert — CAP Application + React Game UI

**Asset name:** `joulebert-cap-app`  
**Asset type:** CAP Application (static host) + React SPA (game engine)  
**Guidelines:** [../guidelines.md](../guidelines.md)

Check off items as completed.

---

## Setup & Scaffolding

- [ ] Create the asset directory: `mkdir -p assets/joulebert-cap-app`
- [ ] Invoke the `setup-solution` skill to scaffold `solution.yaml` and `assets/joulebert-cap-app/asset.yaml`
- [ ] Inside `assets/joulebert-cap-app/`, initialise a CAP project:
  - Run `cds init` (or create manually) — ensure `package.json`, `package-lock.json`, `.cdsrc.json`
  - Do **NOT** create any `.cds` entity files — this CAP app has zero data model
- [ ] Inside `assets/joulebert-cap-app/`, scaffold the React app under `app/`:
  - Use Vite + React template: `npm create vite@latest app -- --template react`
  - Install SAP UI5 Web Components: `npm install @ui5/webcomponents @ui5/webcomponents-fiori @ui5/webcomponents-react`
  - Install any needed dev dependencies (TypeScript optional; plain JS is fine)
- [ ] Configure CAP to serve the React build output as static files:
  - Add `"serve_static": true` (or equivalent) to `.cdsrc.json` / `package.json`
  - Set the static folder to point at `app/dist` (Vite build output)
- [ ] Add npm scripts to `package.json`:
  - `"build:ui"`: runs `npm run build` inside `app/`
  - `"start"`: starts the CAP server serving built static files
  - `"dev"`: starts Vite dev server for hot-reload development

---

## M1: Isometric Pyramid Prototype (R1, R2 partial)

### Game Constants Module (`app/src/engine/constants.js`)

- [ ] Define all magic numbers as named exports:
  - `TILE_WIDTH`, `TILE_HEIGHT` (isometric tile dimensions)
  - `PYRAMID_ROWS` (number of rows, e.g. 7)
  - `COLOR_UNVISITED`, `COLOR_VISITED`, `COLOR_BACKGROUND` — lavender palette values
  - `PLAYER_SPEED` (hop duration in ms)
  - `CANVAS_WIDTH`, `CANVAS_HEIGHT`

### Isometric Pyramid Renderer (`app/src/engine/pyramid.js`)

- [ ] Implement `buildPyramid(rows)` → returns a 2D array of tile objects `{ row, col, visited: false, x, y }` with pre-calculated isometric screen positions
- [ ] Implement `drawPyramid(ctx, tiles)` → renders each tile as a 3-face isometric cube:
  - Top face: `COLOR_VISITED` if visited, `COLOR_UNVISITED` otherwise
  - Left face and right face: darker shades of the top face color for depth
  - Use `save()`/`restore()` and path clipping per tile
- [ ] Verify pyramid fits entirely within `CANVAS_WIDTH × CANVAS_HEIGHT` at `PYRAMID_ROWS = 7`

### Game Loop (`app/src/engine/gameLoop.js`)

- [ ] Implement a `GameLoop` class (or module) with:
  - `start()` — begins `requestAnimationFrame` loop
  - `stop()` — cancels the loop
  - `update(deltaTime)` — called each frame; updates player, enemies, and tile state
  - `render(ctx)` — called each frame; draws pyramid, player, enemies, HUD
- [ ] The loop must track `deltaTime` correctly using `performance.now()`

### Joule Jewel Player Character (`app/src/engine/player.js`)

- [ ] Define player state: `{ row, col, x, y, isHopping, hopProgress, direction, lives, score }`
- [ ] Implement `initPlayer(pyramid)` → places player at the top tile `(0, 0)`, sets `lives = 3`, `score = 0`
- [ ] Implement `hopPlayer(player, direction, pyramid)` → moves player one tile in the given diagonal direction; validates boundary; returns `false` if move is illegal
- [ ] Implement `drawPlayer(ctx, player)` → draws a multi-faceted lavender gem:
  - Draw a hexagonal/diamond shape with lavender gradient fills
  - Inner facets as lighter lavender lines to suggest a jewel cut
  - Small vertical bounce offset during `isHopping` based on `hopProgress` (sine curve)
- [ ] On landing: if the tile `visited === false`, set `visited = true`, increment `player.score`
- [ ] If player hops off the pyramid edge: trigger life-loss sequence

### Input Handler (`app/src/engine/input.js`)

- [ ] Implement keyboard listener: map arrow keys and WASD to `{ UP_LEFT, UP_RIGHT, DOWN_LEFT, DOWN_RIGHT }` diagonal directions (Q*bert uses 4 diagonal hops)
- [ ] Implement canvas click/tap listener: determine which adjacent tile was tapped and convert to direction
- [ ] Expose `getQueuedMove()` — returns next direction or `null`; consuming it clears the queue

### React Canvas Component (`app/src/components/GameCanvas.jsx`)

- [ ] Create `<GameCanvas />` React component:
  - Holds a `<canvas>` ref and mounts the `GameLoop` on `useEffect`
  - Passes canvas `ctx` to the game engine
  - Handles resize: recalculates canvas dimensions and pyramid layout on window resize
  - Unmounts cleanly (cancels loop, removes event listeners)

---

## M2: All Three Enemy Gremlins (R3)

### Enemy Base (`app/src/engine/enemies/enemy.js`)

- [ ] Define base enemy structure: `{ id, type, row, col, x, y, moveTimer, moveInterval }`
- [ ] Implement `drawEnemyBase(ctx, enemy, color, icon)` — shared rendering helper

### The Bug Bot (`app/src/engine/enemies/bugBot.js`)

- [ ] Spawns at the top of the pyramid, always moves downward (either `DOWN_LEFT` or `DOWN_RIGHT`)
- [ ] When it reaches the bottom, it despawns and respawns from the top
- [ ] On contact with player: trigger `onPlayerHit(player)` — player loses a life
- [ ] Visual design: small angular robot face, red/orange color accent, antenna
- [ ] Draw with `drawEnemyBase` + custom icon overlay

### The Hallucinator (`app/src/engine/enemies/hallucinator.js`)

- [ ] Moves in a random valid direction each `moveInterval`
- [ ] Every N moves (random interval 3–7), teleports to a random tile on the pyramid
- [ ] On contact with player: trigger `onPlayerHit(player)` — player loses a life
- [ ] Visual design: glitchy, purple-to-pink gradient, wavy/distorted outline, `?` symbol
- [ ] Teleport effect: brief flash of white/pink on source and destination tiles

### The Legacy Blocker (`app/src/engine/enemies/legacyBlocker.js`)

- [ ] Moves slowly (longer `moveInterval`) downward/randomly
- [ ] When it lands on a `visited === true` tile, sets `visited = false` (reverts tile color)
- [ ] Does NOT cause life loss on contact — just reverts tiles
- [ ] Visual design: grey/brown boxy shape resembling old floppy disk or tape reel, slow waddle animation
- [ ] Reverted tile flashes briefly to indicate the revert

### Enemy Spawner (`app/src/engine/enemies/spawner.js`)

- [ ] Implement `spawnEnemiesForLevel(level)` → returns the starting enemy set per level:
  - Level 1: 1 Bug Bot
  - Level 2: 1 Bug Bot + 1 Hallucinator
  - Level 3: 1 Bug Bot + 1 Hallucinator + 1 Legacy Blocker
  - Level 4: 2 Bug Bots + 2 Hallucinators + 1 Legacy Blocker (faster `moveInterval`)
- [ ] Collision detection: `checkCollisions(player, enemies)` → returns hit enemy or `null`

---

## M3: Four-Level Progression (R4)

### Level Manager (`app/src/engine/levelManager.js`)

- [ ] Implement `LevelManager` with state: `{ currentLevel, maxLevel: 4 }`
- [ ] `startLevel(level)` → resets pyramid (all tiles unvisited), spawns enemies for the level, places player at top
- [ ] `checkLevelComplete(pyramid)` → returns `true` when all tiles are visited
- [ ] `nextLevel()` → advances level (capped at 4, then loops at max difficulty)
- [ ] Expose level speed multiplier: Level 4 enemies move at 1.5× their base `moveInterval`

### Level Transition Screen (`app/src/components/LevelTransition.jsx`)

- [ ] Full-screen overlay component shown for 2 seconds between levels
- [ ] Displays: `"LEVEL {n}"` in large lavender text, brief flash animation
- [ ] Lavender gradient background consistent with game theme
- [ ] Auto-dismisses and triggers `startLevel(nextLevel)` after the timer

### Lives and Game Over Logic

- [ ] When `player.lives === 0`: trigger game-over state
- [ ] On life loss (lives > 0): respawn player at top tile with a brief invincibility window (1 second)
- [ ] Display a "poof" or flash animation at the tile where the player was hit

---

## M4: Full Polish, Branding & Shell (R5, R6, R7, R8, R9, R10)

### HUD Overlay (`app/src/components/HUD.jsx`)

- [ ] Persistent React overlay positioned above the canvas
- [ ] Displays: `Score: {score}` | `Lives: ♦ ♦ ♦` (lavender gems as life icons) | `Level: {level}`
- [ ] Uses SAP UI5 Web Components typography tokens for font consistency
- [ ] Updates in real time via React state lifted from the game loop

### Start Screen (`app/src/components/StartScreen.jsx`)

- [ ] Full-screen lavender-themed intro screen
- [ ] Displays: `"Joule*Bert"` title (large, styled), Joule jewel graphic, brief instructions text
- [ ] `"Play"` button (SAP UI5 `<ui5-button>` primary variant) starts the game
- [ ] Keyboard shortcut: pressing `Enter` or `Space` also starts the game

### Game Over Screen (`app/src/components/GameOverScreen.jsx`)

- [ ] Full-screen lavender-themed game over screen
- [ ] Displays: `"GAME OVER"`, final score, `"Play Again"` button (SAP UI5 `<ui5-button>`)
- [ ] Pressing `Enter` or `Space` also restarts
- [ ] Fade-in animation on appearance

### SAP UI5 Shell Wrapper (`app/src/App.jsx`)

- [ ] Wrap entire app in SAP UI5 Web Components layout:
  - `<ui5-shell-bar>` with title `"Joule*Bert"` and the Joule gem as the logo/icon
  - `<ui5-page>` or plain `<div>` content area containing the game canvas and screens
- [ ] Import SAP UI5 Web Components in `main.jsx`:
  - `import "@ui5/webcomponents/dist/ShellBar.js"`
  - `import "@ui5/webcomponents-fiori/dist/ShellBar.js"`
  - `import "@ui5/webcomponents/dist/Button.js"`
- [ ] Apply global CSS: lavender background (`#1a0d2e` deep purple-black), game canvas centered

### Audio Feedback (R9)

- [ ] Create `app/src/engine/audio.js` with Web Audio API (no external library):
  - `playTileActivate()` — short ascending chime
  - `playPlayerHit()` — descending "bwop" tone
  - `playLevelComplete()` — short fanfare sequence
  - `playGameOver()` — descending sad tones
- [ ] All sounds generated procedurally via `AudioContext.createOscillator()` — no audio files needed
- [ ] `toggleMute()` — global mute flag; all play functions check flag before playing

### Mute Toggle (`app/src/components/MuteToggle.jsx`)

- [ ] Small icon button (🔊 / 🔇) overlaid in the corner of the game canvas
- [ ] Calls `toggleMute()` from `audio.js`
- [ ] Persists mute state in `localStorage`

### Lavender Color Theme (`app/src/styles/theme.css`)

- [ ] Define CSS custom properties:
  - `--joule-primary: #9B7CC7` (lavender)
  - `--joule-light: #C4A8E8`
  - `--joule-dark: #6B4E9B`
  - `--joule-bg: #1a0d2e`
  - `--joule-tile-unvisited: #4a3570`
  - `--joule-tile-visited: #9B7CC7`
  - `--joule-text: #F0E8FF`
- [ ] Import `theme.css` globally in `main.jsx`

---

## CAP Static Serving Configuration

- [ ] In `assets/joulebert-cap-app/`, configure `server.js` (or `package.json` cds config) to serve `app/dist` as static root:
  ```json
  {
    "cds": {
      "requires": {},
      "server": { "serve_static": "app/dist" }
    }
  }
  ```
- [ ] Add `manifest.yml` or `mta.yaml` for BTP Cloud Foundry deployment:
  - App name: `joulebert`
  - Memory: `128M`
  - Buildpack: `nodejs_buildpack`
  - Command: `npm start`
  - No service bindings required
- [ ] Ensure `npm run build:ui` runs before `cf push` (add as pre-deploy step in docs)
- [ ] Verify: `npm start` serves the game at `http://localhost:4004` with no errors

---

## Milestone Verification

- [ ] **M1**: Player can navigate the full pyramid, all tiles change color, no boundary errors — log: `M1.achieved: pyramid prototype playable — movement, tile coloring, and boundary collision working`
- [ ] **M2**: All three gremlin types spawn and behave correctly; Bug Bot and Hallucinator cause life loss; Legacy Blocker reverts tiles — log: `M2.achieved: all gremlin enemy types active — Bug Bot, Hallucinator, Legacy Blocker behavior verified`
- [ ] **M3**: Player completes Level 1 → 4; loop back to max difficulty after Level 4; pyramid stays on screen — log: `M3.achieved: 4-level progression complete — difficulty scaling and level transitions verified`
- [ ] **M4**: Lavender theme consistent throughout; start/game-over screens complete; UI5 shell in place; sound effects play; mute toggle works — log: `M4.achieved: branding, polish, and shell complete — game ready for demo`
