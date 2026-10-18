/**
 * Motor de audio 100 % original con Web Audio API (sin samples ni
 * canciones con copyright):
 *  - Música instrumental alegre con energía deportiva, en bucle continuo
 *    (bajo + acordes a contratiempo + riff de melodía + batería programada).
 *  - Efectos breves: acierto, fallo, rebote, fin de tiempo, tic-tac,
 *    fanfarria final y clic.
 * La música arranca con el gesto del usuario (botón "Comenzar") y no se
 * reinicia al cambiar de pantalla. Volumen y silencio se guardan en
 * localStorage y los respetan tanto la música como los efectos.
 */
import { useCallback, useState } from "react";

export interface AudioPrefs {
  /** 0..100 */
  volume: number;
  muted: boolean;
}

const STORAGE_KEY = "desafio-michel:audio:v1";
const BPM = 116;
const STEP = 60 / BPM / 4; // duración de una semicorchea en segundos

// ---------------------------------------------------------------------------
// Estado del módulo (singleton)
// ---------------------------------------------------------------------------
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let musicBus: GainNode | null = null;
let sfxBus: GainNode | null = null;
let noiseBuf: AudioBuffer | null = null;
let musicTimer: number | null = null;
let nextNoteTime = 0;
let stepIdx = 0;
let prefs: AudioPrefs = loadPrefs();

function loadPrefs(): AudioPrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw) as Partial<AudioPrefs>;
      return {
        volume: clampVolume(typeof p.volume === "number" ? p.volume : 70),
        muted: !!p.muted,
      };
    }
  } catch {
    /* almacenamiento no disponible: valores por defecto */
  }
  return { volume: 70, muted: false };
}

function savePrefs(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    /* noop */
  }
}

function clampVolume(v: number): number {
  return Math.min(100, Math.max(0, Math.round(v)));
}

function applyGains(): void {
  if (!ctx || !master) return;
  const v = prefs.muted ? 0 : Math.pow(prefs.volume / 100, 1.4);
  master.gain.setTargetAtTime(v, ctx.currentTime, 0.02);
}

const mf = (midi: number): number => 440 * Math.pow(2, (midi - 69) / 12);

function ensureCtx(): boolean {
  if (ctx) return true;
  try {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
  } catch {
    return false;
  }
  master = ctx.createGain();
  master.connect(ctx.destination);
  musicBus = ctx.createGain();
  musicBus.gain.value = 0.5;
  musicBus.connect(master);
  sfxBus = ctx.createGain();
  sfxBus.gain.value = 0.9;
  sfxBus.connect(master);
  noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const data = noiseBuf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  applyGains();
  return true;
}

// ---------------------------------------------------------------------------
// Primitivas
// ---------------------------------------------------------------------------
interface ToneOpts {
  freq: number;
  freqEnd?: number;
  at: number;
  dur: number;
  type: OscillatorType;
  gain: number;
  bus?: GainNode | null;
}

function tone(opts: ToneOpts): void {
  if (!ctx) return;
  const t = opts.at;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = opts.type;
  osc.frequency.setValueAtTime(Math.max(1, opts.freq), t);
  if (opts.freqEnd) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, opts.freqEnd), t + opts.dur);
  }
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(opts.gain, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.001, t + opts.dur);
  osc.connect(g);
  g.connect(opts.bus ?? sfxBus ?? ctx.destination);
  osc.start(t);
  osc.stop(t + opts.dur + 0.05);
}

interface NoiseOpts {
  at: number;
  dur: number;
  gain: number;
  filterFreq: number;
  type?: BiquadFilterType;
  bus?: GainNode | null;
}

