import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, runOnJS } from 'react-native-reanimated';

type Props = {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
  display?: string;
};

export function Knob({ label, min, max, value, onChange, display }: Props) {
  // -135° at min, +135° at max
  const angle = ((value - min) / (max - min)) * 270 - 135;
  const rot = useSharedValue(angle);
  rot.value = angle;

  const pan = Gesture.Pan()
    .onUpdate(e => {
      const delta = -e.translationY; // drag up = increase
      const sensitivity = (max - min) / 200; // 200 px full sweep
      const next = Math.max(min, Math.min(max, value + delta * sensitivity));
      runOnJS(onChange)(next);
    });

  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rot.value}deg` }],
  }));

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.knob, style]}>
          <View style={styles.indicator} />
        </Animated.View>
      </GestureDetector>
      {display !== undefined && <Text style={styles.display}>{display}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  label: { fontSize: 11, color: '#3a2a18', marginBottom: 4, letterSpacing: 1 },
  knob: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2a2018',
    borderWidth: 3,
    borderColor: '#5a4028',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 6,
  },
  indicator: { width: 3, height: 18, backgroundColor: '#f5efe0', borderRadius: 1 },
  display: { fontSize: 11, color: '#3a2a18', marginTop: 4 },
});
