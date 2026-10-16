/**
 * Ultra-Luxury Procedural Web Audio Engine
 * Features:
 * - Generative romantic music box + celestial ambient pad
 * - Real-time Web Audio AnalyserNode for audio-reactive 3D & UI visualizers
 * - Luxury interactive UI feedback soundscapes (crystal hover, heart pulse, sparkle)
 * Zero external file dependencies (100% procedural)
 */

class LuxuryAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timerId: number | null = null;
  private masterGain: GainNode | null = null;
  private padGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private currentStep = 0;
  private padOscs: OscillatorNode[] = [];

  // Luxury Minor 9th / Major 7th chords (Hz)
  private chordProgression: { baseFreq: number; notes: number[] }[] = [
    // Fmaj9
    { baseFreq: 87.31, notes: [174.61, 220.00, 261.63, 329.63, 392.00, 523.25, 659.25] },
    // Dm9
    { baseFreq: 73.42, notes: [146.83, 174.61, 220.00, 261.63, 329.63, 440.00, 587.33] },
    // Bbmaj7#11
    { baseFreq: 58.27, notes: [116.54, 174.61, 233.08, 293.66, 349.23, 466.16, 587.33] },
    // Cmaj7add9
    { baseFreq: 65.41, notes: [130.81, 164.81, 196.00, 246.94, 293.66, 392.00, 493.88] }
  ];

  public initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master output
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.22, this.ctx.currentTime);

      // Realtime Analyser for visualizer
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      // Pad gain
      this.padGain = this.ctx.createGain();
      this.padGain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      this.padGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getAudioFrequencyData(): Uint8Array {
    if (!this.analyser) return new Uint8Array(32);
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }

  public toggleMusic(): boolean {
    this.initCtx();
    if (this.isPlaying) {
      this.stopMusic();
      return false;
    } else {
      this.startMusic();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public startMusic() {
    this.initCtx();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.startAmbientPad();
    this.scheduleNotes();
  }

  public stopMusic() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.stopAmbientPad();
  }

  private startAmbientPad() {
    if (!this.ctx || !this.padGain) return;
    this.stopAmbientPad();

    const now = this.ctx.currentTime;
    const baseFreqs = [174.61, 261.63, 329.63]; // F, C, E warm drone

    this.padOscs = baseFreqs.map((freq) => {
      const osc = this.ctx!.createOscillator();
      const filter = this.ctx!.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, now);

      osc.connect(filter);
      filter.connect(this.padGain!);
      osc.start(now);
      return osc;
    });
  }

  private stopAmbientPad() {
    this.padOscs.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {}
    });
    this.padOscs = [];
  }

  private scheduleNotes = () => {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;

    const chordIdx = Math.floor(this.currentStep / 8) % this.chordProgression.length;
    const chord = this.chordProgression[chordIdx];

    // Pick bell note
    const note = chord.notes[this.currentStep % chord.notes.length];
    const isMajorAccent = this.currentStep % 4 === 0;

    this.playMusicBoxNote(note, 0.15, 1.8);

    if (isMajorAccent) {
      this.playSoftBass(chord.baseFreq, 0.16, 2.5);
    }

    // High crystalline sparkle
    if (Math.random() > 0.55) {
      const highNote = chord.notes[Math.floor(Math.random() * chord.notes.length)] * 2;
      setTimeout(() => {
        if (this.isPlaying) {
          this.playMusicBoxNote(highNote, 0.08, 1.4);
        }
      }, 260);
    }

    this.currentStep++;
    this.timerId = window.setTimeout(this.scheduleNotes, 540);
  };

  private playMusicBoxNote(freq: number, volume: number, duration: number) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration + 0.1);
    osc2.stop(now + duration + 0.1);
  }

  private playSoftBass(freq: number, volume: number, duration: number) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(240, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + duration + 0.1);
  }

  /**
   * Delicate crystal hover feedback sound
   */
  public playHoverChime() {
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1046.50, now); // C6 crystal tone
    osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.1); // E6

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.04, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  /**
   * Realistic binaural heartbeat
   */
  public playHeartbeat() {
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    this.createHeartThud(now, 58, 0.42, 0.14);
    this.createHeartThud(now + 0.18, 48, 0.35, 0.18);
  }

  private createHeartThud(time: number, startFreq: number, vol: number, dur: number) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, time);
    osc.frequency.exponentialRampToValueAtTime(32, time + dur);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(130, time);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(vol, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + dur + 0.05);
  }

  /**
   * Sparkle sound
   */
  public playSparkle() {
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const freqs = [659.25, 783.99, 987.77, 1318.51, 1567.98];

    freqs.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);

      gain.gain.setValueAtTime(0, now + idx * 0.04);
      gain.gain.linearRampToValueAtTime(0.06, now + idx * 0.04 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.4);
    });
  }
}

export const loveSoundEngine = new LuxuryAudioEngine();
