import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const LAYOUT = {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  SPACING_UNIT: 16,
  SPACING_SM: 8,
  SPACING_MD: 16,
  SPACING_LG: 24,
  OVERLAY_BORDER_RADIUS: 24,
  OVERLAY_SHADOW_OFFSET: { width: 0, height: -4 },
  OVERLAY_SHADOW_OPACITY: 0.15,
  OVERLAY_SHADOW_RADIUS: 12,
  OVERLAY_ELEVATION: 8,
  NUMBER_LINE_HEIGHT: 48,
  NUMBER_FONT_SIZE: 32,
  ODOMETER_ROW_HEIGHT: 32,
  ODOMETER_FONT_SIZE: 24,
} as const;

export type Layout = typeof LAYOUT;
