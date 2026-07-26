# Zeus Capital Design System

## Design Philosophy

Zeus Capital should feel like a premium fintech platform built for trust, wealth, and simplicity.

The overall experience should communicate:

- Calm
- Trust
- Precision
- Sophistication
- Stability
- Simplicity
- Spaciousness
- Premium craftsmanship

The interface should never feel crowded, noisy, or overly "crypto."

### Inspiration

Take inspiration from products like:

- Apple
- Linear
- Stripe
- Vercel
- Arc
- Mercury
- Ramp
- Notion

Avoid the flashy aesthetic commonly seen in many crypto products.

---

# Design Principles

## Minimal First

Every element must have a purpose.

If removing something improves the interface, remove it.

---

## Editorial Layout

Pages should read like a premium magazine instead of a dashboard.

Use:

- Large typography
- Large imagery
- Large whitespace
- Strong hierarchy
- Clear reading flow

---

## Spacious Design

Whitespace is a feature.

Never try to fill every empty space.

Let components breathe.

---

## Consistency

Every page should feel like it belongs to the same product.

Typography, spacing, colors, cards, buttons, and layouts should remain consistent throughout the application.

---

# Layout System

## Global Container

```css
max-width: 88rem;
margin-inline: auto;
padding-inline: 24px;
width: 100%;
```

Never allow important content to stretch edge-to-edge.

---

## Vertical Rhythm

Use an **8px baseline grid** while favoring the **Fibonacci sequence** for larger spacing.

### Spacing Scale

| Token | Value |
| ----- | ----- |
| xs    | 8px   |
| sm    | 13px  |
| md    | 21px  |
| lg    | 34px  |
| xl    | 55px  |
| 2xl   | 89px  |
| 3xl   | 144px |

Recommended usage:

- Hero top padding → **144px**
- Section vertical spacing → **89px**
- Card padding → **34px**
- Component spacing → **21px**
- Small gaps → **13px**
- Tiny spacing → **8px**

Avoid arbitrary spacing values whenever possible.

---

# Border Radius

Everything should feel soft and modern.

| Component      | Radius |
| -------------- | ------ |
| Inputs         | 13px   |
| Buttons        | 999px  |
| Cards          | 21px   |
| Large Cards    | 34px   |
| Hero Container | 34px   |
| Modals         | 21px   |
| Images         | 21px   |

---

# Typography

## Primary Font

TT Norms Pro

Weights:

- 400
- 600

Never use bold weights heavier than 600.

---

## Heading Sizes

| Element         | Size |
| --------------- | ---- |
| Hero Title      | 72px |
| Section Title   | 56px |
| Feature Heading | 40px |
| Card Title      | 32px |
| Subheading      | 24px |
| Large Body      | 18px |
| Body            | 16px |
| Caption         | 14px |
| Small           | 13px |

---

## Letter Spacing

| Element       | Letter Spacing |
| ------------- | -------------- |
| Hero          | -0.04em        |
| Section Title | -0.03em        |
| Card Title    | -0.02em        |
| Body          | Normal         |

Large typography should always feel tight and premium.

---

# Color Palette

## Background

```
#F5F5F5
```

## Surface

```
#FFFFFF
```

## Dark Surface

```
#2B2644
```

## Primary Text

```
#000000
```

## Secondary Text

```
rgba(0,0,0,.7)
```

## Muted Text

```
rgba(0,0,0,.55)
```

## Borders

```
rgba(0,0,0,.08)
```

## Hover

```
#1F1F1F
```

### Rules

- Use black as the primary brand color.
- Use color sparingly.
- Never rely on bright gradients.
- Green and red should only represent market movement.

---

# Buttons

## Primary Button

- Black background
- White text
- Pill shape
- Large horizontal padding
- White circular icon container

Hover:

```
background: #1F1F1F;
```

---

## Secondary Button

- White
- Thin border
- Rounded pill

---

## Ghost Button

Transparent background.

Only text and icon.

---

# Cards

Cards should always feel premium.

Rules:

- Large padding
- Rounded corners
- One clear purpose
- No unnecessary borders
- Soft shadows only when elevation is needed

