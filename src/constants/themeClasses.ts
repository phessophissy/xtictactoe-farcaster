// Leaf Green Theme Class Constants

// Background Classes
export const BG_CLASSES = {
  primary: 'bg-gradient-to-br from-leaf-100 via-leaf-200 to-leaf-300',
  surface: 'bg-gradient-to-br from-leaf-50 to-leaf-100',
  card: 'bg-gradient-to-br from-leaf-50 to-leaf-100 border-4 border-leaf-400',
  dark: 'bg-leaf-900',
  accent: 'bg-leaf-500',
} as const;

// Text Classes
export const TEXT_CLASSES = {
  primary: 'text-leaf-800',
  secondary: 'text-leaf-700',
  muted: 'text-leaf-600',
  light: 'text-leaf-400',
  white: 'text-white',
} as const;

// Button Classes
export const BTN_CLASSES = {
  primary: 'bg-gradient-to-r from-leaf-500 to-leaf-600 hover:from-leaf-600 hover:to-leaf-700 text-white font-bold',
  secondary: 'bg-leaf-200 hover:bg-leaf-300 text-leaf-800 font-semibold',
  outline: 'border-2 border-leaf-500 text-leaf-600 hover:bg-leaf-100',
  ghost: 'hover:bg-leaf-100 text-leaf-700',
  icon: 'bg-leaf-400 hover:bg-leaf-500 text-white',
} as const;

// Border Classes
export const BORDER_CLASSES = {
  primary: 'border-leaf-400',
  secondary: 'border-leaf-300',
  accent: 'border-leaf-500',
  subtle: 'border-leaf-200',
} as const;

// Shadow Classes
export const SHADOW_CLASSES = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  glow: 'shadow-[0_0_15px_rgba(34,197,94,0.3)]',
} as const;

// Animation Classes
export const ANIM_CLASSES = {
  glowPulse: 'animate-glow-pulse',
  leafSway: 'animate-leaf-sway',
  shimmer: 'animate-forest-shimmer',
  bounceIn: 'animate-bounce-in-green',
} as const;

export default {
  BG_CLASSES,
  TEXT_CLASSES,
  BTN_CLASSES,
  BORDER_CLASSES,
  SHADOW_CLASSES,
  ANIM_CLASSES,
};
