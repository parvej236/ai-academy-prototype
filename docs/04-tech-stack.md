# Tech stack

The technology for AI Academy, both what's built and what's planned. The front end exists today. The backend and database below are the recommended stack and haven't been built yet.

## Summary

| Layer | Choice | Status |
|---|---|---|
| Front end | Next.js 16, React 19, TypeScript, Tailwind CSS 4 | Built |
| API | FastAPI (Python 3.12) | Planned |
| Database | PostgreSQL 16, with `pgvector` and `pg_trgm` | Planned |
| Cache, queue, real-time | Redis 7 | Planned |
| Background jobs | Celery or ARQ workers | Planned |
| AI agents | Claude through the Anthropic API | Planned |
| Speech-to-text | Whisper (`faster-whisper`, self-hosted) | Planned |
| File storage | S3-compatible: MinIO on the server, or Cloudflare R2 | Planned |
| Live classes | Zoom first; self-hosted Jitsi or LiveKit later | Planned |
| Payments | SSLCommerz, bKash, Nagad | Planned |
| Hosting | Docker Compose on a Hostinger VPS, behind Caddy or Nginx | Planned |

## Architecture

```
                    ┌────────────────────────────┐
  Browser ─────────▶│  Caddy / Nginx  (HTTPS)    │
                    └──────┬──────────────┬──────┘
                           │              │ /api, /ws
                ┌──────────▼───┐   ┌──────▼─────────────┐
                │  Next.js     │   │  FastAPI           │
                │  (frontend)  │   │  REST + WebSocket  │
                └──────────────┘   └──┬──────┬──────┬───┘
                                      │      │      │
                        ┌─────────────▼┐ ┌───▼───┐ ┌▼──────────────┐
                        │ PostgreSQL   │ │ Redis │ │ MinIO / R2    │
                        │ + pgvector   │ │       │ │ videos, docs, │
                        └──────▲───────┘ └───┬───┘ │ certificates  │
                               │             │     └───────▲───────┘
                        ┌──────┴─────────────▼─────────────┴──────┐
                        │  Workers                                │
                        │  AI grading · transcription · notes &   │
                        │  slides · emails/SMS · PDFs · payments  │
                        └──────┬──────────────────────┬───────────┘
                               │                      │
                     Anthropic API (Claude)    Whisper (self-hosted)
```

The browser talks only to the reverse proxy. Requests under `/api` and `/ws` go to FastAPI, and everything else goes to Next.js, so the whole product runs on one domain.

## Front end (built)

| Concern | Choice |
|---|---|
| Framework | Next.js 16 App Router, Turbopack |
| Language | TypeScript |
| Styling | Tailwind CSS 4 with design tokens in `globals.css` |
| Icons | lucide-react |
| Fonts | Inter (English), Noto Sans Bengali (Bangla), self-hosted through `next/font` |
| Charts | Hand-built SVG components, no chart library |
| State | React context persisted to `localStorage` (a stand-in until the API exists) |
| Translation | Dictionary keyed by English text, `useT()` hook, EN/বাং toggle |

Details are in [03-frontend-architecture.md](03-frontend-architecture.md).

## Backend (planned)

### Why FastAPI

The hardest parts of the platform are AI and data work: the three agents, the transcription pipeline that turns live classes into notes and slides, and the score and skill-gap analytics. Python has the most mature tools for all three.

FastAPI adds:
- typed request and response models (Pydantic) that can mirror `frontend/src/lib/data.ts`
- automatic OpenAPI docs the front end can be checked against
- WebSocket support for live-class chat and captions

| Concern | Choice |
|---|---|
| Framework | FastAPI |
| Data validation | Pydantic v2 |
| Database access | SQLAlchemy 2 (async) |
| Schema migrations | Alembic |
| Background jobs | Celery or ARQ, using Redis as the broker |
| Tests | pytest, httpx |
| Code quality | Ruff, mypy |

### Suggested layout

```
backend/
  app/
    api/          route modules: auth, courses, lab, exams, live, community,
                  mentors, certificates, admin
    models/       SQLAlchemy models
    schemas/      Pydantic request/response models
    services/     business logic (publishing workflow, grading, billing)
    agents/       examiner, simulator, evaluation, lecture pipeline
    workers/      background tasks
    core/         config, security, permissions, tenant scoping
  migrations/     Alembic
  tests/
```

## Database (planned)

### Why PostgreSQL

Most of the data is relational and needs reliable transactions: users, enrolments, payments, certificates, roles and permissions, firm workspaces and the audit log. For example, a payment must activate a subscription completely or not at all, and a revoked certificate must be revoked everywhere at once.

Postgres also covers needs that would otherwise require extra systems:

| Need | Feature |
|---|---|
| Flexible content (lab case documents, rubrics, exam settings, AI agent settings) | `JSONB` columns |
| Agents answer only from published course material | `pgvector` embeddings for semantic search |
| Search in English and Bangla | Full-text search for English; `pg_trgm` trigram matching for Bangla (Postgres has no Bengali stemmer) |
| Firms can't see each other's data | `tenant_id` on firm-owned rows, optionally enforced with row-level security |

### Main tables

