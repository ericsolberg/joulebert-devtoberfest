# Product Requirements Document (PRD)

**Title:** Joule\*Bert — Q\*bert-Style Arcade Game Easter Egg  
**Date:** 2026-09-29  
**Owner:** Joule Studio Team  
**Solution Category:** Custom React UI Application (within CAP)

---

## Product Purpose & Value Proposition

**Elevator Pitch:**  
Joule\*Bert is a browser-based arcade game — a loving tribute to the classic Q\*bert — built as a hidden easter egg for the SAP Joule Studio community. Players control a multi-faceted lavender jewel (the Joule brand icon) hopping across an isometric pyramid, changing tile colors while dodging whimsical AI gremlins. It requires no login, no backend, and no setup: just open a URL and play.

**Business Need:**  
The Joule Studio team wants a fun, shareable artifact that reinforces Joule branding in a memorable way, sparks joy among colleagues, and can be used as a crowd-pleaser at internal team events and demos. There is no standard SAP product that fulfills this need — it is entirely custom-built.

**Expected Value:**  
- Generates smiles and positive word-of-mouth across SAP internal communities
- Reinforces Joule brand identity in a playful, human way
- Provides a demo-ready showpiece for Joule Studio team events

**Product Objectives (Prioritized):**
1. Deliver a fully playable, bug-free Q\*bert-style game experience in the browser
2. Express Joule's visual identity (lavender jewel, lavender palette) throughout the game
3. Make the game easy to share — a single URL is all that is needed

---

## User Profiles & Personas

### Primary Persona: Alex — The SAP Colleague / Player

Alex is a 32-year-old SAP developer or product manager who discovers the Joule\*Bert link shared in a team Slack channel or shown at a demo. Alex has fond memories of classic arcade games and immediately recognizes the Q\*bert format. Alex wants to beat the current high score among colleagues, laugh at the gremlin enemy names, and share the link with their own team. Alex is comfortable in a browser but expects the game to work immediately without any setup, login, or instructions manual.

**Goals:**
- Jump into the game in under 5 seconds
- Understand the objective instinctively (classic Q\*bert rules apply)
- Progress through levels and feel a satisfying increase in challenge

**Key Tasks:**
- Open the URL and click/tap to start
- Control the Joule jewel using keyboard or touch
- Avoid gremlins, color all tiles, advance levels

### Secondary Persona: Jordan — The Joule Studio Developer / Demo Host

Jordan is a 28-year-old Joule Studio developer who built (or maintains) the game and shows it at internal events. Jordan needs the game to deploy cleanly to SAP BTP, load fast, and look polished enough to represent the Joule brand in a demo setting.

**Goals:**
- Deploy confidently to SAP BTP Cloud Foundry with a standard CAP workflow
- Show the game on a projected screen without visual glitches
- Make small theming tweaks easily if branding guidance changes

---

## Goals and Non-Goals

### Goals (In Scope)

