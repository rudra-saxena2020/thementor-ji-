# Animation System Documentation

## Overview
Our animation system is designed to be subtle, physics-based, and performant. It uses CSS transitions and keyframes defined in `tailwind.config.js` and `src/utils/animations.ts`.

## Core Animations

### Fade In
- **Class:** `animate-fade-in`
- **Duration:** 0.5s
- **Curve:** Ease-out
- **Usage:** Page transitions, modal opening.

### Slide Up
- **Class:** `animate-slide-up`
- **Duration:** 0.5s
- **Curve:** Ease-out
- **Usage:** Cards appearing, lists loading (staggered).

### Scale In
- **Class:** `animate-scale-in`
- **Duration:** 0.3s
- **Curve:** Ease-out
- **Usage:** Tooltips, popovers, badges appearing.

### Float
- **Class:** `animate-float`
- **Duration:** 6s
- **Curve:** Ease-in-out (infinite)
- **Usage:** Hero elements, decorative background shapes.

### Pulse Slow
- **Class:** `animate-pulse-slow`
- **Duration:** 4s
- **Curve:** Cubic-bezier(0.4, 0, 0.6, 1)
- **Usage:** Loading skeletons, attention-grabbing indicators.

## Usage Examples

### React Component
```tsx
import { ANIMATIONS } from '../utils/animations';

const MyComponent = () => (
  <div className={ANIMATIONS.SLIDE_UP}>
    <h1>Hello World</h1>
  </div>
);
```

### Staggered List
```tsx
{items.map((item, index) => (
  <div 
    key={item.id} 
    className="animate-slide-up" 
    style={{ animationDelay: `${index * 100}ms` }}
  >
    {item.name}
  </div>
))}
```

## Reduced Motion
All animations should respect `prefers-reduced-motion`.
Currently, this is handled by Tailwind's `motion-safe` utility if needed, but for critical UI updates, we ensure instant state changes happen even if animation is disabled.
