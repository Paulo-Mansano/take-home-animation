import { Easing } from 'react-native-reanimated';

export const overlayDuration = 500;
export const numberDuration = 1200;
export const odometerDuration = 200;
export const decimalOdometerDuration = 120;
export const statItemDuration = 400;
export const statItemStagger = 80;
export const statItemInitialDelay = 200;

export const easingCurve = Easing.bezier(0.25, 0.1, 0.25, 1);

export const delays = {
  statItemDelay: statItemInitialDelay,
  statItemStagger,
} as const;
