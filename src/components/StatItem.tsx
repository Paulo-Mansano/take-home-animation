import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { LAYOUT } from '../constants/layout';
import {
  statItemDuration,
  statItemStagger,
  statItemInitialDelay,
  easingCurve,
} from '../animations/timings';

type StatItemProps = {
  label: string;
  value: string;
  index?: number;
};

export const StatItem = React.memo(function StatItem({
  label,
  value,
  index = 0,
}: StatItemProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    const delay = statItemInitialDelay + index * statItemStagger;
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: statItemDuration, easing: easingCurve })
    );
    scale.value = withDelay(
      delay,
      withTiming(1, { duration: statItemDuration, easing: easingCurve })
    );
  }, [index]);

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingVertical: LAYOUT.SPACING_SM,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
  },
});