| Area | Tables |
|---|---|
| Accounts | `users`, `otp_codes`, `sessions`, `roles`, `role_permissions`, `tenants`, `tenant_members` |
| Billing | `plans`, `subscriptions`, `payments`, `refunds` |
| Courses | `courses`, `modules`, `lessons`, `documents`, `document_versions`, `enrolments`, `lesson_progress`, `schedule_events` |
| Lab | `lab_cases`, `lab_case_docs`, `lab_steps`, `lab_attempts`, `lab_attempt_turns` |
| Assessment | `questions`, `exams`, `exam_topic_mix`, `exam_attempts`, `exam_answers`, `grading_reviews`, `case_studies` |
| Live | `live_classes`, `live_registrations`, `recordings`, `transcripts`, `lecture_notes`, `slides` |
| People | `mentor_profiles`, `mentor_assignments`, `mentor_reports`, `mentor_sessions` |
| Community | `forum_groups`, `group_members`, `threads`, `replies`, `votes`, `reports` |
| Certificates | `certificate_templates`, `certificates`, `certificate_revocations` |
| Platform | `notification_rules`, `notifications`, `api_keys`, `integrations`, `security_policies`, `audit_log`, `agent_runs` |
| AI | `content_chunks` (text plus `vector` embedding, linked to lessons and documents) |

Content that needs both languages (course titles, summaries, lesson titles) should use paired columns such as `title_en` and `title_bn`, or a JSONB `{ "en": …, "bn": … }` field.

## Redis (planned)

- Cache for course catalog and dashboard data
- Session and rate-limit counters (login attempts, OTP requests)
- Job broker for the background workers
- Pub/sub for live-class chat, captions and in-app notifications

## AI services (planned)

| Agent | Job | Notes |
|---|---|---|
| Examiner Agent | Builds question sets from the bank, writes draft questions, runs viva follow-ups | Drafts need examiner approval before use |
| Simulator Agent | Plays officers, clients and bankers inside lab cases | Uses only the case documents as facts |
| Evaluation Engine | Scores answers against the rubric and returns a confidence value | Below the threshold (0.75 by default), the answer goes to the human grading queue |
| Lecture pipeline | Audio → transcript → lecture notes → slides | Whisper does the transcription; Claude writes notes and slides from the transcript |

Ground rules for every agent:
- Retrieve context from `content_chunks` so answers come from published material.
- Remove personal data (names, phone numbers, BL numbers) before calling the model.
- Store every prompt and output in `agent_runs` for the scoring audit.
- Pick the model per agent in the admin settings. Use larger models where accuracy matters (grading) and smaller ones for high-volume work (transcript summaries).

## External services (planned)

| Service | Use |
|---|---|
| SSLCommerz, bKash, Nagad | Payments; subscriptions activate from the payment-confirmation webhook, never from the browser |
| Zoom (later Jitsi or LiveKit) | Live classes and recordings |
| SMTP provider | Verification codes, reminders, reports |
| SMS gateway (Bangladesh) | Live-class and exam reminders, payment alerts |
| Tradevics AI core | Shared accounts and subscription sync, through scoped API keys |

## Security

- Login with email or mobile number and password; accounts verified by a 6-digit email code
- Passwords hashed with Argon2
- Short-lived access token plus refresh token, both in httpOnly, Secure, SameSite cookies
- Permission checks on every API route, matching the role grid in `/admin/access`
- Two-step verification for admins and examiners
- Video watermarking with the viewer's email and a limit on active devices
- Every admin action written to `audit_log`

## Hosting and deployment (planned)

One Hostinger VPS (4–8 GB RAM) running Docker Compose:

| Container | Purpose |
|---|---|
| `proxy` | Caddy or Nginx, HTTPS certificates, routing |
| `web` | Next.js production server |
| `api` | FastAPI (Uvicorn workers) |
| `worker` | Background jobs |
| `db` | PostgreSQL 16 with `pgvector` |
| `redis` | Redis 7 |
| `storage` | MinIO (skip if using Cloudflare R2) |
| `whisper` | Transcription service (can run on demand) |

- Back up Postgres daily (`pg_dump` or WAL archiving) to off-server storage.
- Store secrets in `.env` files on the server, never in git. Commit only `.env.example`.
- Build images in CI and deploy by pulling them on the server.

This setup suits the expected scale of about 15,000 learners. When it outgrows one server, move Postgres to a managed service first, then the workers and Whisper, before splitting anything else.

## Alternatives considered

| Option | Why not chosen |
|---|---|
| NestJS (Node.js) + Prisma | A good choice for a TypeScript-only team, with types shared with the front end. It would still need a Python service for transcription and heavier AI work, so the server would have two languages instead of one. |
| MongoDB | Payments, certificates, grade overrides and permissions need relations and transactions. |
| Firebase or Supabase as the whole backend | The agent pipeline, grading audit and tenant rules need more control than a hosted backend gives. |
| A separate search engine (Elasticsearch, Meilisearch) | Not needed at this size. Postgres full-text and trigram search are enough to start. |

## Open decisions

- Celery or ARQ for background jobs
- Cloudflare R2 or self-hosted MinIO for files
- When to move live classes from Zoom to self-hosted video
- Whether accounts are shared with the Tradevics AI core platform from day one
