/**
 * MimoApp - Main application class
 * Orchestrates all components and manages the overall application lifecycle
 */

// Import all components
const MimoCharacter = require('./components/MimoCharacter');
const MovementSystem = require('./components/MovementSystem');
const ChatSystem = require('./components/ChatSystem');
const SoundSystem = require('./components/SoundSystem');
const ReactionSystem = require('./components/ReactionSystem');
const InteractionSystem = require('./components/InteractionSystem');
const SettingsManager = require('./components/SettingsManager');

class MimoApp {
    constructor() {
        this.container = null;
        this.settingsManager = null;
        this.character = null;
        this.movementSystem = null;
        this.chatSystem = null;
        this.soundSystem = null;
        this.reactionSystem = null;
        this.interactionSystem = null;
        
        this.init();
    }
    
    init() {
        this.createContainer();
        this.initializeComponents();
        this.setupComponents();
        
        // Expose for debugging
        window.mimo = this;
    }
    
    createContainer() {
        this.container = document.createElement('div');
        this.container.id = 'mimo-container';
        document.body.appendChild(this.container);
    }
    
    initializeComponents() {
        // Initialize settings manager first
        this.settingsManager = new SettingsManager();
        
        // Initialize core components
        this.character = new MimoCharacter(this.container);
        this.soundSystem = new SoundSystem(this.settingsManager.getSettings());
        this.chatSystem = new ChatSystem(this.container, this.settingsManager.getSettings());
        this.movementSystem = new MovementSystem(
            this.character, 
            this.container, 
            this.settingsManager.getSettings()
        );
        
        // Initialize interaction systems
        this.reactionSystem = new ReactionSystem(
            this.character, 
            this.soundSystem, 
            this.chatSystem
        );
        
        this.interactionSystem = new InteractionSystem(
            this.character,
            this.chatSystem,
            this.reactionSystem,
            this.movementSystem
        );
    }
    
    setupComponents() {
        // Register components with settings manager
        this.settingsManager.registerComponent(this.soundSystem);
        this.settingsManager.registerComponent(this.chatSystem);
        this.settingsManager.registerComponent(this.movementSystem);
        
        // Set initial mouse event handling
        if (typeof ipcRenderer !== 'undefined') {
            ipcRenderer.send('set-ignore-mouse-events', true, { forward: true });
        }
    }
    
    // Public API methods for external control
    showRandomChat() {
        this.chatSystem.showRandomChat();
    }
    
    provideCommentary() {
        this.chatSystem.provideCommentary();
    }
    
    doFunnyReaction() {
        this.reactionSystem.doFunnyReaction();
    }
    
    walkTo(x) {
        return this.movementSystem.walkTo(x);
    }
    
    updateSettings(newSettings) {
        this.settingsManager.applySettings(newSettings);
    }
    
    getSettings() {
        return this.settingsManager.getSettings();
    }
    
    // Component getters for debugging
    getCharacter() {
        return this.character;
    }
    
    getMovementSystem() {
        return this.movementSystem;
    }
    
    getChatSystem() {
        return this.chatSystem;
    }
    
    getSoundSystem() {
        return this.soundSystem;
    }
    
    getReactionSystem() {
        return this.reactionSystem;
    }
    
    getInteractionSystem() {
        return this.interactionSystem;
    }
    
    getSettingsManager() {
        return this.settingsManager;
    }
}

module.exports = MimoApp;