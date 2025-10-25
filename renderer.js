const { ipcRenderer } = require('electron');

class CuteMimo {
    constructor() {
        this.mimo = document.getElementById('mimo-character');
        this.chatBubble = document.getElementById('chat-bubble');
        this.chatText = document.getElementById('chat-text');
        this.container = document.getElementById('mimo-container');
        
        this.isWandering = false;
        this.currentX = window.innerWidth / 2;
        this.currentY = window.innerHeight / 2;
        
        // Settings with defaults
        this.settings = {
            sound: true,
            randomChats: true,
            movementSpeed: 5,
            chatFrequency: 5,
            activityLevel: 5
        };
        
        this.phrases = [
            "Beep boop! Hello human!",
            "System status: Friendship mode activated!",
            "Scanning... You look awesome today!",
            "Robot fact: You're doing great!",
            "Processing happiness... Complete!",
            "Initiating fun protocol!",
            "Confidence boost loading... 100%!",
            "Error 404: Sadness not found!",
            "You're in my favorite human database!",
            "Beep! Want to chat with this robot?",
            "Motivational subroutine activated!",
            "Detecting hard work... Impressive!",
            "Reminder: Stretch.exe recommended!",
            "Focus levels: Maximum detected!",
            "Time calculation: Fun time = Now!",
            "Visual analysis: Looking fantastic!",
            "Battery at 100% thanks to your smile!",
            "Running friendship.exe successfully!",
            "Beep boop beep! Translation: You rock!"
        ];
        
        this.funnyReactions = [
            "robot-dance",
            "head-spin",
            "antenna-wiggle",
            "system-glitch",
            "happy-beeps"
        ];
        
        this.reactions = ['happy', 'excited'];
        
        this.init();
    }
    
