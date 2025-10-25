/**
 * SettingsManager - Handles application settings and configuration
 * Manages settings persistence and updates across components
 */
class SettingsManager {
    constructor() {
        this.settings = {
            sound: true,
            randomChats: true,
            movementSpeed: 5,
            chatFrequency: 5,
            activityLevel: 5
        };
        
        this.components = [];
        
        this.init();
    }
    
    init() {
        this.setupElectronIntegration();
    }
    
    setupElectronIntegration() {
        if (typeof ipcRenderer === 'undefined') return;
        
        // Load settings
        ipcRenderer.send('get-mimo-settings');
        ipcRenderer.on('settings-loaded', (event, settings) => {
            this.applySettings(settings);
        });
        
        // Listen for settings updates
        ipcRenderer.on('settings-updated', (event, settings) => {
            this.applySettings(settings);
        });
    }
    
    applySettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        
        // Update all registered components
        this.components.forEach(component => {
            if (component.updateSettings) {
                component.updateSettings(this.settings);
            }
        });
    }
    
    registerComponent(component) {
        this.components.push(component);
        
        // Apply current settings to new component
        if (component.updateSettings) {
            component.updateSettings(this.settings);
        }
    }
    
    updateSetting(key, value) {
        this.settings[key] = value;
        this.applySettings(this.settings);
        
        // Save to electron if available
        if (typeof ipcRenderer !== 'undefined') {
            ipcRenderer.send('save-mimo-settings', this.settings);
        }
    }
    
    getSettings() {
        return { ...this.settings };
    }
    
    getSetting(key) {
        return this.settings[key];
    }
}

module.exports = SettingsManager;