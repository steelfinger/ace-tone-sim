import { AudioContext } from 'react-native-audio-api';

let ctx: AudioContext | null = null;
let masterGain: ReturnType<AudioContext['createGain']> | null = null;

export function getAudio() {
  if (!ctx) {
    ctx = new AudioContext();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.8;
    masterGain.connect(ctx.destination);
  }
  return { ctx: ctx!, master: masterGain! };
}

export function setMasterVolume(v: number) {
  if (masterGain) masterGain.gain.value = Math.max(0, Math.min(1, v));
}

// Noise buffer — generate once, reuse via AudioBufferSourceNode
let noiseBuffer: ReturnType<AudioContext['createBuffer']> | null = null;
export function getNoiseBuffer() {
  if (noiseBuffer) return noiseBuffer;
  const { ctx } = getAudio();
  const seconds = 2;
  const buf = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  noiseBuffer = buf;
  return buf;
}
