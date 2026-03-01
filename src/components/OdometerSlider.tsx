import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import type { SharedValue } from 'react-native-reanimated';
import { useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { DigitColumn } from './DigitColumn';
import { useOdometerLogic } from '../animations/useOdometerLogic';
import { decimalOdometerDuration } from '../animations/timings';
import { LAYOUT } from '../constants/layout';
import { COLORS } from '../constants/theme';

const TENS_DIGITS = ['0', '1', '2', '3'] as const;
const UNITS_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;
// 0–9 repetidos 3x: spin passa por vários dígitos mas valor final só .0 ou .5
const DECIMAL_DIGITS = Array.from({ length: 30 }, (_, i) => String(i % 10)) as readonly string[];
const DECIMAL_MOD = 30;

const STEP = 0.5;
const DRAG_SENSITIVITY = 0.02;

function roundToHalf(x: number): number {
  'worklet';
  return Math.round(x * 2) / 2;
}

function clamp(x: number, min: number, max: number): number {
  'worklet';
  return Math.min(max, Math.max(min, x));
}

type OdometerSliderProps = {
  valueRef?: SharedValue<number>;
  initialValue?: number;
  min?: number;
  max?: number;
  onValueChange?: (value: number) => void;
};

export const OdometerSlider = React.memo(function OdometerSlider({
  valueRef: valueRefProp,
  initialValue = 12,
  min = 0,
  max = 32,
  onValueChange,
}: OdometerSliderProps) {
  const internalValue = useSharedValue(roundToHalf(initialValue));
  const value = valueRefProp ?? internalValue;
  const dragStartValue = useSharedValue(initialValue);
  const lastNotifiedValue = useSharedValue(roundToHalf(initialValue));
  const { tensIndex, unitsIndex, decimalWheelPosition } = useOdometerLogic(
    value,
    roundToHalf(initialValue)
  );
  const initialSnapped = roundToHalf(initialValue);
  const initialDecimalPosition = (Math.floor(initialSnapped * 2) * 5) % DECIMAL_MOD;

  const rowHeight = LAYOUT.ODOMETER_ROW_HEIGHT;
  const fontSize = LAYOUT.ODOMETER_FONT_SIZE;

  const panGesture = Gesture.Pan()
    .onStart(() => {
      'worklet';
      dragStartValue.value = value.value;
    })
    .onUpdate((e) => {
      'worklet';
      const delta = -e.translationY * DRAG_SENSITIVITY;
      const next = clamp(
        roundToHalf(dragStartValue.value + delta),
        min,
        max
      );
      value.value = next;
      if (onValueChange && next !== lastNotifiedValue.value) {
        lastNotifiedValue.value = next;
        scheduleOnRN(onValueChange, next);
      }
    });

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.row}>
        <DigitColumn
          digits={TENS_DIGITS}
          targetIndex={tensIndex}
          rowHeight={rowHeight}
          fontSize={fontSize}
          initialIndex={Math.floor(roundToHalf(initialValue) / 10)}
        />
        <DigitColumn
          digits={UNITS_DIGITS}
          targetIndex={unitsIndex}
          rowHeight={rowHeight}
          fontSize={fontSize}
          initialIndex={Math.floor(roundToHalf(initialValue)) % 10}
        />
        <Text style={styles.decimalDot}>.</Text>
        <DigitColumn
          digits={DECIMAL_DIGITS}
          targetIndex={decimalWheelPosition}
          rowHeight={rowHeight}
          fontSize={fontSize}
          initialIndex={initialDecimalPosition}
          mod={DECIMAL_MOD}
          duration={decimalOdometerDuration}
        />
        <Text style={styles.unit}>oz</Text>
      </View>
    </GestureDetector>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  decimalDot: {
    fontSize: LAYOUT.ODOMETER_FONT_SIZE,
    fontWeight: '700',
    color: COLORS.white,
    marginHorizontal: 2,
  },
  unit: {
    fontSize: LAYOUT.ODOMETER_FONT_SIZE,
    fontWeight: '700',
    color: COLORS.white,
    marginLeft: LAYOUT.SPACING_SM,
  },
});