function noise(opts: NoiseOpts): void {
  if (!ctx || !noiseBuf) return;
  const t = opts.at;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuf;
  src.loop = true;
  const f = ctx.createBiquadFilter();
  f.type = opts.type ?? "highpass";
  f.frequency.value = opts.filterFreq;
  const g = ctx.createGain();
  g.gain.setValueAtTime(opts.gain, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + opts.dur);
  src.connect(f);
  f.connect(g);
  g.connect(opts.bus ?? sfxBus ?? ctx.destination);
  src.start(t);
  src.stop(t + opts.dur + 0.05);
}

// ---------------------------------------------------------------------------
// Música: composición original en bucle (I–V–vi–IV: C – G – Am – F)
// ---------------------------------------------------------------------------
const BASS_ROOTS = [36, 43, 45, 41]; // C2, G2, A2, F2 (un compás cada uno)
const CHORDS: number[][] = [
  [48, 52, 55], // C
  [55, 59, 62], // G
  [57, 60, 64], // Am
  [53, 57, 60], // F
];
/** Riff de melodía: 64 pasos (4 compases × 16); 0 = silencio. */
const LEAD = [
  64, 0, 67, 0, 69, 0, 67, 0, 64, 0, 62, 0, 64, 0, 0, 0,
  62, 0, 64, 0, 67, 0, 0, 0, 71, 0, 69, 0, 67, 0, 0, 0,
  69, 0, 72, 0, 71, 0, 69, 0, 67, 0, 69, 0, 64, 0, 0, 0,
  65, 0, 69, 0, 72, 0, 69, 0, 65, 0, 64, 0, 62, 0, 0, 0,
];

function scheduleStep(s: number, t: number): void {
  if (!ctx || !musicBus) return;
  const bar = Math.floor(s / 16);
  const root = BASS_ROOTS[bar] ?? 36;
  const chord = CHORDS[bar] ?? CHORDS[0] ?? [];
  const inBar = s % 16;

  // Bajo en corcheas (con octava arriba en dos puntos para darle aire)
  if (inBar % 2 === 0) {
    const up = inBar === 6 || inBar === 14;
    tone({ freq: mf(root + (up ? 12 : 0)), at: t, dur: STEP * 1.8, type: "triangle", gain: 0.3, bus: musicBus });
  }
  // Acordes a contratiempo
  if (inBar === 2 || inBar === 6 || inBar === 10 || inBar === 14) {
    for (const m of chord) {
      tone({ freq: mf(m), at: t, dur: 0.11, type: "triangle", gain: 0.07, bus: musicBus });
    }
  }
  // Melodía
  const lead = LEAD[s];
  if (lead) {
    tone({ freq: mf(lead), at: t, dur: STEP * 1.9, type: "triangle", gain: 0.19, bus: musicBus });
  }
  // Batería: bombo a negras, caja en 2 y 4, hats en corcheas
  if (inBar % 4 === 0) {
    tone({ freq: 140, freqEnd: 42, at: t, dur: 0.13, type: "sine", gain: 0.5, bus: musicBus });
  }
  if (inBar === 4 || inBar === 12) {
    noise({ at: t, dur: 0.11, gain: 0.2, filterFreq: 1800, bus: musicBus });
    tone({ freq: 190, at: t, dur: 0.08, type: "triangle", gain: 0.1, bus: musicBus });
  }
  if (inBar % 2 === 0) {
    noise({ at: t, dur: 0.035, gain: inBar % 4 === 2 ? 0.09 : 0.05, filterFreq: 7000, bus: musicBus });
  }
}

function schedulerTick(): void {
  if (!ctx) return;
  while (nextNoteTime < ctx.currentTime + 0.18) {
    scheduleStep(stepIdx, nextNoteTime);
    nextNoteTime += STEP;
    stepIdx = (stepIdx + 1) % 64;
  }
}

export function startMusic(): void {
  if (!ensureCtx() || !ctx) return;
  void ctx.resume();
  if (musicTimer !== null) return; // ya suena: no reiniciar entre pantallas
  stepIdx = 0;
  nextNoteTime = ctx.currentTime + 0.08;
  musicTimer = window.setInterval(schedulerTick, 25);
}

