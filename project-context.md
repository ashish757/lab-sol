---
trigger: always_on
---

# Project Overview & Business Logic

## The Product
- **Name:** Enterprise Analysis Tool
- **Core Function:** A high-performance web and desktop application that processes ~30 complex inputs to perform proprietary calculations and generate enterprise reports (PDF/Excel).
- **Users:** Internal analysts who require data accuracy and low-latency input handling.

## Monorepo Architecture
- **Root Directory:** Contains `client/` and `server/`.
- **Client:** React + Vite (Frontend). Focus on performant data entry and visualization.
- **Server:** NestJS + Prisma (Backend). Focus on "Secret Math" logic and document generation.
- **Shared:** (If applicable) Shared Zod schemas and TypeScript interfaces.


## Instruction to Agent
- When working on the **Client**, always reference the business goals in this file to ensure the UI supports high-density data entry.
- When working on the **Server**, ensure the math logic is robust and follows the enterprise reporting requirements.
