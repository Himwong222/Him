# AGENTS.md - Game Development Project Guidelines

## Build Commands

This is a static HTML/JavaScript project. No build process is required.

### Testing in Browser
- Open `index.html` in a web browser to access the game launcher
- Open individual game files (game1.html, game2.html, etc.) directly to test specific games
- Use a local server for testing: `python -m http.server 8000` or any static file server
- Live reload is not configured - refresh the browser manually after changes

### No Linting/Formatting Tools
This project does not have ESLint, Prettier, or other code quality tools configured.

## Code Style Guidelines

### HTML
- Use semantic HTML5 elements (`<canvas>`, `<button>`, etc.)
- Include `lang` attribute on `<html>` tag (e.g., `lang="zh-HK"` or `lang="zh-TW"`)
- Include viewport meta tag for responsive design
- Close all tags properly
- Use double quotes for attribute values

### CSS
- Place CSS in `<style>` tags within the `<head>` section
- Use flexbox for layout (`display: flex`, `justify-content`, `align-items`)
- Use CSS custom properties for consistent colors when appropriate
- Include responsive design with `@media` queries for mobile devices
- Use `box-sizing: border-box` on all elements
- Add hover effects and transitions for interactive elements
- Use meaningful class names (kebab-case)

### JavaScript
- Place JavaScript in `<script>` tags before `</body>` closing tag
- Use `const` for constants, `let` for variables, avoid `var`
- Use camelCase for variable and function names (e.g., `gameLoop`, `initGame`)
- Use descriptive names: `gameRunning` not `gr`, `obstacles` not `obs`
- Add Chinese comments for user-facing messages and game logic
- Use template literals for string interpolation
- Use arrow functions for callbacks
- Use `addEventListener` instead of inline event handlers
- Use `localStorage` for persistent data (high scores, settings)

### Naming Conventions
- Files: kebab-case (e.g., `game1.html`, `my-game.html`)
- CSS classes: kebab-case (e.g., `.game-container`, `.difficulty-btn`)
- JavaScript variables/functions: camelCase (e.g., `initGame`, `gameSpeed`)
- Constants: UPPER_SNAKE_CASE or camelCase with `const` (e.g., `MAX_SCORE`)
- IDs: camelCase (referenced in JavaScript via `getElementById`)

### Error Handling
- Add basic error checking for `localStorage` access
- Check that DOM elements exist before using them
- Use `try-catch` for operations that may fail
- Validate user input (e.g., difficulty settings)
- Handle edge cases in game logic (boundary conditions)

### Game Development
- Use `requestAnimationFrame` or `setInterval` for game loops
- Target 60 FPS with `1000/60` interval
- Implement collision detection for game objects
- Use `localStorage` for saving high scores
- Separate game state (variables) from rendering (drawing functions)
- Provide visual feedback for game events (game over, new high score)

### Internationalization
- Support Traditional Chinese (zh-TW) and Cantonese (zh-HK)
- Use Chinese text for UI elements (buttons, instructions, feedback)
- Maintain consistent character encoding: `<meta charset="UTF-8">`

### Code Organization
- Group related variables together (game settings, DOM references)
- Separate init, update, and draw functions in games
- Use configuration objects for game settings (difficulty, obstacles)
- Add whitespace between logical code sections
- Keep functions focused and under 50 lines when possible

### Performance
- Remove off-screen objects from arrays (use `splice` or `filter`)
- Reuse objects when possible to reduce garbage collection
- Use `const` for DOM element references to avoid repeated queries
- Cache computed values that don't change frequently

### Accessibility
- Use semantic HTML elements
- Add descriptive text for interactive elements
- Ensure sufficient color contrast
- Support keyboard controls where appropriate