    init() {
        this.startWandering();
        this.setupInteractions();
        this.scheduleRandomChats();
        this.scheduleRandomReactions();
        this.setupElectronIntegration();
        this.initializeSpeech();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.currentX = Math.min(this.currentX, window.innerWidth - 100);
            this.currentY = Math.min(this.currentY, window.innerHeight - 120);
        });
    }
    
    initializeSpeech() {
        // Initialize speech synthesis
        if ('speechSynthesis' in window) {
            // Load voices
            speechSynthesis.getVoices();
            
            // Some browsers need this event to load voices
            speechSynthesis.addEventListener('voiceschanged', () => {
                console.log('Speech voices loaded');
            });
        }
    }
    
    setupElectronIntegration() {
        // Set initial mouse event handling
        ipcRenderer.send('set-ignore-mouse-events', true, { forward: true });
        
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
    
    applySettings(settings) {
        this.settings = { ...this.settings, ...settings };
        
        // Apply movement speed
        if (settings.movementSpeed) {
            this.movementSpeed = settings.movementSpeed;
        }
        
        // Apply chat frequency
        if (settings.chatFrequency) {
            this.chatFrequency = settings.chatFrequency;
        }
        
        // Apply activity level
        if (settings.activityLevel) {
            this.activityLevel = settings.activityLevel;
        }
    }
    
    startWandering() {
        this.isWandering = true;
        this.wander();
    }
    
    wander() {
        if (!this.isWandering) return;
        
        const margin = 100;
        const newX = Math.random() * (window.innerWidth - margin * 2) + margin;
        
        // Keep Mimo on the ground (walking, not flying)
        this.walkTo(newX);
        
        // Schedule next wander (3-8 seconds for more active movement)
        const delay = Math.random() * 5000 + 3000;
        setTimeout(() => this.wander(), delay);
    }
    
    walkTo(x) {
        this.currentX = x;
        
        // Calculate hopping duration based on distance and speed setting
        const distance = Math.abs(x - parseInt(this.container.style.left || window.innerWidth / 2));
        const speedMultiplier = this.settings.movementSpeed || 5;
        const hopDuration = Math.max(800, distance * (11 - speedMultiplier)); // Faster with higher speed setting
        
        // Add hopping animation class
        this.mimo.classList.add('hopping');
        
        // Determine direction and flip character if needed
        const currentLeft = parseInt(this.container.style.left || window.innerWidth / 2);
        if (x < currentLeft) {
            this.mimo.style.transform = 'scaleX(-1)'; // Face left
        } else {
            this.mimo.style.transform = 'scaleX(1)'; // Face right
        }
        
        // Robot hopping sound
        if (this.settings.sound !== false) {
            this.playHopSound();
        }
        
        this.container.style.transition = `left ${hopDuration}ms ease-in-out`;
        this.container.style.left = x + 'px';
        
        // Remove hopping animation when done
        setTimeout(() => {
            this.mimo.classList.remove('hopping');
            this.mimo.style.transform = 'scaleX(1)'; // Reset to face right
        }, hopDuration);
    }
    
    playHopSound() {
        // Create robot hopping sound effect
        this.createBeepSequence([400, 600], [0.1, 0.1]);
    }
    
    moveTo(x, y) {
        // Legacy method for compatibility
        this.walkTo(x);
    }
    
    setupInteractions() {
        // Enable mouse events for Mimo character area
        this.mimo.addEventListener('mouseenter', () => {
            ipcRenderer.send('set-ignore-mouse-events', false);
            this.addReaction('happy');
        });
        
        this.mimo.addEventListener('mouseleave', () => {
            ipcRenderer.send('set-ignore-mouse-events', true, { forward: true });
            this.removeReactions();
        });
        
        this.mimo.addEventListener('click', () => {
            this.showRandomChat();
            this.addReaction('excited');
            
            // Track interaction
            ipcRenderer.send('mimo-interaction');
        });
        
        // Context menu for right-click
        this.mimo.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showContextMenu();
        });
        
        // Make sure the rest of the window is click-through
        document.addEventListener('mousemove', (e) => {
            const mimoRect = this.mimo.getBoundingClientRect();
            const chatRect = this.chatBubble.getBoundingClientRect();
            
            const isOverMimo = (
                e.clientX >= mimoRect.left &&
                e.clientX <= mimoRect.right &&
                e.clientY >= mimoRect.top &&
                e.clientY <= mimoRect.bottom
            );
            
            const isOverChat = !this.chatBubble.classList.contains('hidden') && (
                e.clientX >= chatRect.left &&
                e.clientX <= chatRect.right &&
                e.clientY >= chatRect.top &&
                e.clientY <= chatRect.bottom
            );
            
            if (!isOverMimo && !isOverChat) {
                ipcRenderer.send('set-ignore-mouse-events', true, { forward: true });
            }
        });
    }
    
    showContextMenu() {
        // Simple context menu functionality
        this.showChat("Right-click menu! 🎯");
    }
    
    showRandomChat() {
        const randomPhrase = this.phrases[Math.floor(Math.random() * this.phrases.length)];
        this.showChat(randomPhrase);
    }
    
    showChat(message) {
        this.chatText.textContent = message;
        this.chatBubble.classList.remove('hidden');
        
        // Enable mouse events for chat bubble
        ipcRenderer.send('set-ignore-mouse-events', false);
        
        // Add text-to-speech if enabled
        if (this.settings.sound !== false) {
            this.speak(message);
        }
        
        // Track message
        ipcRenderer.send('mimo-message');
        
        setTimeout(() => {
            this.chatBubble.classList.add('hidden');
            // Re-enable click-through after chat disappears
            setTimeout(() => {
                ipcRenderer.send('set-ignore-mouse-events', true, { forward: true });
            }, 100);
        }, 4000);
    }
    
    speak(text) {
        if ('speechSynthesis' in window) {
            // Cancel any ongoing speech
            speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            
            // Configure robot-like voice
            utterance.rate = 0.9; // Slightly slower
            utterance.pitch = 1.2; // Higher pitch for robot effect
            utterance.volume = 0.7; // Not too loud
            
            // Try to find a robotic-sounding voice
            const voices = speechSynthesis.getVoices();
            const robotVoice = voices.find(voice => 
                voice.name.includes('Microsoft') || 
                voice.name.includes('Google') ||
                voice.lang.includes('en')
            );
            
            if (robotVoice) {
                utterance.voice = robotVoice;
            }
            
            // Add some robot sound effects before speaking
            this.playRobotSound();
            
            setTimeout(() => {
                speechSynthesis.speak(utterance);
            }, 200);
        }
    }
    
    playRobotSound() {
        // Create simple beep sound using Web Audio API
        if ('AudioContext' in window || 'webkitAudioContext' in window) {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        }
    }
    
    addReaction(reaction) {
        this.mimo.classList.add(reaction);
        
        // Add sound effect for reactions
        if (reaction === 'excited') {
            this.playExcitedBeeps();
        } else if (reaction === 'happy') {
            this.playHappyBeep();
        }
        
        setTimeout(() => {
            this.mimo.classList.remove(reaction);
        }, 1000);
    }
    
    doFunnyReaction() {
        const reaction = this.funnyReactions[Math.floor(Math.random() * this.funnyReactions.length)];
        
        switch(reaction) {
            case 'robot-dance':
                this.robotDance();
                break;
            case 'head-spin':
                this.headSpin();
                break;
            case 'antenna-wiggle':
                this.antennaWiggle();
                break;
            case 'system-glitch':
                this.systemGlitch();
                break;
            case 'happy-beeps':
                this.happyBeeps();
                break;
        }
    }
    
    robotDance() {
        this.mimo.classList.add('robot-dance');
        this.playDanceMusic();
        this.showChat("🎵 Beep boop dance mode! 🕺");
        
        setTimeout(() => {
            this.mimo.classList.remove('robot-dance');
        }, 3000);
    }
    
    headSpin() {
        this.mimo.classList.add('head-spin');
        this.playSpinSound();
        this.showChat("🌀 System calibration in progress... 🤖");
        
        setTimeout(() => {
            this.mimo.classList.remove('head-spin');
        }, 2000);
    }
    
    antennaWiggle() {
        this.mimo.classList.add('antenna-wiggle');
        this.playWiggleSound();
        this.showChat("📡 Receiving good vibes! ✨");
        
        setTimeout(() => {
            this.mimo.classList.remove('antenna-wiggle');
        }, 2000);
    }
    
    systemGlitch() {
        this.mimo.classList.add('system-glitch');
        this.playGlitchSound();
        this.showChat("⚡ ERROR... Just kidding! 😄");
        
        setTimeout(() => {
            this.mimo.classList.remove('system-glitch');
        }, 1500);
    }
    
    happyBeeps() {
        this.playHappyBeepSequence();
        this.showChat("🎶 Beep beep boop! Happy robot sounds! 🎵");
        this.addReaction('excited');
    }
    
    playExcitedBeeps() {
        this.createBeepSequence([800, 1000, 1200], [0.1, 0.1, 0.15]);
    }
    
    playHappyBeep() {
        this.createBeepSequence([600, 800], [0.1, 0.1]);
    }
    
    playDanceMusic() {
        this.createBeepSequence([400, 500, 600, 500, 400, 500, 600, 800], [0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.3]);
    }
    
    playSpinSound() {
        // Ascending frequency for spin effect
        const frequencies = [];
        for (let i = 0; i < 10; i++) {
            frequencies.push(400 + (i * 50));
        }
        this.createBeepSequence(frequencies, new Array(10).fill(0.1));
    }
    
    playWiggleSound() {
        this.createBeepSequence([700, 600, 700, 600, 700], [0.1, 0.1, 0.1, 0.1, 0.1]);
    }
    
    playGlitchSound() {
        // Random frequencies for glitch effect
        const frequencies = [200, 1500, 300, 1200, 400, 1000];
        this.createBeepSequence(frequencies, [0.05, 0.05, 0.05, 0.05, 0.05, 0.1]);
    }
    
    playHappyBeepSequence() {
        this.createBeepSequence([600, 700, 800, 900, 1000], [0.15, 0.15, 0.15, 0.15, 0.2]);
    }
    
    createBeepSequence(frequencies, durations) {
        if ('AudioContext' in window || 'webkitAudioContext' in window) {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            let currentTime = audioContext.currentTime;
            
            frequencies.forEach((freq, index) => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(freq, currentTime);
                gainNode.gain.setValueAtTime(0.1, currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + durations[index]);
                
                oscillator.start(currentTime);
                oscillator.stop(currentTime + durations[index]);
                
                currentTime += durations[index] + 0.05; // Small gap between beeps
            });
        }
    }
    
    removeReactions() {
        this.reactions.forEach(reaction => {
            this.mimo.classList.remove(reaction);
        });
    }
    
    scheduleRandomChats() {
        // Adjust frequency based on settings
        const baseDelay = 30000; // 30 seconds base
        const frequencyMultiplier = (11 - (this.settings.chatFrequency || 5)) / 10; // Higher setting = more frequent
        const randomDelay = Math.random() * baseDelay * frequencyMultiplier + (baseDelay * frequencyMultiplier);
        
        setTimeout(() => {
            if (this.settings.randomChats !== false && Math.random() < 0.6) {
                this.showRandomChat();
            }
            this.scheduleRandomChats();
        }, randomDelay);
    }
    
    scheduleRandomReactions() {
        const randomDelay = Math.random() * 25000 + 15000; // 15-40 seconds
        
        setTimeout(() => {
            const chance = Math.random();
            if (chance < 0.3) { // 30% chance for normal reaction
                const randomReaction = this.reactions[Math.floor(Math.random() * this.reactions.length)];
                this.addReaction(randomReaction);
            } else if (chance < 0.5) { // 20% chance for funny reaction
                this.doFunnyReaction();
            }
            this.scheduleRandomReactions();
        }, randomDelay);
    }
    
    // Commentary system based on time of day
    provideCommentary() {
        const hour = new Date().getHours();
        let timeBasedCommentaries = [];
        
        if (hour < 12) {
            timeBasedCommentaries = [
                "Good morning!",
                "Ready for a productive day?",
                "Morning energy activated!"
            ];
        } else if (hour < 17) {
            timeBasedCommentaries = [
                "Afternoon focus time!",
                "You're doing great today!",
                "Keep up the good work!"
            ];
        } else {
            timeBasedCommentaries = [
                "Evening productivity mode!",
                "Almost done for today?",
                "Night owl mode activated!"
            ];
        }
        
        const randomCommentary = timeBasedCommentaries[Math.floor(Math.random() * timeBasedCommentaries.length)];
        this.showChat(randomCommentary);
    }
}

// Initialize Mimo when page loads
document.addEventListener('DOMContentLoaded', () => {
    const mimo = new CuteMimo();
    
    // Expose mimo globally for debugging
    window.mimo = mimo;
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'm') {
        window.mimo.showRandomChat();
    }
    
    if (e.ctrlKey && e.shiftKey && e.key === 'M') {
        window.mimo.provideCommentary();
    }
});