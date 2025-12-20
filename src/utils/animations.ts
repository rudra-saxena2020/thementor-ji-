export const ANIMATIONS = {
  FADE_IN: 'animate-fade-in',
  SLIDE_UP: 'animate-slide-up',
  SCALE_IN: 'animate-scale-in',
  FLOAT: 'animate-float',
  PULSE_SLOW: 'animate-pulse-slow',
  ACCORDION_DOWN: 'animate-accordion-down',
  ACCORDION_UP: 'animate-accordion-up',
};

export const TRANSITIONS = {
  DEFAULT: 'transition-all duration-300 ease-in-out',
  FAST: 'transition-all duration-150 ease-out',
  SLOW: 'transition-all duration-500 ease-in-out',
};

export const VARIANTS = {
  BUTTON: {
    PRIMARY: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-primary/25',
    SECONDARY: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    GHOST: 'hover:bg-accent hover:text-accent-foreground',
    OUTLINE: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    DESTRUCTIVE: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    GLASS: 'glass-button text-white',
  },
  CARD: {
    DEFAULT: 'premium-card',
    GLASS: 'glass-panel',
    HOVER: 'hover:shadow-lg hover:-translate-y-1',
  }
};
