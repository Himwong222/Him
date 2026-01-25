# AGENTS.md - Game Development Project Guidelines

## Project Overview

This is a static HTML/JavaScript game collection containing 11 browser-based games (game1.html through game11.html) plus a launcher page (index.html). The project supports Traditional Chinese (zh-TW) and Cantonese (zh-HK) interfaces.

## Build Commands

No build process required - this is a pure static HTML/JavaScript project.

### Testing in Browser
- **Launcher**: Open `index.html` in a web browser to access the game menu
- **Individual Games**: Open `game1.html` through `game11.html` directly to test specific games
- **Local Server**: Run `python -m http.server 8000` in the project directory, then navigate to `http://localhost:8000`
- **Quick Test**: Use any static file server (VS Code Live Server, http-server, etc.)
- **No Live Reload**: Refresh the browser manually after making changes

### No Linting/Formatting Tools
This project does not have ESLint, Prettier, or other code quality tools configured.

## Shared Game Engine

### Location
All shared game utilities are located in `js/game-engine.js`

### Using the Game Engine
```javascript
// Initialize game engine
const game = new GameEngine('canvasId', { width: 800, height: 500 });

// Load high score
game.loadHighScore('gameKey');

// Save high score (returns true if new record)
game.saveHighScore('gameKey', score);

// Create particle effects
game.createParticles(x, y, { 
    count: 15, 
    color: '#FFD700',
    speed: 3,
    size: 4,
    life: 40 
});

// Play sound effects
game.audio.init(); // Initialize audio system
game.audio.play('jump');      // Jump sound
game.audio.play('score');     // Score sound
game.audio.play('gameover');  // Game over sound
game.audio.play('victory');   // Victory sound
game.audio.play('clear');     // Clear lines sound

// Toggle mute
const isMuted = game.audio.toggleMute();
```

### Available Audio Effects
- `click` - Button clicks
- `jump` - Jumping sounds
- `score` - Scoring points
- `hit` - Collision sounds
- `clear` - Line clearing
- `gameover` - Game over
- `victory` - Victory celebration
- `warning` - Warning sounds

### Game Engine Features
- High score storage (with error handling)
- Particle system for visual effects
- Game loop management
- Collision detection utilities
- Math utilities (clamp, lerp, random)
- Difficulty settings
- Game over/victory screens

## Code Style Guidelines

### HTML
- Use semantic HTML5 elements (`<canvas>`, `<button>`, `<div>`, etc.)
- Include `lang` attribute on `<html>` tag (`lang="zh-HK"` for Cantonese or `lang="zh-TW"` for Traditional Chinese)
- Include viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">`
- Add PWA meta tags for mobile:
  ```html
  <meta name="theme-color" content="#6c63ff">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <link rel="manifest" href="manifest.json">
  ```
- Close all tags properly and use self-closing tags where appropriate
- Use double quotes for all attribute values
- Structure: `<!DOCTYPE html>` → `<html>` → `<head>` → `<body>` → `<script>` at end of body

### CSS
- Place CSS in `<style>` tags within the `<head>` section
- Use flexbox for layout (`display: flex`, `justify-content`, `align-items`, `flex-wrap`)
- Apply `box-sizing: border-box` globally (`* { box-sizing: border-box; }`)
- Use CSS custom properties for consistent theme colors when appropriate
- Include responsive design with `@media (max-width: 600px)` queries for mobile
- Add hover effects and transitions for interactive elements (`transition: all 0.3s ease`)
- Use meaningful class names in kebab-case (e.g., `.game-container`, `.difficulty-btn`)
- Use descendant selectors sparingly; prefer flat class structure
- Add `-webkit-tap-highlight-color: transparent` for mobile touch feedback

### JavaScript
- Place all JavaScript in `<script>` tags immediately before `</body>` closing tag
- Include shared game engine: `<script src="js/game-engine.js"></script>`
- Use `const` for constants and `let` for variables; avoid `var` entirely
- Use camelCase for variable and function names (e.g., `gameLoop`, `initGame`, `currentScore`)
- Use descriptive names: `gameRunning` not `gr`, `obstacles` not `obs`, `highScore` not `hs`
- Add Chinese comments for user-facing messages and game logic explanations
- Use template literals for string interpolation: `` `Score: ${score}` ``
- Use arrow functions for callbacks and event handlers
- Use `addEventListener` instead of inline event handlers (`onclick`, etc.)
- Use `localStorage` through game engine for persistent data (high scores, game settings, player preferences)
- Cache DOM element references in `const` variables at the top of script

