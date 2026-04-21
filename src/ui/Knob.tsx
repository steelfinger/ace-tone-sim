import React, { useCallback, useEffect } from 'react';
import { Image, LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { scheduleOnRN } from 'react-native-worklets';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

type Props = {
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
  image: any;
};

export function Knob({ min, max, value, onChange, image }: Props) {
  // -135° at min, +135° at max — initialized once, then owned by the gesture
  const rot = useSharedValue(((value - min) / (max - min)) * 270 - 135);

  // Tracks the latest prop value so onBegin always starts from the right place
  const valueRef = useSharedValue(value);
  useEffect(() => { valueRef.value = value; }, [value, valueRef]);

  const cx = useSharedValue(0);
  const cy = useSharedValue(0);
  const startAngle = useSharedValue(0);
  const startValue = useSharedValue(value);
  const currentValue = useSharedValue(value);
  const lastNotify = useSharedValue(0);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    cx.value = e.nativeEvent.layout.width / 2;
    cy.value = e.nativeEvent.layout.height / 2;
  }, [cx, cy]);

  const notify = useCallback((v: number) => onChange(v), [onChange]);

  const pan = Gesture.Pan()
    .onBegin(e => {
      startAngle.value = Math.atan2(e.y - cy.value, e.x - cx.value);
      startValue.value = valueRef.value;
      currentValue.value = valueRef.value;
    })
    .onUpdate(e => {
      const angle = Math.atan2(e.y - cy.value, e.x - cx.value);
      let delta = angle - startAngle.value;
      if (delta > Math.PI) delta -= 2 * Math.PI;
      if (delta < -Math.PI) delta += 2 * Math.PI;
      const next = Math.max(min, Math.min(max,
        startValue.value + delta * (max - min) / Math.PI
      ));
      rot.value = ((next - min) / (max - min)) * 270 - 135;
      currentValue.value = next;
      const now = Date.now();
      if (now - lastNotify.value > 50) {
        lastNotify.value = now;
        scheduleOnRN(notify, next);
      }
    })
    .onEnd(() => {
      scheduleOnRN(notify, currentValue.value);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rot.value}deg` }],
  }));

  return (
    <GestureDetector gesture={pan}>
      {/* Stable wrapper owns layout measurement — not affected by rotation transform */}
      <View style={styles.container} onLayout={onLayout}>
        <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
          <Image source={image} style={styles.image} />
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
