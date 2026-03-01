import React, { useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
} from 'react-native';
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { LAYOUT } from '../constants/layout';
import { COLORS } from '../constants/theme';
import { StatItem } from '../components/StatItem';
import type { TriggerLayout } from '../components/CardExpansionOverlay';

type StepsScreenProps = {
  onOpenWater: (layout: TriggerLayout) => void;
  expansionProgress: SharedValue<number>;
};

export function StepsScreen({
  onOpenWater,
  expansionProgress,
}: StepsScreenProps) {
  const waterButtonRef = useRef<View>(null);

  const handleOpenWater = () => {
    waterButtonRef.current?.measureInWindow((x, y, width, height) => {
      onOpenWater({ x, y, width, height });
    });
  };

  const iconAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [
        { scale: interpolate(expansionProgress.value, [0, 0.15], [1, 0.85], Extrapolation.CLAMP) },
      ],
      opacity: interpolate(expansionProgress.value, [0, 0.2], [1, 0], Extrapolation.CLAMP),
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.blueSection}>
        <Animated.View style={[styles.waterIconWrapper, iconAnimatedStyle]}>
          <Pressable
            ref={waterButtonRef}
            style={styles.waterIconButton}
            onPress={handleOpenWater}
            hitSlop={12}
          >
            <Text style={styles.waterIcon}>🥤</Text>
          </Pressable>
        </Animated.View>
        <View style={styles.blueHeader}>
          <Text style={styles.stepsBehind}>
            <Text style={styles.stepsBehindNumber}>876</Text> Steps behind
          </Text>
          <View style={styles.lowerRow}>
            <Text style={styles.lowerText}>76% Lower than yesterday</Text>
          </View>
        </View>
        <View style={styles.chartPlaceholder}>
          <View style={styles.chartBars}>
            {[0.2, 0.5, 0.9, 0.6, 0.3, 0.1].map((h, i) => (
              <View
                key={i}
                style={[styles.chartBar, { height: `${h * 100}%` }]}
              />
            ))}
          </View>
          <Text style={styles.chartYLabel}>3K</Text>
          <Text style={styles.chartXLabel}>Thu  Fri  Mon  Tue  Wed</Text>
        </View>
      </View>

      <View style={styles.whiteCard}>
        <View style={styles.cardHeader}>
          <View style={styles.gdLogo}>
            <Text style={styles.gdText}>GD</Text>
          </View>
          <View style={styles.segmentedControl}>
            <View style={styles.segmentActive}>
              <Text style={styles.segmentTextActive}>D</Text>
            </View>
            <View style={styles.segment}>
              <Text style={styles.segmentText}>W</Text>
            </View>
            <View style={styles.segment}>
              <Text style={styles.segmentText}>M</Text>
            </View>
          </View>
        </View>
        <View style={styles.stepsMain}>
          <Text style={styles.stepsValue}>275</Text>
          <Text style={styles.stepsLabel}>Steps</Text>
        </View>
        <View style={styles.metricsRow}>
          <StatItem label="Distance" value="0.11mi" index={0} />
          <StatItem label="Calories" value="8kcal" index={1} />
          <StatItem label="Floors" value="1" index={2} />
        </View>
        <View style={styles.bottomButtons}>
          <Pressable style={styles.pillButton}>
            <Text style={styles.pillIcon}>👟</Text>
            <Text style={styles.pillText}>Steps</Text>
          </Pressable>
          <Pressable style={styles.circleButton}>
            <Text style={styles.circleIcon}>♡</Text>
          </Pressable>
          <Pressable style={styles.circleButton}>
            <Text style={styles.circleIcon}>🌙</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blueSection: {
    backgroundColor: COLORS.blueDark,
    paddingTop: LAYOUT.SPACING_LG,
    paddingHorizontal: LAYOUT.SPACING_LG,
    paddingBottom: LAYOUT.SPACING_MD,
    minHeight: LAYOUT.SCREEN_HEIGHT * 0.35,
  },
  waterIconWrapper: {
    position: 'absolute',
    top: LAYOUT.SPACING_LG,
    right: LAYOUT.SPACING_LG,
    zIndex: 10,
  },
  waterIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waterIcon: {
    fontSize: 22,
  },
  blueHeader: {
    marginBottom: LAYOUT.SPACING_MD,
  },
  stepsBehind: {
    color: COLORS.white,
    fontSize: 16,
  },
  stepsBehindNumber: {
    fontWeight: '700',
    fontSize: 18,
  },
  lowerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  lowerText: {
    color: COLORS.red,
    fontSize: 14,
    fontWeight: '600',
  },
  chartPlaceholder: {
    flex: 1,
    minHeight: 120,
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 100,
    paddingHorizontal: 8,
  },
  chartBar: {
    width: 24,
    backgroundColor: COLORS.blueLight,
    borderRadius: 4,
  },
  chartYLabel: {
    color: COLORS.white,
    fontSize: 10,
    opacity: 0.8,
  },
  chartXLabel: {
    color: COLORS.white,
    fontSize: 10,
    opacity: 0.8,
    marginTop: 4,
  },
  whiteCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: LAYOUT.OVERLAY_BORDER_RADIUS,
    borderTopRightRadius: LAYOUT.OVERLAY_BORDER_RADIUS,
    marginTop: -20,
    padding: LAYOUT.SPACING_LG,
    shadowColor: '#000',
    shadowOffset: LAYOUT.OVERLAY_SHADOW_OFFSET,
    shadowOpacity: LAYOUT.OVERLAY_SHADOW_OPACITY,
    shadowRadius: LAYOUT.OVERLAY_SHADOW_RADIUS,
    elevation: LAYOUT.OVERLAY_ELEVATION,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: LAYOUT.SPACING_LG,
  },
  gdLogo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gdText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: COLORS.grayLight,
    borderRadius: 8,
    padding: 4,
  },
  segment: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  segmentActive: {
    backgroundColor: COLORS.white,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    color: COLORS.gray,
    fontSize: 14,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: COLORS.black,
    fontSize: 14,
    fontWeight: '700',
  },
  stepsMain: {
    alignItems: 'center',
    marginBottom: LAYOUT.SPACING_LG,
  },
  stepsValue: {
    fontSize: 48,
    fontWeight: '700',
    color: COLORS.black,
  },
  stepsLabel: {
    fontSize: 16,
    color: COLORS.gray,
    marginTop: 4,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: LAYOUT.SPACING_LG,
  },
  bottomButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: LAYOUT.SPACING_MD,
  },
  pillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.grayLight,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 6,
  },
  pillIcon: {
    fontSize: 18,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '600',
  },
  circleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleIcon: {
    fontSize: 20,
  },
});
