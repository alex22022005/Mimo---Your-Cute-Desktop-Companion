/**
 * ChatSystem - Handles chat bubbles and messaging
 * Manages random chats, user interactions, and message display
 */
class ChatSystem {
    constructor(container, settings) {
        this.container = container;
        this.settings = settings;
        this.chatBubble = null;
        this.chatText = null;
        
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
        
        this.init();
    }
    
    init() {
        this.createElement();
        this.scheduleRandomChats();
    }
    
    createElement() {
        this.chatBubble = document.createElement('div');
        this.chatBubble.id = 'chat-bubble';
        this.chatBubble.className = 'hidden';
        
        this.chatText = document.createElement('p');
        this.chatText.id = 'chat-text';
        
        this.chatBubble.appendChild(this.chatText);
        this.container.appendChild(this.chatBubble);
    }
    
    showRandomChat() {
        const randomPhrase = this.phrases[Math.floor(Math.random() * this.phrases.length)];
        this.showChat(randomPhrase);
    }
    
    showChat(message) {
        this.chatText.textContent = message;
        this.chatBubble.classList.remove('hidden');
        
        // Enable mouse events for chat bubble
        if (typeof ipcRenderer !== 'undefined') {
            ipcRenderer.send('set-ignore-mouse-events', false);
            ipcRenderer.send('mimo-message');
        }
        
        setTimeout(() => {
            this.chatBubble.classList.add('hidden');
            // Re-enable click-through after chat disappears
            setTimeout(() => {
                if (typeof ipcRenderer !== 'undefined') {
                    ipcRenderer.send('set-ignore-mouse-events', true, { forward: true });
                }
            }, 100);
        }, 4000);
    }
    
    scheduleRandomChats() {
        // Adjust frequency based on settings
        const baseDelay = 30000; // 30 seconds base
        const frequencyMultiplier = (11 - (this.settings.chatFrequency || 5)) / 10;
        const randomDelay = Math.random() * baseDelay * frequencyMultiplier + (baseDelay * frequencyMultiplier);
        
        setTimeout(() => {
            if (this.settings.randomChats !== false && Math.random() < 0.6) {
                this.showRandomChat();
            }
            this.scheduleRandomChats();
        }, randomDelay);
    }
    
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
    
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
    }
    
    getChatElement() {
        return this.chatBubble;
    }
}

module.exports = ChatSystem;