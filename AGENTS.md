# AGENTS.md

## Zeus Capital

You are working on Zeus Capital, a premium cryptocurrency brokerage and mining platform.

This project prioritizes maintainability, scalability, clean architecture, and exceptional user experience over rapid implementation.

---

## Documentation

The following files are considered part of the project's source of truth.

### DESIGN.md

Contains:

- Complete design system
- UI principles
- Layout rules
- Typography
- Color palette
- Components
- Motion
- Page structures
- Spacing
- UX guidelines

Always read and follow DESIGN.md before generating or modifying any UI.

UI work must never contradict DESIGN.md.

---

### PRODUCT.md

Contains

- Product vision
- Features
- User flows
- Business requirements

---

### ARCHITECTURE.md

Contains

- Folder structure
- Module boundaries
- Data flow
- Project architecture

Always follow these documents.

---

### ROADMAP.md

Contains:

- Development phases
- Project milestones
- Feature implementation order
- Current progress
- Planned improvements
- Long-term goals

Always use ROADMAP.md to understand what has been completed, what is currently being built, and what should be implemented next.

Do not skip phases or implement features out of order unless explicitly instructed.

### CHANGELOG.md

Contains:

- Version history
- New features
- Improvements
- Bug fixes
- Breaking changes
- Security updates

Update CHANGELOG.md whenever a meaningful change is made to the project.

Follow semantic versioning and keep entries concise, chronological, and easy to review.

---

## Tech Stack

- Bun
- TypeScript
- Next.js (App Router)
- Tailwind CSS v4
- shadcn/ui
- Better Auth
- Prisma ORM
- PostgreSQL
- React Hook Form
- Zod
- TanStack Query
- Zustand (only when necessary)
- Recharts
- D3.js
- Motion
- Biome
- Husky
- lint-staged

---

## Coding Standards

- Always use strict TypeScript.
- Never use `any`.
- Prefer Server Components.
- Keep Client Components as small as possible.
- Favor composition over inheritance.
- Prefer reusable abstractions.
- Never duplicate logic.
- Keep files focused on a single responsibility.
- Use descriptive names.
- Remove dead code.
- Avoid unnecessary dependencies.

---

## Project Principles

The codebase should remain:

- Modular
- Predictable
- Readable
- Testable
- Scalable
- Production-ready

Optimize for long-term maintainability rather than short-term speed.

---

## UI Principles

Never invent new visual styles.

Always reuse the existing design language defined in DESIGN.md.

Every page should feel like it belongs to the same application.

---

## Components

Before creating a new component:

1. Search for an existing one.
2. Reuse it if possible.
3. Extend it if necessary.
4. Create a new one only as a last resort.

---

## Styling

- Use Tailwind CSS.
- Avoid inline styles unless required.
- Prefer design tokens and reusable utilities.
- Maintain consistent spacing and typography.

---

## Charts

Never use TradingView.

Use reusable chart components built with Recharts or D3.

Charts must accept generic data through props.

---

## Data

Use mocked data during development unless instructed otherwise.

When integrating market data, read from the application's database rather than directly from external APIs whenever possible.

---

## Before Writing Code

Always:

- Understand the feature.
- Review existing implementations.
- Follow project conventions.
- Reuse existing utilities.
- Minimize complexity.

---

## Quality Checklist

Before considering any task complete:

- Code compiles.
- No lint errors.
- No TypeScript errors.
- Responsive.
- Accessible.
- Reusable.
- Matches DESIGN.md.
- No duplicated logic.
- Clean folder structure.
- Production quality.

## What Not To Do

- Never use npm, yarn, or pnpm only use bun
- Do not run npx, yarnx or pnpx only bunx
