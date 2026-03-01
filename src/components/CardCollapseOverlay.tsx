import React, { useEffect } from 'react';
import Animated, {
  Easing,
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { LAYOUT } from '../constants/layout';

const COLLAPSE_DURATION_MS = 500;
// Curva 'in' — a janela parte suavemente e acelera ao mergulhar no ícone
const COLLAPSE_EASING = Easing.in(Easing.exp);

export type TargetLayout = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type CardCollapseOverlayProps = {
  targetLayout: TargetLayout;
  progress: SharedValue<number>;
  onCollapseComplete: () => void;
  renderContent: () => React.ReactNode;
};

export const CardCollapseOverlay = React.memo(function CardCollapseOverlay({
  targetLayout,
  progress,
  onCollapseComplete,
  renderContent,
}: CardCollapseOverlayProps) {
  const screenWidth = LAYOUT.SCREEN_WIDTH;
  const screenHeight = LAYOUT.SCREEN_HEIGHT;

  const iconCenterX = targetLayout.x + targetLayout.width / 2;
  const iconCenterY = targetLayout.y + targetLayout.height / 2;

  const screenCenterX = screenWidth / 2;
  const screenCenterY = screenHeight / 2;

  // Quando p=0, a janela estará centralizada sobre o ícone-alvo
  const collapsedTranslateX = iconCenterX - screenCenterX;
  const collapsedTranslateY = iconCenterY - screenCenterY;
  const collapsedScale = targetLayout.width / screenWidth;

  const collapsedBorderRadius = (targetLayout.width / 2) / collapsedScale;

  useEffect(() => {
    // Anima de 1 (tela cheia) → 0 (tamanho/posição do ícone)
    progress.value = withTiming(
      0,
      { duration: COLLAPSE_DURATION_MS, easing: COLLAPSE_EASING },
      (finished) => {
        if (finished) {
          scheduleOnRN(onCollapseComplete);
        }
      }
    );
  }, [onCollapseComplete, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    const p = progress.value;

    return {
      position: 'absolute' as const,
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      backgroundColor: '#FFF',
      overflow: 'hidden' as const,

      borderRadius: interpolate(p, [0, 1], [collapsedBorderRadius, 0], Extrapolation.CLAMP),

      transform: [
        { translateX: interpolate(p, [0, 1], [collapsedTranslateX, 0], Extrapolation.CLAMP) },
        { translateY: interpolate(p, [0, 1], [collapsedTranslateY, 0], Extrapolation.CLAMP) },
        { scale: interpolate(p, [0, 1], [collapsedScale, 1], Extrapolation.CLAMP) },
      ],

      // Opacidade desaparece nos últimos instantes para evitar "pisco" ao colapsar
      opacity: interpolate(p, [0, 0.05], [0, 1], Extrapolation.CLAMP),

      shadowColor: '#000',
      shadowOffset: { width: 0, height: interpolate(p, [0, 1], [2, 10], Extrapolation.CLAMP) },
      shadowOpacity: interpolate(p, [0, 1], [0.1, 0.3], Extrapolation.CLAMP),
      shadowRadius: interpolate(p, [0, 1], [4, 20], Extrapolation.CLAMP),
      elevation: interpolate(p, [0, 1], [2, 10], Extrapolation.CLAMP),
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      {renderContent()}
    </Animated.View>
  );
});
