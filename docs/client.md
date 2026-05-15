# Client Documentation

The frontend of the Enterprise Analysis Tool is built to prioritize performant data entry and clear visualization.

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Form Handling**: React Hook Form
- **Validation**: Zod & `@hookform/resolvers`
- **Routing**: React Router DOM

## Core Requirements

- **Zero Lag Data Entry**: The form contains ~30 complex inputs. Typing must be instantaneous. We achieve this by using uncontrolled components via `react-hook-form` rather than relying on standard React state (`useState`) for every keystroke.
- **Validation**: Inputs are strictly validated on the client side using Zod before submission to minimize server load and provide immediate feedback to the analyst.

## Structure

- `src/features/analysis/`: Contains the core analysis forms and views (e.g., `AnalysisForm.tsx`).
- `src/pages/`: Contains the top-level route pages (e.g., `AnalysisPage.tsx`).
- `src/types/`: Contains shared TypeScript types and Zod schemas (e.g., `analysisSchema.ts`).

## Styling Guidelines

We use Tailwind CSS v4. Ensure all new components utilize Tailwind utility classes to maintain a consistent, modern, and responsive design.
