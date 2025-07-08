// src/utils/metrics.ts
import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Base dimensions for scaling (iPhone 11 Pro)
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

/**
 * Scale horizontally based on device width
 */
export const horizontalScale = (size: number): number => 
  (width / guidelineBaseWidth) * size;

/**
 * Scale vertically based on device height
 */
export const verticalScale = (size: number): number => 
  (height / guidelineBaseHeight) * size;

/**
 * Moderate scale - less aggressive scaling for fonts and small elements
 */
export const moderateScale = (size: number, factor: number = 0.5): number => 
  size + (horizontalScale(size) - size) * factor;

/**
 * Scale based on pixel density for crisp images and icons
 */
export const pixelScale = (size: number): number => 
  size * PixelRatio.get();

/**
 * Get responsive font size based on screen width
 */
export const responsiveFontSize = (size: number): number => {
  const scale = width / 320; // Base on smallest common width
  const newSize = size * scale;
  
  if (Platform.OS === 'ios') {
    return Math.max(size * 0.9, Math.min(newSize, size * 1.3));
  } else {
    return Math.max(size * 0.85, Math.min(newSize, size * 1.25));
  }
};

// Screen dimensions
export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;

// Device type detection
export const isTablet = width >= 768;
export const isSmallDevice = width < 350;
export const isLargeDevice = width > 414;

// Safe area calculations
export const STATUS_BAR_HEIGHT = Platform.select({
  ios: height > 812 ? 44 : 20,
  android: 24,
  default: 0,
});

export const HEADER_HEIGHT = Platform.select({
  ios: 44,
  android: 56,
  default: 44,
});

// Common spacing values with responsive scaling
export const SPACING = {
  xs: moderateScale(4),
  sm: moderateScale(8),
  md: moderateScale(16),
  lg: moderateScale(24),
  xl: moderateScale(32),
  xxl: moderateScale(40),
  xxxl: moderateScale(48),
} as const;

// Responsive font sizes
export const FONT_SIZES = {
  xs: responsiveFontSize(10),
  sm: responsiveFontSize(12),
  md: responsiveFontSize(14),
  lg: responsiveFontSize(16),
  xl: responsiveFontSize(18),
  xxl: responsiveFontSize(20),
  xxxl: responsiveFontSize(24),
  display: responsiveFontSize(32),
} as const;

// Common layout dimensions
export const LAYOUT = {
  window: {
    width,
    height,
  },
  isSmallDevice,
  isTablet,
  isLargeDevice,
  
  // Common component sizes
  buttonHeight: verticalScale(48),
  inputHeight: verticalScale(48),
  headerHeight: HEADER_HEIGHT + STATUS_BAR_HEIGHT,
  tabBarHeight: verticalScale(60),
  
  // Content margins
  contentPadding: horizontalScale(20),
  cardMargin: moderateScale(16),
  sectionSpacing: verticalScale(24),
} as const;

// Animation durations
export const ANIMATION = {
  fast: 200,
  normal: 300,
  slow: 500,
} as const;

// Helper functions for responsive design
export const responsiveWidth = (percentage: number): number => 
  (width * percentage) / 100;

export const responsiveHeight = (percentage: number): number => 
  (height * percentage) / 100;

export const getResponsiveMargin = (baseMargin: number): number => {
  if (isTablet) return baseMargin * 1.5;
  if (isSmallDevice) return baseMargin * 0.8;
  return baseMargin;
};

export const getResponsivePadding = (basePadding: number): number => {
  if (isTablet) return basePadding * 1.3;
  if (isSmallDevice) return basePadding * 0.9;
  return basePadding;
};