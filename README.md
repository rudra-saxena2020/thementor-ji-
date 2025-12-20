<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Tutor Ji - AI Powered Study Companion

This project is a React-based educational platform enhanced with AI capabilities.

## Project Structure

The project follows a modular and scalable structure designed for maintainability and separation of concerns.

```
Root/
├── src/                    # Primary source code
│   ├── components/         # Reusable UI components (colocated with styles/tests)
│   ├── pages/              # Page-level components (views)
│   ├── services/           # API services and external integrations (e.g., AI, Auth)
│   ├── context/            # React Context providers (Global state)
│   ├── utils/              # Shared utility functions
│   ├── data/               # Static and mock data files
│   ├── assets/             # Static assets (images, icons)
│   ├── app.tsx             # Main application component
│   └── main.tsx            # Application entry point
├── tests/                  # Test suites
│   ├── unit/               # Unit tests
│   └── integration/        # Integration tests
├── docs/                   # Project documentation
├── config/                 # Configuration files
└── public/                 # Public static files
```

### Key Conventions

- **File Naming**: Kebab-case (e.g., `user-auth-info.tsx`, `dashboard-ai.ts`) is used for all files and directories.
- **Colocation**: Related files are kept together.
- **Components**: Reusable UI elements located in `src/components`.
- **Pages**: Top-level views located in `src/pages`.
- **Services**: Business logic and API calls in `src/services`.

## Run Locally

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
