import type { SharedValue } from 'react-native-reanimated';
import { useAnimatedReaction, useDerivedValue, useSharedValue } from 'react-native-reanimated';

function roundToHalf(x: number): number {
  'worklet';
  return Math.round(x * 2) / 2;
}

function indicesFromSnapped(snapped: number): {
  tens: number;
  units: number;
  decimalIndex: number;
  decimalWheelPosition: number;
} {
  'worklet';
  const int = Math.floor(snapped);
  const decimalPart = snapped % 1;
  // Decimal: 0 → índice 0, 0.5 → índice 1 (evita fronteira 0.25 e flutuação)
  const decimalIndex = Math.round(decimalPart * 2) % 2;
  // Posição monotônica do “wheel” (só avança), para coluna decimal sem reset visual
  const decimalWheelPosition = Math.floor(snapped * 2) * 5;
  return {
    tens: Math.floor(int / 10),
    units: int % 10,
    decimalIndex,
    decimalWheelPosition,
  };
}

export function useOdometerLogic(
  value: SharedValue<number>,
  initialValue: number = 0
) {
  const initialSnapped = roundToHalf(initialValue);
  const initial = indicesFromSnapped(initialSnapped);

  const tensIndex = useSharedValue(initial.tens);
  const unitsIndex = useSharedValue(initial.units);
  const decimalIndex = useSharedValue(initial.decimalIndex);
  const decimalWheelPosition = useSharedValue(initial.decimalWheelPosition);

  // Derivar sempre do valor SNAPPED para evitar oscilação por float (0.4999/0.5001)
  const snappedValue = useDerivedValue(() => roundToHalf(value.value));

  useAnimatedReaction(
    () => snappedValue.value,
    (snapped) => {
      'worklet';
      const idx = indicesFromSnapped(snapped);
      tensIndex.value = idx.tens;
      unitsIndex.value = idx.units;
      decimalIndex.value = idx.decimalIndex;
      decimalWheelPosition.value = idx.decimalWheelPosition;
    }
  );

  return { tensIndex, unitsIndex, decimalIndex, decimalWheelPosition, snappedValue };
}
