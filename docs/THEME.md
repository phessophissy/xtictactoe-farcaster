# Gold and Black Theme Documentation

## Overview

The xTicTacToe application uses a luxurious **Gold and Black** theme inspired by elegance, prestige, and premium gaming experiences.

## Color Palette

### Gold Colors
| Name | Hex | Usage |
|------|-----|-------|
| gold-50 | #fffef7 | Lightest gold tint |
| gold-100 | #fffbeb | Light backgrounds |
| gold-200 | #fef3c7 | Subtle accents |
| gold-300 | #fde68a | Secondary elements |
| gold-400 | #fcd34d | Primary text, icons |
| gold-500 | #f59e0b | Primary accent |
| gold-600 | #d97706 | Hover states |
| gold-700 | #b45309 | Active states |
| gold-800 | #92400e | Dark gold accents |
| gold-900 | #713f12 | Darkest gold |

### Obsidian Colors (Black)
| Name | Hex | Usage |
|------|-----|-------|
| obsidian-50 | #18181b | Primary dark background |
| obsidian-100 | #27272a | Card backgrounds |
| obsidian-200 | #3f3f46 | Elevated surfaces |
| obsidian-300 | #52525b | Borders |
| obsidian-400 | #71717a | Muted elements |
| obsidian-500 | #a1a1aa | Secondary text |

### Royal Accent Colors
| Name | Hex | Usage |
|------|-----|-------|
| royal-light | #fef3c7 | Light gold accents |
| royal-medium | #f59e0b | Primary gold |
| royal-dark | #713f12 | Dark gold elements |

## Usage Examples

### Backgrounds
- Primary: `from-obsidian-900 via-obsidian-800 to-obsidian-900`

### Cards
- Default: Use `metal-card` class for consistent styling

### Buttons
- Primary: Use `metal-btn` class with gold gradient

### Text
- Primary: `text-gold-400` for main text on dark backgrounds
- Secondary: `text-gold-500` for muted text

## Animation Classes

### Entrance Animations
- `animate-fade-in`: Smooth fade in effect
- `animate-slide-up`: Slide up from below
- `animate-slide-down`: Slide down from above
- `animate-slide-right`: Slide in from left
- `animate-scale-in`: Scale up effect
- `animate-bounce-in`: Bouncy entrance

### Effect Animations
- `animate-gold-glow`: Pulsing gold glow effect
- `animate-glow-pulse`: Button glow animation
- `animate-gold-shimmer`: Sweeping shimmer effect
- `animate-shake`: Error/attention shake
- `animate-wiggle`: Playful wiggle motion
- `animate-heartbeat`: Pulsing heartbeat
- `animate-tada`: Celebration effect

## Metal Component Classes

- `metal-card`: Dark card with gold border and gradient
- `metal-btn`: Gold button with hover effects
- `metal-cell`: Game board cell styling
- `metal-text`: Gold gradient text effect
- `metal-stats`: Statistics display box
- `metal-badge`: Badge with gold accent
- `metal-spinner`: Loading spinner

## Best Practices

1. Use gold-400 for primary text on dark backgrounds
2. Use obsidian-100/200 for card backgrounds
3. Apply animate-glow-pulse to important action buttons
4. Use staggered animation delays for list items
5. Combine fade-in with slide animations for smooth entrances
