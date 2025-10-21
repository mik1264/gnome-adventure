# Gnome Exploration Algorithm Feature - Implementation Plan

## Overview
Add a dropdown UI control that allows users to select different exploration algorithms for the gnome, enabling various playstyles from random wandering to intelligent navigation.

## Constraints & Rules
- **Vision**: Gnome can see contents of 8 adjacent cells before moving
- **Memory**: Gnome has perfect memory of previously visited cells and their contents
- **Live Switching**: Algorithm can be changed during gameplay
- **Naming Style**: Playful, personality-based names

---

## Available Algorithms

### 1. Wanderer (Current Default)
**Behavior**: Pure random walk among valid adjacent cells
- No strategy or optimization
- Picks random direction from 8 valid moves
- Current implementation (lines 1039-1084)

**When to use**: Unpredictable fun, casual play

---

### 2. Brave Explorer
**Behavior**: Prioritizes unexplored territory
- Always prefers cells not in `visitedCells` set
- If all adjacent cells explored → picks random
- Ignores danger in pursuit of discovery

**Algorithm**:
```
1. Get all valid adjacent cells
2. Filter for unexplored cells (not in visitedCells)
3. If unexplored cells exist → pick random from them
4. Else → pick random from all valid cells
```

**When to use**: Maximize map coverage, risky but thorough

---

### 3. Treasure Hunter
**Behavior**: Greedy flower collection using vision + memory
- Immediate: Jumps on visible flowers
- Memory: Navigates to remembered flowers
- Fallback: Explores new territory

**Algorithm**:
```
1. Check adjacent cells for flowers (visible)
2. If flower adjacent → move there immediately
3. Else if known flowers in memory → pathfind to closest
4. Else → prefer unexplored cells
5. Fallback → random valid move
```

**When to use**: Fast wins, flower-heavy maps

---

### 4. Scaredy Cat
**Behavior**: Risk-avoidant, survival-focused
- Scores each move by danger level
- Avoids cells adjacent to bombs
- Uses both vision and memory for safety

**Algorithm**:
```
1. For each valid move, calculate danger score:
   - Adjacent to visible bomb: +10 danger
   - Adjacent to remembered bomb: +5 danger
   - Unexplored cell: +2 danger (unknown risk)
2. Pick move with lowest danger score
3. If tied → prefer explored safe cells
4. Fallback → random from lowest danger moves
```

**When to use**: High bomb density, low health situations

---

### 5. Scout (Balanced/Smart)
**Behavior**: Weighs multiple factors for optimal decisions
- Balances flower seeking, bomb avoidance, exploration
- Uses all available information
- Most "intelligent" algorithm

**Algorithm**:
```
1. For each valid move, calculate score:
   - Flower visible: +50 points
   - Known flower nearby: +20 points
   - Unexplored cell: +15 points
   - Adjacent to bomb: -30 points
   - Previously visited: -5 points
2. Pick move with highest score
3. Add slight randomness for ties (10% variance)
```

**When to use**: Best general-purpose, optimal play

---

### 6. Drifter (Optional)
**Behavior**: Momentum-based wandering
- Prefers continuing in same direction
- Smooth, natural-looking movement
- Random when hitting wall

**Algorithm**:
```
1. If lastMoveDirection exists and valid → 70% chance use it
2. Else → pick random adjacent move
3. Store direction for next move
```

**When to use**: Aesthetically pleasing to watch

---

## Implementation Details

### Data Structures (New Global Variables)

```javascript
let explorationAlgorithm = 'wanderer'; // Current selected algorithm
let visitedCells = new Set(); // Track "row,col" strings
let knownBombs = new Map(); // Remember bomb locations
let knownFlowers = new Map(); // Remember flower locations
let lastMoveDirection = null; // For Drifter algorithm
```

### Helper Functions

```javascript
// Get what gnome can see in adjacent cells
function getCellsInVision() {
    // Returns array of {row, col, content} for 8 adjacent cells
}

// Check if a position is adjacent to bombs
function isAdjacentToBomb(row, col) {
    // Uses both vision + knownBombs memory
}

// Find closest known flower using Manhattan distance
function findClosestKnownFlower() {
    // Returns {row, col} or null
}

// Update memory after each move
function updateGnomeMemory() {
    visitedCells.add(`${gnomePosition.row},${gnomePosition.col}`);
    // Scan vision and update knownBombs/knownFlowers
}
```