### Naming Conventions
- Files: kebab-case (e.g., `game1.html`, `game10.html`, `index.html`)
- CSS classes: kebab-case (e.g., `.game-container`, `.difficulty-btn`, `.game-over`)
- JavaScript variables/functions: camelCase (e.g., `initGame`, `gameSpeed`, `isGameOver`)
- Constants: UPPER_SNAKE_CASE or camelCase with `const` (e.g., `MAX_SCORE`, `const FPS = 60`)
- HTML IDs: camelCase (referenced in JavaScript via `getElementById`)

### Error Handling
- Wrap `localStorage` operations in try-catch blocks to handle quota exceeded or privacy settings
- Check that DOM elements exist before using them (e.g., `if (canvas) { ... }`)
- Validate user input (difficulty selection, player names, game settings)
- Handle edge cases in game logic (boundary conditions, division by zero, empty arrays)
- Provide fallback values when data is unavailable (e.g., `parseInt(value) || 0`)
- Log errors to console during development: `console.error('Error message', error)`

### Game Development Patterns
- Use `setInterval(gameLoop, 1000/60)` for 60 FPS game loops (interval = 16.67ms)
- Alternative: Use `requestAnimationFrame` for smoother animations
- Implement AABB collision detection for rectangle-based collision:
  ```javascript
  if (rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y) {
      // Collision detected
  }
  ```
- Use `localStorage.setItem('gameKey', score)` and `localStorage.getItem('gameKey')` for high scores
- Separate game state (variables) from rendering (drawing functions)
- Provide visual feedback for game events (game over overlays, new high score announcements)
- Use configuration objects for difficulty and game settings
- Use game engine's particle system for visual effects: `game.createParticles(x, y, options)`
- Use game engine's audio system for sound effects: `game.audio.play('soundName')`

### Internationalization
- Primary languages: Traditional Chinese (zh-TW) and Cantonese (zh-HK)
- Use Chinese text for all UI elements (buttons, instructions, feedback messages, game over screens)
- Maintain consistent character encoding: `<meta charset="UTF-8">`
- Store feedback messages in objects for easy localization:
  ```javascript
  const feedbackMessages = {
      newHighScore: ['太厲害了！新紀錄！', '你簡直是遊戲大師！'],
      gameOver: ['再試一次！', '差一點就過關了！']
  };
  ```

### Code Organization
- Group related variables together (game settings, DOM references, game state)
- Structure game code with clear function sections: Init → Update → Draw → Event Handlers
- Use configuration objects for game settings (difficulty, obstacles, physics constants)
- Add whitespace between logical code sections for readability
- Keep functions focused and under 50 lines when possible; split complex functions
- Order: Constants/Config → DOM References → Game State → Helper Functions → Main Functions → Event Listeners → Initialization

### Performance Optimization
- Remove off-screen objects from arrays using `splice` or `filter`
- Reuse objects when possible to reduce garbage collection pressure
- Use `const` for DOM element references to avoid repeated `getElementById` calls
- Cache computed values that don't change frequently
- Avoid creating new objects inside game loops
- Use `for` loops instead of `forEach` for performance-critical code

### Accessibility
- Use semantic HTML elements (`<button>` instead of `<div onclick>`)
- Add descriptive text for interactive elements
- Ensure sufficient color contrast between text and backgrounds
- Support keyboard controls where appropriate (arrow keys, space bar, enter)
- Add `aria-label` attributes to icon-only buttons when needed
- Make game over screens focusable for keyboard navigation

## PWA Support

### Files
- `manifest.json` - Web app manifest for PWA installation
- `sw.js` - Service worker for offline support

### Features
- Installable as standalone app on mobile devices
- Offline caching of all game files
- Offline indicator when network is unavailable

## Working with Games

### Game Files
- **Launcher**: `index.html` - Main menu with game categories
- **Arcade Games**: `game1.html` (Dino), `game3.html` (Tetris), `game4.html` (2048), `game5.html` (Snake), `game6.html` (Minesweeper), `game7.html` (Breakout)
- **Board Games**: `game2.html` (Chinese Chess), `game8.html` (Tic-Tac-Toe), `game9.html` (Gomoku)
- **Motion Games**: `game10.html` (Gesture Rock-Paper-Scissors), `game11.html` (Motion Ping-Pong)

### Common Game Elements
- Canvas element: `<canvas id="gameCanvas" width="800" height="300">`
- Difficulty selector: Button group with `data-difficulty` attributes
- Game controls: Start, Reset, and game-specific action buttons
- Game over overlay: Modal-style div with score display and restart button
- High score storage key: Use unique keys per game (e.g., `dinoHighScore`, `tetrisHighScore`)

### Testing Specific Games
- Test each game individually by opening its HTML file directly
- Verify all difficulty levels work correctly
- Test game over and restart functionality
- Verify high scores persist after page refresh
- Check responsive design on mobile viewport sizes
- Test keyboard controls if implemented
- Test sound effects with game engine
- Test particle effects for visual feedback
