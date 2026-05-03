import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useSeq } from '../state/sequencer';

const FLASH_MS = 80;

export function PowerIndicator() {
  const running = useSeq(s => s.running);
  const currentStep = useSeq(s => s.currentStep);
  const pattern = useSeq(s => s.getPattern());
  const [lit, setLit] = useState(false);

  // Pulse on every quarter-note. 16-step grids = 16ths (÷4); 12-step waltz = 8ths (÷2).
  const stepDiv = pattern?.steps === 12 ? 2 : 4;

  useEffect(() => {
    if (!running) { setLit(false); return; }
    if (currentStep % stepDiv !== 0) return;
    setLit(true);
    const t = setTimeout(() => setLit(false), FLASH_MS);
    return () => clearTimeout(t);
  }, [running, currentStep, stepDiv]);

  return (
    <View style={styles.indicator}>
      <Image
        source={lit
          ? require('../../assets/red-light-on.png')
          : require('../../assets/red-light-off.png')}
        style={styles.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  indicator: {
    position: 'absolute',
    right: 25,
    top: -37,
    width: 32,
    height: 32,
  },
  image: { width: '100%', height: '100%', resizeMode: 'contain' },
});