### Algorithm Functions

```javascript
function algorithmWanderer(validMoves) {
    return validMoves[Math.floor(Math.random() * validMoves.length)];
}

function algorithmBrave(validMoves) {
    // Filter for unexplored, fallback to random
}

function algorithmTreasureHunter(validMoves) {
    // Check vision for flowers, use memory, explore
}

function algorithmScaredyCat(validMoves) {
    // Score by danger, pick safest
}

function algorithmScout(validMoves) {
    // Multi-factor weighted scoring
}

function algorithmDrifter(validMoves) {
    // Momentum-based with randomness
}
```

### Modified Movement Logic

```javascript
function moveGnome() {
    // ... existing code ...

    // Get valid moves (existing logic)
    const validMoves = moves.filter(/* ... */);

    // NEW: Select move using current algorithm
    let selectedMove;
    switch(explorationAlgorithm) {
        case 'wanderer':
            selectedMove = algorithmWanderer(validMoves);
            break;
        case 'brave':
            selectedMove = algorithmBrave(validMoves);
            break;
        case 'treasure-hunter':
            selectedMove = algorithmTreasureHunter(validMoves);
            break;
        case 'scaredy-cat':
            selectedMove = algorithmScaredyCat(validMoves);
            break;
        case 'scout':
            selectedMove = algorithmScout(validMoves);
            break;
        case 'drifter':
            selectedMove = algorithmDrifter(validMoves);
            break;
        default:
            selectedMove = algorithmWanderer(validMoves);
    }

    // Apply the move
    gnomePosition.row += selectedMove.row;
    gnomePosition.col += selectedMove.col;

    // NEW: Update memory
    updateGnomeMemory();

    // ... rest of existing code ...
}
```

### UI Changes

**HTML Addition** (insert after game speed control, around line 815):
```html
<div class="control-item">
    <label for="explorationAlgo">AI Style</label>
    <select id="explorationAlgo" onchange="updateAlgorithm()">
        <option value="wanderer" selected>Wanderer</option>
        <option value="brave">Brave Explorer</option>
        <option value="treasure-hunter">Treasure Hunter</option>
        <option value="scaredy-cat">Scaredy Cat</option>
        <option value="scout">Scout</option>
    </select>
</div>
```

**CSS Additions** (for select element):
```css
.control-item select {
    padding: 12px;
    border: 2px solid #dee2e6;
    border-radius: 8px;
    font-size: 1em;
    width: 150px;
    cursor: pointer;
    transition: border-color 0.3s;
    background: white;
}

@media (max-width: 1024px) {
    .control-item select {
        padding: 4px;
        font-size: 0.75em;
        width: 90px;
    }
}

.control-item select:focus {
    outline: none;
    border-color: #007bff;
}
```

**JavaScript Handler**:
```javascript
function updateAlgorithm() {
    explorationAlgorithm = document.getElementById('explorationAlgo').value;
    // No need to restart - will take effect on next move
}
```

### Reset Logic

Update `generateField()` to reset memory:
```javascript
function generateField() {
    // ... existing reset code ...

    // Reset algorithm memory
    visitedCells = new Set();
    knownBombs = new Map();
    knownFlowers = new Map();
    lastMoveDirection = null;

    // ... rest of function ...
}
```

---

## Testing Checklist

- [ ] Each algorithm produces valid moves
- [ ] Memory persists across moves
- [ ] Live switching works mid-game
- [ ] UI dropdown styled consistently
- [ ] Responsive on mobile/tablet
- [ ] Reset clears memory on new game
- [ ] No crashes with edge cases (0 bombs, 0 flowers, full board)

---

## Recommended Implementation Order

1. **Phase 1**: Data structures + helper functions
2. **Phase 2**: Wanderer + Brave Explorer (simplest algorithms)
3. **Phase 3**: UI dropdown integration
4. **Phase 4**: Treasure Hunter + Scaredy Cat
5. **Phase 5**: Scout (most complex)
6. **Phase 6**: Optional Drifter if desired

---

## Future Enhancements (Not in Initial Scope)

- Algorithm statistics (win rate, avg steps per algorithm)
- Visual indicator showing what gnome "sees"
- Difficulty levels that affect vision range
- Custom algorithm creator (user-defined weights)

---

