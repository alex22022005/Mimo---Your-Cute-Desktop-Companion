const { app, BrowserWindow, Tray, Menu, ipcMain, screen, nativeImage } = require('electron');
const path = require('path');
const AutoLaunch = require('auto-launch');
const Store = require('electron-store');

class MimoDesktopApp {
    constructor() {
        this.mainWindow = null;
        this.controlPanel = null;
        this.tray = null;
        this.store = new Store();
        this.isQuitting = false;
        this.mimoRunning = false;
        this.stats = {
            interactions: 0,
            messages: 0,
            startTime: null
        };
        
        // Auto-launch setup
        this.autoLauncher = new AutoLaunch({
            name: 'Cute Mimo',
            path: process.execPath,
        });
        
        this.init();
    }
    
    init() {
        // Disable GPU acceleration to prevent crashes
        app.disableHardwareAcceleration();
        
        // Add command line switches for better compatibility
        app.commandLine.appendSwitch('disable-gpu');
        app.commandLine.appendSwitch('disable-gpu-compositing');
        
        // Enable auto-launch on first run (but don't block startup)
        setTimeout(() => {
            if (!this.store.get('autoLaunchEnabled', false)) {
                this.enableAutoLaunch();
            }
        }, 1000);
        
        app.whenReady().then(() => {
            this.createControlPanel();
            this.createTray();
            this.setupIPC();
            
            // Check if should auto-start Mimo
            if (this.store.get('settings.autostart', false)) {
                setTimeout(() => this.startMimo(), 2000);
            }
        });
        
        app.on('window-all-closed', (e) => {
            e.preventDefault(); // Prevent app from quitting
        });
        
        app.on('before-quit', () => {
            this.isQuitting = true;
        });
        
        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                this.createWindow();
            }
        });
    }
    
    createControlPanel() {
        this.controlPanel = new BrowserWindow({
            width: 520,
            height: 700,
            resizable: false,
            frame: true,
            show: true,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                webSecurity: false
            },
            icon: path.join(__dirname, 'assets', 'icon.png')
        });
        
        this.controlPanel.loadFile('control-panel.html');
        
        this.controlPanel.on('close', (e) => {
            if (!this.isQuitting) {
                e.preventDefault();
                this.controlPanel.hide();
            }
        });
    }
    
    createMimoWindow() {
        if (this.mainWindow) return;
        
        const { width, height } = screen.getPrimaryDisplay().workAreaSize;
        
        this.mainWindow = new BrowserWindow({
            width: width,
            height: height,
            x: 0,
            y: 0,
            transparent: true,
            frame: false,
            alwaysOnTop: true,
            skipTaskbar: true,
            resizable: false,
            movable: false,
            minimizable: false,
            maximizable: false,
            closable: false,
            focusable: false,
            show: false,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                webSecurity: false
            }
        });
        
        // Make window click-through except for Mimo character
        this.mainWindow.setIgnoreMouseEvents(true, { forward: true });
        
        this.mainWindow.loadFile('src/index.html');
        
        this.mainWindow.once('ready-to-show', () => {
            this.mainWindow.show();
            this.mainWindow.setAlwaysOnTop(true, 'screen-saver');
        });
        
        this.mainWindow.on('close', (e) => {
            if (!this.isQuitting) {
                e.preventDefault();
                this.stopMimo();
            }
        });
        
        // Handle window focus to maintain always on top
        this.mainWindow.on('blur', () => {
            if (this.mainWindow && !this.mainWindow.isDestroyed()) {
                this.mainWindow.setAlwaysOnTop(true, 'screen-saver');
            }
        });
    }
    
    startMimo() {
        if (this.mimoRunning) return;
        
        this.createMimoWindow();
        this.mimoRunning = true;
        this.stats.startTime = Date.now();
        
        // Notify control panel
        if (this.controlPanel) {
            this.controlPanel.webContents.send('mimo-status-changed', { running: true });
        }
    }
    
    stopMimo() {
        if (!this.mimoRunning) return;
        
        if (this.mainWindow) {
            this.mainWindow.destroy();
            this.mainWindow = null;
        }
        
        this.mimoRunning = false;
        this.stats.startTime = null;
        
        // Notify control panel
        if (this.controlPanel) {
            this.controlPanel.webContents.send('mimo-status-changed', { running: false });
        }
    }
    
    restartMimo() {
        this.stopMimo();
        setTimeout(() => this.startMimo(), 1000);
    }
    
    createTray() {
        // Create a simple tray icon using nativeImage
        this.tray = new Tray(this.createTrayIcon());
        
        const contextMenu = Menu.buildFromTemplate([
            {
                label: 'Control Panel',
                click: () => {
                    if (this.controlPanel) {
                        this.controlPanel.show();
                    }
                }
            },
            { type: 'separator' },
            {
                label: this.mimoRunning ? 'Stop Mimo' : 'Start Mimo',
                click: () => {
                    if (this.mimoRunning) {
                        this.stopMimo();
                    } else {
                        this.startMimo();
                    }
                }
            },
            {
                label: 'Restart Mimo',
                enabled: this.mimoRunning,
                click: () => {
                    this.restartMimo();
                }
            },
            { type: 'separator' },
            {
                label: 'Auto-start',
                type: 'checkbox',
                checked: this.store.get('settings.autostart', false),
                click: (item) => {
                    this.store.set('settings.autostart', item.checked);
                    if (item.checked) {
                        this.enableAutoLaunch();
                    } else {
                        this.disableAutoLaunch();
                    }
                }
            },
            { type: 'separator' },
            {
                label: 'Quit Application',
                click: () => {
                    this.isQuitting = true;
                    app.quit();
                }
            }
        ]);
        
        this.tray.setContextMenu(contextMenu);
        this.tray.setToolTip('Cute Mimo - Virtual Desktop Companion');
        
        this.tray.on('double-click', () => {
            if (this.mainWindow) {
                if (this.mainWindow.isVisible()) {
                    this.mainWindow.hide();
                } else {
                    this.mainWindow.show();
                }
            }
        });
    }
    
    createTrayIcon() {
        // Create a simple tray icon
        return nativeImage.createEmpty();
    }
    
    setupIPC() {
        // Mimo window events
        ipcMain.on('set-ignore-mouse-events', (event, ignore, options) => {
            if (this.mainWindow) {
                this.mainWindow.setIgnoreMouseEvents(ignore, options);
            }
        });
        
        // Control panel events
        ipcMain.on('start-mimo', () => {
            this.startMimo();
        });
        
        ipcMain.on('stop-mimo', () => {
            this.stopMimo();
        });
        
        ipcMain.on('restart-mimo', () => {
            this.restartMimo();
        });
        
        ipcMain.on('minimize-control-panel', () => {
            if (this.controlPanel) {
                this.controlPanel.hide();
            }
        });
        
        // Settings management
        ipcMain.on('update-mimo-settings', (event, settings) => {
            const currentSettings = this.store.get('settings', {});
            this.store.set('settings', { ...currentSettings, ...settings });
            
            // Apply settings to running Mimo
            if (this.mainWindow) {
                this.mainWindow.webContents.send('settings-updated', settings);
            }
        });
        
        ipcMain.on('get-mimo-settings', (event) => {
            const settings = this.store.get('settings', {
                autostart: false,
                sound: true,
                randomChats: true,
                movementSpeed: 5,
                chatFrequency: 5,
                activityLevel: 5
            });
            event.reply('settings-loaded', settings);
        });
        
        ipcMain.on('toggle-autostart', (event, enabled) => {
            this.store.set('settings.autostart', enabled);
            if (enabled) {
                this.enableAutoLaunch();
            } else {
                this.disableAutoLaunch();
            }
        });
        
        // Stats tracking
        ipcMain.on('mimo-interaction', () => {
            this.stats.interactions++;
            if (this.controlPanel) {
                this.controlPanel.webContents.send('mimo-stats-update', this.stats);
            }
        });
        
        ipcMain.on('mimo-message', () => {
            this.stats.messages++;
            if (this.controlPanel) {
                this.controlPanel.webContents.send('mimo-stats-update', this.stats);
            }
        });
        
        // Legacy settings support
        ipcMain.on('update-settings', (event, settings) => {
            this.store.set('settings', settings);
        });
        
        ipcMain.on('get-settings', (event) => {
            event.reply('settings-data', this.store.get('settings', {}));
        });
    }
    
    async enableAutoLaunch() {
        try {
            await this.autoLauncher.enable();
            this.store.set('autoLaunchEnabled', true);
        } catch (err) {
            console.error('Failed to enable auto-launch:', err);
        }
    }
    
    async disableAutoLaunch() {
        try {
            await this.autoLauncher.disable();
            this.store.set('autoLaunchEnabled', false);
        } catch (err) {
            console.error('Failed to disable auto-launch:', err);
        }
    }
    
    openSettings() {
        // Create settings window if needed
        console.log('Settings window - to be implemented');
    }
}

// Initialize the app
new MimoDesktopApp();