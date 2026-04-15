import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import type { Pattern } from '../patterns';

type Props = {
  pat: Pattern;
  selected: boolean;
  onPress: () => void;
};

export function RectangularButton({ pat, selected, onPress }: Props) {
  const label = (pat.displayName ?? pat.name).toUpperCase();
  const parts = label.split(' ');
  const spacing = pat.letterSpacing ?? 0;

  return (
    <View style={styles.buttonContainer}>
      <View style={styles.labelContainer}>
        <Text style={[styles.buttonLabel, { letterSpacing: spacing }]}>{parts[0]}</Text>
        {parts[1] && <Text style={[styles.buttonLabel, { letterSpacing: spacing }]}>{parts[1]}</Text>}
      </View>
      <View style={styles.rhythmButtonWrapper}>
        {!selected && <Image source={require('../../assets/rect-shadow.png')} style={styles.rectShadowImage} />}
        <Pressable style={styles.rhythmButton} onPress={onPress}>
          <Image
            source={selected ? require('../../assets/rect-button-pressed.png') : require('../../assets/rect-button.png')}
            style={styles.rectButtonImage}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 0,
    overflow: 'visible',
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
  rhythmButtonWrapper: {
    width: '100%',
    aspectRatio: 96 / 212,
    overflow: 'visible',
  },
  rhythmButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  rectShadowImage: {
    position: 'absolute',
    width: '100%',
    height: 64,
    bottom: -15,
    left: 0,
  },
  rectButtonImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
});
