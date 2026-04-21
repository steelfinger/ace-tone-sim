import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native';
import { useSeq } from '../state/sequencer';
import { PATTERNS } from '../patterns';
import { Knob } from './Knob';
import { RectangularButton } from './RectangularButton';
import { LabeledRoundButton } from './LabeledRoundButton';
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

  const [lit, setLit] = useState(false);
  useEffect(() => {
    if (!running) {
      setLit(false);
      return;
    }
    const beatMs = (60 / bpm) * 1000;
    let offTimer: ReturnType<typeof setTimeout>;
    const flash = () => {
      setLit(true);
      offTimer = setTimeout(() => setLit(false), 80);
    };
    flash();
    const interval = setInterval(flash, beatMs);
    return () => {
      clearInterval(interval);
      clearTimeout(offTimer);
      setLit(false);
    };
  }, [running, bpm]);

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
              {topPatterns.map((pat) => (
                <RectangularButton
                  key={pat.id}
                  pat={pat}
                  selected={selected.includes(pat.id)}
                  onPress={() => toggle(pat.id, pat.steps)}
                />
              ))}
            </View>

            <View style={{ height: '7%' }} />

            <View style={styles.buttonRowContainer}>
              {bottomPatterns.map((pat) => (
                <RectangularButton
                  key={pat.id}
                  pat={pat}
                  selected={selected.includes(pat.id)}
                  onPress={() => toggle(pat.id, pat.steps)}
                />
              ))}
            </View>
          </View>

          {/* Bottom controls */}
          <View style={styles.bottomControls}>
            {/* Mute triggers + Start */}
            <View style={styles.triggerColumn}>
              <Text style={styles.cancelSectionLabel}>CANCEL</Text>
              {MUTE_VOICES.map(({ id, label }) => (
                <LabeledRoundButton
                  key={id}
                  label={label}
                  pressed={!!mutes[id]}
                  onPress={() => toggleMute(id)}
                />
              ))}

              <View style={{ marginTop: 'auto', marginBottom: 16 }}>
                <LabeledRoundButton
                  label="START"
                  pressed={running}
                  onPress={() => setRunning(!running)}
                />
              </View>
            </View>

            {/* Knobs */}
            <View style={styles.dialColumn}>
              <View style={styles.knobContainer}>
                <Text style={styles.knobLabel}>TEMPO</Text>
                <View style={styles.tempoKnobScale}>
                  <Image source={require('../../assets/tempo-scale.png')} style={{ width: 136, height: 136, resizeMode: 'contain' }} />
                </View>
                <View style={styles.blackKnobSizer}>
                  <Image source={require('../../assets/round-shadow.png')} style={styles.knobShadowImage} />
                  <Knob
                    min={40} max={240}
                    value={bpm} onChange={setBpm}
                    image={require('../../assets/black-knob.png')}
                  />
                </View>
              </View>

              <View style={[styles.knobContainer, { marginTop: 40 }]}>
                <Text style={styles.knobLabel}>VOLUME</Text>
                <View style={styles.volumeKnobScale}>
                  <Image source={require('../../assets/volume-scale.png')} style={{ width: 112, height: 112, resizeMode: 'contain' }} />
                </View>
                <View style={styles.powerIndicator}>
                  <Image source={lit ? require('../../assets/red-light-on.png') : require('../../assets/red-light-off.png')} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
                </View>
                <View style={styles.volumeKnobSizer}>
                  <Image source={require('../../assets/round-shadow.png')} style={[styles.knobShadowImage, { width: 90, height: 90 }]} />
                  <Knob
                    min={0} max={1}
                    value={volume} onChange={setVolume}
                    image={require('../../assets/silver-knob.png')}
                  />
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
    overflow: 'visible',
  },
  bottomControls: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '5%',
    marginBottom: 40,
    marginLeft: 20,
    marginRight: 40,
  },
  triggerColumn: {
    flex: 1,
    paddingTop: 20,
    paddingLeft: 16,
  },
  cancelSectionLabel: {
    position: 'absolute',
    top: -12,
    left: 0,
    width: 70,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    fontStyle: 'italic',
    fontFamily: 'Times New Roman',
    color: '#2a2a2a',
  },
  dialColumn: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flex: 1,
  },
  knobContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
    marginBottom: 10,
  },
  blackKnobSizer: {
    width: 82,
    height: 82,
    marginTop: 20,
    overflow: 'visible',
  },
  volumeKnobSizer: {
    width: 90, 
    height: 90, 
    marginTop: 10,
    overflow: 'visible',
  },
  knobShadowImage: {
    position: 'absolute',
    width: 80,
    height: 80,
    top: 15,
    opacity: 0.7,
  },
  knobLabel: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    fontStyle: 'italic',
    fontFamily: 'Times New Roman',
    color: '#222',
    marginTop: -4,
    marginBottom: 4,
  },
  tempoKnobScale: {
    position: 'absolute',
    top: 5,
  },
  volumeKnobScale: {
    position: 'absolute',
    top: 19,
  },
  volumeOffLabel: {
    position: 'absolute',
    bottom: -5,
    left: -25,
    fontSize: 12,
    fontWeight: '700',
    fontStyle: 'italic',
    fontFamily: 'Times New Roman',
  },
  powerIndicator: {
    position: 'absolute',
    right: 25,
    top: -37,
    width: 32,
    height: 32,
  },
});
