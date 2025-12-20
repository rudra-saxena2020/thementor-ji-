<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Tutor Ji - AI Powered Study Companion

This project is a React-based educational platform enhanced with AI capabilities.

## 📚 Documentation

- [Project Structure](./docs/structure.md) - Detailed explanation of the folder structure.
- [Design System](./docs/design-system.md) - Colors, typography, and component API.
- [Animation System](./docs/animation-system.md) - Animation guidelines and examples.
- [Performance Report](./docs/performance-report.md) - Optimization metrics and strategies.
- [QA Test Plan](./docs/qa-test-plan.md) - Testing strategy and matrix.
- [UX Audit](./docs/ux-audit.md) - UX findings and roadmap.

## 🎨 Design System

The application uses a custom design system built on top of Tailwind CSS.
- **Framework:** React + Tailwind CSS
- **Icons:** Lucide React
- **Theme:** Dark/Light mode support with semantic colors.

### Key Components
- **Glass Panel:** `.glass-panel` for the signature frosted glass look.
- **Premium Card:** `.premium-card` for standard content containers.
- **Animations:** Custom keyframes for `fade-in`, `slide-up`, `float`, etc.

## 🚀 Getting Started

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key.
3. Run the app:
   `npm run dev`

## Deployment Fix

If you encounter build errors related to `@react-three/fiber`, ensure you install dependencies with:
`npm install --legacy-peer-deps`

This resolves React version conflicts with the 3D avatar component.
