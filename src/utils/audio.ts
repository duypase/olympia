// Simple Web Audio API sound synthesizer for game show tension effects (no external audio files needed)

let audioCtx: AudioContext | null = null;
let isSoundMuted = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function unlockAudioContext() {
  const ctx = getAudioContext();
  if (ctx && ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }
  const r1Audios = getRound1Audios();
  r1Audios.forEach((audio) => audio.load());
  const gameIntro = getGameIntroAudio();
  if (gameIntro) gameIntro.load();
  const r1NextQAudio = getRound1NextQuestionAudio();
  if (r1NextQAudio) r1NextQAudio.load();
  const r1Intro = getRound1IntroAudio();
  if (r1Intro) r1Intro.load();
  const r2Start = getRound2StartAudio();
  if (r2Start) r2Start.load();
  const r2OpenClue = getRound2OpenClueAudio();
  if (r2OpenClue) r2OpenClue.load();
  const r2Solving = getRound2SolvingKeywordAudio();
  if (r2Solving) r2Solving.load();
  const audio2 = getTimerAudio(2);
  if (audio2) audio2.load();
  const sAudio = getSolvedAudio();
  if (sAudio) sAudio.load();
  const bAudio = getSolvedBedAudio();
  if (bAudio) bAudio.load();
  const cAudio = getClueRevealAudio();
  if (cAudio) cAudio.load();
  const r2ChooseRow = getRound2ChooseRowAudio();
  if (r2ChooseRow) r2ChooseRow.load();
  const obsSolved = getObstacleSolvedAudio();
  if (obsSolved) obsSolved.load();
  const credAudio = getCreditsAudio();
  if (credAudio) credAudio.load();
}

function isPresentationEnvironment(): boolean {
  if (typeof window === "undefined") return false;
  return (
    new URLSearchParams(window.location.search).get("view") === "presentation"
  );
}

export function setMuted(muted: boolean) {
  isSoundMuted = muted;
  if (muted) {
    if (countdownAudiosR1) {
      countdownAudiosR1.forEach((audio) => audio.pause());
    }
    if (countdownAudioR2) countdownAudioR2.pause();
    if (round1NextQuestionAudio) {
      round1NextQuestionAudio.pause();
      round1NextQuestionAudio.currentTime = 0;
    }
    if (round2ChooseRowAudio) {
      round2ChooseRowAudio.pause();
      round2ChooseRowAudio.currentTime = 0;
    }
    stopSolvedRound2();
    stopObstacleSolvedSound();
    stopCreditsSound();
    stopGameIntroSound();
    stopRound1IntroSound();
    stopRound2StartSound();
    stopRound2OpenClueSound();
    stopRound2SolvingKeywordSound();
    if (correctAudio) correctAudio.pause();
  }
}

export function isMuted(): boolean {
  if (!isPresentationEnvironment()) return true;
  return isSoundMuted;
}

