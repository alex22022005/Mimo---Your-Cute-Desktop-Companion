/**
 * Modular Renderer - Entry point for the modular Mimo application
 */

const { ipcRenderer } = require('electron');
const MimoApp = require('./MimoApp');

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const mimoApp = new MimoApp();
    
    // Expose for debugging and external access
    window.mimoApp = mimoApp;
    window.mimo = mimoApp; // Backward compatibility
});

// Add keyboard shortcuts at document level
document.addEventListener('keydown', (e) => {
    if (window.mimoApp) {
        if (e.ctrlKey && e.key === 'm') {
            window.mimoApp.showRandomChat();
        }
        
        if (e.ctrlKey && e.shiftKey && e.key === 'M') {
            window.mimoApp.provideCommentary();
        }
    }
});