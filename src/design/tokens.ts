/**
 * LIFEINTEL Design Tokens — Warm Minimal
 * 
 * Centralized design constants for programmatic use.
 * Tailwind classes should be preferred in JSX; use these tokens
 * for dynamic styling, charts, and computed values.
 */

export const colors = {
  ivory: {
    50: '#FEFDFB',
    100: '#FBF9F5',
    200: '#F7F4EE',
    300: '#F0ECE3',
    400: '#E8E3D8',
    500: '#DDD7CA',
  },
  espresso: {
    50: '#F5F3F1',
    100: '#E0DBD5',
    200: '#C2B8AB',
    300: '#A39585',
    400: '#8A7B69',
    500: '#6B5D4E',
    600: '#564A3E',
    700: '#41382F',
    800: '#2C2520',
    900: '#1A1613',
  },
  sage: {
    50: '#F4F7F4',
    100: '#E4ECE4',
    200: '#C8D9C8',
    300: '#A3BFA3',
    400: '#7EA37E',
    500: '#5F8A5F',
    600: '#4A6E4A',
    700: '#3D5A3D',
    800: '#334A33',
    900: '#2B3E2B',
  },
  terracotta: {
    50: '#FBF5F1',
    100: '#F5E6DB',
    200: '#ECCBB6',
    300: '#E0A98A',
    400: '#D4885F',
    500: '#C97043',
    600: '#BB5B35',
    700: '#9B472D',
    800: '#7D3B2A',
    900: '#663225',
  },
  warmgray: {
    50: '#F9F8F6',
    100: '#F0EEEA',
    200: '#E1DDD6',
    300: '#CCC6BB',
    400: '#B5ACA0',
    500: '#9E9385',
    600: '#8A7D6F',
    700: '#73685C',
    800: '#60574E',
    900: '#504941',
  },
  white: '#FFFFFF',
  black: '#0D0B09',
} as const;

export const typography = {
  fontFamily: {
    heading: '"DM Serif Display", Georgia, serif',
    body: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
} as const;

export const spacing = {
  sidebar: {
    width: '16rem',       // 256px
    collapsedWidth: '4rem', // 64px
  },
  topbar: {
    height: '3.5rem',     // 56px
  },
  content: {
    maxWidth: '72rem',    // 1152px
    padding: '2rem',      // 32px
  },
} as const;

export const statusColors = {
  active: colors.sage[500],
  warning: colors.terracotta[500],
  error: '#C53030',
  info: '#3182CE',
  inactive: colors.warmgray[400],
  success: colors.sage[600],
} as const;

