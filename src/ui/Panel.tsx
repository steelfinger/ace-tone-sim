import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, ImageBackground } from 'react-native';
import { useSeq } from '../state/sequencer';
import { PATTERNS } from '../patterns';
import { Knob } from './Knob';
import type { VoiceId } from '../audio/voices';

const topPatterns = PATTERNS.slice(0, 8);
const bottomPatterns = PATTERNS.slice(8, 16);

const MUTE_VOICES: { id: VoiceId; label: string }[] = [
  { id: 'cy', label: 'CYMBAL' },
  { id: 'cl', label: 'CLAVES' },
  { id: 'cb', label: 'COW BELL' },
  { id: 'bd', label: 'BASS DRUM' },
];

export function Panel() {
  const selected = useSeq(s => s.selected);
  const toggle = useSeq(s => s.toggleSelected);
  const running = useSeq(s => s.running);
  const setRunning = useSeq(s => s.setRunning);
  const bpm = useSeq(s => s.bpm);
  const setBpm = useSeq(s => s.setBpm);
  const volume = useSeq(s => s.volume);
  const setVolume = useSeq(s => s.setVolume);
  const mutes = useSeq(s => s.mutes);
  const toggleMute = useSeq(s => s.toggleMute);

  return (
    <View style={styles.screen}>
      <ImageBackground
        source={require('../../assets/background.png')}
        style={styles.container}
        resizeMode="cover"
      >
        <View style={styles.internalUI}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.titleText}>
              RHYTHM ACE <Text style={styles.subTitle}>{'  '}FULL AUTO</Text>
            </Text>
            <View style={styles.headerLine} />
          </View>

          {/* 2-row preset grid */}
          <View style={styles.gridSection}>
            <View style={styles.buttonRowContainer}>
              {topPatterns.map((pat) => {
                const on = selected.includes(pat.id);
                const parts = pat.name.toUpperCase().split(' ');
                return (
                  <View key={pat.id} style={styles.buttonContainer}>
                    <View style={styles.labelContainer}>
                      <Text style={styles.buttonLabel}>{parts[0]}</Text>
                      {parts[1] && <Text style={styles.buttonLabel}>{parts[1]}</Text>}
                    </View>
                    <Pressable
                      style={styles.rhythmButton}
                      onPress={() => toggle(pat.id, pat.steps)}
                    >
                      <Image source={on ? require('../../assets/rect-button-pressed.png') : require('../../assets/rect-button.png')} style={styles.rectButtonImage} />
                    </Pressable>
                  </View>
                );
              })}
            </View>

            <View style={{ height: '7%' }} />

            <View style={styles.buttonRowContainer}>
              {bottomPatterns.map((pat) => {
                const on = selected.includes(pat.id);
                const parts = pat.name.toUpperCase().split(' ');
                return (
                  <View key={pat.id} style={styles.buttonContainer}>
                    <View style={styles.labelContainer}>
                      <Text style={styles.buttonLabel}>{parts[0]}</Text>
                      {parts[1] && <Text style={styles.buttonLabel}>{parts[1]}</Text>}
                    </View>
                    <Pressable
                      style={styles.rhythmButton}
                      onPress={() => toggle(pat.id, pat.steps)}
                    >
                      <Image source={on ? require('../../assets/rect-button-pressed.png') : require('../../assets/rect-button.png')} style={styles.rectButtonImage} />
                    </Pressable>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Bottom controls */}
          <View style={styles.bottomControls}>
            {/* Mute triggers + Start */}
            <View style={styles.triggerColumn}>
              <Text style={styles.cancelSectionLabel}>CANCEL</Text>
              {MUTE_VOICES.map(({ id, label }) => (
                <Pressable
                  key={id}
                  style={styles.triggerRow}
                  onPress={() => toggleMute(id)}
                >
                  <View style={styles.roundButton}>
                    <Image source={mutes[id] ? require('../../assets/round-button-pressed.png') : require('../../assets/round-button.png')} style={styles.roundButtonImage} />
                  </View>
                  <Text style={styles.triggerLabel}>{label}</Text>
                  <View style={styles.triggerLabelLine} />
                </Pressable>
              ))}

              <Pressable
                style={[styles.triggerRow, { marginTop: 'auto', marginBottom: '15%' }]}
                onPress={() => setRunning(!running)}
              >
                <View style={styles.roundButton}>
                  <Image source={running ? require('../../assets/round-button-pressed.png') : require('../../assets/round-button.png')} style={styles.roundButtonImage} />
                </View>
                <Text style={styles.triggerLabel}>START</Text>
                <View style={[styles.triggerLabelLine, { width: 40 }]} />
              </Pressable>
            </View>

            {/* Knobs */}
            <View style={styles.dialColumn}>
              <View style={styles.knobContainer}>
                <Text style={styles.knobLabel}>TEMPO</Text>
                <View style={styles.tempoMarks}>
                  <Text style={[styles.knobMark, { top: 48, left: -15 }]}>22</Text>
                  <Text style={[styles.knobMark, { top: 24, left: -17 }]}>24</Text>
                  <Text style={[styles.knobMark, { top: 4, left: -8 }]}>27</Text>
                  <Text style={[styles.knobMark, { top: -10, left: 12 }]}>30</Text>
                  <Text style={[styles.knobMark, { top: -14, left: 35 }]}>35</Text>
                  <Text style={[styles.knobMark, { top: -10, left: 58 }]}>40</Text>
                  <Text style={[styles.knobMark, { top: 4, left: 74 }]}>50</Text>
                  <Text style={[styles.knobMark, { top: 24, left: 82 }]}>60</Text>
                  <Text style={[styles.knobMark, { top: 48, left: 80 }]}>75</Text>
                </View>
                <View style={styles.blackKnobSizer}>
                  <Knob
                    min={40} max={240}
                    value={bpm} onChange={setBpm}
                    image={require('../../assets/black-knob.png')}
                  />
                </View>
              </View>

              <View style={[styles.knobContainer, { marginTop: 30 }]}>
                <Text style={styles.knobLabel}>VOLUME</Text>
                <View style={[styles.blackKnobSizer, { width: 90, height: 90, marginTop: 10 }]}>
                  <Knob
                    min={0} max={1}
                    value={volume} onChange={setVolume}
                    image={require('../../assets/silver-knob.png')}
                  />
                </View>
                <View style={styles.powerIndicator}>
                  <Image source={running ? require('../../assets/red-light-on.png') : require('../../assets/red-light-off.png')} style={styles.roundButtonImage} />
                </View>
                <Text style={styles.volumeOffLabel}>OFF</Text>
              </View>
            </View>
          </View>

        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  internalUI: {
    flex: 1,
    paddingTop: '38%', // push Title down enough to clear shadow
  },
  header: {
    marginBottom: '2%', // adaptive
    alignItems: 'flex-start',
    paddingHorizontal: '10%',
  },
  titleText: {
    fontSize: 32,
    fontWeight: '900',
    fontFamily: 'Impact',
    letterSpacing: 1,
    color: '#2a2a2a',
  },
  subTitle: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Helvetica',
    letterSpacing: 0,
  },
  headerLine: {
    height: 1,
    backgroundColor: '#333',
    marginTop: 2,
    width: '100%',
  },
  gridSection: {
    marginTop: '5%', // prominently push the rectangular buttons down
    alignItems: 'center',
    width: '100%',
  },
  buttonRowContainer: {
    flexDirection: 'row',
    width: '95%',
    justifyContent: 'center',
    marginTop: '5%',
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 0,
  },
  labelContainer: {
    position: 'absolute',
    bottom: '100%',
    marginBottom: 6,
    width: 60,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  buttonLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#333',
    textAlign: 'center',
    lineHeight: 10,
  },
  rhythmButton: {
    width: '100%',
    aspectRatio: 96 / 212,
  },
  rectButtonImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
  bottomControls: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '10%',
    marginBottom: '10%',
    paddingHorizontal: '5%',
  },
  triggerColumn: {
    flex: 1,
    paddingTop: 10,
    paddingLeft: 16,
  },
  triggerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '4%', // group radios closer together
    height: 30,
  },
  roundButton: {
    width: 28,
    height: 28,
  },
  roundButtonImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  cancelSectionLabel: {
    position: 'absolute',
    top: -18,
    left: 0,
    width: 70,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    fontStyle: 'italic',
    fontFamily: 'Times New Roman',
    color: '#2a2a2a',
  },
  triggerLabel: {
    fontSize: 15,
    fontWeight: '700',
    fontStyle: 'italic',
    marginLeft: 18,
    color: '#2a2a2a',
    fontFamily: 'Times New Roman',
  },
  triggerLabelLine: {
    position: 'absolute',
    left: 45,
    bottom: 0,
    width: 80,
    height: 1,
    backgroundColor: '#333',
  },
  dialColumn: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    paddingRight: 10,
    flex: 1,
  },
  knobContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: '10%',
  },
  blackKnobSizer: {
    width: 75,
    height: 75,
    marginTop: 15,
  },
  knobLabel: {
    fontSize: 14,
    fontWeight: '700',
    fontStyle: 'italic',
    fontFamily: 'Times New Roman',
    color: '#222',
    marginTop: -4,
    marginBottom: 4,
  },
  tempoMarks: {
    position: 'absolute',
    top: 30,
    left: 0,
    width: '100%',
    height: '100%',
  },
  knobMark: {
    position: 'absolute',
    fontSize: 10,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Times New Roman',
  },
  volumeOffLabel: {
    position: 'absolute',
    bottom: -5,
    left: -15,
    fontSize: 12,
    fontWeight: '700',
    fontStyle: 'italic',
    fontFamily: 'Times New Roman',
    color: '#a00',
  },
  powerIndicator: {
    position: 'absolute',
    right: 25,
    top: -37,
    width: 32,
    height: 32,
  },
});
