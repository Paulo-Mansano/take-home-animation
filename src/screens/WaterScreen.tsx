import React, { useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Platform,
} from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { LAYOUT } from '../constants/layout';
import { COLORS } from '../constants/theme';
import { OdometerSlider } from '../components/OdometerSlider';
import { WaterSliderBar } from '../components/WaterSliderBar';

const INITIAL_OZ = 12;
const MIN_OZ = 0;
const MAX_OZ = 32;
const STEP_OZ = 0.5;

type WaterScreenProps = {
  onClose: () => void;
};

export function WaterScreen({ onClose }: WaterScreenProps) {
  const ozRef = useRef(INITIAL_OZ);
  const valueRef = useSharedValue(INITIAL_OZ);

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.closeButton}
        onPress={onClose}
        hitSlop={12}
      >
        <Text style={styles.closeIcon}>✕</Text>
      </Pressable>

      <View style={styles.content}>
        <View style={styles.bottleContainer}>
          <View style={styles.bottle}>
            <View style={styles.bottleCap} />
            <View style={styles.bottleBody} />
            <View style={styles.gdLogo}>
              <Text style={styles.gdText}>GD</Text>
            </View>
          </View>
        </View>
        <View style={styles.statsColumn}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>0%</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>50oz</Text>
            <Text style={styles.statLabel}>Goal</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValueLarge}>0</Text>
            <Text style={styles.statLabel}>OZ</Text>
            <Text style={styles.statLabelSmall}>Consumed so far</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomCard}>
        <View style={styles.odometerRow}>
          <OdometerSlider
            valueRef={valueRef}
            initialValue={INITIAL_OZ}
            min={MIN_OZ}
            max={MAX_OZ}
            onValueChange={(v) => {
              ozRef.current = v;
            }}
          />
        </View>
        <WaterSliderBar
          valueRef={valueRef}
          initialValue={INITIAL_OZ}
          min={MIN_OZ}
          max={MAX_OZ}
          step={STEP_OZ}
          onValueChange={(v) => {
            ozRef.current = v;
          }}
        />
        <View style={styles.stepButtonsRow}>
          <Pressable
            style={[styles.stepButton, styles.stepButtonMinus]}
            onPress={() => {
              const next = Math.max(MIN_OZ, ozRef.current - STEP_OZ);
              valueRef.value = next;
              ozRef.current = next;
            }}
          >
            <Text style={[styles.stepButtonText, styles.stepButtonTextMinus]}>−</Text>
          </Pressable>
          <Pressable
            style={[styles.stepButton, styles.stepButtonPlus]}
            onPress={() => {
              const next = Math.min(MAX_OZ, ozRef.current + STEP_OZ);
              valueRef.value = next;
              ozRef.current = next;
            }}
          >
            <Text style={[styles.stepButtonText, styles.stepButtonTextPlus]}>+</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.blueBg,
    paddingTop: Platform.OS === 'android' ? 40 : 60,
    paddingHorizontal: LAYOUT.SPACING_LG,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 40 : 60,
    right: LAYOUT.SPACING_LG,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.blueLight,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeIcon: {
    color: COLORS.blueDark,
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: LAYOUT.SPACING_LG,
  },
  bottleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottle: {
    width: 100,
    alignItems: 'center',
  },
  bottleCap: {
    width: 32,
    height: 20,
    backgroundColor: COLORS.black,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  bottleBody: {
    width: 80,
    height: 140,
    backgroundColor: COLORS.blueLight,
    borderWidth: 2,
    borderColor: COLORS.blueDark,
    borderRadius: 8,
    opacity: 0.9,
  },
  gdLogo: {
    position: 'absolute',
    top: 50,
    left: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gdText: {
    color: COLORS.blueDark,
    fontSize: 12,
    fontWeight: '700',
  },
  statsColumn: {
    marginLeft: LAYOUT.SPACING_MD,
  },
  stat: {
    marginBottom: LAYOUT.SPACING_LG,
  },
  statValue: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '700',
  },
  statValueLarge: {
    color: COLORS.white,
    fontSize: 36,
    fontWeight: '700',
  },
  statLabel: {
    color: COLORS.white,
    fontSize: 14,
    opacity: 0.9,
  },
  statLabelSmall: {
    color: COLORS.white,
    fontSize: 12,
    opacity: 0.8,
    marginTop: 2,
  },
  bottomCard: {
    backgroundColor: COLORS.blueCard,
    borderRadius: 24,
    padding: LAYOUT.SPACING_LG,
    marginBottom: LAYOUT.SPACING_LG * 2,
  },
  odometerRow: {
    marginBottom: LAYOUT.SPACING_SM,
  },
  stepButtonsRow: {
    flexDirection: 'row',
    gap: LAYOUT.SPACING_MD,
    marginTop: LAYOUT.SPACING_MD,
  },
  stepButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepButtonMinus: {
    backgroundColor: COLORS.blueLight,
  },
  stepButtonPlus: {
    backgroundColor: COLORS.white,
  },
  stepButtonText: {
    fontSize: 24,
    fontWeight: '700',
  },
  stepButtonTextMinus: {
    color: COLORS.blueDark,
  },
  stepButtonTextPlus: {
    color: COLORS.blueBg,
  },
});
