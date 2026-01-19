let audioContext: AudioContext | null = null;
let isUnlocked = false;

// Initialize audio context (must be called from user gesture on iOS)
export const initAudio = (): void => {
  if (typeof window === 'undefined') return;

  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  if (!isUnlocked && audioContext.state === 'suspended') {
    audioContext.resume().then(() => {
      isUnlocked = true;
      console.log('Audio context unlocked');
    });
  }
};

// Play a beep tone
export const playBeep = (frequency: number = 440, duration: number = 200): void => {
  if (!audioContext || audioContext.state === 'suspended') {
    initAudio();
    if (!audioContext) return;
  }

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';

  // Fade out to avoid clicking
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration / 1000);
};

// Play "Start Running" cue (higher pitched, two beeps)
export const playRunCue = (): void => {
  playBeep(800, 150);
  setTimeout(() => playBeep(800, 150), 200);
};

// Play "Start Walking" cue (lower pitched, single beep)
export const playWalkCue = (): void => {
  playBeep(400, 300);
};

// Speak text using SpeechSynthesis API
export const speak = (text: string): void => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  window.speechSynthesis.speak(utterance);
};

// Combined audio cue with optional speech
export const playIntervalCue = (type: 'run' | 'walk', useSpeech: boolean = true): void => {
  if (type === 'run') {
    playRunCue();
    if (useSpeech) {
      setTimeout(() => speak('Run'), 400);
    }
  } else {
    playWalkCue();
    if (useSpeech) {
      setTimeout(() => speak('Walk'), 300);
    }
  }
};
