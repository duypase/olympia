// Simple Web Audio API sound synthesizer for game show tension effects (no external audio files needed)

let audioCtx: AudioContext | null = null;
let isSoundMuted = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function unlockAudioContext() {
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
  const audio = getTimerAudio();
  if (audio) {
    audio.load();
  }
}

function isPresentationEnvironment(): boolean {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('view') === 'presentation';
}

export function setMuted(muted: boolean) {
  isSoundMuted = muted;
  if (muted && countdownAudio) {
    countdownAudio.pause();
  }
}

export function isMuted(): boolean {
  if (!isPresentationEnvironment()) return true;
  return isSoundMuted;
}

let countdownAudio: HTMLAudioElement | null = null;

export function getTimerAudio(): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null;
  if (!countdownAudio) {
    countdownAudio = new Audio('/timer_soundtrack.wav');
    countdownAudio.preload = 'auto';
  }
  return countdownAudio;
}

export function startTimerSoundtrack() {
  if (!isPresentationEnvironment() || isSoundMuted || typeof window === 'undefined') return;
  const audio = getTimerAudio();
  if (!audio) return;
  audio.currentTime = 0;
  audio.volume = 1.0;
  audio.play().catch(() => {
    // Autoplay policy fallback: resume Web Audio if needed
    getAudioContext();
  });
}

export function pauseTimerSoundtrack() {
  if (countdownAudio && !countdownAudio.paused) {
    countdownAudio.pause();
  }
}

export function resumeTimerSoundtrack() {
  if (!isPresentationEnvironment() || isSoundMuted || !countdownAudio) return;
  if (countdownAudio.paused && !countdownAudio.ended) {
    countdownAudio.play().catch(() => {});
  }
}

export function stopTimerSoundtrack() {
  if (countdownAudio) {
    countdownAudio.pause();
    countdownAudio.currentTime = 0;
  }
}

export function isSoundtrackPlaying(): boolean {
  return !!countdownAudio && !countdownAudio.paused && !countdownAudio.ended;
}

export function playTick() {
  // Replaced by high-fidelity continuous timer soundtrack!
  // Left as no-op to prevent double ticking sound.
}

export function playWarning() {
  // Integrated directly into the timer soundtrack's final urgency crescendo!
}

export function playCorrect() {
  if (!isPresentationEnvironment() || isSoundMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Major chord flourish)

  freqs.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + idx * 0.08);

    gain.gain.setValueAtTime(0.2, now + idx * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.08);
    osc.stop(now + idx * 0.08 + 0.35);
  });
}

export function playWrong() {
  if (!isPresentationEnvironment() || isSoundMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(160, now);
  osc.frequency.linearRampToValueAtTime(110, now + 0.3);

  gain.gain.setValueAtTime(0.3, now);
  gain.gain.linearRampToValueAtTime(0.01, now + 0.35);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.35);
}

export function playVictory() {
  if (!isPresentationEnvironment() || isSoundMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [
    { freq: 523.25, time: 0 },
    { freq: 659.25, time: 0.12 },
    { freq: 783.99, time: 0.24 },
    { freq: 1046.50, time: 0.36 },
    { freq: 1318.51, time: 0.55 },
  ];

  notes.forEach(({ freq, time }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + time);

    gain.gain.setValueAtTime(0.3, now + time);
    gain.gain.exponentialRampToValueAtTime(0.001, now + time + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + time);
    osc.stop(now + time + 0.6);
  });
}
