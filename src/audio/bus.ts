import { GainNode } from 'react-native-audio-api';
import { getAudio } from './context';
import type { VoiceId } from './voices';

const busses: Partial<Record<VoiceId, GainNode>> = {};

export function getBus(v: VoiceId): GainNode {
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