---

# Icons

Use:

- Lucide React

Sizes:

- 16px
- 18px
- 20px
- 24px
- 28px

Never use filled icons.

Always use outlined icons.

---

# Motion

Animations should feel calm.

Never playful.

## Duration

| Type   | Duration |
| ------ | -------- |
| Fast   | 150ms    |
| Normal | 200ms    |
| Slow   | 300ms    |

## Easing

```
ease-out
```

Hover effects may include:

- Background color
- Opacity
- Slight elevation
- Scale (1.01)

Never over-animate.

---

# Images

Images should be:

- Editorial
- High quality
- Large
- Rounded
- Minimal

Avoid obvious stock photography.

---

# Video

Videos should:

- Autoplay
- Loop
- Be muted
- Use object-cover
- Feel cinematic

---

# Page Structure

Every page should follow a consistent hierarchy.

```
Navbar

↓

Hero

↓

Primary Content

↓

Feature Sections

↓

CTA

↓

Footer
```

---

# Landing Page Structure

```
Navbar

↓

Hero

↓

Trust Section

↓

Core Value Proposition

↓

Feature Grid

↓

Product Modules

↓

Statistics

↓

Use Cases

↓

How It Works

↓

Testimonials

↓

FAQ

↓

Call To Action

↓

Footer
```

The hero should occupy the full viewport.

Users should understand the product before scrolling.

---

# About Page Structure

```
Navbar

↓

Hero

↓

Mission

↓

Vision

↓

Company Story

↓

Core Values

↓

Timeline

↓

Technology

↓

Security

↓

CTA

↓

Footer
```

The About page should feel like an annual report instead of a startup brochure.

---

# Pricing Page Structure

```
Navbar

↓

Hero

↓

Pricing Cards

↓

Feature Comparison

↓

Frequently Asked Questions

↓

CTA

↓

Footer
```

Pricing should emphasize clarity over marketing.

---

# Contact Page Structure

```
Navbar

↓

Hero

↓

Contact Options

↓

Office Locations

↓

Contact Form

↓

Map (optional)

↓

CTA

↓

Footer
```

---

# Documentation Page Structure

```
Navbar

↓

Sidebar

↓

Content

↓

Related Articles

↓

Previous / Next Navigation
```

Reading experience always comes first.

---

# Dashboard Philosophy

Marketing pages should inspire.

Dashboards should inform.

Dashboard design principles:

- Dense but not crowded
- Fast to scan
- Consistent spacing
- Highly reusable components
- Information first
- Visual polish second

---

# Dashboard Layout

```
Sidebar

+

Top Navigation

↓

Overview Cards

↓

Charts

↓

Tables

↓

Widgets
```

Spacing:

- Card padding → 24–34px
- Grid gap → 24px
- Widget spacing → 16–24px

---

# Component Guidelines

Every component should be:

- Reusable
- Composable
- Accessible
- Responsive
- Typed
- Variant-driven

Never duplicate components.

---

# Content Guidelines

Copy should be:

- Short
- Clear
- Premium
- Confident

Avoid:

- Buzzwords
- Marketing fluff
- Excessive capitalization
- Emoji

---

# AI Design Rules

When generating new pages:

1. Reuse the same spacing scale.
2. Reuse the typography system.
3. Keep content inside the 88rem container.
4. Use large whitespace instead of dividers.
5. Every section should have a single visual focus.
6. Prefer asymmetrical but balanced layouts.
7. Never use more than three primary colors per page.
8. Keep button styles consistent.
9. Reuse the same card language across the application.
10. Use premium editorial layouts over traditional SaaS layouts.
11. Prioritize readability over decoration.
12. Favor composition and reusable sections over one-off designs.
13. Every page should feel like part of the same product family.

---

# Overall Design Goal

Zeus Capital should feel like a product built by a world-class fintech company.

The experience should be:

- Premium
- Calm
- Trustworthy
- Modern
- Spacious
- Timeless
- Elegant
- Highly polished

Every screen should communicate confidence before functionality.
