class SoundManager {
    audioContext: AudioContext | null = null;
    isMuted: boolean = false;

    constructor() {
        // Initialize AudioContext on first user interaction if possible
        try {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        } catch (e) {
            console.error("Web Audio API not supported", e);
        }
    }

    private ensureContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        if (!this.audioContext) {
            try {
                this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            } catch (e) { }
        }
        return !!this.audioContext;
    }

    playCaptureSound() {
        if (this.isMuted || !this.ensureContext()) return;

        const ctx = this.audioContext!;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.15);
    }

    playLevelUpSound() {
        if (this.isMuted || !this.ensureContext()) return;

        const ctx = this.audioContext!;
        const now = ctx.currentTime;

        [440, 554, 659, 880].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'square';
            osc.frequency.value = freq;

            gain.gain.setValueAtTime(0.1, now + i * 0.1);
            gain.gain.linearRampToValueAtTime(0, now + i * 0.1 + 0.1);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now + i * 0.1);
            osc.stop(now + i * 0.1 + 0.15);
        });
    }

    playGameOverSound() {
        if (this.isMuted || !this.ensureContext()) return;

        const ctx = this.audioContext!;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(50, ctx.currentTime + 1);

        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 1.1);
    }
}

export const soundManager = new SoundManager();
