import { getAudio } from './context';
import { trigger, type VoiceId } from './voices';
import { getBus } from './bus';
import { PATTERNS, type Pattern } from '../patterns';

const VOICES: VoiceId[] = ['bd', 'sd', 'lc', 'hc', 'cy', 'cl', 'cb', 'mc'];

export function combine(patternIds: string[]): Pattern | null {
  const chosen = PATTERNS.filter(p => patternIds.includes(p.id));
  if (chosen.length === 0) return null;
  const steps = chosen[0].steps;
  // Ignore patterns that don't match dominant time signature
  const compatible = chosen.filter(p => p.steps === steps);
  const grid: Partial<Record<VoiceId, number[]>> = {};
  for (const v of VOICES) {
    const row = new Array(steps).fill(0);
    let any = false;
    for (const pat of compatible) {
      const r = pat.grid[v];
      if (!r) continue;
      any = true;
      for (let i = 0; i < steps; i++) if (r[i]) row[i] = 1;
    }
    if (any) grid[v] = row;
  }
  return { id: 'combined', name: 'Combined', steps, grid };
}

type Opts = {
  getBpm: () => number;
  getPattern: () => Pattern | null;
  onStep: (step: number, time: number) => void;
};

export function createScheduler({ getBpm, getPattern, onStep }: Opts) {
  const LOOKAHEAD = 0.1;   // seconds of audio scheduled ahead
  const TICK = 25;         // ms between scheduler runs
  let nextStepTime = 0;
  let step = 0;
  let running = false;
  let timer: ReturnType<typeof setInterval> | null = null;

  function scheduleStep(s: number, t: number) {
    const pat = getPattern();
    if (!pat) return;
    for (const v of VOICES) {
      const row = pat.grid[v];
      if (row && row[s]) trigger[v](t, getBus(v));
    }
    onStep(s, t);
  }

  function tick() {
    const { ctx } = getAudio();
    while (nextStepTime < ctx.currentTime + LOOKAHEAD) {
      const pat = getPattern();
      if (!pat) { nextStepTime = ctx.currentTime + 0.05; break; }
      scheduleStep(step, nextStepTime);
      // 12-step waltz = 8th notes per beat; 16-step = 16th notes per beat
      const stepDiv = pat.steps === 12 ? 2 : 4;
      nextStepTime += 60 / getBpm() / stepDiv;
      step = (step + 1) % pat.steps;
    }
  }

  return {
    start() {
      if (running) return;
      const { ctx } = getAudio();
      running = true;
      step = 0;
      nextStepTime = ctx.currentTime + 0.05;
      timer = setInterval(tick, TICK);
    },
    stop() {
      running = false;
      if (timer) clearInterval(timer);
      timer = null;
    },
    isRunning: () => running,
  };
}
