/**
 * ReactionSystem - Handles character reactions and animations
 * Manages funny reactions, emotional responses, and special animations
 */
class ReactionSystem {
    constructor(character, soundSystem, chatSystem) {
        this.character = character;
        this.soundSystem = soundSystem;
        this.chatSystem = chatSystem;
        
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
        this.scheduleRandomReactions();
    }
    
    addReaction(reaction) {
        this.character.addReaction(reaction);
        
        // Add sound effect for reactions
        if (reaction === 'excited') {
            this.soundSystem.playExcitedBeeps();
        } else if (reaction === 'happy') {
            this.soundSystem.playHappyBeep();
        }
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
        this.character.addReaction('robot-dance');
        this.soundSystem.playDanceMusic();
        this.chatSystem.showChat("🎵 Beep boop dance mode! 🕺");
        
        setTimeout(() => {
            this.character.getElement().classList.remove('robot-dance');
        }, 3000);
    }
    
    headSpin() {
        this.character.addReaction('head-spin');
        this.soundSystem.playSpinSound();
        this.chatSystem.showChat("🌀 System calibration in progress... 🤖");
        
        setTimeout(() => {
            this.character.getElement().classList.remove('head-spin');
        }, 2000);
    }
    
    antennaWiggle() {
        this.character.addReaction('antenna-wiggle');
        this.soundSystem.playWiggleSound();
        this.chatSystem.showChat("📡 Receiving good vibes! ✨");
        
        setTimeout(() => {
            this.character.getElement().classList.remove('antenna-wiggle');
        }, 2000);
    }
    
    systemGlitch() {
        this.character.addReaction('system-glitch');
        this.soundSystem.playGlitchSound();
        this.chatSystem.showChat("⚡ ERROR... Just kidding! 😄");
        
        setTimeout(() => {
            this.character.getElement().classList.remove('system-glitch');
        }, 1500);
    }
    
    happyBeeps() {
        this.soundSystem.playHappyBeepSequence();
        this.chatSystem.showChat("🎶 Beep beep boop! Happy robot sounds! 🎵");
        this.addReaction('excited');
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
    
    removeReactions() {
        this.character.removeReactions();
    }
}

module.exports = ReactionSystem;