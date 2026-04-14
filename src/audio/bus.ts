import { getAudio } from './context';
import type { VoiceId } from './voices';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const busses: Partial<Record<VoiceId, any>> = {};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getBus(v: VoiceId): any {
  if (busses[v]) return busses[v];
  const { ctx, master } = getAudio();
  const g = ctx.createGain();
  g.gain.value = 1;
  g.connect(master);
  busses[v] = g;
  return g;
}

export function setMuted(v: VoiceId, muted: boolean) {
  getBus(v).gain.value = muted ? 0 : 1;
}
