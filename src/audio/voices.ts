import { getAudio, getNoiseBuffer } from './context';

export type VoiceId = 'bd' | 'sd' | 'lc' | 'hc' | 'cy' | 'cl' | 'cb' | 'mc';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const env = (ctx: any, target: any, t: number, peak: number, decay: number) => {
  target.setValueAtTime(0.0001, t);
  target.exponentialRampToValueAtTime(peak, t + 0.002);
  target.exponentialRampToValueAtTime(0.0001, t + decay);
};

// BASS DRUM — LC oscillator ~60 Hz with fast pitch sweep, ~200 ms decay
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function bass(t: number, out: any) {
  const { ctx } = getAudio();
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(130, t);
  osc.frequency.exponentialRampToValueAtTime(48, t + 0.06);
  env(ctx, g.gain, t, 0.9, 0.22);
  osc.connect(g).connect(out);
  osc.start(t);
  osc.stop(t + 0.3);
}

// SNARE — tonal body (~180 Hz triangle) + filtered noise burst
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function snare(t: number, out: any) {
  const { ctx } = getAudio();
  // body
  const osc = ctx.createOscillator();
  const gOsc = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(220, t);
  osc.frequency.exponentialRampToValueAtTime(170, t + 0.05);
  env(ctx, gOsc.gain, t, 0.35, 0.12);
  osc.connect(gOsc).connect(out);
  osc.start(t);
  osc.stop(t + 0.15);
  // noise
  const n = ctx.createBufferSource();
  n.buffer = getNoiseBuffer();
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 1200;
  const gN = ctx.createGain();
  env(ctx, gN.gain, t, 0.5, 0.18);
  n.connect(hp).connect(gN).connect(out);
  n.start(t);
  n.stop(t + 0.2);
}

// LOW CONGA — resonant sine w/ short pitch drop, woody decay
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function lowConga(t: number, out: any) {
  const { ctx } = getAudio();
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(180, t);
  osc.frequency.exponentialRampToValueAtTime(120, t + 0.08);
  env(ctx, g.gain, t, 0.7, 0.25);
  osc.connect(g).connect(out);
  osc.start(t);
  osc.stop(t + 0.3);
}

// HIGH CONGA — same topology, higher pitch
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function highConga(t: number, out: any) {
  const { ctx } = getAudio();
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(320, t);
  osc.frequency.exponentialRampToValueAtTime(230, t + 0.06);
  env(ctx, g.gain, t, 0.65, 0.18);
  osc.connect(g).connect(out);
  osc.start(t);
  osc.stop(t + 0.25);
}

// CYMBAL — HPF white noise, long decay (~400 ms)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function cymbal(t: number, out: any) {
  const { ctx } = getAudio();
  const n = ctx.createBufferSource();
  n.buffer = getNoiseBuffer();
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 7000;
  const g = ctx.createGain();
  env(ctx, g.gain, t, 0.35, 0.35);
  n.connect(hp).connect(g).connect(out);
  n.start(t);
  n.stop(t + 0.45);
}

// CLAVES — pure sine ~2.5 kHz, very short (~40 ms)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function claves(t: number, out: any) {
  const { ctx } = getAudio();
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = 2500;
  env(ctx, g.gain, t, 0.55, 0.05);
  osc.connect(g).connect(out);
  osc.start(t);
  osc.stop(t + 0.06);
}

// COWBELL — two squares (540/800 Hz) through BPF, ~300 ms decay
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function cowbell(t: number, out: any) {
  const { ctx } = getAudio();
  const o1 = ctx.createOscillator();
  const o2 = ctx.createOscillator();
  o1.type = 'square'; o1.frequency.value = 540;
  o2.type = 'square'; o2.frequency.value = 800;
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass'; bp.frequency.value = 650; bp.Q.value = 4;
  const g = ctx.createGain();
  env(ctx, g.gain, t, 0.18, 0.3);
  o1.connect(bp); o2.connect(bp);
  bp.connect(g).connect(out);
  o1.start(t); o2.start(t);
  o1.stop(t + 0.35); o2.stop(t + 0.35);
}

// MARACAS — BPF noise, very short attack/decay
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function maracas(t: number, out: any) {
  const { ctx } = getAudio();
  const n = ctx.createBufferSource();
  n.buffer = getNoiseBuffer();
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 6000;
  bp.Q.value = 1.5;
  const g = ctx.createGain();
  env(ctx, g.gain, t, 0.3, 0.06);
  n.connect(bp).connect(g).connect(out);
  n.start(t);
  n.stop(t + 0.08);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const trigger: Record<VoiceId, (t: number, out: any) => void> = {
  bd: bass, sd: snare, lc: lowConga, hc: highConga,
  cy: cymbal, cl: claves, cb: cowbell, mc: maracas,
};
