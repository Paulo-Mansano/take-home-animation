import { useEffect } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { LAYOUT } from '../constants/layout';
import { overlayDuration, easingCurve } from './timings';

const { SCREEN_HEIGHT } = LAYOUT;

type Options = {
  autoRun?: boolean;
};

export function useSlideUpAnimation(options: Options = {}) {
  const { autoRun = true } = options;
  const translateY = useSharedValue(SCREEN_HEIGHT);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const runAnimation = () => {
    translateY.value = withTiming(0, {
      duration: overlayDuration,
      easing: easingCurve,
    });
  };

  const runCloseAnimation = (onComplete?: () => void) => {
    translateY.value = withTiming(
      SCREEN_HEIGHT,
      {
        duration: overlayDuration,
        easing: easingCurve,
      },
      (finished) => {
        'worklet';
        if (finished && onComplete) {
          scheduleOnRN(onComplete);
        }
      }
    );
  };

  const reset = () => {
    translateY.value = SCREEN_HEIGHT;
  };

  useEffect(() => {
    if (autoRun) {
      runAnimation();
    }
  }, [autoRun]);

  return { animatedStyle, runAnimation, runCloseAnimation, reset };
}
