# Front-end architecture

## Stack
Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS 4, lucide-react icons. There are no other runtime dependencies.

`next.config.ts` sets `agentRules: false`, so Next.js doesn't write an `AGENTS.md` into the folder.

## Layout

```
frontend/src/
  app/
    (site)/            public site: landing, courses, course page, live, pricing, verify
    (auth)/            login, sign-up with email OTP step
    app/               learner workspace       → <PortalShell role="student">
    mentor/            mentor & tutor portal   → <PortalShell role="mentor">
    admin/             admin portal            → <PortalShell role="admin">
    globals.css        tokens, glass surfaces, controls
    layout.tsx         fonts, StoreProvider, Toaster
  components/
    ui/                shared primitives
    charts/            SVG charts
    shell/             site header/footer, portal shell + Paywall
    landing/           hero simulator console, product tour video player
    illustrations/     SVG illustrations and course category glyphs
  lib/
    data.ts            all dummy data and types (the future API contract)
    store.tsx          client state + actions (stand-in for API calls)
    i18n.tsx           Bangla/English dictionary, useT(), LangToggle
    time.ts, next.ts   small helpers
```

## State
`lib/store.tsx` is a React context persisted to `localStorage`. It holds:

- the session user and plan
- language
- enrolments and lesson completion
- forum threads
- exam and lab results
- live-class reminders and notifications

Admin screens keep their edits in local component state, seeded from `lib/data.ts`.

`PortalShell` redirects to `/login` when there's no user, and enforces portal access: admin-only for `/admin`, mentor or admin for `/mentor`. `Paywall` hides paid features from users without a plan.

## Bangla / English
`useT()` returns `t(english)`, which looks up a Bangla string keyed by the English text and falls back to English, plus `n()` for Bangla numerals.

The toggle sets `<html lang>`, which switches the font. UI chrome is translated, including navigation, shells, landing, auth, page and panel headings, and common actions.

Course content, questions and forum posts stay in their authored language. The CMS has a Bangla title field, and bilingual content fields should come from the API.

## Where the backend plugs in

| Front-end piece | Replace with |
|---|---|
| `lib/data.ts` exports | `GET` endpoints with the same shapes |
| `store.login/signup` | Auth API: email or mobile + password, 6-digit email OTP, JWT/session cookie |
| `store.subscribe` + `/pricing` checkout | Payment gateway redirect (bKash, Nagad, SSLCommerz) and webhook |
| Lab answers scored in `app/app/lab/[id]` | Simulator Agent + Evaluation Engine API (stream turns, return rubric scores) |
| Exam question draw in `app/app/exams/[id]` | Examiner Agent endpoint that returns a fresh question set per attempt |
| `/admin/questions` "Generate" | Examiner Agent generation job, results stored as drafts |
| Live room captions and notes | Meeting provider (Zoom or Jitsi) + transcription pipeline events |
| Toast-only admin actions (save, export, rotate key) | Corresponding admin endpoints, with audit log writes |

## Product tour video

The home-page video is recorded from the running app, so it shows real screens, and has a voice-over in English and Bangla. To rebuild it after the UI or the script changes:

```bash
# one-time setup, outside the repo
mkdir -p /tmp/tour && cd /tmp/tour
npm init -y && npm i playwright-core
python3 -m venv venv && ./venv/bin/pip install imageio-ffmpeg pillow edge-tts

# with the app running on http://localhost:3000
node <repo>/tools/tour-video/capture.mjs http://localhost:3000 frames <repo>/frontend/public/mark.png
./venv/bin/python <repo>/tools/tour-video/build.py frames <repo>/frontend/public/media en bn
```

| File | What it does |
|---|---|
| `tools/tour-video/capture.mjs` | Drives Chrome (`/usr/bin/google-chrome`) through 15 scenes and saves screenshots |
| `tools/tour-video/narration.json` | The voice-over script: one line per scene in each language, and the voice for each language |
| `tools/tour-video/build.py` | Synthesises the narration, times each scene to its line, adds the zoom and crossfades, mixes and normalises the audio, and writes both videos, captions and the poster |

To change what the narrator says, edit `narration.json` and rerun `build.py`. Delete the `.tts-<lang>` folder inside the output directory to force fresh audio. The scene list in `capture.mjs` and the lines in `narration.json` must stay the same length.

**Voice licensing.** The voices come from Microsoft's free Read Aloud service through `edge-tts`. That's fine for a prototype and client demos, but its terms don't clearly cover commercial use. Before public launch, either record a human voice artist with the same script, or generate the audio through Azure AI Speech (paid, licensed for commercial use, same voices). Either way, only the audio step changes.

## Conventions
- Pages are client components because they're interactive. Don't export helpers from `page.tsx`; put them in `lib/`.
- Tables use `.tbl`, form controls `.field` and `.label`, and buttons `.btn` with `btn-primary`, `btn-glass`, `btn-ghost`, `btn-danger`, `btn-sm` or `btn-lg`.
- Run `npm run build` before committing. It type-checks and prerenders all 49 routes.
