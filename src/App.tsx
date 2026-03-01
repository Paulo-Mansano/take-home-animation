import React, { useCallback, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { WaterScreen } from './screens/WaterScreen';
import { StepsScreen } from './screens/StepsScreen';
import { CardExpansionOverlay } from './components/CardExpansionOverlay';
import { CardCollapseOverlay } from './components/CardCollapseOverlay';
import type { TriggerLayout } from './components/CardExpansionOverlay';
import type { TargetLayout } from './components/CardCollapseOverlay';

type ScreenMode = 'steps' | 'expanding' | 'water' | 'collapsing';

export default function App() {
  const [screenMode, setScreenMode] = useState<ScreenMode>('steps');
  const [triggerLayout, setTriggerLayout] = useState<TriggerLayout | null>(null);
  const [collapseLayout, setCollapseLayout] = useState<TargetLayout | null>(null);
  const expansionProgress = useSharedValue(0);

  const handleOpenWater = useCallback((layout: TriggerLayout) => {
    setTriggerLayout(layout);
    setScreenMode('expanding');
  }, []);

  const handleExpansionComplete = useCallback(() => {
    setScreenMode('water');
  }, []);

  const handleCloseWater = useCallback((layout: TargetLayout) => {
    setCollapseLayout(layout);
    setScreenMode('collapsing');
  }, []);

  const handleCollapseComplete = useCallback(() => {
    expansionProgress.value = 0;
    setScreenMode('steps');
    setTriggerLayout(null);
    setCollapseLayout(null);
  }, [expansionProgress]);

  const stepsDepthStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [
        { scale: interpolate(expansionProgress.value, [0, 1], [1, 0.96], Extrapolation.CLAMP) },
      ],
      opacity: interpolate(expansionProgress.value, [0, 1], [1, 0.88], Extrapolation.CLAMP),
    };
  });

  const showExpansion = screenMode === 'expanding' && triggerLayout !== null;
  const showCollapse = screenMode === 'collapsing' && collapseLayout !== null;

  return (
    <GestureHandlerRootView style={styles.root}>
      <View style={styles.screen}>
        <StatusBar style="light" />
        <Animated.View style={[StyleSheet.absoluteFill, stepsDepthStyle]}>
          <StepsScreen
            onOpenWater={handleOpenWater}
            expansionProgress={expansionProgress}
          />
        </Animated.View>
        {showExpansion && triggerLayout && (
          <CardExpansionOverlay
            triggerLayout={triggerLayout}
            progress={expansionProgress}
            onExpansionComplete={handleExpansionComplete}
            renderContent={() => <WaterScreen onClose={handleCloseWater} />}
          />
        )}
        {screenMode === 'water' && (
          <View style={StyleSheet.absoluteFill}>
            <WaterScreen onClose={handleCloseWater} />
          </View>
        )}
        {showCollapse && collapseLayout && (
          <CardCollapseOverlay
            targetLayout={collapseLayout}
            progress={expansionProgress}
            onCollapseComplete={handleCollapseComplete}
            renderContent={() => <WaterScreen onClose={handleCloseWater} />}
          />
        )}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
});
