# Theme Migration: Leaf Green to Gold and Black

## Overview
This document describes the migration from the original "Leaf Green" theme to the new "Gold and Black" color scheme.

## Color Palette Changes

### Old Palette (Leaf Green)
- Primary colors: #f0fdf4 to #14532d
- Accent: Green shades

### New Palette (Gold and Black)

#### Gold Colors
| Shade | Hex Code | Usage |
|-------|----------|-------|
| 50 | #fffef7 | Lightest gold tint |
| 100 | #fffbeb | Light backgrounds |
| 200 | #fef3c7 | Hover states |
| 300 | #fde68a | Borders, dividers |
| 400 | #fcd34d | Primary text, icons |
| 500 | #f59e0b | Primary actions, buttons |
| 600 | #d97706 | Hover states for primary |
| 700 | #b45309 | Pressed states |
| 800 | #92400e | Dark accents |
| 900 | #713f12 | Darkest gold |

#### Obsidian Colors (Black)
| Shade | Hex Code | Usage |
|-------|----------|-------|
| 50 | #18181b | Primary background |
| 100 | #27272a | Card backgrounds |
| 200 | #3f3f46 | Elevated surfaces |
| 300 | #52525b | Borders |
| 400 | #71717a | Muted text |
| 500 | #a1a1aa | Secondary text |

## CSS Class Changes

### Renamed Classes
- `.leaf-*` → `.gold-*`
- `.avatar-leaf` → `.avatar-gold`
- `.modal-leaf` → `.modal-gold`
- `.card-leaf` → `.card-gold`
- `.table-leaf` → `.table-gold`
- `.tooltip-leaf` → `.tooltip-gold`
- `.focus-leaf` → `.focus-gold`
- `.hover-leaf` → `.hover-gold`
- `.input-leaf` → `.input-gold`
- `.progress-leaf` → `.progress-gold`
- `.badge-leaf` → `.badge-gold`
- `.divider-leaf` → `.divider-gold`
- `.alert-leaf` → `.alert-gold`

### New Metal-Themed Classes
- `.metal-card` - Dark card with gold border
- `.metal-btn` - Gold button with glow effect
- `.metal-cell` - Game board cell styling
- `.metal-text` - Gold gradient text
- `.metal-stats` - Statistics display styling
- `.metal-badge` - Badge with gold accent
- `.metal-spinner` - Loading spinner

## Animation Additions

The gold theme includes 30+ new animations:
- `animate-fade-in` - Fade in effect
- `animate-slide-up` - Slide up entrance
- `animate-slide-down` - Slide down entrance
- `animate-slide-right` - Slide right entrance
- `animate-scale-in` - Scale in effect
- `animate-bounce-in` - Bouncy entrance
- `animate-gold-glow` - Pulsing gold glow
- `animate-glow-pulse` - Button glow pulse
- `animate-gold-shimmer` - Shimmer sweep effect
- `animate-shake` - Error shake
- `animate-wiggle` - Playful wiggle
- `animate-heartbeat` - Attention pulse
- `animate-tada` - Celebration effect

## Migration Steps

1. Update `tailwind.config.js` with gold/obsidian color palette
2. Update `globals.css` with new theme styles
3. Replace all `leaf-*` class references with `gold-*`
4. Update component files to use new metal-* classes
5. Add isLoaded state for animated rendering
6. Update theme utilities and types

## Backward Compatibility

Legacy aliases are maintained for compatibility:
- `leafColors` → alias for `goldColors`
- `forestColors` → alias for `royalColors`
- `LeafShade` type → alias for `GoldShade`
- `ForestVariant` type → alias for `RoyalVariant`
