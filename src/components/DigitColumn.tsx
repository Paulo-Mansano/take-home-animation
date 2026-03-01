import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { odometerDuration, easingCurve } from '../animations/timings';

type DigitColumnProps = {
  digits: readonly string[];
  targetIndex: SharedValue<number>;
  rowHeight: number;
  fontSize?: number;
  initialIndex?: number;
  /** Para coluna decimal: usa targetIndex % mod para posição na strip repetida (evita reset visual) */
  mod?: number;
  /** Duração da animação em ms; se não informado, usa odometerDuration (decimal pode usar valor menor) */
  duration?: number;
};

export const DigitColumn = React.memo(function DigitColumn({
  digits,
  targetIndex,
  rowHeight,
  fontSize = 24,
  initialIndex = 0,
  mod,
  duration,
}: DigitColumnProps) {
  const displayIndex = useSharedValue(initialIndex);
  const durationMs = duration ?? odometerDuration;

  useAnimatedReaction(
    () => {
      'worklet';
      const raw = targetIndex.value;
      return mod !== undefined ? raw % mod : raw;
    },
    (effectiveTarget) => {
      'worklet';
      // Só anima quando o alvo realmente muda (evita restart = micro-congelamento)
      if (effectiveTarget === displayIndex.value) return;
      displayIndex.value = withTiming(effectiveTarget, {
        duration: durationMs,
        easing: easingCurve,
      });
    }
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -displayIndex.value * rowHeight }],
  }));

  return (
    <View style={[styles.container, { height: rowHeight }]}>
      <Animated.View style={[styles.stack, animatedStyle]}>
        {digits.map((digit, i) => (
          <View key={i} style={[styles.cell, { height: rowHeight }]}>
            <Text style={[styles.digit, { fontSize }]}>{digit}</Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  stack: {
    flexDirection: 'column',
  },
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  digit: {
    fontWeight: '700',
  },
});
