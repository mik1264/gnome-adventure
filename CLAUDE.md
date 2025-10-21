# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Interactive Gnome Adventure is a browser-based game where a gnome automatically explores a field filled with bombs and flowers. This is a single-file web application with no build process or dependencies - all HTML, CSS, and JavaScript are contained in `index.html`.

## Running the Game

Open `index.html` directly in any modern web browser. No build, compilation, or server required.

## Architecture

### Single-File Structure

The entire application is in `index.html` with three main sections:
- `<style>`: CSS for layout, animations, and responsive design
- `<body>`: HTML structure for controls and game display
- `<script>`: JavaScript game logic

### Game State Management

Global state variables manage the game:
- `gnomePosition`: Current gnome location `{row, col}`
- `gnomeHealth`: Health points (max 3)
- `flowersCollected`: Total flowers collected
- `gnomeStatus`: Current state ('happy', 'collecting', 'exploding', 'dead')
- `currentField`: 2D array representing the game board
- `currentFieldSize`: Size of the current field
- `gnomeTimer`: Interval for automatic movement

### Field Representation

The game field is a 2D array where each cell contains:
- `0`: Empty cell
- `1`: Bomb
- `2`: Flower

The gnome's position is tracked separately in `gnomePosition` and overlaid during rendering.

### Core Game Systems

**Field Generation** (`createBombField`):
- Creates an N×N grid
- Randomly places bombs and flowers using position shuffling
- Ensures no overlap between items
- Places gnome at random starting position

**Gnome Movement** (`moveGnome`):
- Executes every 800ms via `setInterval`
- Supports 8-directional movement (including diagonals)
- Randomly selects from valid adjacent cells
- Stops when gnome dies or all flowers collected

**Interaction Handling** (`handleGnomeInteraction`):
- **Flower collection**: Heals 1 HP (max 3), removes flower from field, triggers 'collecting' animation, checks win condition
- **Bomb explosion**: Damages 1 HP, triggers 'exploding' animation, respawns gnome if alive or ends game if dead
- **Empty cells**: No effect, gnome remains 'happy'

**Rendering** (`renderField`, `updateFieldDisplay`):
- Generates grid dynamically with CSS Grid
- Applies cell classes based on content
- Overlays gnome with appropriate emoji and animation
- Updates stats display with current game state

### Animation States

CSS keyframe animations for gnome states:
- `gnomeWalk`: Subtle scale/rotate animation for normal movement
- `gnomeCollect`: Gold flash when collecting flowers
- `gnomeExplode`: Red flash and scale when hit by bomb
- Dead state uses CSS transform (rotate 45deg) instead of animation

### Win/Lose Conditions

**Win**: All flowers collected (checked in `handleGnomeInteraction` after each flower)
**Lose**: Gnome health reaches 0 (checked after each bomb hit)

Both conditions stop gnome movement and display appropriate message.

### Responsive Design

Media queries handle different screen sizes:
- Grid cell size scales with viewport
- Font sizes adjust for smaller screens
- Layout reflows for mobile devices

## Key Constants and Limits

- Field size: 3-20 (configurable)
- Max gnome health: 3
- Gnome movement interval: 800ms
- Max respawn attempts: 100 (to find safe spot after bomb)
- Animation durations: 300ms (collect), 600ms (explode)

## Development Patterns

**Adding new item types**:
1. Add new numeric constant to field representation
2. Update `createBombField` to place new items
3. Add interaction logic in `handleGnomeInteraction`
4. Add rendering logic in `renderField`
5. Add CSS class and styles

**Modifying gnome behavior**:
- Movement logic: `moveGnome` function
- Speed: Change interval in `startGnomeMovement` (line 559)
- AI: Modify `validMoves` filter to prefer certain directions

**Adding animations**:
1. Define `@keyframes` in CSS
2. Add new gnome status to `gnomeStatus` variable
3. Apply CSS class in `renderField` based on status
4. Trigger status change in `handleGnomeInteraction`

## Testing

No automated test framework. Manual testing by:
1. Opening `index.html` in browser
2. Testing different field configurations
3. Verifying game mechanics (healing, damage, win/lose)
4. Checking responsive behavior at different screen sizes
