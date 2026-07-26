# CHANGELOG.md

All notable changes to Zeus Capital are documented here.

---

# Unreleased

## Added

- Initial project structure
- AGENTS.md
- DESIGN.md
- PRODUCT.md
- ARCHITECTURE.md
- ROADMAP.md
- CHANGELOG.md

# v0.7.0

## Added

- Designed database `Notification` schema mapping to user profiles.
- Created `/api/notifications` and `/api/admin/notifications` routes to manage fetch, read, and dispatch procedures.
- Configured automated security notifications for user compliance reviews (KYC approved/rejected).
- Built dynamic dashboard header notifications bell querying live DB states.
- Implemented administrators user dashboard tools to dispatch user-specific notifications or global broadcasts.

# v0.6.0

## Added

- Fully integrated marketing homepage (`page.tsx`) mapping anchors to custom layouts.
- Dedicated Features sub-page (`/features`) displaying infrastructure capabilities.
- Pricing sub-page (`/pricing`) displaying hashing package tiers alongside a dynamic interactive yield calculator.
- Dedicated FAQ page (`/faq`) with categorized accordion selectors.
- Contact page (`/contact`) with support forms and location addresses.

# v0.5.0

## Added

- Codebase formatting cleanup and imports organization across 145 files using Biome.
- Fixed Better Auth client-side reset password initiation type signature issues on forgot-password forms.

# v0.4.0

## Added

- Database-backed Price Override schemas (`PriceOverride` model) and administration endpoints (`/api/admin/prices`).
- Dynamic override check interceptors integrated directly inside ticker feeds (`/api/market/top-coins`) and historical charts (`/api/market/chart`).
- Rebuilt Admin pricing override view to modify active database records.
- Custom responsive D3.js historical chart component (`components/MarketChartD3.tsx`) with area gradient fills and interactive pointer-tracking crosshairs.

# v0.3.0

## Added

- Admin Dashboard Layout with responsive navigation sidebars and safety route controls (`/admin/layout.tsx`).
- Live user registry table (`/admin/users`) with promotion/demotion privileges toggling endpoints (`/api/admin/users`).
- Manual KYC Queue review controller (`/admin/kyc`) with file viewers and auditor check approvals/rejections (`/api/admin/kyc/review`).
- Interactive configurations panels for Mining Plan clusters, Exchange Price Overrides, Transactions Ledger registers, Deposit checkers, and Withdrawal releases.

# v0.2.0

## Added

- CoinGecko historical index server router (`/api/market/chart`) and client chart container.
- CoinGecko top 10 rankings router (`/api/market/top-coins`) and ScrollArea display table.
- Dashboard quick actions menu hub.
- Top navigation bar profile dropdown (integrating signout triggers) and notification feed modal.
- KYC database model schema (`Kyc`) and POST upload controller (`/api/kyc/submit`).
- File uploading with previews (Front of ID, Back of ID, Proof of Address) and extras compliance options inside KYC.
- Form validation using React Hook Form, Zod schema resolvers, and custom Base UI select dropdown overlays in the KYC wizard.
- Added Verified (Approved), Pending, and Rejected states inside the KYC tab with auditor feedback details.
- Integrated Sonner toast loaders, success markers, and warning indicators for document uploads and submission events.
- Overrode default Sonner toast CSS variables to match the dark premium theme (`#111114` background and white text).
- Added global cache invalidation in `lib/prisma.ts` to reload generated Prisma client schemas dynamically.
- Migrated KYC status field from a plain string type to a native Postgres `KycStatus` enum.

## Changed

- Fixed input text colors to white for visibility in dark-mode dashboard pages (KYC and settings panels).
- Shifted user profile and signout controls from left sidebar drawers to top navbar profile dropdowns.
- Fixed custom `Button` component children layout wrapping to display inline (preventing stacked icon/text elements).

---

# v0.1.0

## Added

- Next.js project
- TypeScript
- Tailwind CSS
- shadcn/ui
- Biome configuration

## Changed

- Initial project branding to Zeus Capital

## Planned

- Marketing website
- Authentication
- Dashboard
- Admin Panel

---

# Changelog Rules

Every release should document:

## Added

New functionality.

## Changed

Modified behavior.

## Fixed

Bug fixes.

## Removed

Removed functionality.

## Security

Security-related improvements.

Follow semantic versioning:

Major.Minor.Patch

Example:

1.0.0
1.1.0
1.1.1