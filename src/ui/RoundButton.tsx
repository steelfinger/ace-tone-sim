import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

type Props = {
  pressed: boolean;
};

export function RoundButton({ pressed }: Props) {
  return (
    <View style={styles.wrapper}>
      {!pressed && <Image source={require('../../assets/round-shadow.png')} style={styles.shadow} />}
      <View style={styles.button}>
        <Image
          source={pressed ? require('../../assets/round-button-pressed.png') : require('../../assets/round-button.png')}
          style={styles.image}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 28,
    height: 28,
    overflow: 'visible',
  },
  button: {
    width: 28,
    height: 28,
  },
  shadow: {
    position: 'absolute',
    width: 32,
    height: 32,
    top: 4,
    left: 0,
    opacity: 0.4,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
