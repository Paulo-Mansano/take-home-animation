import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { LAYOUT } from '../constants/layout';
import { numberDuration, easingCurve } from '../animations/timings';

const { NUMBER_LINE_HEIGHT, NUMBER_FONT_SIZE } = LAYOUT;

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

type NumberSliderProps = {
  targetValue: number;
  initialValue?: number;
};

export const NumberSlider = React.memo(function NumberSlider({
  targetValue,
  initialValue = 0,
}: NumberSliderProps) {
  const progress = useSharedValue(initialValue);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: -progress.value * NUMBER_LINE_HEIGHT },
    ],
  }));

  useEffect(() => {
    const clamped = Math.min(9, Math.max(0, Math.round(targetValue)));
    progress.value = withTiming(clamped, {
      duration: numberDuration,
      easing: easingCurve,
    });
  }, [targetValue]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.stack, animatedStyle]}>
        {DIGITS.map((digit) => (
          <View key={digit} style={styles.cell}>
            <Text style={styles.digit}>{digit}</Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    height: NUMBER_LINE_HEIGHT,
    overflow: 'hidden',
  },
  stack: {
    flexDirection: 'column',
  },
  cell: {
    height: NUMBER_LINE_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  digit: {
    fontSize: NUMBER_FONT_SIZE,
    fontWeight: '700',
  },
});
