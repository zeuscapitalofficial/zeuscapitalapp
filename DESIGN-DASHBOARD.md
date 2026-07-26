# DESIGN-DASHBOARD.md

# Zeus Capital Dashboard Design System

## Design Philosophy

The dashboard should feel like a premium trading terminal built for professional investors.

The interface should communicate:

- Precision
- Performance
- Intelligence
- Confidence
- Control
- Clarity

Unlike the landing page, beauty should never compromise usability.

Users should feel capable within seconds.

---

# Inspiration

Primary references:

- Linear
- Raycast
- Arc Browser
- Vercel
- Perplexity
- Coinbase Advanced
- Trading terminals
- Apple Pro Apps

Avoid:

- Busy Binance clones
- Neon cyberpunk
- Glass overload
- Excessive gradients
- Cartoonish crypto dashboards

---

# Visual Language

Keywords:

Minimal

Dark

Professional

Premium

Elegant

Dense

Focused

Technical

Calm

Sophisticated

---

# Theme

Dark-first.

Light mode optional.

Dark mode should be considered the primary experience.

---

# Color Palette

## Background

```
#09090B
```

Primary application background.

---

## Sidebar

```
#0E0E11
```

---

## Card

```
#111114
```

---

## Elevated Card

```
#17171B
```

---

## Hover

```
#1D1D22
```

---

## Border

```
rgba(255,255,255,.06)
```

---

## Primary Text

```
#FFFFFF
```

---

## Secondary Text

```
rgba(255,255,255,.72)
```

---

## Muted Text

```
rgba(255,255,255,.48)
```

---

## Success

```
#22C55E
```

---

## Danger

```
#EF4444
```

---

## Warning

```
#F59E0B
```

---

## Accent

Use a subtle indigo accent.

```
#8B7CFF
```

Only for:

- active navigation
- focused buttons
- charts
- selected states

Never dominate the interface.

---

# Grid

Desktop

12-column grid

Gap

24px

Container

Fluid

Padding

32px

---

# Spacing

Follow 8px spacing with Fibonacci for larger layouts.

Scale

```
8
16
24
32
48
64
96
144
```

Section gap

64px

Card padding

24–32px

Widget spacing

24px

Sidebar spacing

20px

---

# Border Radius

Cards

20px

Buttons

14px

Inputs

14px

Dialogs

20px

Charts

20px

Tables

16px

---

# Typography

Primary

TT Norms Pro

Weights

400

500

600

Never use bold.

---

# Typography Scale

Dashboard Heading

48px

Page Heading

36px

Section Heading

28px

Widget Title

22px

Card Heading

18px

Body

15px

Small

13px

Caption

12px

---

# Layout

```
Sidebar

+

Main Content

↓

Top Navigation

↓

Overview Widgets

↓

Analytics

↓

Tables

↓

Activity
```

---

# Sidebar

Width

280px

Contains

Logo

Navigation

Workspace

Support

Settings

User Profile

Sections separated with generous spacing.

Active item uses:

- subtle glow
- darker background
- left accent indicator

---

# Top Navigation

Contains:

Breadcrumb

Search

Notifications

Theme Toggle

Wallet

Profile

Height

72px

Sticky

Blurred background

Thin bottom border

---

# Cards

Every card should have:

Large radius

Dark surface

Thin border

Subtle shadow

Large spacing

Cards should never feel cramped.

---

# Widgets

Each widget has:

Header

↓

Primary metric

↓

Supporting metric

↓

Chart

↓

Actions

Every widget should have a single responsibility.

---

# Tables

Large row height

56–64px

Rounded container

Sticky header

Hover state

Minimal borders

Icons before names

Positive values

Green

Negative values

Red

---

# Charts

Never embed TradingView.

Use Recharts.

Charts should support:

Area

Line

Bar

Portfolio

Asset Allocation

Performance

Mining

Revenue

Every chart receives data through props.

---

# Motion

Duration

150ms

200ms

250ms

Ease

ease-out

Hover

Slight elevation

Opacity

Background transition

Tiny scale (1.01)

Never bounce.

Never overshoot.

---

# Icons

Lucide

20px default

24px for navigation

16px for inline

Always outline.

---

# Shadows

Keep shadows subtle.

Cards should appear elevated without obvious blur.

---

# Blur

Only use backdrop blur for:

Navigation

Dialogs

Dropdowns

Never blur every surface.

---

# Dashboard Components

Navigation

Breadcrumb

Search

Profile Dropdown

Sidebar

Widgets

Metric Cards

Charts

Tables

Activity Feed

Wallet Cards

Portfolio Cards

Mining Cards

Coin Cards

Notifications

Dialogs

Drawers

Settings Panels

Every component must be reusable.

---

# Dashboard UX Rules

Users should always know:

Where they are.

What changed.

What requires attention.

What action is available.

---

# Information Hierarchy

Large number

↓

Context

↓

Trend

↓

Visualization

↓

Actions

Never reverse this order.

---

# AI Rules

When generating dashboard pages:

- Prioritize information over decoration.
- Reuse widgets whenever possible.
- Maintain consistent spacing.
- Keep navigation predictable.
- Never overload a page.
- Every chart should tell one story.
- Every card should have one purpose.
- Keep actions close to the information they affect.
- Prefer progressive disclosure over clutter.
- Maintain a premium, institutional-grade appearance.

---

# Overall Goal

The dashboard should feel like software used by hedge funds and institutional investors rather than a retail crypto exchange.

The experience should be:

- Fast
- Premium
- Calm
- Intelligent
- Professional
- Trustworthy
- Timeless