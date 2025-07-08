// src/utils/colors.ts
export const primary_color = '#2553FF';
export const secondary_color = '#FFFEFE';
export const tertiary_color = '#F2F2F3';

export const blue = '#1F41BB';
export const lightBlue = "#f1f4ff";

// Enhanced color palette for modern UI
export const colors = {
  // Primary colors
  primary: '#1F41BB',
  primaryLight: '#4A6CF7',
  primaryDark: '#162A7C',
  
  // Secondary colors
  secondary: '#4CAF50',
  secondaryLight: '#81C784',
  secondaryDark: '#2E7D32',
  
  // Background colors
  background: '#F8FAFC',
  backgroundSecondary: '#F1F5F9',
  surface: '#FFFFFF',
  surfaceVariant: '#F8F9FA',
  
  // Text colors
  text: '#1E293B',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  textInverse: '#FFFFFF',
  
  // Border and divider colors
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  divider: '#E5E7EB',
  
  // Status colors
  success: '#10B981',
  successLight: '#6EE7B7',
  error: '#EF4444',
  errorLight: '#FCA5A5',
  warning: '#F59E0B',
  warningLight: '#FCD34D',
  info: '#3B82F6',
  infoLight: '#93C5FD',
  
  // Agriculture specific colors
  cropGreen: '#16A34A',
  soilBrown: '#A16207',
  skyBlue: '#0EA5E9',
  sunYellow: '#EAB308',
  
  // Gradient colors
  gradientStart: '#1F41BB',
  gradientEnd: '#4A6CF7',
  
  // Shadow colors
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.25)',
  
  // Overlay colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.2)',
} as const;

// Theme configuration
export const theme = {
  colors,
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    extraLarge: 24,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
  typography: {
    fontSizes: {
      xs: 10,
      sm: 12,
      md: 14,
      lg: 16,
      xl: 18,
      xxl: 20,
      xxxl: 24,
      display: 32,
    },
    fontWeights: {
      light: '300',
      regular: '400',
      medium: '500',
      semiBold: '600',
      bold: '700',
    },
  },
} as const;