## Critical Reflection & Refinements

### Overall Assessment: 85% Solid ✅

Core architecture is sound and aligns with existing single-file structure. However, several ambiguities and edge cases need addressing during implementation.

### Issues Identified

#### 1. Treasure Hunter Pathfinding Complexity ⚠️

**Problem**: Plan says "pathfind to closest flower" but gnome only has 8-cell vision range. Full pathfinding (A*, BFS) is overkill.

**Original (Line 54)**:
```
3. Else if known flowers in memory → pathfind to closest
```

**Refined Approach**:
```
3. Else if known flowers exist → move toward nearest flower
   - Calculate Manhattan distance to all known flowers
   - Pick valid move that minimizes distance to closest flower
   - Simple greedy direction, not true pathfinding
```

**Rationale**: Simpler implementation, still effective, fits limited-information model.

---

#### 2. Data Structure Simplification 🔧

**Current Plan (Line 130-132)**:
```javascript
let knownBombs = new Map(); // Remember bomb locations
let knownFlowers = new Map(); // Remember flower locations
```

**Issue**: What would Map values be? We only need positions.

**Better**:
```javascript
let visitedCells = new Set();   // "row,col" strings
let knownBombs = new Set();     // "row,col" strings
let knownFlowers = new Set();   // "row,col" strings
```

**Rationale**: All should be Sets of position strings. Simpler and sufficient for our needs.

---

#### 3. Danger Scoring Clarification 🎯

**Ambiguity**: When evaluating move from position P to destination M, what does "adjacent to bomb" mean given vision limits?

**Vision Reality**:
- Gnome at P can see M's content (8-cell vision)
- Gnome can see SOME of M's neighbors (vision overlap)
- Gnome CANNOT see all of M's neighbors (some are 2+ steps away)

**Refined Danger Scoring** (for Scaredy Cat):
```
1. Filter out moves to bomb cells (instant death)
2. For each remaining valid move M, calculate danger:
   - M's visible neighbors contain bombs: +10 danger per bomb
   - M's remembered neighbors contain bombs: +5 danger per bomb
   - M is unexplored: +2 danger (unknown risk)
3. Pick move with lowest danger score
```

**Scout Scoring** should be similarly explicit:
```
- Flower in destination cell: +100 points
- Move reduces distance to nearest known flower: +20 points
- Move increases distance: -10 points
- Unexplored cell: +15 points
- Visible bomb adjacent to destination: -30 per bomb
- Remembered bomb adjacent to destination: -15 per bomb
- Previously visited: -5 points
```

---

#### 4. Invincibility State Handling ✨

**Missing**: No mention of checking `gnomeStatus === 'invincible'` in algorithms.

**Problem**: When gnome has invincibility (from Phoenix Flower, lines 1159-1175), bomb danger should be ignored.

**Required Changes**:
```javascript
function algorithmScaredyCat(validMoves) {
    if (gnomeStatus === 'invincible') {
        return algorithmBrave(validMoves); // Act fearless when safe
    }
    // ... normal cautious logic
}

function algorithmScout(validMoves) {
    const bombPenalty = (gnomeStatus === 'invincible') ? 0 : -30;
    // ... use bombPenalty in scoring
}
```

**Treasure Hunter** can also be more aggressive when invincible.

---

#### 5. Memory Management Edge Cases 🧠

**Issue 1: Flower Collection**
When gnome collects flower (line 1104):
```javascript
currentField[gnomePosition.row][gnomePosition.col] = 0;
```

**Missing**: Remove from memory too
```javascript
knownFlowers.delete(`${gnomePosition.row},${gnomePosition.col}`);
```

**Issue 2: Initial Memory State**
When should memory be initialized?

**Current Plan**: Doesn't specify starting state.

**Better Approach**:
```javascript
function generateField() {
    // ... existing code ...

    // Initialize memory with starting position
    visitedCells = new Set();
    knownBombs = new Set();
    knownFlowers = new Set();

    visitedCells.add(`${gnomePosition.row},${gnomePosition.col}`);
    updateGnomeMemory(); // Scan initial 8-cell vision
}
```

---

#### 6. Vision Helper Function Specification 📡

**Current Plan (Line 139-141)**:
```javascript
function getCellsInVision() {
    // Returns array of {row, col, content} for 8 adjacent cells
}
```

**Too Vague**. Should specify:

