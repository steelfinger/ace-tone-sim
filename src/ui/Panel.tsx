import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  SafeAreaView,
} from 'react-native';
import { useSeq } from '../state/sequencer';
import { PATTERNS } from '../patterns';
import { Knob } from './Knob';
import type { VoiceId } from '../audio/voices';

const VOICE_LABELS: Record<VoiceId, string> = {
  bd: 'Bass', sd: 'Snare', lc: 'L. Conga', hc: 'H. Conga',
  cy: 'Cymbal', cl: 'Claves', cb: 'Cowbell', mc: 'Maracas',
};

// The 4 original FR-1 cancel buttons (mute, not manual trigger)
const CANCEL_VOICES: VoiceId[] = ['bd', 'cy', 'cl', 'cb'];

export function Panel() {
  const { width, height } = useWindowDimensions();
  const isTablet = Math.min(width, height) >= 600;
  const landscape = width > height;
  const cols = isTablet ? (landscape ? 16 : 8) : 4;

  const selected = useSeq(s => s.selected);
  const toggle = useSeq(s => s.toggleSelected);
  const running = useSeq(s => s.running);
  const setRunning = useSeq(s => s.setRunning);
  const currentStep = useSeq(s => s.currentStep);
  const bpm = useSeq(s => s.bpm);
  const setBpm = useSeq(s => s.setBpm);
  const volume = useSeq(s => s.volume);
  const setVolume = useSeq(s => s.setVolume);
  const mutes = useSeq(s => s.mutes);
  const toggleMute = useSeq(s => s.toggleMute);

  const downbeat = currentStep === 0 && running;

  return (
    <SafeAreaView style={styles.wood}>
      <View style={styles.face}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brand}>Ace Tone</Text>
          <Text style={styles.model}>FR-1 · Rhythm Ace</Text>
          <View style={[styles.led, downbeat && styles.ledOn]} />
        </View>

        {/* Rhythm button grid — 16 latching presets, OR-combinable */}
        <View style={[styles.grid]}>
          {PATTERNS.map((pat) => {
            const on = selected.includes(pat.id);
            return (
              <Pressable
                key={pat.id}
                onPress={() => toggle(pat.id, pat.steps)}
                style={[
                  styles.rhythm,
                  { flexBasis: `${100 / cols - 2}%` },
                  on && styles.rhythmOn,
                ]}
              >
                <Text style={[styles.rhythmLabel, on && styles.rhythmLabelOn]}>
                  {pat.name}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Cancel row — mute the 4 cancel-able voices */}
        <View style={styles.cancelRow}>
          {CANCEL_VOICES.map(v => (
            <Pressable
              key={v}
              onPress={() => toggleMute(v)}
              style={[styles.cancel, mutes[v] && styles.cancelOn]}
            >
              <Text style={styles.cancelLabel}>{VOICE_LABELS[v]}</Text>
              <Text style={styles.cancelState}>{mutes[v] ? 'OFF' : 'ON'}</Text>
            </Pressable>
          ))}
        </View>

        {/* Knob bank + transport */}
        <View style={styles.knobRow}>
          <Knob
            label="TEMPO"
            min={40}
            max={240}
            value={bpm}
            onChange={setBpm}
            display={`${bpm}`}
          />
          <Knob
            label="VOLUME"
            min={0}
            max={1}
            value={volume}
            onChange={setVolume}
            display={`${Math.round(volume * 100)}`}
          />
          <Pressable
            onPress={() => setRunning(!running)}
            style={[styles.start, running && styles.startOn]}
          >
            <Text style={styles.startLabel}>{running ? 'STOP' : 'START'}</Text>
          </Pressable>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wood: { flex: 1, backgroundColor: '#3a2418', padding: 12 },
  face: {
    flex: 1,
    backgroundColor: '#e8dcc0',
    borderRadius: 6,
    padding: 16,
    borderWidth: 2,
    borderColor: '#8b6a3f',
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  brand: { fontSize: 22, fontWeight: '800', color: '#2a2018', letterSpacing: 2 },
  model: { fontSize: 14, color: '#6a5438', flex: 1 },
  led: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#5a1a12',
    shadowColor: '#ff3020',
    shadowOpacity: 0,
    shadowRadius: 8,
  },
  ledOn: { backgroundColor: '#ff3822', shadowOpacity: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 },
  rhythm: {
    backgroundColor: '#f5efe0',
    borderWidth: 1,
    borderColor: '#b8a07a',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  rhythmOn: { backgroundColor: '#c0392b', borderColor: '#7a1f14' },
  rhythmLabel: { fontSize: 12, fontWeight: '600', color: '#3a2a18' },
  rhythmLabelOn: { color: '#fff' },
  cancelRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  cancel: {
    flex: 1,
    backgroundColor: '#f5efe0',
    borderWidth: 1,
    borderColor: '#b8a07a',
    borderRadius: 3,
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelOn: { backgroundColor: '#8a8070' },
  cancelLabel: { fontSize: 12, fontWeight: '600', color: '#3a2a18' },
  cancelState: { fontSize: 10, color: '#6a5438', marginTop: 2 },
  knobRow: { flexDirection: 'row', alignItems: 'center', gap: 20, marginTop: 'auto' },
  start: {
    marginLeft: 'auto',
    paddingVertical: 18,
    paddingHorizontal: 28,
    backgroundColor: '#2a2018',
    borderRadius: 40,
  },
  startOn: { backgroundColor: '#c0392b' },
  startLabel: { color: '#fff', fontWeight: '800', letterSpacing: 2 },
});
