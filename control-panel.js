const { ipcRenderer } = require('electron');

class MimoControlPanel {
    constructor() {
        this.isRunning = false;
        this.startTime = null;
        this.stats = {
            interactions: 0,
            messages: 0
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadSettings();
        this.updateUI();
        this.startStatsUpdater();
    }
    
    setupEventListeners() {
        // Control buttons
        document.getElementById('start-btn').addEventListener('click', () => this.startMimo());
        document.getElementById('stop-btn').addEventListener('click', () => this.stopMimo());
        document.getElementById('restart-btn').addEventListener('click', () => this.restartMimo());
        document.getElementById('minimize-btn').addEventListener('click', () => this.minimizePanel());
        
        // Settings toggles
        document.getElementById('autostart-toggle').addEventListener('change', (e) => {
            this.updateSetting('autostart', e.target.checked);
        });
        
        document.getElementById('sound-toggle').addEventListener('change', (e) => {
            this.updateSetting('sound', e.target.checked);
        });
        
        document.getElementById('chat-toggle').addEventListener('change', (e) => {
            this.updateSetting('randomChats', e.target.checked);
        });
        
        // Sliders
        document.getElementById('speed-slider').addEventListener('input', (e) => {
            document.getElementById('speed-value').textContent = e.target.value;
            this.updateSetting('movementSpeed', parseInt(e.target.value));
        });
        
        document.getElementById('chat-frequency').addEventListener('input', (e) => {
            document.getElementById('chat-freq-value').textContent = e.target.value;
            this.updateSetting('chatFrequency', parseInt(e.target.value));
        });
        
        document.getElementById('activity-slider').addEventListener('input', (e) => {
            document.getElementById('activity-value').textContent = e.target.value;
            this.updateSetting('activityLevel', parseInt(e.target.value));
        });
        
        // IPC listeners
        ipcRenderer.on('mimo-status-changed', (event, status) => {
            this.isRunning = status.running;
            if (status.running && !this.startTime) {
                this.startTime = Date.now();
            } else if (!status.running) {
                this.startTime = null;
            }
            this.updateUI();
        });
        
        ipcRenderer.on('mimo-stats-update', (event, stats) => {
            this.stats = { ...this.stats, ...stats };
            this.updateStats();
        });
        
        ipcRenderer.on('settings-loaded', (event, settings) => {
            this.applySettings(settings);
        });
    }
    
    startMimo() {
        ipcRenderer.send('start-mimo');
        this.isRunning = true;
        this.startTime = Date.now();
        this.updateUI();
    }
    
    stopMimo() {
        ipcRenderer.send('stop-mimo');
        this.isRunning = false;
        this.startTime = null;
        this.updateUI();
    }
    
    restartMimo() {
        ipcRenderer.send('restart-mimo');
        this.startTime = Date.now();
        this.updateUI();
    }
    
    minimizePanel() {
        ipcRenderer.send('minimize-control-panel');
    }
    
    updateSetting(key, value) {
        const settings = {};
        settings[key] = value;
        ipcRenderer.send('update-mimo-settings', settings);
        
        // Special handling for autostart
        if (key === 'autostart') {
            ipcRenderer.send('toggle-autostart', value);
        }
    }
    
    loadSettings() {
        ipcRenderer.send('get-mimo-settings');
    }
    
    applySettings(settings) {
        // Apply toggle settings
        if (settings.autostart !== undefined) {
            document.getElementById('autostart-toggle').checked = settings.autostart;
        }
        if (settings.sound !== undefined) {
            document.getElementById('sound-toggle').checked = settings.sound;
        }
        if (settings.randomChats !== undefined) {
            document.getElementById('chat-toggle').checked = settings.randomChats;
        }
        
        // Apply slider settings
        if (settings.movementSpeed !== undefined) {
            document.getElementById('speed-slider').value = settings.movementSpeed;
            document.getElementById('speed-value').textContent = settings.movementSpeed;
        }
        if (settings.chatFrequency !== undefined) {
            document.getElementById('chat-frequency').value = settings.chatFrequency;
            document.getElementById('chat-freq-value').textContent = settings.chatFrequency;
        }
        if (settings.activityLevel !== undefined) {
            document.getElementById('activity-slider').value = settings.activityLevel;
            document.getElementById('activity-value').textContent = settings.activityLevel;
        }
    }
    
    updateUI() {
        const statusDot = document.getElementById('status-dot');
        const statusText = document.getElementById('status-text');
        const startBtn = document.getElementById('start-btn');
        const stopBtn = document.getElementById('stop-btn');
        
        if (this.isRunning) {
            statusDot.classList.add('online');
            statusText.textContent = 'Online';
            startBtn.disabled = true;
            stopBtn.disabled = false;
        } else {
            statusDot.classList.remove('online');
            statusText.textContent = 'Offline';
            startBtn.disabled = false;
            stopBtn.disabled = true;
        }
    }
    
    updateStats() {
        document.getElementById('interactions').textContent = this.stats.interactions || 0;
        document.getElementById('messages').textContent = this.stats.messages || 0;
    }
    
    startStatsUpdater() {
        setInterval(() => {
            if (this.startTime) {
                const uptime = Date.now() - this.startTime;
                const hours = Math.floor(uptime / (1000 * 60 * 60));
                const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((uptime % (1000 * 60)) / 1000);
                
                document.getElementById('uptime').textContent = 
                    `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            } else {
                document.getElementById('uptime').textContent = '00:00:00';
            }
        }, 1000);
    }
}

// Initialize control panel
document.addEventListener('DOMContentLoaded', () => {
    new MimoControlPanel();
});