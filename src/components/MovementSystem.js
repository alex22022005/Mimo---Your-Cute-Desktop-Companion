/**
 * MovementSystem - Handles all movement and animation logic
 * Manages wandering, walking, hopping animations
 */
class MovementSystem {
    constructor(character, container, settings) {
        this.character = character;
        this.container = container;
        this.settings = settings;
        this.isWandering = false;
        this.currentX = window.innerWidth / 2;
        
        this.init();
    }
    
    init() {
        this.startWandering();
    }
    
    startWandering() {
        this.isWandering = true;
        this.wander();
    }
    
    stopWandering() {
        this.isWandering = false;
    }
    
    wander() {
        if (!this.isWandering) return;
        
        const margin = 100;
        const newX = Math.random() * (window.innerWidth - margin * 2) + margin;
        
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
        const hopDuration = Math.max(800, distance * (11 - speedMultiplier));
        
        // Add hopping animation class
        this.character.getElement().classList.add('hopping');
        
        // Determine direction and flip character if needed
        const currentLeft = parseInt(this.container.style.left || window.innerWidth / 2);
        if (x < currentLeft) {
            this.character.setDirection('left');
        } else {
            this.character.setDirection('right');
        }
        
        this.container.style.transition = `left ${hopDuration}ms ease-in-out`;
        this.container.style.left = x + 'px';
        
        // Remove hopping animation when done
        setTimeout(() => {
            this.character.getElement().classList.remove('hopping');
            this.character.resetDirection();
        }, hopDuration);
        
        return hopDuration;
    }
    
    moveTo(x, y) {
        // Legacy method for compatibility
        return this.walkTo(x);
    }
    
    getCurrentPosition() {
        return {
            x: this.currentX,
            y: this.currentY
        };
    }
    
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
    }
}

module.exports = MovementSystem;