// Gold and Black Theme Utilities

export const goldColors = {
  50: '#fffef7',
  100: '#fffbeb',
  200: '#fef3c7',
  300: '#fde68a',
  400: '#fcd34d',
  500: '#f59e0b',
  600: '#d97706',
  700: '#b45309',
  800: '#92400e',
  900: '#713f12',
} as const;

export const obsidianColors = {
  50: '#18181b',
  100: '#27272a',
  200: '#3f3f46',
  300: '#52525b',
  400: '#71717a',
  500: '#a1a1aa',
  600: '#d4d4d8',
  700: '#e4e4e7',
  800: '#f4f4f5',
  900: '#fafafa',
} as const;

export const royalColors = {
  light: '#fef3c7',
  medium: '#f59e0b',
  dark: '#713f12',
} as const;

export type GoldColorKey = keyof typeof goldColors;
export type ObsidianColorKey = keyof typeof obsidianColors;
export type RoyalColorKey = keyof typeof royalColors;

export const getGoldColor = (shade: GoldColorKey): string => {
  return goldColors[shade];
};

export const getObsidianColor = (shade: ObsidianColorKey): string => {
  return obsidianColors[shade];
};

export const getRoyalColor = (variant: RoyalColorKey): string => {
  return royalColors[variant];
};

// CSS class generators
export const bgGold = (shade: GoldColorKey) => `bg-gold-${shade}`;
export const textGold = (shade: GoldColorKey) => `text-gold-${shade}`;
export const borderGold = (shade: GoldColorKey) => `border-gold-${shade}`;

export const bgObsidian = (shade: ObsidianColorKey) => `bg-obsidian-${shade}`;
export const textObsidian = (shade: ObsidianColorKey) => `text-obsidian-${shade}`;
export const borderObsidian = (shade: ObsidianColorKey) => `border-obsidian-${shade}`;

// Gradient utilities
export const goldGradient = (from: GoldColorKey, to: GoldColorKey) => 
  `from-gold-${from} to-gold-${to}`;

export const goldGradientBg = (from: GoldColorKey, to: GoldColorKey) =>
  `bg-gradient-to-br ${goldGradient(from, to)}`;

export const obsidianGradient = (from: ObsidianColorKey, to: ObsidianColorKey) => 
  `from-obsidian-${from} to-obsidian-${to}`;

// Theme configuration
export const themeConfig = {
  primary: goldColors[500],
  primaryHover: goldColors[600],
  secondary: goldColors[400],
  background: obsidianColors[50],
  surface: obsidianColors[100],
  text: goldColors[400],
  textMuted: goldColors[600],
  border: goldColors[500],
  accent: royalColors.medium,
};

// Legacy aliases for backward compatibility
export const leafColors = goldColors;
export const forestColors = royalColors;

export default goldColors;