export const BASE_URL = import.meta.env.BASE_URL || '/';
export const getAssetUrl = (path: string): string => {
  if (!path) return '';
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${BASE_URL}${cleanPath}`;
};

const ROUND1_AUDIO_PATHS = [
  getAssetUrl('/round1_10s_1.ogg'),
  getAssetUrl('/round1_10s_2.ogg'),
  getAssetUrl('/round1_10s_3.ogg'),
];

let countdownAudiosR1: HTMLAudioElement[] | null = null;
let lastR1Index = -1;
let countdownAudioR2: HTMLAudioElement | null = null;
let activeCountdownAudio: HTMLAudioElement | null = null;

export function getRound1Audios(): HTMLAudioElement[] {
  if (typeof window === "undefined") return [];
  if (!countdownAudiosR1) {
    countdownAudiosR1 = ROUND1_AUDIO_PATHS.map((path) => {
      const audio = new Audio(path);
      audio.preload = "auto";
      return audio;
    });
  }
  return countdownAudiosR1;
}

export function getRandomRound1Audio(): HTMLAudioElement | null {
  const audios = getRound1Audios();
  if (audios.length === 0) return null;
  let nextIndex: number;
  if (audios.length > 1) {
    do {
      nextIndex = Math.floor(Math.random() * audios.length);
    } while (nextIndex === lastR1Index);
  } else {
    nextIndex = 0;
  }
  lastR1Index = nextIndex;
  return audios[nextIndex];
}

export function getTimerAudio(round: 1 | 2 = 1): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (round === 2) {
    if (!countdownAudioR2) {
      countdownAudioR2 = new Audio(getAssetUrl("/round2_timer.mpeg"));
      countdownAudioR2.preload = "auto";
    }
    return countdownAudioR2;
  }
  if (activeCountdownAudio) {
    return activeCountdownAudio;
  }
  return getRandomRound1Audio();
}

export function startTimerSoundtrack(round: 1 | 2 = 1) {
  if (
    !isPresentationEnvironment() ||
    isSoundMuted ||
    typeof window === "undefined"
  )
    return;
  if (activeCountdownAudio) {
    activeCountdownAudio.pause();
    activeCountdownAudio.currentTime = 0;
  }
  if (round2ChooseRowAudio) {
    round2ChooseRowAudio.pause();
    round2ChooseRowAudio.currentTime = 0;
  }
  stopGameIntroSound();
  stopRound1IntroSound();
  stopRound2StartSound();
  stopRound2OpenClueSound();
  const audio = round === 1 ? getRandomRound1Audio() : getTimerAudio(round);
  if (!audio) return;
  activeCountdownAudio = audio;
  audio.currentTime = 0;
  audio.volume = 1.0;
  audio.play().catch(() => {
    // Autoplay policy fallback: resume Web Audio if needed
    getAudioContext();
  });
}

export function pauseTimerSoundtrack() {
  if (activeCountdownAudio && !activeCountdownAudio.paused) {
    activeCountdownAudio.pause();
  }
}

export function resumeTimerSoundtrack(round: 1 | 2 = 1) {
  if (!isPresentationEnvironment() || isSoundMuted) return;
  if (!activeCountdownAudio) {
    activeCountdownAudio =
      round === 1 ? getRandomRound1Audio() : getTimerAudio(round);
  }
  if (
    activeCountdownAudio &&
    activeCountdownAudio.paused &&
    !activeCountdownAudio.ended
  ) {
    activeCountdownAudio.play().catch(() => {});
  }
}

export function stopTimerSoundtrack() {
  if (countdownAudiosR1) {
    countdownAudiosR1.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  }
  if (countdownAudioR2) {
    countdownAudioR2.pause();
    countdownAudioR2.currentTime = 0;
  }
  activeCountdownAudio = null;
}

export function fadeAndStopTimerSoundtrack(fadeMs = 600) {
  if (!activeCountdownAudio || activeCountdownAudio.paused) return;
  const audio = activeCountdownAudio;
  const startVol = audio.volume;
  const startTime = performance.now();

  const fadeInterval = setInterval(() => {
    const elapsed = performance.now() - startTime;
    const progress = Math.min(1, elapsed / fadeMs);
    audio.volume = Math.max(0, startVol * (1 - progress));
    if (progress >= 1) {
      clearInterval(fadeInterval);
      audio.pause();
      audio.currentTime = 0;
      audio.volume = 1.0;
    }
  }, 30);
}

let solvedAudio: HTMLAudioElement | null = null;
let solvedBedAudio: HTMLAudioElement | null = null;
let correctAudio: HTMLAudioElement | null = null;

export function getSolvedAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!solvedAudio) {
    solvedAudio = new Audio(getAssetUrl("/round2_solved.mpeg"));
    solvedAudio.preload = "auto";
  }
  return solvedAudio;
}

export function getSolvedBedAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!solvedBedAudio) {
    solvedBedAudio = new Audio(getAssetUrl("/solved_bed_round2.wav"));
    solvedBedAudio.preload = "auto";
  }
  return solvedBedAudio;
}

export function getClueRevealAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!correctAudio) {
    correctAudio = new Audio(getAssetUrl("/correct.wav"));
    correctAudio.preload = "auto";
  }
  return correctAudio;
}

export function playSolvedRound2() {
  if (
    !isPresentationEnvironment() ||
    isSoundMuted ||
    typeof window === "undefined"
  )
    return;
  stopSolvedRound2();

  const sAudio = getSolvedAudio();

  if (sAudio) {
    sAudio.currentTime = 0;
    sAudio.volume = 1.0;
    sAudio.play().catch(() => {});
  }
}

export function stopSolvedRound2() {
  if (solvedAudio) {
    solvedAudio.pause();
    solvedAudio.currentTime = 0;
  }
  if (solvedBedAudio) {
    solvedBedAudio.pause();
    solvedBedAudio.currentTime = 0;
  }
}

export function playClueRevealSound() {
  if (
    !isPresentationEnvironment() ||
    isSoundMuted ||
    typeof window === "undefined"
  )
    return;
  const audio = getClueRevealAudio();
  if (!audio) return;
  audio.currentTime = 0;
  audio.volume = 1.0;
  audio.play().catch(() => {});
}

let round1NextQuestionAudio: HTMLAudioElement | null = null;

export function getRound1NextQuestionAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!round1NextQuestionAudio) {
    round1NextQuestionAudio = new Audio(getAssetUrl("/round1_nextq.ogg"));
    round1NextQuestionAudio.preload = "auto";
  }
  return round1NextQuestionAudio;
}

export function playRound1NextQuestionSound() {
  if (
    !isPresentationEnvironment() ||
    isSoundMuted ||
    typeof window === "undefined"
  )
    return;
  stopRound1IntroSound();
  const audio = getRound1NextQuestionAudio();
  if (!audio) return;
  audio.currentTime = 0;
  audio.volume = 1.0;
  audio.play().catch(() => {});
}

let gameIntroAudio: HTMLAudioElement | null = null;

export function getGameIntroAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!gameIntroAudio) {
    gameIntroAudio = new Audio(getAssetUrl("/intro-game.ogg"));
    gameIntroAudio.preload = "auto";
  }
  return gameIntroAudio;
}

export function playGameIntroSound() {
  if (
    !isPresentationEnvironment() ||
    isSoundMuted ||
    typeof window === "undefined"
  )
    return;
  stopGameIntroSound();
  const audio = getGameIntroAudio();
  if (!audio) return;
  audio.currentTime = 0;
  audio.volume = 1.0;
  audio.play().catch(() => {});
}

export function stopGameIntroSound() {
  if (gameIntroAudio) {
    gameIntroAudio.pause();
    gameIntroAudio.currentTime = 0;
  }
}

export function isGameIntroPlaying(): boolean {
  return (
    !!gameIntroAudio &&
    !gameIntroAudio.paused &&
    !gameIntroAudio.ended
  );
}

let round1IntroAudio: HTMLAudioElement | null = null;

export function getRound1IntroAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!round1IntroAudio) {
    round1IntroAudio = new Audio(getAssetUrl("/round1_start.mpeg"));
    round1IntroAudio.preload = "auto";
  }
  return round1IntroAudio;
}

export function playRound1IntroSound() {
  if (
    !isPresentationEnvironment() ||
    isSoundMuted ||
    typeof window === "undefined"
  )
    return;
  stopGameIntroSound();
  stopRound1IntroSound();
  const audio = getRound1IntroAudio();
  if (!audio) return;
  audio.currentTime = 0;
  audio.volume = 1.0;
  audio.play().catch(() => {});
}

export function stopRound1IntroSound() {
  if (round1IntroAudio) {
    round1IntroAudio.pause();
    round1IntroAudio.currentTime = 0;
  }
}

let round2StartAudio: HTMLAudioElement | null = null;

export function getRound2StartAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!round2StartAudio) {
    round2StartAudio = new Audio(getAssetUrl("/round2_start.wav"));
    round2StartAudio.preload = "auto";
  }
  return round2StartAudio;
}

export function playRound2StartSound() {
  if (
    !isPresentationEnvironment() ||
    isSoundMuted ||
    typeof window === "undefined"
  )
    return;
  stopRound2StartSound();
  const audio = getRound2StartAudio();
  if (!audio) return;
  audio.currentTime = 0;
  audio.volume = 1.0;
  audio.play().catch(() => {});
}

export function stopRound2StartSound() {
  if (round2StartAudio) {
    round2StartAudio.pause();
    round2StartAudio.currentTime = 0;
  }
}

let round2OpenClueAudio: HTMLAudioElement | null = null;

export function getRound2OpenClueAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!round2OpenClueAudio) {
    round2OpenClueAudio = new Audio(getAssetUrl("/round2_open_clue.wav"));
    round2OpenClueAudio.preload = "auto";
  }
  return round2OpenClueAudio;
}

export function playRound2OpenClueSound() {
  if (
    !isPresentationEnvironment() ||
    isSoundMuted ||
    typeof window === "undefined"
  )
    return;
  stopRound2StartSound();
  stopRound2OpenClueSound();
  const audio = getRound2OpenClueAudio();
  if (!audio) return;
  audio.currentTime = 0;
  audio.volume = 1.0;
  audio.play().catch(() => {});
}

export function stopRound2OpenClueSound() {
  if (round2OpenClueAudio) {
    round2OpenClueAudio.pause();
    round2OpenClueAudio.currentTime = 0;
  }
}

let round2SolvingKeywordAudio: HTMLAudioElement | null = null;

export function getRound2SolvingKeywordAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!round2SolvingKeywordAudio) {
    round2SolvingKeywordAudio = new Audio(getAssetUrl("/round2_solving_keyword.wav"));
    round2SolvingKeywordAudio.preload = "auto";
  }
  return round2SolvingKeywordAudio;
}

export function playRound2SolvingKeywordSound() {
  if (
    !isPresentationEnvironment() ||
    isSoundMuted ||
    typeof window === "undefined"
  )
    return;
  stopRound2SolvingKeywordSound();
  stopTimerSoundtrack();
  stopRound2OpenClueSound();
  const audio = getRound2SolvingKeywordAudio();
  if (!audio) return;
  audio.currentTime = 0;
  audio.volume = 1.0;
  audio.play().catch(() => {});
}

export function stopRound2SolvingKeywordSound() {
  if (round2SolvingKeywordAudio) {
    round2SolvingKeywordAudio.pause();
    round2SolvingKeywordAudio.currentTime = 0;
  }
}

let round2ChooseRowAudio: HTMLAudioElement | null = null;
let lastChooseRowPlayTime = 0;

export function getRound2ChooseRowAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!round2ChooseRowAudio) {
    round2ChooseRowAudio = new Audio(getAssetUrl("/round2_chooserow.wav"));
    round2ChooseRowAudio.preload = "auto";
  }
  return round2ChooseRowAudio;
}

export function playRound2ChooseRowSound() {
  if (
    !isPresentationEnvironment() ||
    isSoundMuted ||
    typeof window === "undefined"
  )
    return;
  stopRound2OpenClueSound();
  const now = Date.now();
  if (now - lastChooseRowPlayTime < 300) return;
  lastChooseRowPlayTime = now;
  const audio = getRound2ChooseRowAudio();
  if (!audio) return;
  audio.currentTime = 0;
  audio.volume = 1.0;
  audio.play().catch(() => {});
}

let obstacleSolvedAudio: HTMLAudioElement | null = null;
let lastObstacleSolvedPlayTime = 0;

export function getObstacleSolvedAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!obstacleSolvedAudio) {
    obstacleSolvedAudio = new Audio(getAssetUrl("/round2_keyword_solved.ogg"));
    obstacleSolvedAudio.preload = "auto";
  }
  return obstacleSolvedAudio;
}

export function playObstacleSolvedSound() {
  if (
    !isPresentationEnvironment() ||
    isSoundMuted ||
    typeof window === "undefined"
  )
    return;
  const now = Date.now();
  if (now - lastObstacleSolvedPlayTime < 1000) return;
  lastObstacleSolvedPlayTime = now;
  stopTimerSoundtrack();
  stopSolvedRound2();
  stopRound2SolvingKeywordSound();
  const audio = getObstacleSolvedAudio();
  if (!audio) return;
  audio.currentTime = 0;
  audio.volume = 1.0;
  audio.play().catch(() => {});
}

export function stopObstacleSolvedSound() {
  if (obstacleSolvedAudio) {
    obstacleSolvedAudio.pause();
    obstacleSolvedAudio.currentTime = 0;
  }
}

let creditsAudio: HTMLAudioElement | null = null;

export function getCreditsAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!creditsAudio) {
    creditsAudio = new Audio(getAssetUrl("/credits.wav"));
    creditsAudio.preload = "auto";
  }
  return creditsAudio;
}

export function playCreditsSound() {
  if (
    !isPresentationEnvironment() ||
    isSoundMuted ||
    typeof window === "undefined"
  )
    return;
  stopTimerSoundtrack();
  stopSolvedRound2();
  stopObstacleSolvedSound();
  const audio = getCreditsAudio();
  if (!audio) return;
  audio.currentTime = 0;
  audio.volume = 1.0;
  audio.play().catch(() => {});
}

export function stopCreditsSound() {
  if (creditsAudio) {
    creditsAudio.pause();
    creditsAudio.currentTime = 0;
  }
}

export function isSoundtrackPlaying(): boolean {
  return (
    !!activeCountdownAudio &&
    !activeCountdownAudio.paused &&
    !activeCountdownAudio.ended
  );
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
  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }

  const now = ctx.currentTime;
  // Bright ascending fanfare: C5 (523Hz), E5 (659Hz), G5 (784Hz), C6 (1046Hz)
  const freqs = [523.25, 659.25, 783.99, 1046.5];

  freqs.forEach((freq, idx) => {
    // Primary sine wave for sweet chime
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now + idx * 0.08);

    gain.gain.setValueAtTime(0.3, now + idx * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.38);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.08);
    osc.stop(now + idx * 0.08 + 0.38);

    // Subtle harmonic overtone (triangle) for sparkle
    const harmOsc = ctx.createOscillator();
    const harmGain = ctx.createGain();

    harmOsc.type = "triangle";
    harmOsc.frequency.setValueAtTime(freq * 2, now + idx * 0.08);

    harmGain.gain.setValueAtTime(0.08, now + idx * 0.08);
    harmGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);

    harmOsc.connect(harmGain);
    harmGain.connect(ctx.destination);

    harmOsc.start(now + idx * 0.08);
    harmOsc.stop(now + idx * 0.08 + 0.25);
  });
}

export function playWrong() {
  stopRound2SolvingKeywordSound();
  if (!isPresentationEnvironment() || isSoundMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }

  const now = ctx.currentTime;

  // Classic double-buzzer effect (Buzz 1: 0 - 0.15s, Buzz 2: 0.20 - 0.45s)
  const beeps = [
    { start: 0, dur: 0.14, startFreq: 170, endFreq: 125 },
    { start: 0.18, dur: 0.25, startFreq: 155, endFreq: 105 },
  ];

  beeps.forEach(({ start, dur, startFreq, endFreq }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(startFreq, now + start);
    osc.frequency.linearRampToValueAtTime(endFreq, now + start + dur);

    gain.gain.setValueAtTime(0.35, now + start);
    gain.gain.linearRampToValueAtTime(0.01, now + start + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + start);
    osc.stop(now + start + dur);
  });
}

export function playVictory() {
  playObstacleSolvedSound();
}
