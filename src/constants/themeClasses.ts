// Gold and Black Theme Class Constants

// Background Classes
export const BG_CLASSES = {
  primary: 'bg-gradient-to-br from-obsidian-900 via-obsidian-800 to-obsidian-900',
  surface: 'bg-gradient-to-br from-obsidian-100 to-obsidian-200',
  card: 'metal-card',
  dark: 'bg-obsidian-50',
  accent: 'bg-gold-500',
} as const;

// Text Classes
export const TEXT_CLASSES = {
  primary: 'text-gold-400',
  secondary: 'text-gold-500',
  muted: 'text-gold-600',
  light: 'text-gold-300',
  white: 'text-white',
} as const;

// Button Classes
export const BTN_CLASSES = {
  primary: 'metal-btn',
  secondary: 'bg-obsidian-200 hover:bg-obsidian-300 text-gold-400 font-semibold',
  outline: 'border-2 border-gold-500 text-gold-400 hover:bg-obsidian-200',
  ghost: 'hover:bg-obsidian-200 text-gold-400',
  icon: 'bg-gold-500 hover:bg-gold-600 text-obsidian-50',
} as const;

// Border Classes
export const BORDER_CLASSES = {
  primary: 'border-gold-500',
  secondary: 'border-gold-400',
  accent: 'border-gold-600',
  subtle: 'border-gold-700',
} as const;

// Shadow Classes
export const SHADOW_CLASSES = {
  sm: 'shadow-sm shadow-gold-500/20',
  md: 'shadow-md shadow-gold-500/30',
  lg: 'shadow-lg shadow-gold-500/40',
  xl: 'shadow-xl shadow-gold-500/50',
  glow: 'shadow-[0_0_15px_rgba(245,158,11,0.4)]',
} as const;

// Animation Classes
export const ANIM_CLASSES = {
  glowPulse: 'animate-glow-pulse',
  goldGlow: 'animate-gold-glow',
  shimmer: 'animate-gold-shimmer',
  bounceIn: 'animate-bounce-in',
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  scaleIn: 'animate-scale-in',
} as const;

export default {
  BG_CLASSES,
  TEXT_CLASSES,
  BTN_CLASSES,
  BORDER_CLASSES,
  SHADOW_CLASSES,
  ANIM_CLASSES,
};