- Fully playable isometric pyramid game with hop-based tile-coloring mechanic
- Joule brand jewel as the player character; three distinct AI-gremlin enemy types
- Four difficulty levels with increasing enemy speed and quantity
- In-session score and lives display (no persistence required)
- Keyboard (arrow / WASD) and touch/click input support
- Lavender (#9B7CC7) color theme throughout, SAP UI5 Web Components shell wrapper
- Hosted as a static React SPA inside a zero-entity CAP application on SAP BTP

### Non-Goals (Out of Scope)

- No leaderboard, high-score persistence, or backend database
- No user authentication or login
- No mobile app packaging (browser only)
- No multiplayer or networked play
- No accessibility compliance beyond basic keyboard support

---

## Requirements

### Must-Have Requirements

**R1: Isometric Pyramid Game Board**

- **Problem to Solve**: Players need a classic Q\*bert-style pyramid to hop across.
- **User Story**: As a player, I need an isometric pyramid of tiles rendered on screen so that I can navigate across it and change tile colors by landing on them.
- **Acceptance Criteria**:
  - Given the game loads, a pyramid of cubes is drawn on a canvas element
  - When the player lands on an unvisited tile, it changes to the "activated" lavender color
  - When all tiles are activated, the level is complete and the next level begins
- **Maps to Objective**: Objective 1 — playable game experience
- **Priority Rank**: 1

**R2: Joule Jewel Player Character**

- **Problem to Solve**: The hero must represent the Joule brand visually.
- **User Story**: As a player, I need the hero character to look like the Joule multi-faceted lavender jewel so that the game feels connected to the Joule product identity.
- **Acceptance Criteria**:
  - Given the game starts, a faceted lavender gem sprite is displayed on the top tile
  - When the player presses a direction key, the gem hops to the adjacent tile with a bounce animation
  - The gem sprite is recognizable as the SAP Joule icon
- **Maps to Objective**: Objective 2 — Joule visual identity
- **Priority Rank**: 2

**R3: Three Distinct AI-Gremlin Enemies**

- **Problem to Solve**: The game needs enemies that challenge the player in different ways, themed as enemies of enterprise AI.
- **User Story**: As a player, I need enemies with distinct behaviors so that each gremlin type requires a different avoidance strategy, keeping the game interesting.
- **Acceptance Criteria**:
  - **The Bug Bot**: spawns from the top, bounces methodically downward, causes immediate game-over on contact
  - **The Hallucinator**: moves randomly, can teleport to any tile; causes game-over on contact
  - **The Legacy Blocker**: moves slowly but reverts any tile it lands on to unactivated state
  - All three types are visually distinct from the player and from each other
- **Maps to Objective**: Objective 1 — playable game experience
- **Priority Rank**: 3

**R4: Four Difficulty Levels**

- **Problem to Solve**: The game must get progressively harder to maintain engagement without becoming unplayable or exceeding the screen.
- **User Story**: As a player, I need the difficulty to increase across levels so that I feel a satisfying sense of challenge and progression.
- **Acceptance Criteria**:
  - Level 1: 1 Bug Bot, slow speed; Level 2: adds a Hallucinator; Level 3: adds a Legacy Blocker; Level 4: all types at increased speed and count
  - Pyramid dimensions remain fixed to fit within the browser viewport on all four levels
  - A level transition animation and level number indicator display between levels
  - After Level 4, the game loops at maximum difficulty
- **Maps to Objective**: Objective 1 — playable game experience
- **Priority Rank**: 4

**R5: In-Session Score and Lives Display**

- **Problem to Solve**: Players need feedback on their performance to stay engaged.
- **User Story**: As a player, I need to see my current score and remaining lives during play so that I know how well I am doing.
- **Acceptance Criteria**:
  - Score increments for each tile activated (first activation only)
  - Players start with 3 lives; losing a life shows an animation and respawns the player at the top
  - Score and lives are shown as a persistent HUD (heads-up display) over the game canvas
  - Score and lives reset on "New Game"
- **Maps to Objective**: Objective 1 — playable game experience
- **Priority Rank**: 5

**R6: Keyboard and Touch Controls**

- **Problem to Solve**: The game must be accessible to players on desktop and on touchscreen devices at demo events.
- **User Story**: As a player, I need to control the Joule jewel with both keyboard and touch/click inputs so that I can play on any device without a special setup.
- **Acceptance Criteria**:
  - Arrow keys and WASD move the jewel in the four diagonal directions
  - Tapping or clicking on an adjacent tile moves the jewel there
  - Controls are responsive with no perceptible lag
- **Maps to Objective**: Objective 3 — easy to share and play
- **Priority Rank**: 6

**R7: Lavender Theme and SAP UI5 Shell**

- **Problem to Solve**: The game must feel like a polished Joule-branded experience, not a generic game.
- **User Story**: As a demo host, I need the game to look on-brand so that it reinforces Joule's identity during team demos and shareable screenshots.
- **Acceptance Criteria**:
  - Primary color palette is lavender (#9B7CC7) with complementary shades for activated/unactivated tiles, background, and UI elements
  - SAP UI5 Web Components provide the page shell (title bar, outer container)
  - Game title "Joule\*Bert" is prominently displayed with Joule iconography
  - Start screen, game-over screen, and level transition screens are all consistently styled
- **Maps to Objective**: Objective 2 — Joule visual identity
- **Priority Rank**: 7

**R8: CAP Application Hosting**

- **Problem to Solve**: The game needs a deployable container on SAP BTP.
- **User Story**: As a developer, I need the game to be wrapped in a standard CAP application so that it can be deployed to SAP BTP Cloud Foundry using familiar tooling.
- **Acceptance Criteria**:
  - The CAP project has no CDS entities — it serves only as a static file host
  - The React build output is served as static content
  - The application deploys to SAP BTP Cloud Foundry with `cf push` or MTA deployment
  - A single public URL loads the game in a browser without authentication
- **Maps to Objective**: Objective 3 — easy to share
- **Priority Rank**: 8

### High-Want Requirements

**R9: Visual and Audio Feedback**

- **Problem to Solve**: The game feels flat without responsive feedback.
- **User Story**: As a player, I need sound effects and visual animations so that the game feels lively and satisfying to play.
- **Acceptance Criteria**:
  - Short sound effects play on tile activation, enemy contact, level completion, and game over
  - The player jewel has a small bounce animation on each hop
  - Gremlins have idle animations
  - A mute toggle is available
- **Priority Rank**: 1

**R10: Start Screen and Game-Over Screen**

- **Problem to Solve**: The game needs clear entry and exit points.
- **User Story**: As a player, I need a start screen and a game-over screen so that I can begin a new game easily and see my final score.
- **Acceptance Criteria**:
  - Start screen shows game title, brief instructions, and a "Play" button
  - Game-over screen shows final score and a "Play Again" button
  - Both screens use the lavender theme
- **Priority Rank**: 2

---

## Solution Architecture

**Architecture Overview:**  
Joule\*Bert is a React single-page application with an HTML5 Canvas game engine, wrapped inside a zero-entity CAP application for deployment. There is no backend data layer.

**Key Components:**

- **React SPA**: Application shell, routing, HUD components (score, lives, level)
- **HTML5 Canvas Game Engine**: Game loop, pyramid rendering, character sprites, collision detection, level logic
- **SAP UI5 Web Components**: Page shell (title bar, layout wrapper) for SAP-consistent chrome
- **CAP Application (host only)**: Static file serving; no CDS entities, no database, no OData services
- **SAP BTP Cloud Foundry**: Deployment target

**Deployment Environments:**

- Single environment; the game contains no sensitive data and requires no environment separation

---

## Milestones

### M1: Playable Pyramid Prototype

- **Description**: The core game loop is working — pyramid renders, Joule jewel hops, tiles change color, collision with board edges is handled
- **Achieved when**: A player can navigate the full pyramid and change all tile colors without errors
- **Log on achievement**: `M1.achieved: pyramid prototype playable — movement, tile coloring, and boundary collision working`
- **Log on miss**: `M1.missed: pyramid prototype not reached — core game loop incomplete`

### M2: All Three Enemy Gremlins Implemented

- **Description**: Bug Bot, Hallucinator, and Legacy Blocker all spawn and move on the pyramid with their defined behaviors
- **Achieved when**: All three enemy types are active in-game, cause the correct effects on contact, and are visually distinct
- **Log on achievement**: `M2.achieved: all gremlin enemy types active — Bug Bot, Hallucinator, Legacy Blocker behavior verified`
- **Log on miss**: `M2.missed: one or more gremlin types not implemented or behaving incorrectly`

### M3: Four-Level Progression Complete

- **Description**: All four difficulty levels are implemented, transitions work, and pyramid stays within screen bounds
- **Achieved when**: Player can complete Level 1 through Level 4 and the game loops correctly at max difficulty
- **Log on achievement**: `M3.achieved: 4-level progression complete — difficulty scaling and level transitions verified`
- **Log on miss**: `M3.missed: level progression incomplete or pyramid exceeds screen bounds`

### M4: Full Polish and Branding

- **Description**: Lavender theme applied throughout, Joule jewel sprite finalized, gremlin visuals complete, sound/visual feedback in place, SAP UI5 shell integrated
- **Achieved when**: The game is visually indistinguishable from the intended brand spec; start and game-over screens are complete; sound effects play
- **Log on achievement**: `M4.achieved: branding, polish, and shell complete — game ready for demo`
- **Log on miss**: `M4.missed: branding or polish incomplete — not demo-ready`

---

## Risks, Assumptions, and Dependencies

### Risks

- Canvas performance on lower-end or older browsers may cause frame-rate drops — mitigated by keeping sprite complexity low
- Lavender color accuracy depends on screen calibration; minor variation is acceptable

### Assumptions

- The game is deployed to a publicly accessible (but unlinked) BTP URL — security by obscurity is acceptable for an internal easter egg
- No authentication or user management is required

### Dependencies

- SAP BTP Cloud Foundry subaccount with quota for one additional app
- React, HTML5 Canvas, SAP UI5 Web Components (all open source / included in BTP)

---

## Appendix

### Glossary

| Term | Definition |
|------|------------|
| Q\*bert | Classic 1982 arcade game; player hops on isometric pyramid tiles to change their color while avoiding enemies |
| Joule | SAP's AI assistant; its brand icon is a multi-faceted lavender jewel |
| CAP | SAP Cloud Application Programming Model — framework for building cloud-native apps on BTP |
| HUD | Heads-up display — on-screen overlay showing score, lives, and level |
| The Bug Bot | Enemy gremlin type 1; bounces methodically downward |
| The Hallucinator | Enemy gremlin type 2; moves randomly and teleports |
| The Legacy Blocker | Enemy gremlin type 3; reverts activated tiles to unactivated |
