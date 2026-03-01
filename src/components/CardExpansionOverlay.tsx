import React, { useEffect } from 'react';
import { Platform } from 'react-native';
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

const EXPANSION_DURATION_MS = 500; 
// Uma curva 'out' faz a janela sair rápido do botão e desacelerar suavemente ao chegar na tela toda
const EXPANSION_EASING = Easing.out(Easing.exp); 

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

export const CardExpansionOverlay = React.memo(function CardExpansionOverlay({
  triggerLayout,
  progress,
  onExpansionComplete,
  renderContent,
}: CardExpansionOverlayProps) {
  const screenWidth = LAYOUT.SCREEN_WIDTH;
  const screenHeight = LAYOUT.SCREEN_HEIGHT;

  // 1. Calculamos o centro exato do ícone da gota
  const iconCenterX = triggerLayout.x + triggerLayout.width / 2;
  const iconCenterY = triggerLayout.y + triggerLayout.height / 2;
  
  // 2. Calculamos o centro exato da tela do celular
  const screenCenterX = screenWidth / 2;
  const screenCenterY = screenHeight / 2;

  // 3. Descobrimos a distância que a tela precisa mover para iniciar em cima do ícone
  const startTranslateX = iconCenterX - screenCenterX;
  const startTranslateY = iconCenterY - screenCenterY;

  // 4. Calculamos a escala inicial para que a tela comece do tamanho exato do botão
  const startScale = triggerLayout.width / screenWidth;

  // Como estamos usando "scale", o arredondamento das bordas também encolhe visualmente.
  // Para que a borda pareça perfeitamente redonda no início, precisamos compensar a escala.
  const startBorderRadius = (triggerLayout.width / 2) / startScale;
  const endBorderRadius = 0;

  useEffect(() => {
    progress.value = withTiming(
      1,
      { duration: EXPANSION_DURATION_MS, easing: EXPANSION_EASING },
      (finished) => {
        if (finished) {
          scheduleOnRN(onExpansionComplete);
        }
      }
    );
  }, [onExpansionComplete, progress]);

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
      // Fazemos a transição do arredondamento calculando do máximo até a borda padrão do celular
      borderRadius: interpolate(p, [0, 1], [startBorderRadius, endBorderRadius], Extrapolation.CLAMP),
      
      // A mágica acontece aqui: Movemos e Escalonamos de forma simultânea
      transform: [
        { translateX: interpolate(p, [0, 1], [startTranslateX, 0], Extrapolation.CLAMP) },
        { translateY: interpolate(p, [0, 1], [startTranslateY, 0], Extrapolation.CLAMP) },
        { scale: interpolate(p, [0, 1], [startScale, 1], Extrapolation.CLAMP) },
      ],
      
      // Um pequeno truque de opacidade nos primeiros milissegundos evita qualquer "pisco" visual
      opacity: interpolate(p, [0, 0.05], [0, 1], Extrapolation.CLAMP),
      
      // Sombra que aumenta conforme a janela "se aproxima" da tela do usuário
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