export function stopMusic(): void {
  if (musicTimer !== null) {
    window.clearInterval(musicTimer);
    musicTimer = null;
  }
}

// ---------------------------------------------------------------------------
// Efectos de sonido (respetan volumen y silencio a través del master)
// ---------------------------------------------------------------------------
export function sfxClick(): void {
  if (!ctx) return;
  tone({ freq: 660, at: ctx.currentTime, dur: 0.05, type: "sine", gain: 0.1 });
}

export function sfxCorrect(): void {
  if (!ctx) return;
  const t0 = ctx.currentTime;
  [72, 76, 79, 84].forEach((m, i) =>
    tone({ freq: mf(m), at: t0 + i * 0.09, dur: 0.22, type: "triangle", gain: 0.24 }),
  );
}

export function sfxWrong(): void {
  if (!ctx) return;
  const t0 = ctx.currentTime;
  tone({ freq: 220, freqEnd: 110, at: t0, dur: 0.35, type: "sawtooth", gain: 0.14 });
  tone({ freq: 165, freqEnd: 82, at: t0 + 0.05, dur: 0.35, type: "sawtooth", gain: 0.09 });
}

export function sfxRebound(): void {
  if (!ctx) return;
  const t0 = ctx.currentTime;
  tone({ freq: 98, freqEnd: 49, at: t0, dur: 0.3, type: "sine", gain: 0.5 });
  tone({ freq: 147, freqEnd: 73, at: t0 + 0.18, dur: 0.35, type: "sine", gain: 0.5 });
  noise({ at: t0, dur: 0.5, gain: 0.08, filterFreq: 900, type: "bandpass" });
}

export function sfxTimeout(): void {
  if (!ctx) return;
  const t0 = ctx.currentTime;
  for (let i = 0; i < 3; i++) {
    tone({ freq: 880, at: t0 + i * 0.14, dur: 0.1, type: "square", gain: 0.08 });
  }
}

export function sfxTick(): void {
  if (!ctx) return;
  tone({ freq: 1250, at: ctx.currentTime, dur: 0.045, type: "sine", gain: 0.06 });
}

export function sfxFanfare(): void {
  if (!ctx) return;
  const t0 = ctx.currentTime;
  const seq: Array<[number, number, number]> = [
    [72, 0, 0.16],
    [72, 0.18, 0.16],
    [72, 0.36, 0.16],
    [76, 0.54, 0.3],
    [79, 0.9, 0.16],
    [76, 1.08, 0.16],
    [84, 1.26, 0.55],
  ];
  for (const [m, dt, d] of seq) {
    tone({ freq: mf(m), at: t0 + dt, dur: d, type: "sawtooth", gain: 0.11 });
  }
  noise({ at: t0 + 1.26, dur: 0.6, gain: 0.05, filterFreq: 6000 });
}

// ---------------------------------------------------------------------------
// Preferencias + hook de React
// ---------------------------------------------------------------------------
export function setVolumeValue(v: number): void {
  prefs.volume = clampVolume(v);
  savePrefs();
  applyGains();
}

export function setMutedValue(m: boolean): void {
  prefs.muted = m;
  savePrefs();
  applyGains();
}

export function getPrefs(): AudioPrefs {
  return { ...prefs };
}

export function useAudioEngine() {
  const [volume, setVolume] = useState(prefs.volume);
  const [muted, setMuted] = useState(prefs.muted);

  const changeVolume = useCallback((v: number) => {
    setVolumeValue(v);
    setVolume(prefs.volume);
  }, []);

  const toggleMute = useCallback(() => {
    setMutedValue(!prefs.muted);
    setMuted(prefs.muted);
  }, []);

  const start = useCallback(() => {
    startMusic();
  }, []);

  return { volume, muted, setVolume: changeVolume, toggleMute, startMusic: start };
}
