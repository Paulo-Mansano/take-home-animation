import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import type { SharedValue } from 'react-native-reanimated';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { LAYOUT } from '../constants/layout';
import { COLORS } from '../constants/theme';

const TRACK_HEIGHT = 8;
const THUMB_SIZE = 20;

function roundToHalf(x: number): number {
  'worklet';
  return Math.round(x * 2) / 2;
}

function clamp(x: number, min: number, max: number): number {
  'worklet';
  return Math.min(max, Math.max(min, x));
}

type WaterSliderBarProps = {
  valueRef: SharedValue<number>;
  initialValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number) => void;
};

export const WaterSliderBar = React.memo(function WaterSliderBar({
  valueRef,
  initialValue,
  min = 0,
  max = 32,
  step = 0.5,
  onValueChange,
}: WaterSliderBarProps) {
  const trackWidthRef = useSharedValue(0);
  const dragStartValue = useSharedValue(min);
  const lastNotifiedValue = useSharedValue(initialValue ?? min);

  const thumbStyle = useAnimatedStyle(() => {
    const w = trackWidthRef.value;
    if (w <= 0) return { transform: [{ translateX: 0 }] };
    const range = max - min;
    const thumbRange = w - THUMB_SIZE;
    const x = (valueRef.value - min) / range;
    const translateX = x * thumbRange;
    return { transform: [{ translateX }] };
  });

  const fillStyle = useAnimatedStyle(() => {
    const w = trackWidthRef.value;
    if (w <= 0) return { width: 0 };
    const range = max - min;
    const pct = (valueRef.value - min) / range;
    return { width: pct * w };
  });

  const panGesture = Gesture.Pan()
    .onStart(() => {
      'worklet';
      dragStartValue.value = valueRef.value;
    })
    .onUpdate((e) => {
      'worklet';
      const w = trackWidthRef.value;
      if (w <= 0) return;
      const range = max - min;
      const deltaValue = (e.translationX / w) * range;
      const next = clamp(
        roundToHalf(dragStartValue.value + deltaValue),
        min,
        max
      );
      valueRef.value = next;
      if (onValueChange && next !== lastNotifiedValue.value) {
        lastNotifiedValue.value = next;
        runOnJS(onValueChange)(next);
      }
    });

  return (
    <GestureDetector gesture={panGesture}>
      <View
        style={styles.track}
        onLayout={(e) => {
          trackWidthRef.value = e.nativeEvent.layout.width;
        }}
      >
        <Animated.View style={[styles.fill, fillStyle]} />
        <Animated.View style={[styles.thumb, thumbStyle]} />
      </View>
    </GestureDetector>
  );
});

const styles = StyleSheet.create({
  track: {
    height: TRACK_HEIGHT,
    backgroundColor: COLORS.blueDark,
    borderRadius: 4,
    justifyContent: 'center',
    marginBottom: LAYOUT.SPACING_SM,
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: COLORS.blueLight,
    borderRadius: 4,
  },
  thumb: {
    position: 'absolute',
    left: 0,
    top: -(THUMB_SIZE - TRACK_HEIGHT) / 2,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: COLORS.white,
  },
});
