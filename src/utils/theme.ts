// Leaf Green Theme Utilities

export const leafColors = {
  50: '#f0fdf4',
  100: '#dcfce7',
  200: '#bbf7d0',
  300: '#86efac',
  400: '#4ade80',
  500: '#22c55e',
  600: '#16a34a',
  700: '#15803d',
  800: '#166534',
  900: '#14532d',
} as const;

export const forestColors = {
  light: '#bbf7d0',
  medium: '#22c55e',
  dark: '#14532d',
} as const;

export type LeafColorKey = keyof typeof leafColors;
export type ForestColorKey = keyof typeof forestColors;

export const getLeafColor = (shade: LeafColorKey): string => {
  return leafColors[shade];
};

export const getForestColor = (variant: ForestColorKey): string => {
  return forestColors[variant];
};

// CSS class generators
export const bgLeaf = (shade: LeafColorKey) => `bg-leaf-${shade}`;
export const textLeaf = (shade: LeafColorKey) => `text-leaf-${shade}`;
export const borderLeaf = (shade: LeafColorKey) => `border-leaf-${shade}`;

// Gradient utilities
export const leafGradient = (from: LeafColorKey, to: LeafColorKey) => 
  `from-leaf-${from} to-leaf-${to}`;

export const leafGradientBg = (from: LeafColorKey, to: LeafColorKey) =>
  `bg-gradient-to-br ${leafGradient(from, to)}`;

// Theme configuration
export const themeConfig = {
  primary: leafColors[500],
  primaryHover: leafColors[600],
  secondary: leafColors[400],
  background: leafColors[100],
  surface: leafColors[50],
  text: leafColors[800],
  textMuted: leafColors[600],
  border: leafColors[400],
  accent: forestColors.medium,
};

export default leafColors;
