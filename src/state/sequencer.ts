import { create } from 'zustand';
import { combine } from '../audio/scheduler';
import type { Pattern } from '../patterns';
import type { VoiceId } from '../audio/voices';
import { setMuted } from '../audio/bus';
import { setMasterVolume } from '../audio/context';
import { PATTERNS } from '../patterns';

type S = {
  selected: string[];
  toggleSelected: (id: string, steps: number) => void;
  bpm: number;
  setBpm: (n: number) => void;
  volume: number;
  setVolume: (v: number) => void;
  mutes: Record<VoiceId, boolean>;
  toggleMute: (v: VoiceId) => void;
  running: boolean;
  setRunning: (r: boolean) => void;
  currentStep: number;
  setCurrentStep: (n: number) => void;
  getPattern: () => Pattern | null;
};

export const useSeq = create<S>((set, get) => ({
  selected: ['rock'],
  toggleSelected: (id, steps) => set(state => {
    const others = state.selected.filter(x => x !== id);
    if (state.selected.includes(id)) return { selected: others };
    // Enforce same time signature among selected
    const existing = get().getPattern();
    if (existing && existing.steps !== steps) return { selected: [id] }; // switch
    return { selected: [...state.selected, id] };
  }),
  bpm: 110,
  setBpm: (n) => set({ bpm: Math.round(n) }),
  volume: 0.8,
  setVolume: (v) => { setMasterVolume(v); set({ volume: v }); },
  mutes: { bd: false, sd: false, lc: false, hc: false, cy: false, cl: false, cb: false, mc: false },
  toggleMute: (v) => set(s => {
    const next = !s.mutes[v];
    setMuted(v, next);
    return { mutes: { ...s.mutes, [v]: next } };
  }),
  running: false,
  setRunning: (r) => set({ running: r }),
  currentStep: 0,
  setCurrentStep: (n) => set({ currentStep: n }),
  getPattern: () => combine(get().selected),
}));

// Keep PATTERNS imported so consumers can reference it from here if needed
export { PATTERNS };
