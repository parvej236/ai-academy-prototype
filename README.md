<p align="center">
  <img src="frontend/public/mark.png" alt="AI Academy logo" width="96" />
</p>

<h1 align="center">AI Academy</h1>

<p align="center">
  Customs and trade training platform by <strong>Tradevics AI</strong><br />
  Courses, AI case simulations, exams, mentoring and expert-led live classes for importers, C&amp;F agents and tax practitioners in Bangladesh.
</p>

---

## About

AI Academy is the training arm of Tradevics AI and is delivered as **Module 13** of the Tradevics platform. It's a paid platform: every feature, including expert-led live classes, requires a subscription. The academy's subject experts author the curriculum. The AI generates questions, simulations and grading from that material, not the syllabus itself.

> **Status:** the front end is complete and runs on dummy data stored in the browser. The backend and database aren't built yet. [docs/03-frontend-architecture.md](docs/03-frontend-architecture.md) lists where each API plugs in.

## Features

| Area | What's included |
|---|---|
| **Learner workspace** | Dashboard with a skill radar, skill-gap analysis and personalised learning path. Course player with AI lecture notes and transcript. Certificates and plan settings |
| **Practical lab & simulator** | Real consignment cases. The Simulator Agent plays the assessing officer and the Evaluation Engine scores each answer against a rubric, with an audit trail |
| **Assessment & examination** | Quizzes, mock papers, final exams, case studies and a viva board. Timer, flags and auto-submit. Results with per-topic feedback |
| **Expert-led live classes** | Schedule with reminders, live room with captions and Q&A. Recordings with AI transcript, notes and slides |
| **Community** | Discussion groups for importers, C&F agents, tax practitioners, freight forwarders and exporters |
| **Mentor & tutor portal** | Assigned students, at-risk flags, text-based training reports, session scheduling |
| **Admin portal** | Course CMS with publishing workflow, master schedule, documents, enrolments, live/video control, lab case builder, question bank, exam builder, grading queue, analytics, mentor assignment, moderation, certificates, roles and tenants, billing, security, notifications, API keys, AI agent settings |
| **Public site** | Landing page with a playable lab case and a narrated product tour video (English and Bangla voice-over), course catalog, pricing and checkout, certificate verification |

The interface is available in **English and Bangla**, with a light, glass-style design. [docs/01-requirements-map.md](docs/01-requirements-map.md) maps every client requirement to its screens.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) with React 19 and TypeScript
- [Tailwind CSS 4](https://tailwindcss.com) with custom design tokens
- [lucide-react](https://lucide.dev) icons
- Inter and Noto Sans Bengali via `next/font`
- Charts are hand-built SVG, with no chart library

## Getting started

Requires **Node.js 20 or newer** and npm.

```bash
git clone <repository-url> ai-academy
cd ai-academy/frontend
npm install
npm run dev
```

Open <http://localhost:3000>.

### Scripts

Run these from `frontend/`:

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Production build (also runs type checking) |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

No environment variables are needed yet.

## Demo accounts

Go to `/login` and choose a sample account under **Explore the demo**:

| Account | Lands on | Shows |
|---|---|---|
| Student | `/app` | Learner workspace with an active Professional plan |
| Mentor | `/mentor` | Mentor and tutor portal |
| Admin | `/admin` | Full admin portal |

- Once signed in, the switcher in the top bar moves between portals.
- To see the paywall, sign up as a new user. A new account has no plan until checkout on `/pricing`. Checkout is simulated, and any 6-digit code works for email verification.
- Demo data is saved in the browser's `localStorage` under `ai-academy-demo-v1`. Clear site data to reset it.

## Project structure

```
ai-academy/
├── docs/                    Project documentation
├── frontend/                Next.js application
│   ├── public/              Logo and static assets
│   └── src/
│       ├── app/
│       │   ├── (site)/      Public pages
│       │   ├── (auth)/      Login and sign-up
│       │   ├── app/         Learner workspace (/app)
│       │   ├── mentor/      Mentor and tutor portal (/mentor)
│       │   └── admin/       Admin portal (/admin)
│       ├── components/      UI primitives, charts, layout shells
│       └── lib/             Dummy data, client state, i18n
├── tools/tour-video/        Scripts that record the home-page product tour
└── logo.png                 Original brand logo
```

## Documentation

| Document | Contents |
|---|---|
| [Requirements map](docs/01-requirements-map.md) | Each client requirement and the screens that implement it |
| [Design system](docs/02-design-system.md) | Colours, typography, components and design rules |
| [Front-end architecture](docs/03-frontend-architecture.md) | Code layout, state, translations and backend integration points |
| [Tech stack](docs/04-tech-stack.md) | Current front-end stack and the recommended backend, database, AI services and hosting |
| [Work plan](docs/05-work-plan.md) | Six-month, week-by-week plan for a team of two |

## Roadmap

- [x] Front end with dummy data for all modules
- [x] English and Bangla interface
- [ ] Backend API and database
- [ ] Authentication with email OTP
- [ ] Payments: bKash, Nagad, SSLCommerz
- [ ] AI agent services: Examiner Agent, Simulator Agent, Evaluation Engine
- [ ] Live class provider and transcription pipeline
- [ ] Bilingual course content from the CMS

## Contributing

1. Create a branch from `main`.
2. Keep to the conventions in [docs/03-frontend-architecture.md](docs/03-frontend-architecture.md) and the design rules in [docs/02-design-system.md](docs/02-design-system.md).
3. Run `npm run lint` and `npm run build` in `frontend/` before opening a pull request.

## Licence

Private project of Tradevics AI. Licence terms to be confirmed.
