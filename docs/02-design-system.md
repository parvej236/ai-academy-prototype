# Design system

Light theme only. The goal is a calm, premium product for professionals: flat paper ground, frosted white panels, hairline borders, one accent colour. No decorative gradients.

## Colour

Tokens live in `frontend/src/app/globals.css` (`:root`) and are exposed to Tailwind through `@theme`.

| Token | Value | Use |
|---|---|---|
| `--paper` | `#f5f6fa` | Page background |
| `--text` | `#0f1433` | Body text, headings |
| `--muted` | `#4a5276` | Secondary text |
| `--faint` | `#7a82a5` | Captions, meta |
| `--line` | `rgba(27,34,102,.10)` | Borders and dividers |
| `--indigo` | `#4646e8` | The single accent: primary buttons, links, active nav, selection |
| `--cyan` | `#0b93ab` | Data series 1, progress bars |
| `--orchid` | `#b02fd1` | Data series 2, AI-generated content markers |
| `--mint` / `--amber` / `--rose` | `#0f9a68` / `#b86e00` / `#d6304f` | Status only: good / warning / bad |

Cyan and orchid come from the Tradevics logo. On white they are deepened to hold contrast.

`.on-dark` re-scopes the text tokens for dark artwork: video stage, course covers, certificates.

**Charts.** Series colours were checked with a palette validator against the white surface: S1 `#0b93ab`, S2 `#b02fd1`, colour-blind ΔE 9.6, contrast ≥ 3:1. There is one y-axis per chart, and two-series charts always carry a legend.

## Type

| Script | Face | Notes |
|---|---|---|
| Latin | Inter | Body and headings. Headings are semibold with −0.025em tracking |
| Bangla | Noto Sans Bengali | Swapped in when `<html lang="bn">`; headings get 1.35 line-height |

Both fonts are loaded with `next/font/google` and self-hosted at build time. Numbers use tabular figures (`.tnum`). In Bangla mode, `n()` from `useT()` renders Bangla numerals.

## Surfaces

| Class | Use |
|---|---|
| `.glass` | Default panel: 82% white, 22px blur, hairline border, soft shadow |
| `.glass-strong` | Modals, menus, the hero console |
| `.glass-inset` | Wells inside a panel (document fields, notes) |
| `.edge-lit` | Indigo ring for the one panel that matters most on a screen |

Panels use a 22px radius, controls 12px, and buttons and tabs are pills.

## Components

All shared components are in `frontend/src/components/ui/index.tsx`:

- `Panel`, `PanelHead`, `PageHeader`, `Stat`
- `Badge`, `StateBadge`, `Bar`
- `Tabs`, `Modal`, `Switch`, `Toaster`, `Empty`
- `Avatar`, `Cover`, `Logo`

Charts (`LineChart`, `BarChart`, `Radar`, `Ring`, `BarList`) are hand-built SVG with hover tooltips, in `components/charts`.

String props on `PageHeader`, `PanelHead`, `Tabs`, `Stat` and `Empty` are translated automatically.

## Rules we hold to

- One accent colour. Status colours never carry decoration.
- No gradients, glows or floating badges.
- Motion only on the hero entrance and in response to user actions. `prefers-reduced-motion` turns all of it off.
- Sentence case everywhere, plain verbs on buttons ("Save score", not "Submit"), and errors that say how to fix the problem.
- Numbered markers only where the content really is a sequence (learning path, how-it-works, publishing workflow).
- Responsive down to 375px with no horizontal scroll. Grid children get `min-width: 0` globally for this.
