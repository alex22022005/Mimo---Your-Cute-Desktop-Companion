/**
 * SoundSystem - Handles all audio functionality
 * Manages text-to-speech, robot sounds, and sound effects
 */
class SoundSystem {
    constructor(settings) {
        this.settings = settings;
        this.audioContext = null;
        
        this.init();
    }
    
    init() {
        this.initializeSpeech();
        this.initializeAudioContext();
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
    
    initializeAudioContext() {
        if ('AudioContext' in window || 'webkitAudioContext' in window) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }
    
    speak(text) {
        if (!this.settings.sound || !('speechSynthesis' in window)) return;
        
        // Cancel any ongoing speech
        speechSynthesis.cancel();
        
        // Remove emojis from speech text
        const cleanText = text.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');
        
        const utterance = new SpeechSynthesisUtterance(cleanText);
        
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
    
    playRobotSound() {
        if (!this.settings.sound || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.2);
    }
    
    playHopSound() {
        this.createBeepSequence([400, 600], [0.1, 0.1]);
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
        if (!this.settings.sound || !this.audioContext) return;
        
        let currentTime = this.audioContext.currentTime;
        
        frequencies.forEach((freq, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(freq, currentTime);
            gainNode.gain.setValueAtTime(0.1, currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + durations[index]);
            
            oscillator.start(currentTime);
            oscillator.stop(currentTime + durations[index]);
            
            currentTime += durations[index] + 0.05; // Small gap between beeps
        });
    }
    
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
    }
}

module.exports = SoundSystem;