import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { RoundButton } from './RoundButton';

type Props = {
  label: string;
  pressed: boolean;
  onPress: () => void;
};

// Geometry (all values in px, relative to the row's top-left):
//   Row height: 40  —  button: 28×28 at top-left
//   Diagonal: from button bottom-right (28, 28) → underline start (40, 39)
//   dx=12, dy=11  →  length≈16.3px, angle≈42.5° clockwise from horizontal
//   Rotated-view centre: ((28+40)/2, (28+39)/2) = (34, 33.5)
//   View: width=17, height=1  →  top=33, left=26

export function LabeledRoundButton({ label, pressed, onPress }: Props) {
  return (
    <Pressable style={styles.row} onPress={onPress} accessible accessibilityRole="button">
      {/* Diagonal connector: button bottom-right → underline left edge */}
      <View style={styles.diagonal} />
      <RoundButton pressed={pressed} />
      <View style={styles.labelArea}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.line} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    height: 40,
    marginBottom: '3%',
    position: 'relative',
    overflow: 'visible',
  },
  diagonal: {
    position: 'absolute',
    width: 15,
    height: 1,
    backgroundColor: '#333',
    top: 26,
    left: 15,
    transform: [{ rotate: '42.5deg' }],
  },
  labelArea: {
    paddingLeft: 12,   // line starts at x=28+12=40, matching diagonal endpoint
    justifyContent: 'flex-end',
    flex: 1,
    height: 32,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    fontStyle: 'italic',
    color: '#2a2a2a',
    fontFamily: 'Times New Roman',
    marginBottom: 3,
  },
  line: {
    position: 'absolute',
    left: 0,           // x=40 in row coords — meets the diagonal's right endpoint
    right: 0,
    bottom: 0,
    height: 1,
    backgroundColor: '#333',
  },
});
