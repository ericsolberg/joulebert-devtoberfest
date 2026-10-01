# Joule*Bert — Q*bert-Style Arcade Game Easter Egg

A fun arcade game for the SAP Joule Studio team, built as a React UI within a CAP application on SAP BTP.

## Business Challenge

The Joule Studio team wants a delightful, shareable easter egg: a Q*bert-inspired arcade game called "Joule*Bert" where the Joule character (a multi-faceted lavender jewel) hops across a pyramid, changing tile colors while evading whimsical AI-gremlin enemies. The game should reinforce Joule branding, generate smiles, and be shareable across SAP.

## Business Goals & Success Criteria

| Metric | Baseline | Target | Timeline | Process / Capability | Source |
|--------|----------|--------|----------|----------------------|--------|
| Colleague engagement | — | Played and shared virally within SAP | — | Internal team morale / developer experience | user |
| Event usage | — | Demonstrated at a team event | — | Team demos / showcases | user |

## Key Milestones

- **Playable prototype**: Core Q*bert pyramid movement, tile coloring, and collision detection working
- **Enemy AI**: All three gremlin types spawning and moving on the pyramid
- **Level progression**: 4 difficulty levels implemented and capped at a screen-friendly pyramid size
- **Polish & branding**: Lavender theme, Joule jewel sprite, gremlin sprites, sound/visual feedback

## Business Architecture (RBA)

### End-to-End Process

Idea to Release for Software

### Process Hierarchy

```
Idea to Release for Software
└── Manage Service (software product)
    └── Manage solution lifecycle and compliance (software product)
        └── Manage solution data
```

### Summary

This internal developer experience tool maps to the "Idea to Release for Software" E2E process, specifically solution lifecycle management. It is entirely custom development with no standard SAP product coverage.

## Fit Gap Analysis

| Requirement (business) | Standard asset(s) found | API ORD ID | MCP Server ORD ID | MCP Server Version | Webhook API ORD ID | Data Product ORD ID | Gap? | Notes / assumptions |
|------------------------|-------------------------|------------|-------------------|--------------------|--------------------|---------------------|------|---------------------|
| Playable arcade game UI | None — full custom build | — | — | — | — | — | Yes | React + HTML Canvas; no SAP standard product covers a game |
| Joule branding & lavender theme | SAP Fiori / UI5 Web Components (shell chrome only) | — | — | — | — | — | No | UI5 Web Components used for page shell; game canvas is fully custom |
| Level progression & difficulty scaling | None — custom | — | — | — | — | — | Yes | 4 levels, pyramid scales within screen bounds |
| CAP hosting (no entities) | SAP CAP (static file serving) | — | — | — | — | — | No | CAP used purely as the deployment container; no CDS entities needed |

### Key Findings

- This is 100% a custom development — no standard SAP product provides an arcade game engine.
- SAP UI5 Web Components provide the outer shell chrome for SAP-consistent look and feel.
- CAP serves as a lightweight hosting container with no data model.
- The game canvas is implemented with React and the HTML5 Canvas API.
- No APIs, MCP servers, or data products are required.
- All game state (score, level) is ephemeral — no backend persistence or leaderboard needed.

## Recommendations

### Joule*Bert — Custom React Game in CAP Shell

#### Executive Summary

Fully custom React + Canvas game hosted inside a zero-entity CAP app.

#### Recommended Solution

Build "Joule*Bert" as a React single-page application using the HTML5 Canvas API for the game loop and rendering. Host it inside a CAP application (no CDS entities) deployed to SAP BTP Cloud Foundry. SAP UI5 Web Components wrap the outer page shell for branding consistency. The lavender color palette mirrors Joule's official SAP iconography.

**Game Design Specification:**
- **Hero**: Multi-faceted lavender jewel (Joule's SAP brand icon) — hops across pyramid tiles
- **Objective**: Land on every tile to change its color; complete the pyramid to advance
- **Enemies**:
  - *The Bug Bot* — relentlessly bounces down the pyramid hunting the player
  - *The Hallucinator* — moves unpredictably, teleporting randomly between tiles
  - *The Legacy Blocker* — slow but reverses tile colors back, undoing player progress
- **Levels**: 4 total; difficulty increases via faster enemies and more simultaneous gremlins; pyramid size is fixed to remain screen-friendly
- **Scoring**: In-session score display; no persistence, no leaderboard
- **Color theme**: Lavender (#9B7CC7 / SAP Joule palette) throughout

#### Recommended solution category

Custom React UI Application (within CAP)

#### Intent fit
100%
