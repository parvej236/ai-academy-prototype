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

## Illustrations and media

**Illustrations** live in `frontend/src/components/illustrations`. They are hand-drawn SVG React components, flat with no gradients, using only brand colours and the 45° diamond motif from the logo:

| Component | Where it's used |
|---|---|
| `LearnArt`, `LabArt`, `ExamArt`, `CertifyArt` | Home page, "From first lesson to a certificate" steps |
| `LiveArt` | Home page, live classes panel |
| `PortScene` | Login and sign-up side panel (on navy) |
| `LostArt` | 404 page |
| `EmptyArt` | Every empty state, through `<Empty>` |
| `CategoryGlyph` | Course covers: one white line icon per category |

All illustrations are decorative (`aria-hidden`), and the text next to them says the same thing.

**Product tour video** lives in `frontend/public/media`, with a voice-over in each language:

| File | Purpose |
|---|---|
| `ai-academy-tour-en.mp4` | Tour narrated in English (voice: Andrew), 1080p H.264 with AAC audio |
| `ai-academy-tour-bn.mp4` | Tour narrated in Bangla (voice: Pradeep) |
| `captions-en.vtt`, `captions-bn.vtt` | Captions matching each narration, off by default |
| `ai-academy-tour-poster.jpg` | Poster shown before play |

The player loads the version that matches the site language and switches when the language changes.

The video is only downloaded when someone presses play. To re-record it after screens change, see `tools/tour-video/` and [03-frontend-architecture.md](03-frontend-architecture.md#product-tour-video).

## Rules we hold to

- One accent colour. Status colours never carry decoration.
- No gradients, glows or floating badges.
- Motion only on the hero entrance and in response to user actions. `prefers-reduced-motion` turns all of it off.
- Sentence case everywhere, plain verbs on buttons ("Save score", not "Submit"), and errors that say how to fix the problem.
- Numbered markers only where the content really is a sequence (learning path, how-it-works, publishing workflow).
- Responsive down to 375px with no horizontal scroll. Grid children get `min-width: 0` globally for this.
