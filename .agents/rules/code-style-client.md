---
trigger: glob
globs: /client/**
---

# Client Coding Style

## Core Principles
- **Architecture:** Feature-based folder structure. Keep logic inside `features/` folders.
- **Naming:** Use camelCase for all variables, functions, and non-component files. Use PascalCase for React components.
- **Variable Names:** Keep names clear and self explanatory. 
Files & Schemas:** Use descriptive names (e.g., analysisSchema.ts, authService.ts).
- **Comments:** Minimal use of comments, only where necesary and Strictly NO Emojis in the comments. Logic must be self-explanatory through naming.

## State Management (Redux Toolkit)
- Use `createSlice` for global UI state (auth, theme, settings).
- Use **RTK Query** (`createApi`) for all server state and API interactions.
- Use auto-generated hooks (e.g., `useGetHistoryQuery`) in components.
- Centralize API endpoints in `src/services/api.ts` or feature-specific slices.

## Forms & Validation (React Hook Form + Zod)
- Use `react-hook-form` for all forms, especially the 30-input analysis form.
- Use **Uncontrolled Components** via the `register` method to maximize performance and avoid re-renders.
- Integrate validation using `@hookform/resolvers/zod` with a strict Zod schema.
- Define all Zod schemas in `@/types/schemas.ts` or alongside the feature.

## UI & Styling (Tailwind CSS)
- Use utility classes directly in `className`. 
- Avoid creating separate CSS files or `styled-components`.
- Use the `cn()` utility (clsx + tailwind-merge) for conditional classes.

## TypeScript Requirements
- Strictly avoid `any`. Define interfaces for all API responses and Redux state.
- Use `Template Literal Types` for specific string constants (e.g., themes, statuses).
- Export types and interfaces from a central `@/types` directory when shared.