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
        
        this.phrases = [
            "Hi there! 💖",
            "You're doing great! ✨",
            "Need a break? I'm here! 🌟",
            "You look wonderful today! 😊",
            "Let's have some fun! 🎉",
            "I believe in you! 💪",
            "Time for a smile! 😄",
            "You're amazing! 🌈",
            "Want to chat? 💭",
            "Keep going, friend! 🚀"
        ];
        
        this.reactions = ['happy', 'excited'];
        
        this.init();
    }
    
    init() {
        this.startWandering();
        this.setupInteractions();
        this.scheduleRandomChats();
        this.scheduleRandomReactions();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.currentX = Math.min(this.currentX, window.innerWidth - 100);
            this.currentY = Math.min(this.currentY, window.innerHeight - 120);
        });
    }
    
    startWandering() {
        this.isWandering = true;
        this.wander();
    }
    
    wander() {
        if (!this.isWandering) return;
        
        const margin = 100;
        const newX = Math.random() * (window.innerWidth - margin * 2) + margin;
        const newY = Math.random() * (window.innerHeight - margin * 2) + margin;
        
        this.moveTo(newX, newY);
        
        // Schedule next wander
        setTimeout(() => this.wander(), Math.random() * 8000 + 5000);
    }
    
    moveTo(x, y) {
        this.currentX = x;
        this.currentY = y;
        
        this.container.style.transition = 'all 3s ease-in-out';
        this.container.style.left = x + 'px';
        this.container.style.top = y + 'px';
        this.container.style.transform = 'translate(-50%, -50%)';
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
        });
        
        // Make sure the rest of the window is click-through
        document.addEventListener('mousemove', (e) => {
            const mimoRect = this.mimo.getBoundingClientRect();
            const isOverMimo = (
                e.clientX >= mimoRect.left &&
                e.clientX <= mimoRect.right &&
                e.clientY >= mimoRect.top &&
                e.clientY <= mimoRect.bottom
            );
            
            if (!isOverMimo) {
                ipcRenderer.send('set-ignore-mouse-events', true, { forward: true });
            }
        });
    }
    
    showRandomChat() {
        const randomPhrase = this.phrases[Math.floor(Math.random() * this.phrases.length)];
        this.showChat(randomPhrase);
    }
    
    showChat(message) {
        this.chatText.textContent = message;
        this.chatBubble.classList.remove('hidden');
        
        setTimeout(() => {
            this.chatBubble.classList.add('hidden');
        }, 3000);
    }
    
    addReaction(reaction) {
        this.mimo.classList.add(reaction);
        
        setTimeout(() => {
            this.mimo.classList.remove(reaction);
        }, 1000);
    }
    
    removeReactions() {
        this.reactions.forEach(reaction => {
            this.mimo.classList.remove(reaction);
        });
    }
    
    scheduleRandomChats() {
        const randomDelay = Math.random() * 30000 + 15000; // 15-45 seconds
        
        setTimeout(() => {
            if (Math.random() < 0.7) { // 70% chance
                this.showRandomChat();
            }
            this.scheduleRandomChats();
        }, randomDelay);
    }
    
    scheduleRandomReactions() {
        const randomDelay = Math.random() * 20000 + 10000; // 10-30 seconds
        
        setTimeout(() => {
            if (Math.random() < 0.5) { // 50% chance
                const randomReaction = this.reactions[Math.floor(Math.random() * this.reactions.length)];
                this.addReaction(randomReaction);
            }
            this.scheduleRandomReactions();
        }, randomDelay);
    }
    
    // Commentary system
    provideCommentary() {
        const commentaries = [
            "Looks like you're working hard! 💻",
            "Don't forget to take breaks! 🍃",
            "You've got this! 💪",
            "Beautiful work you're doing! ✨",
            "I'm proud of you! 🌟"
        ];
        
        const randomCommentary = commentaries[Math.floor(Math.random() * commentaries.length)];
        this.showChat(randomCommentary);
    }
}

// Initialize Mimo when page loads
document.addEventListener('DOMContentLoaded', () => {
    const mimo = new CuteMimo();
    
    // Expose mimo globally for debugging
    window.mimo = mimo;
});

// Add some keyboard shortcuts for interaction
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'm') {
        window.mimo.showRandomChat();
    }
});