**Refined Signature**:
```javascript
function getCellsInVision() {
    // Returns array of {row, col, content} for adjacent cells
    // Only includes cells within field bounds (edge handling)
    // content comes from currentField[row][col]
    const neighbors = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
    ];

    return neighbors
        .map(([dr, dc]) => ({
            row: gnomePosition.row + dr,
            col: gnomePosition.col + dc
        }))
        .filter(({row, col}) =>
            row >= 0 && row < currentFieldSize &&
            col >= 0 && col < currentFieldSize
        )
        .map(({row, col}) => ({
            row,
            col,
            content: currentField[row][col]
        }));
}
```

---

#### 7. Memory Update Timing ⏱️

**Question**: When exactly is memory updated?

**Proposed Flow**:
```
1. moveGnome() selects destination using algorithm
2. gnomePosition updated
3. updateGnomeMemory() called BEFORE handleGnomeInteraction()
   - Add current position to visitedCells
   - Scan 8-cell vision
   - Update knownBombs/knownFlowers Sets
4. handleGnomeInteraction() processes cell content
   - If flower: remove from knownFlowers
   - If bomb: trigger explosion, respawn
```

**Rationale**: Memory should reflect knowledge BEFORE consequences occur.

---

#### 8. Scout Neighborhood Awareness 🔍

**Original Scout (Line 94)**:
```
- Known flower nearby: +20 points
```

**Too vague**: Define "nearby"

**Refined**:
```
- Move toward nearest known flower (reduces distance): +20
- Move away from nearest known flower: -10
```

Uses Manhattan distance calculation.

---

#### 9. Brave Explorer Behavior Pattern 🗺️

**Observation**: Brave Explorer creates depth-first search pattern.

**Consequence**:
- Gnome might wander far from spawn before exploring nearby areas
- Could miss flowers adjacent to starting position
- Valid strategy, but different from breadth-first coverage

**Not a bug**: This is working as intended. Creates interesting exploration pattern.

**Future Enhancement**: Could add "Methodical Explorer" (breadth-first) later.

---

#### 10. Performance Analysis 📊

**Concern**: Is memory updating every move too expensive?

**Analysis**:
- Max field: 20×20 = 400 cells
- Typical game: ~100 steps
- Operations per move: 8 cells scanned + Set operations
- Total: 100 moves × 8 scans = 800 operations
- Set add/has operations are O(1)

**Verdict**: ✅ No performance issue. Totally acceptable.

---

### Algorithm Balance Review 🎮

**Question**: Will these be fun to watch/play?

- **Wanderer**: Pure RNG - unpredictable, could be hilarious or frustrating ✅
- **Brave Explorer**: Systematic coverage, ignores danger - interesting to watch ✅
- **Treasure Hunter**: Goal-directed, might be too effective? ⚠️
- **Scaredy Cat**: Overly cautious, might freeze in dense bomb fields? ⚠️
- **Scout**: Might be "optimal" and boring to watch? ⚠️

**Mitigation**: Users can control difficulty by choosing algorithm + field configuration. If Scout wins too easily, that's a feature (reward for picking smart AI). If Scaredy Cat freezes, user can switch algorithms mid-game.

**Verdict**: Algorithm variety is good. Balance concerns are acceptable.

---

### Required Refinements Summary

**Must Fix During Implementation**:
1. ✅ Use Sets for all memory structures (not Maps)
2. ✅ Simplify Treasure Hunter to greedy direction (not pathfinding)
3. ✅ Add invincibility checks to danger-aware algorithms
4. ✅ Initialize memory at game start with initial vision
5. ✅ Remove flowers from knownFlowers when collected
6. ✅ Make Scout scoring more explicit and distance-based
7. ✅ Specify getCellsInVision() implementation details
8. ✅ Clarify danger scoring for limited vision range

**Nice to Have**:
- Add algorithm tooltips in UI (explain behavior on hover)
- Debug mode: visualize what gnome "sees" and "remembers"
- Statistics tracking per algorithm

---

### Final Verdict

**Status**: Plan is architecturally sound and ready for implementation.

**Confidence**: 85% → 95% after refinements

**Recommendation**: Proceed with implementation, incorporating the refinements above. The core structure is correct, and identified issues are all addressable during coding.

**Next Step**: Exit plan mode and begin Phase 1 implementation.
