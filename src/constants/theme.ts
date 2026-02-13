// src/constants/theme.ts
import { Platform } from 'react-native';

export const COLORS = {
  // Base
  BACKGROUND: '#0A0A0A', // Almost black
  SURFACE: '#141414',    // Dark Charcoal
  SURFACE_LIGHT: '#1F1F1F',
  
  // Accents
  ORANGE: '#FF5500',     // International Safety Orange
  ORANGE_DIM: 'rgba(255, 85, 0, 0.2)',
  
  // Text & UI
  TEXT_PRIMARY: '#E0E0E0',
  TEXT_SECONDARY: '#666666',
  BORDER: '#333333',
  
  // State
  SUCCESS: '#00FF41',    // Terminal Green
  ERROR: '#FF0000',
};

export const FONTS = {
  // Monospace font stack for that "Technical" look
  MONO: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
};

export const STYLES = {
  // The "Hashed" border look (simulated with dashed borders)
  HASHED_BORDER: {
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderStyle: 'dashed' as 'dashed',
  },
  CONTAINER_PADDING: 20,
};