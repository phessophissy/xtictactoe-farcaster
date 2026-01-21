# Changelog - Gold and Black Theme

## [3.0.0] - Gold Theme Migration

### Added
- New gold color palette (50-900 shades)
- New obsidian/black color palette (50-900 shades)
- Royal accent colors (light, medium, dark)
- Metal-themed CSS classes (metal-card, metal-btn, etc.)
- 30+ new animation keyframes
- Animation utility classes (fade-in, slide-up, scale-in, etc.)
- Staggered animation support for lists
- Loading spinners and shimmer effects
- Theme migration documentation

### Changed
- **Major**: Migrated from leaf green theme to gold and black
- Updated all component Tailwind classes to gold/obsidian
- Refactored globals.css with dark background and gold accents
- Updated tailwind.config.js color palette
- Added isLoaded state for animated component rendering
- Enhanced all components with entrance animations
- Updated all CSS style files with gold colors
- Renamed all leaf-prefixed classes to gold-prefixed

### Components Updated
- GameBoard.tsx - metal-card with fade-in animations
- ModeSelector.tsx - staggered button animations
- PvPGame.tsx - timer flash and turn indicator pulse
- Leaderboard.tsx - staggered row slide-right animations
- MatchmakingLobby.tsx - game list animations
- WaitingRoom.tsx - stats panel animations
- page.tsx - updated navigation with gold theme

### Style Files Updated
- All 18+ CSS files in src/styles/ converted to gold theme
- loaders.css - new gold spinner variants
- animations.css - gold shimmer effects
- theme.css - dark theme CSS properties

### Type Definitions
- Added GoldShade and ObsidianShade types
- Added RoyalVariant type
- Legacy LeafShade alias maintained

### Documentation
- THEME.md - Updated for gold palette
- THEME_MIGRATION.md - Migration guide from leaf to gold
- ANIMATIONS.md - Updated animation reference

---

## [2.0.0] - Leaf Green Theme (Previous)

### Added
- Leaf green color palette (50-900 shades)
- Forest accent colors (light, medium, dark)
- Comprehensive CSS component library
- Theme utility functions in TypeScript
- useTheme React hook
- Theme type definitions
- Animation keyframes for leaf-themed effects
- Documentation for theme usage

### Changed
- Migrated from carton/brown theme to leaf green
- Updated all component Tailwind classes
- Modified wallet modal accent color
- Refactored globals.css with green theme
- Updated tailwind.config.js color palette
