# ARCHITECTURE.md

# Architecture

Zeus Capital follows a modular monolith architecture.

The project remains in a single repository while keeping features isolated.

---

# High Level Structure

```
app/
components/
features/
lib/
hooks/
types/
prisma/
public/
```

---

# Feature Modules

```
features/

auth/
market/
portfolio/
wallet/
mining/
transactions/
notifications/
settings/
support/

admin/

shared/
```

Each module owns:

- UI
- Hooks
- Services
- Types
- Validation
- Utilities

---

# Components

Shared UI belongs in:

```
components/
```

Feature-specific components belong inside their feature.

Example:

```
features/mining/components/
```

Never place feature-specific UI inside the global components directory.

---

# Lib

```
lib/

auth/

db/

api/

charts/

utils/

constants/

validators/
```

---

# State Management

Use:

Server Components whenever possible.

TanStack Query

Only use Zustand when truly necessary.

Avoid unnecessary global state.

---

# Data Flow

```
Client

↓

Server Component

↓

Server Action / Route Handler

↓

Service

↓

Prisma

↓

Database
```

Business logic should never live inside components.

---

# API

Route Handlers should remain thin.

Move business logic into services.

---

# Forms

React Hook Form

↓

Zod Validation

↓

Server Action

↓

Database

---

# Charts

Charts should be reusable.

Charts must never fetch their own data.

They should only receive props.

---

# Folder Rules

One responsibility per file.

One responsibility per component.

Avoid files larger than ~300 lines unless justified.

---

# Naming

Components

PascalCase

Hooks

camelCase with use prefix

Utilities

camelCase

Constants

UPPER_SNAKE_CASE where appropriate

---

# General Rules

Prefer composition.

Avoid inheritance.

Avoid deeply nested components.

Extract reusable logic.

Keep imports organized.

Never duplicate business logic.