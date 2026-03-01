import React from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSlideUpAnimation } from '../animations/useSlideUpAnimation';
import { LAYOUT } from '../constants/layout';

type OverlayProps = {
  children?: React.ReactNode;
  autoRun?: boolean;
  onCloseComplete?: () => void;
  renderContent?: (props: { onClose: () => void }) => React.ReactNode;
};

export const Overlay = React.memo(function Overlay({
  children,
  autoRun = true,
  onCloseComplete,
  renderContent,
}: OverlayProps) {
  const { animatedStyle, runCloseAnimation } = useSlideUpAnimation({
    autoRun,
  });

  const handleClose = () => {
    runCloseAnimation(onCloseComplete);
  };

  const content = renderContent
    ? renderContent({ onClose: handleClose })
    : children;

  return (
    <Animated.View style={[styles.overlay, animatedStyle]}>
      {content}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: 'transparent',
  },
});
