# Mimo Modular Architecture

This directory contains the modular version of the Mimo virtual desktop companion application. Each component is separated into its own file for easier maintenance and future updates.

## Directory Structure

```
src/
├── components/           # Individual component modules
│   ├── MimoCharacter.js     # Character visual representation
│   ├── MovementSystem.js    # Movement and walking logic
│   ├── ChatSystem.js        # Chat bubbles and messaging
│   ├── SoundSystem.js       # Audio and text-to-speech
│   ├── ReactionSystem.js    # Reactions and animations
│   ├── InteractionSystem.js # User interaction handling
│   └── SettingsManager.js   # Settings management
├── styles/              # Modular CSS files
│   ├── base.css            # Core application styles
│   ├── character.css       # Character appearance
│   ├── movement.css        # Movement animations
│   ├── reactions.css       # Reaction animations
│   ├── chat.css           # Chat bubble styles
│   ├── enhancements.css   # Visual enhancements
│   └── main.css           # Main CSS file (imports all)
├── MimoApp.js          # Main application orchestrator
├── renderer.js         # Entry point for Electron renderer
├── index.html          # Main HTML file
└── README.md           # This documentation
```

## Component Overview

### MimoCharacter.js
- Handles the visual representation of Mimo
- Manages basic character animations
- Provides methods for reactions and direction changes

### MovementSystem.js
- Controls all movement logic (wandering, walking, hopping)
- Manages position tracking
- Handles movement animations and timing

### ChatSystem.js
- Manages chat bubble display and messaging
- Handles random chat scheduling
- Provides time-based commentary

### SoundSystem.js
- Handles all audio functionality
- Text-to-speech with robot voice effects
- Sound effects for movements and reactions

### ReactionSystem.js
- Manages character reactions and emotions
- Handles funny animations (dance, spin, glitch, etc.)
- Schedules random reactions

### InteractionSystem.js
- Handles user interactions (clicks, hover, keyboard)
- Manages mouse event forwarding for click-through
- Provides keyboard shortcuts

### SettingsManager.js
- Manages application settings and configuration
- Handles settings persistence via Electron
- Updates all components when settings change

### MimoApp.js
- Main orchestrator that ties all components together
- Manages component lifecycle and initialization
- Provides public API for external control

## Usage

### Basic Usage
```javascript
// The application automatically initializes when the DOM loads
// Access the app instance via:
window.mimoApp

// Or for backward compatibility:
window.mimo
```

### Component Access
```javascript
// Access individual components for debugging or extension
const character = window.mimoApp.getCharacter();
const movement = window.mimoApp.getMovementSystem();
const chat = window.mimoApp.getChatSystem();
const sound = window.mimoApp.getSoundSystem();
const reactions = window.mimoApp.getReactionSystem();
const interactions = window.mimoApp.getInteractionSystem();
const settings = window.mimoApp.getSettingsManager();
```

### Public API Methods
```javascript
// Show a random chat message
window.mimoApp.showRandomChat();

// Provide time-based commentary
window.mimoApp.provideCommentary();

// Trigger a funny reaction
window.mimoApp.doFunnyReaction();

// Move Mimo to a specific position
window.mimoApp.walkTo(500);

// Update settings
window.mimoApp.updateSettings({
    sound: false,
    movementSpeed: 8
});

// Get current settings
const settings = window.mimoApp.getSettings();
```

## Extending the Application

### Adding New Components
1. Create a new file in `src/components/`
2. Follow the existing component pattern
3. Register with SettingsManager if needed
4. Import and initialize in MimoApp.js

### Adding New Styles
1. Create a new CSS file in `src/styles/`
2. Add import to `src/styles/main.css`
3. Follow BEM naming convention for classes

### Adding New Features
1. Identify which component should handle the feature
2. Add methods to the appropriate component
3. Update MimoApp.js if public API access is needed
4. Add corresponding styles if visual changes are needed

## Benefits of Modular Architecture

1. **Maintainability**: Each component has a single responsibility
2. **Testability**: Components can be tested in isolation
3. **Extensibility**: Easy to add new features without affecting existing code
4. **Reusability**: Components can be reused in different contexts
5. **Debugging**: Easier to locate and fix issues
6. **Collaboration**: Multiple developers can work on different components

## Migration from Legacy Code

The modular version maintains backward compatibility with the original API. The main differences:

- Components are now separate files instead of methods in a single class
- Settings management is centralized
- CSS is split into logical modules
- Better separation of concerns

All existing functionality remains the same, but the code is now much more organized and maintainable.