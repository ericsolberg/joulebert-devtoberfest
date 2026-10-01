# Execution Guidelines

## General Rules

- Read the per-asset specification before starting any implementation task.
- Check off `- [ ]` items as you complete them (change to `- [x]`).
- Never skip a task — if a task cannot be completed, document the reason clearly.
- Write clean, well-documented code with helpful inline comments.
- Never use lazy placeholders like `// ... existing code ...` — always provide complete file content.
- When a file already exists, use `update_file` (targeted search+replace) rather than overwriting the whole file.
- All code must be functional and tested before marking a task complete.

## File Organization

- CAP application code lives in `assets/<asset-name>/`
- React UI source lives in `assets/<asset-name>/app/` (or the configured Vite/React root)
- Keep HTML, CSS, and JavaScript/TypeScript in separate files
- Use relative imports within packages

## Technology Constraints

- **Backend**: CAP (Node.js) — zero CDS entities for this project; static file serving only
- **Frontend**: React + HTML5 Canvas; SAP UI5 Web Components for shell chrome
- **Styling**: Lavender color theme (#9B7CC7 primary); no external CSS frameworks beyond UI5
- **No direct HTTP calls** to SAP APIs — all API interactions must go through MCP tools (N/A for this project)
- **No backend persistence** — all game state is ephemeral (in-memory / React state)

## Coding Standards

- Use functional React components and hooks (no class components)
- Game loop must use `requestAnimationFrame` — never `setInterval` for the render loop
- Separate game logic from React rendering: keep engine logic in plain JS/TS modules
- Canvas rendering: clear and redraw each frame; use `save()`/`restore()` around transforms
- All magic numbers (colors, speeds, sizes) must be defined as named constants

## Testing

- Smoke-test the game in the browser after each milestone (M1–M4)
- Verify keyboard controls (arrow keys + WASD) and click/touch controls
- Check that the pyramid fits within a 1280×800 viewport

## Deployment

- The CAP app must deploy cleanly with `cf push` or MTA tooling
- React build output is placed in the CAP static resources folder
- No authentication, no database bindings required
