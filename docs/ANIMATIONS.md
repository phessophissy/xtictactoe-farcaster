# Animation Guide - Gold and Black Theme

## Core Entrance Animations

### Fade In
Smooth opacity transition
- Class: `animate-fade-in`
- Duration: 0.5s
- Use: General content appearance

### Slide Up
Slides content from below
- Class: `animate-slide-up`
- Duration: 0.6s
- Use: Cards, modals, toasts

### Slide Down
Slides content from above
- Class: `animate-slide-down`
- Duration: 0.6s
- Use: Dropdown menus, headers

### Slide Right
Slides content from left
- Class: `animate-slide-right`
- Duration: 0.5s
- Use: List items, sidebar content

### Scale In
Scales content from small to normal
- Class: `animate-scale-in`
- Duration: 0.4s
- Use: Buttons, icons, badges

### Bounce In
Entry animation with bounce effect
- Class: `animate-bounce-in`
- Duration: 0.5s
- Use: Notifications, achievements

### Rotate In
Rotates content while fading in
- Class: `animate-rotate-in`
- Duration: 0.5s
- Use: Icons, avatars

## Effect Animations

### Gold Glow
Pulsing gold glow effect
- Class: `animate-gold-glow`
- Duration: 2s
- Use: Important text, headings

### Glow Pulse
Button glow animation
- Class: `animate-glow-pulse`
- Duration: 2s
- Use: CTA buttons, active elements

### Gold Shimmer
Sweeping shimmer effect
- Class: `animate-gold-shimmer`
- Duration: 2s
- Use: Highlights, loading states

### Pulse Gold
Subtle pulsing effect
- Class: `animate-pulse-gold`
- Duration: 2s
- Use: Attention indicators

## Interactive Animations

### Shake
Error/attention shake
- Class: `animate-shake`
- Duration: 0.6s
- Use: Form errors, invalid input

### Wiggle
Playful wiggle motion
- Class: `animate-wiggle`
- Duration: 0.5s
- Use: Fun interactions, Easter eggs

### Heartbeat
Pulsing heartbeat effect
- Class: `animate-heartbeat`
- Duration: 1.3s
- Use: Likes, favorites

### Tada
Celebration effect
- Class: `animate-tada`
- Duration: 1s
- Use: Success, achievements

## Loading Animations

### Spinner
Rotating circle with gold accent
- Class: `loader-gold-spinner`
- Size: 2rem

### Dots
Bouncing dots
- Class: `loader-gold-dots`
- Use: Inline loading

### Pulse
Expanding circle
- Class: `loader-gold-pulse`
- Use: Full-screen loading

### Ring
Rotating ring
- Class: `loader-gold-ring`
- Use: Button loading states

### Metal Spinner (Inline)
Small inline spinner
- Class: `metal-spinner`
- Use: Button text, inline loading

## Usage Patterns

### Staggered Animations
```jsx
{items.map((item, index) => (
  <div 
    className="animate-slide-right"
    style={{ animationDelay: \`\${index * 100}ms\` }}
  >
    {item}
  </div>
))}
```

### Conditional Animation with isLoaded
```jsx
const [isLoaded, setIsLoaded] = useState(false);

useEffect(() => {
  setIsLoaded(true);
}, []);

return (
  <div className={\`\${isLoaded ? 'animate-fade-in' : 'opacity-0'}\`}>
    Content
  </div>
);
```

### Combining Animations
```jsx
<div className="animate-fade-in animate-slide-up">
  Combined entrance effect
</div>
```

## Game-Specific Animations

### Cell Win
Gold shine sweep for winning cells
- Class: `animate-gold-cell-win`

### Cell Place
Pop effect when placing X or O
- Class: `animate-gold-place`

### Timer Flash
Urgent flash when time is low
- Class: `animate-timer-flash`

### Turn Indicator
Pulse on current player indicator
- Class: `animate-pulse`
