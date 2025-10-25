/**
 * InteractionSystem - Handles user interactions and mouse events
 * Manages click events, hover effects, and context menus
 */
class InteractionSystem {
    constructor(character, chatSystem, reactionSystem, movementSystem) {
        this.character = character;
        this.chatSystem = chatSystem;
        this.reactionSystem = reactionSystem;
        this.movementSystem = movementSystem;
        
        this.init();
    }
    
    init() {
        this.setupInteractions();
        this.setupKeyboardShortcuts();
    }
    
    setupInteractions() {
        const mimoElement = this.character.getElement();
        const chatElement = this.chatSystem.getChatElement();
        
        // Enable mouse events for Mimo character area
        mimoElement.addEventListener('mouseenter', () => {
            if (typeof ipcRenderer !== 'undefined') {
                ipcRenderer.send('set-ignore-mouse-events', false);
            }
            this.reactionSystem.addReaction('happy');
        });
        
        mimoElement.addEventListener('mouseleave', () => {
            if (typeof ipcRenderer !== 'undefined') {
                ipcRenderer.send('set-ignore-mouse-events', true, { forward: true });
            }
            this.reactionSystem.removeReactions();
        });
        
        mimoElement.addEventListener('click', () => {
            this.chatSystem.showRandomChat();
            this.reactionSystem.addReaction('excited');
            
            // Track interaction
            if (typeof ipcRenderer !== 'undefined') {
                ipcRenderer.send('mimo-interaction');
            }
        });
        
        // Context menu for right-click
        mimoElement.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showContextMenu();
        });
        
        // Make sure the rest of the window is click-through
        document.addEventListener('mousemove', (e) => {
            const mimoRect = mimoElement.getBoundingClientRect();
            const chatRect = chatElement.getBoundingClientRect();
            
            const isOverMimo = (
                e.clientX >= mimoRect.left &&
                e.clientX <= mimoRect.right &&
                e.clientY >= mimoRect.top &&
                e.clientY <= mimoRect.bottom
            );
            
            const isOverChat = !chatElement.classList.contains('hidden') && (
                e.clientX >= chatRect.left &&
                e.clientX <= chatRect.right &&
                e.clientY >= chatRect.top &&
                e.clientY <= chatRect.bottom
            );
            
            if (!isOverMimo && !isOverChat) {
                if (typeof ipcRenderer !== 'undefined') {
                    ipcRenderer.send('set-ignore-mouse-events', true, { forward: true });
                }
            }
        });
    }
    
    setupKeyboardShortcuts() {
        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'm') {
                this.chatSystem.showRandomChat();
            }
            
            if (e.ctrlKey && e.shiftKey && e.key === 'M') {
                this.chatSystem.provideCommentary();
            }
        });
    }
    
    showContextMenu() {
        // Simple context menu functionality
        this.chatSystem.showChat("Right-click menu! 🎯");
    }
}

module.exports = InteractionSystem;