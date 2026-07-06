# Ex Books — Design System

## Direction
Warm editorial marketplace. A friendly, approachable aesthetic for a campus book exchange — combining the trustworthiness of a library with the energy of a student community.

## Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | oklch(0.97 0.005 80) | Page background — warm cream |
| `--foreground` | oklch(0.2 0.03 50) | Primary text — warm charcoal |
| `--card` | oklch(0.98 0.01 75) | Card surfaces — near-white warm |
| `--primary` | oklch(0.55 0.18 30) | CTAs, links — terracotta/rust |
| `--accent` | oklch(0.65 0.08 150) | Highlights, badges — sage green |
| `--muted` | oklch(0.92 0.02 75) | Secondary backgrounds |
| `--border` | oklch(0.88 0.025 75) | Dividers, borders |

## Gradients

| Name | Value |
|------|-------|
| `--gradient-hero` | linear-gradient(160deg, oklch(0.94 0.02 70) 0%, oklch(0.97 0.01 80) 50%, oklch(0.94 0.015 160 / 0.15) 100%) |
| `--gradient-warm` | linear-gradient(135deg, oklch(0.98 0.01 75) 0%, oklch(0.95 0.02 70) 100%) |
| `--gradient-primary` | linear-gradient(135deg, oklch(var(--primary)), oklch(var(--accent))) |
| `--gradient-subtle` | linear-gradient(180deg, oklch(var(--card)), oklch(var(--background))) |

## Background Design

The page background uses a **multi-layer radial gradient system** for visual depth:
- **Top-left glow**: warm terracotta-tinted radial gradient (oklch(0.94 0.02 70 / 0.5))
- **Bottom-right glow**: subtle sage green radial gradient (oklch(0.92 0.015 160 / 0.2))
- **Top-center wash**: soft warm cream overlay (oklch(0.96 0.01 80 / 0.6))
- All gradients are `background-attachment: fixed` for a parallax-like depth effect

## Patterns

| Utility | Description |
|---------|-------------|
| `.bg-pattern-dots` | Subtle dot grid using foreground at 4% opacity, 24px spacing |
| `.bg-pattern-grid` | Faint line grid using border color at 30% opacity, 40px spacing |
| `.bg-pattern-subtle` | Primary-tinted dots at 3% opacity, 32px spacing |

## Shadows

| Utility | Description |
|---------|-------------|
| `.shadow-subtle` | Soft ambient shadow for cards |
| `.shadow-elevated` | Deep shadow for hover states |
| `.shadow-warm` | Warm-tinted shadow with primary color influence |
| `.glow-primary` | Primary-colored ambient glow for featured elements |
| `.glow-accent` | Accent-colored ambient glow |

## Glass Effects

| Utility | Description |
|---------|-------------|
| `.glass-card` | Frosted glass card with 85% opacity, 12px blur |
| `.glass-hero` | More transparent frosted glass with 70% opacity, 16px blur |

## Typography

- **Display**: Space Grotesk — bold, geometric, modern
- **Body**: Plus Jakarta Sans — clean, readable, friendly
- **Mono**: Geist Mono — technical, precise

## Zones

| Zone | Background | Treatment |
|------|------------|-----------|
| Header | `bg-card` + `border-b` + `shadow-subtle` | Sticky, elevated |
| Hero | `bg-hero-gradient` + decorative blobs | Full visual impact |
| Content sections | `bg-background` + radial gradients | Warm, inviting |
| Alternating sections | `bg-muted/30` + `bg-pattern-dots` | Visual rhythm |
| Cards | `bg-card` + `shadow-subtle` | Clean, elevated |
| Footer | `bg-card` + `border-t` | Grounding |

## Motion

- Entrance animations via `motion/react` with `whileInView` + `viewport={{ once: true }}`
- Stagger children with `delay: index * 0.1`
- Hover transitions: `transition-smooth` (0.3s cubic-bezier)
- Interactive elements: scale + shadow transitions
