# AGENTS.md

## Zeus Capital

You are working on Zeus Capital, a premium cryptocurrency brokerage and mining platform.

This project prioritizes maintainability, scalability, clean architecture, and exceptional user experience over rapid implementation.

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

Always reuse the existing design language from shadcn/ui.

Every page should feel like it belongs to the same application.

---

## Components

Before creating a new component:

1. ShadCN most likey have it, and all of ShadCN components are already in the codebase so deploy a subagent to research if that componet exists.
2. Reuse it if possible.
3. Never modify shadcn components.

---

## Styling

- Use Tailwind CSS.
- Avoid inline styles unless required.
- Prefer design tokens and reusable utilities.
- Maintain consistent spacing and typography.

---

## Charts

Never use TradingView.

Use reusable chart components built with Recharts.

Charts must accept generic data through props.

---

## Data

Never use mocked data unless instructed otherwise.

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
- bunx dont work no more so run bunx --bun
