# Design System Documentation

## 1. Design Tokens

### Colors
We use a semantic color system built on top of Tailwind CSS.

- **Primary:** `hsl(var(--primary))` - Used for main actions, buttons, and active states.
- **Secondary:** `hsl(var(--secondary))` - Used for secondary actions and subtle backgrounds.
- **Accent:** `hsl(var(--accent))` - Used for interactive elements and highlights.
- **Destructive:** `hsl(var(--destructive))` - Used for dangerous actions (delete, logout).
- **Background:** `hsl(var(--background))` - Main application background.
- **Foreground:** `hsl(var(--foreground))` - Main text color.

### Typography
- **Font Family:** `Inter` (Sans-serif) for UI, `Cal Sans` for Display headers.
- **Scale:**
  - `text-xs`: 0.75rem (12px)
  - `text-sm`: 0.875rem (14px)
  - `text-base`: 1rem (16px)
  - `text-lg`: 1.125rem (18px)
  - `text-xl`: 1.25rem (20px)
  - `text-2xl`: 1.5rem (24px)
  - ...and so on.

### Spacing
We follow an 8px baseline grid.
- `p-1` = 4px
- `p-2` = 8px
- `p-4` = 16px
- `p-6` = 24px
- `p-8` = 32px

## 2. Component API

### Button
Located at: `src/components/ui/button.tsx`

**Props:**
- `variant`: `default` | `secondary` | `ghost` | `outline` | `destructive` | `glass`
- `size`: `sm` | `md` | `lg` | 'icon'
- `isLoading`: `boolean` - Shows a spinner and disables the button.

**Usage:**
```tsx
<Button variant="default" size="lg" onClick={handleClick}>
  Click Me
</Button>
```

### Card
Located at: `src/components/ui/card.tsx`

**Props:**
- `variant`: `default` | `glass` | `flat`
- `padding`: `none` | `sm` | `md` | `lg`

**Usage:**
```tsx
<Card variant="glass" padding="lg">
  <CardContent>...</CardContent>
</Card>
```

### Badge
Located at: `src/components/ui/badge.tsx`

**Props:**
- `variant`: `default` | `secondary` | `outline` | `success` | `warning` | `destructive`

**Usage:**
```tsx
<Badge variant="success">Online</Badge>
```

## 3. Accessibility Guidelines

- All interactive elements must have focus states (`focus-visible:ring`).
- Images must have `alt` text.
- Icons used as buttons must have `aria-label`.
- Color contrast must meet WCAG AA standards (checked via semantic colors).
- Use `rem` for font sizes to respect user preferences.

## 4. Dark Mode
Implemented via `dark` class on the `html` element.
- All colors use CSS variables (e.g., `--background`) that change values when `.dark` is active.
- Glassmorphism effects adapt opacity for dark mode (`bg-white/70` vs `bg-slate-900/70`).
