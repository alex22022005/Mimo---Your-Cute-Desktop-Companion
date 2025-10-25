# Cute Mimo - Your Cute Desktop Companion 🌟

An adorable virtual companion that runs as a desktop application! Mimo appears as a hologram overlay on top of all your applications, wandering around your screen and providing friendly companionship while you work.

## Features ✨

* **Always On Top**: Runs as an overlay above all other applications.
* **Wandering Behavior**: Mimo moves around your screen autonomously.
* **Interactive Chats**: Click on Mimo for sweet, encouraging conversations.
* **Cute Reactions**: Mimo shows emotions and reactions.
* **Click-Through Window**: Only Mimo is interactive; you can click through the rest of the app window to your applications below.
* **System Tray Control**: Manage Mimo easily from the system tray.
* **Auto-Start**: Can be set to automatically start when your computer boots up.
* **Keyboard Shortcuts**: Use hotkeys to interact with Mimo.

## Installation & Setup 🚀

### Prerequisites
* Windows 10/11
* Node.js (Download from https://nodejs.org/)

### Quick Install (Recommended)
1.  Run `install.bat` as administrator.
2.  Wait for the installation to complete.
3.  Run `start.bat` to launch Mimo.

### Manual Installation
```bash
# Install dependencies
npm install

# Run the application
npm start
```
### Building Executable
```bash
npm run dist
```

## Customization 🎨

### Adding New Phrases
Edit the `phrases` array in `script.js` to add your own custom messages:

```javascript
this.phrases = [
    "Your custom message here! 💖",
    "Another sweet phrase! ✨"
];
```

### Changing Appearance
Modify `styles.css` to customize Mimo's look:
- Colors: Update the gradient in `.mimo-body`
- Size: Adjust width/height in `#mimo-character`
- Animations: Modify keyframes for different effects

### Behavior Settings
In `script.js`, you can adjust:
- Wandering frequency (currently 5-13 seconds)
- Chat frequency (currently 15-45 seconds)
- Reaction probability and timing

## Browser Compatibility 🌐

Works best in modern browsers with CSS3 and ES6 support:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Tips for Desktop Integration 💡

For a true desktop companion experience:
1. Use browser fullscreen mode (F11)
2. Consider using Electron to create a desktop app
3. Set browser to always on top for overlay effect

Enjoy your new virtual friend! 🎉
## System Tray Controls 🎛️

Right-click the Mimo icon in your system tray to access:
- **Show/Hide Mimo**: Toggle visibility
- **Auto-start**: Enable/disable startup with Windows
- **Settings**: Customize behavior (coming soon)
- **Quit Mimo**: Completely close the application

## Keyboard Shortcuts ⌨️

- `Ctrl + M`: Trigger random chat
- `Ctrl + Shift + M`: Get time-based commentary

## How It Works 🔧

Mimo runs as an Electron desktop application with these key features:

- **Transparent Overlay**: Creates a transparent window that covers your entire screen
- **Always On Top**: Uses Windows API to stay above all other applications
- **Click-Through Technology**: Only Mimo character responds to mouse events
- **Auto-Launch Integration**: Registers with Windows startup programs
- **System Tray Integration**: Provides easy access and control

## Customization 🎨

### Adding New Phrases
Edit the `phrases` array in `renderer.js`:

```javascript
this.phrases = [
    "Your custom message here! 💖",
    "Another sweet phrase! ✨"
];
```

### Changing Appearance
Modify `styles.css` to customize Mimo's look:
- Colors: Update the gradient in `.mimo-body`
- Size: Adjust width/height in `#mimo-character`
- Animations: Modify keyframes for different effects

### Behavior Settings
In `renderer.js`, you can adjust:
- Wandering frequency (currently 5-15 seconds)
- Chat frequency (currently 20-50 seconds)
- Reaction probability and timing

## Technical Details 🛠️

- **Framework**: Electron with Node.js
- **Always On Top**: Uses `screen-saver` level priority
- **Auto-Launch**: Integrated with Windows startup registry
- **Click-Through**: Dynamic mouse event handling
- **Transparency**: Full window transparency with selective interaction

## Troubleshooting 🔧

### Mimo Not Appearing
- Check system tray for Mimo icon
- Right-click tray icon and select "Show Mimo"
- Restart the application

### Auto-Start Not Working
- Run application as administrator once
- Check tray menu "Auto-start" option is enabled
- Verify in Windows Task Manager > Startup tab

### Performance Issues
- Close unnecessary applications
- Check Windows graphics drivers are updated
- Reduce animation frequency in settings

## Security & Privacy 🔒

- No internet connection required
- No data collection or tracking
- Runs entirely locally on your machine
- Open source - inspect the code yourself
