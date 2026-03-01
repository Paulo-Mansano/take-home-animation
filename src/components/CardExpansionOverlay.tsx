import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  SharedValue,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { LAYOUT } from '../constants/layout';

const EXPANSION_DURATION_MS = 750;
const EXPANSION_EASING = Easing.bezier(0.22, 1, 0.36, 1);
const DEVICE_BORDER_RADIUS = Platform.OS === 'ios' ? 38 : 28;

export type TriggerLayout = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type CardExpansionOverlayProps = {
  triggerLayout: TriggerLayout;
  progress: SharedValue<number>;
  onExpansionComplete: () => void;
  renderContent: () => React.ReactNode;
};

/**
 * Card expansion overlay: a surface grows from the icon position as a circle
 * (phase 1), then morphs into the device screen rectangle (phase 2).
 * Content is always rendered at full viewport size inside the card.
 */
export const CardExpansionOverlay = React.memo(function CardExpansionOverlay({
  triggerLayout,
  progress,
  onExpansionComplete,
  renderContent,
}: CardExpansionOverlayProps) {
  const screenWidth = LAYOUT.SCREEN_WIDTH;
  const screenHeight = LAYOUT.SCREEN_HEIGHT;

  const iconCenterX = triggerLayout.x + triggerLayout.width / 2;
  const iconCenterY = triggerLayout.y + triggerLayout.height / 2;
  const iconWidth = triggerLayout.width;
  const iconHeight = triggerLayout.height;

  const maxCircleSize = Math.max(screenWidth, screenHeight);

  useEffect(() => {
    progress.value = withTiming(
      1,
      { duration: EXPANSION_DURATION_MS, easing: EXPANSION_EASING },
      (finished) => {
        if (finished) {
          runOnJS(onExpansionComplete)();
        }
      }
    );
  }, [onExpansionComplete, progress]);

  const cardStyle = useAnimatedStyle(() => {
    'worklet';
    const p = progress.value;

    const w = interpolate(
      p, [0, 0.75, 1],
      [iconWidth, maxCircleSize, screenWidth],
      Extrapolation.CLAMP,
    );
    const h = interpolate(
      p, [0, 0.75, 1],
      [iconHeight, maxCircleSize, screenHeight],
      Extrapolation.CLAMP,
    );
    const l = interpolate(
      p, [0, 0.75, 1],
      [iconCenterX - iconWidth / 2, iconCenterX - maxCircleSize / 2, 0],
      Extrapolation.CLAMP,
    );
    const t = interpolate(
      p, [0, 0.75, 1],
      [iconCenterY - iconHeight / 2, iconCenterY - maxCircleSize / 2, 0],
      Extrapolation.CLAMP,
    );
    const br = interpolate(
      p, [0, 0.75, 1],
      [iconWidth / 2, maxCircleSize / 2, DEVICE_BORDER_RADIUS],
      Extrapolation.CLAMP,
    );

    return {
      position: 'absolute' as const,
      width: w,
      height: h,
      left: l,
      top: t,
      borderRadius: br,
      overflow: 'hidden' as const,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: interpolate(p, [0, 0.4, 1], [0.4, 0.25, 0], Extrapolation.CLAMP),
      shadowRadius: 24,
      elevation: interpolate(p, [0, 0.4, 1], [16, 12, 0], Extrapolation.CLAMP),
    };
  });

  const contentStyle = useAnimatedStyle(() => {
    'worklet';
    const p = progress.value;

    const cardLeft = interpolate(
      p, [0, 0.75, 1],
      [iconCenterX - iconWidth / 2, iconCenterX - maxCircleSize / 2, 0],
      Extrapolation.CLAMP,
    );
    const cardTop = interpolate(
      p, [0, 0.75, 1],
      [iconCenterY - iconHeight / 2, iconCenterY - maxCircleSize / 2, 0],
      Extrapolation.CLAMP,
    );

    return {
      position: 'absolute' as const,
      width: screenWidth,
      height: screenHeight,
      left: -cardLeft,
      top: -cardTop,
    };
  });

  const content = renderContent();

  return (
    <Animated.View style={cardStyle}>
      <Animated.View style={contentStyle}>
        {content}
      </Animated.View>
    </Animated.View>
  );
});
