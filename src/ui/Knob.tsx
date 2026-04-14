import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, runOnJS } from 'react-native-reanimated';

type Props = {
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
  image: any;
};

export function Knob({ min, max, value, onChange, image }: Props) {
  // -135° at min, +135° at max
  const angle = ((value - min) / (max - min)) * 270 - 135;
  const rot = useSharedValue(angle);
  rot.value = angle; // sync on render

  const pan = Gesture.Pan()
    .onUpdate(e => {
      const delta = -e.translationY; // drag up = increase
      const sensitivity = (max - min) / 200; // 200 px drag for full sweep
      const next = Math.max(min, Math.min(max, value + delta * sensitivity));
      runOnJS(onChange)(next);
    });

  const style = useAnimatedStyle(() => ({
    flex: 1, // fill container size from parent absolute positioning
    transform: [{ rotate: `${rot.value}deg` }],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={style}>
        <Image source={image} style={styles.image} />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
