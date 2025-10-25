/**
 * MimoCharacter - Main character component
 * Handles the visual representation and basic animations of Mimo
 */
class MimoCharacter {
    constructor(container) {
        this.container = container;
        this.element = null;
        this.currentX = window.innerWidth / 2;
        this.currentY = window.innerHeight / 2;
        
        this.init();
    }
    
    init() {
        this.createElement();
        this.setupEventListeners();
    }
    
    createElement() {
        this.element = document.createElement('div');
        this.element.id = 'mimo-character';
        this.element.innerHTML = `
            <div class="mimo-body">
                <div class="mimo-face">
                    <div class="eyes">
                        <div class="eye left-eye"></div>
                        <div class="eye right-eye"></div>
                    </div>
                    <div class="mouth"></div>
                </div>
            </div>
            <div class="robot-legs">
                <div class="leg left-leg"></div>
                <div class="leg right-leg"></div>
            </div>
        `;
        
        this.container.appendChild(this.element);
    }
    
    setupEventListeners() {
        // Handle window resize
        window.addEventListener('resize', () => {
            this.currentX = Math.min(this.currentX, window.innerWidth - 100);
            this.currentY = Math.min(this.currentY, window.innerHeight - 120);
        });
    }
    
    addReaction(reaction) {
        this.element.classList.add(reaction);
        
        setTimeout(() => {
            this.element.classList.remove(reaction);
        }, 1000);
    }
    
    removeReactions() {
        const reactions = ['happy', 'excited', 'robot-dance', 'head-spin', 'antenna-wiggle', 'system-glitch'];
        reactions.forEach(reaction => {
            this.element.classList.remove(reaction);
        });
    }
    
    setDirection(direction) {
        if (direction === 'left') {
            this.element.style.transform = 'scaleX(-1)';
        } else {
            this.element.style.transform = 'scaleX(1)';
        }
    }
    
    resetDirection() {
        this.element.style.transform = 'scaleX(1)';
    }
    
    getElement() {
        return this.element;
    }
}

module.exports = MimoCharacter;