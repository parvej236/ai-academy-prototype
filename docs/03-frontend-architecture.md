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
    landing/           hero simulator console
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

## Conventions
- Pages are client components because they're interactive. Don't export helpers from `page.tsx`; put them in `lib/`.
- Tables use `.tbl`, form controls `.field` and `.label`, and buttons `.btn` with `btn-primary`, `btn-glass`, `btn-ghost`, `btn-danger`, `btn-sm` or `btn-lg`.
- Run `npm run build` before committing. It type-checks and prerenders all 49 routes.
