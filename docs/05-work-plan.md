# Six-month work plan

A week-by-week plan to take AI Academy from the finished front end to a launched product, built by a team of two.

- **Duration:** 26 weeks, Monday 30 Nov 2026 to Friday 28 May 2027
- **Stack:** as in [04-tech-stack.md](04-tech-stack.md)
- **Scope:** every requirement in [01-requirements-map.md](01-requirements-map.md)

## Roles

Both members can work across the stack, but each owns one side. That keeps the two of you from editing the same files every day and makes every task's owner clear.

| | Member A, backend and AI | Member B, front end and integration |
|---|---|---|
| Owns | `backend/`, database, AI agents, background workers, servers and deployment | `frontend/`, API client, wiring screens to real data, payments and live-class UI, testing |
| Also does | API contracts (OpenAPI), security, backups | Translations, accessibility, end-to-end tests, user acceptance testing with the client |
| Reviews | Member B's API calls and data handling | Member A's API shapes against what the screens need |

**API first.** Each week, Member A publishes the API shapes (OpenAPI) for the next feature before building it. Member B builds against a mock of that API, then switches to the real one. Neither waits on the other.

## How the team works

| When | What |
|---|---|
| Monday, 30 min | Plan the week: pick tasks from this document, agree on API shapes |
| Daily, 10 min | Async update in chat: done, next, blocked |
| Friday, 45 min | Demo on the staging server, then a short retrospective |
| Every 2 weeks | Show the client the new features; collect feedback |

**Git**
- `main` is always deployable.
- Work on short-lived branches (`feat/lab-scoring`, `fix/otp-expiry`).
- Every pull request is reviewed by the other member before merging.

**Definition of done**
- The pull request is reviewed and merged.
- Lint, type checks and tests pass in CI.
- The feature is deployed to staging and works in both English and Bangla.
- API and docs are updated.
- Every admin action the feature adds writes to the audit log.

## Phases

| Phase | Weeks | Goal | Milestone |
|---|---|---|---|
| 0. Foundations | 1–2 | Repository, CI, servers, data model | Staging server is live |
| 1. Accounts and courses | 3–6 | Real login, roles, course CMS, files, enrolment | Learners can sign up and study a course |
| 2. Payments | 7–9 | Subscriptions, gateways, notifications | **M1: paid learning works end to end** |
| 3. Assessment | 10–13 | Question bank, exams, Examiner Agent, Evaluation Engine | Exams graded with an AI and human review |
| 4. Practical lab | 14–16 | Case builder, Simulator Agent, scoring audit | **M2: AI features live (beta)** |
| 5. Live classes | 17–19 | Zoom, notifications, transcription, notes and slides | Expert live classes with AI notes |
| 6. Mentors and community | 20–21 | Mentor workflow, forum, real-time updates | People features complete |
| 7. Insights and certificates | 22–23 | Skill gaps, learning path, certificates, analytics | **M3: feature complete** |
| 8. Hardening and launch | 24–26 | Security, performance, client testing, launch | **M4: production launch** |

Phases build on each other. Payments come before the AI work so the paywall is real before expensive features open up. The lab comes after exams because it reuses the Evaluation Engine.

## How to use the weekly plan

Every week has the same parts:

- **Agree on Monday:** the API both of you need that week. Member A writes it into `openapi.json` by Monday evening. From then on, Member B builds against the mock (MSW) and Member A builds the real thing, so neither waits.
- **Member A** and **Member B:** separate checklists. Copy them into your issue board as one card per line. Tick them off here or there.
- **Hand-offs:** the few points where one of you needs something from the other, and by when.
- **Done when:** what you demo together on Friday on staging.

If a task slips, it moves to the top of next week for the same person. Don't swap work mid-week unless one of you is blocked for more than a day.

### Overview

| Week | Dates | Member A: backend and AI | Member B: front end and integration |
|---|---|---|---|
| 1 | 30 Nov – 4 Dec | Backend skeleton, Docker Compose | CI, API client and service layer |
| 2 | 7 – 11 Dec | Core database schema, seed data, OpenAPI | Staging server, auto-deploy, mock API, generated types |
| 3 | 14 – 18 Dec | Auth API: sign-up, email code, login, reset | Auth screens, session, route protection |
| 4 | 21 – 25 Dec | Roles, permissions, tenants, audit log | Permission grid, firm workspaces, permission-aware UI |
| 5 | 28 Dec – 1 Jan | Course CMS API, publishing workflow, file storage | Course editor, uploads, documents |
| 6 | 4 – 8 Jan | Catalog search, enrolment, progress, video URLs | Catalog, course page, lesson player, enrolments admin |
| 7 | 11 – 15 Jan | Plans, subscriptions, server-side paywall | Pricing, plan settings, paywall handling, firm seats |
| 8 | 18 – 22 Jan | Payment gateways, webhooks, refunds, invoices | Checkout flow, return pages, billing admin |
| 9 | 25 – 29 Jan | Job queue, email, SMS, notification rules | Notification bell, preferences, rules admin. **M1** |
| 10 | 1 – 5 Feb | Question bank, import, exam builder API | Question bank and exam builder screens |
| 11 | 8 – 12 Feb | Exam attempts, timer, marking, proctor log | Exam screens, autosave, offline recovery |
| 12 | 15 – 19 Feb | Retrieval, agent logging, Examiner Agent | AI question drafts, streamed viva |
| 13 | 22 – 26 Feb | Evaluation Engine, grading queue, calibration | Grading queue, rubric feedback on results |
| 14 | 1 – 5 Mar | Lab case model, builder API, versioning | Case builder screens |
| 15 | 8 – 12 Mar | Simulator Agent over WebSocket | Live lab session |
| 16 | 15 – 19 Mar | Attempt audit, AI settings, cost tracking | Audit and AI settings screens, beta onboarding. **M2** |
| 17 | 22 – 26 Mar | Zoom integration, notify all, reminders | Live class admin, schedule, join flow |
| 18 | 29 Mar – 2 Apr | Live Q&A channels, attendance, recordings | Live room |
| 19 | 5 – 9 Apr | Transcription, notes and slides pipeline | Recordings page, transcript editor |
| 20 | 12 – 16 Apr | Mentor assignment, reports, sessions, risk flags | Mentor portal and learner mentor page |
| 21 | 19 – 23 Apr | Community API, moderation, live updates | Community screens and moderation |
| 22 | 26 – 30 Apr | Skill scores, cohort, learning-path engine | Dashboard |
| 23 | 3 – 7 May | Certificates, verification, analytics API | Certificates, verify page, analytics. **M3** |
| 24 | 10 – 14 May | Two-step verification, API keys, security review | Security screens, accessibility, Bangla pass |
| 25 | 17 – 21 May | Load test, caching, backups, monitoring | End-to-end tests, client testing, polish |
| 26 | 24 – 28 May | Production deploy, live gateways | Launch checks, help pages, handover. **M4** |

## Week by week

### Phase 0: Foundations

#### Week 1 (30 Nov – 4 Dec): repository and tooling

**Agree on Monday:** folder layout, branch names, and one error format for every API response: `{"error": {"code": "...", "message": "..."}}`.

**Member A: backend and AI**
- [ ] Create `backend/` with `pyproject.toml`, FastAPI app factory (`app/main.py`) and settings loaded from the environment (pydantic-settings).
- [ ] Add async SQLAlchemy engine, a database session dependency and Alembic (`alembic init`, first empty migration).
- [ ] Write `docker-compose.yml`: `api`, `db` (Postgres 16 with pgvector), `redis`, `minio`, `mailpit` (catches email in development).
- [ ] Add `GET /api/health` that checks the database and Redis connections.
- [ ] Add the shared error handler that returns the agreed error format.
- [ ] Set up Ruff, mypy and pytest, with one passing test.
- [ ] Write `backend/.env.example` and a `Makefile` (`make dev`, `make test`, `make migrate`).

**Member B: front end and integration**
- [ ] Set up GitHub Actions CI: front end (lint, type check, build) and back end (Ruff, mypy, pytest). Run on every pull request.
- [ ] Add `frontend/src/lib/api/client.ts`: a fetch wrapper with base URL from `NEXT_PUBLIC_API_URL`, cookies included, and errors parsed into one `ApiError` type.
- [ ] Create `frontend/src/lib/services/` (courses, exams, lab, live, community, mentors, certificates, admin). For now each function returns the dummy data from `lib/data.ts` as a Promise.
- [ ] Switch the catalog, course page and dashboard to the services, with loading and error states.
- [ ] Add a `frontend/Dockerfile` (standalone Next.js build) and `frontend/.env.example`.
- [ ] Add a pull request template and issue labels (`backend`, `frontend`, `bug`, `blocked`).

**Hand-offs:** none this week.

**Done when:** `docker compose up` starts both apps, `/api/health` returns OK, and CI runs on every pull request.

#### Week 2 (7 – 11 Dec): data model and staging

**Agree on Monday:** table names for accounts and courses, and how bilingual fields are stored (`title_en` and `title_bn` columns).

**Member A**
- [ ] Models and migration: `users`, `otp_codes`, `refresh_tokens`, `roles`, `permissions`, `role_permissions`, `tenants`, `tenant_members`, `plans`, `subscriptions`.
- [ ] Models and migration: `courses`, `modules`, `lessons`, `enrolments`, `lesson_progress`, with bilingual title and summary columns.
- [ ] Seed script that loads the current dummy courses, plans and demo users (export `lib/data.ts` to JSON once and import it).
- [ ] Pagination helper (`?page=&page_size=`) and a standard list response shape.
- [ ] Script that writes `openapi.json` to the repository root; run it in CI so it never goes stale.

**Member B**
- [ ] Prepare the staging VPS: Docker, Caddy with HTTPS on the staging subdomain, `/api/*` routed to the API and everything else to Next.js.
- [ ] GitHub Actions deploy: build both images, push to GitHub Container Registry, SSH to staging, pull and restart on every merge to `main`.
- [ ] Set up MSW (Mock Service Worker) in development, with handlers built from the examples in `openapi.json`.
- [ ] Generate TypeScript types from `openapi.json` with `openapi-typescript` into `lib/api/types.ts`; add an `npm run gen:api` script.
- [ ] Start replacing hand-written types in `lib/data.ts` with the generated ones.

**Hand-offs:** A commits the first `openapi.json` by Wednesday so B can generate types.

**Done when:** staging is live over HTTPS, the front end runs against the mock API, and types are generated from the API.

### Phase 1: Accounts and courses

#### Week 3 (14 – 18 Dec): authentication. *Victory Day, 16 Dec: short week.*

**Agree on Monday:** `POST /api/auth/signup`, `/auth/verify-otp`, `/auth/resend-otp`, `/auth/login`, `/auth/logout`, `/auth/refresh`, `/auth/forgot`, `/auth/reset`, `GET /api/me`.

**Member A**
- [ ] Sign-up with name, email, Bangladeshi mobile (unique, `01[3-9]XXXXXXXX`), password and confirmation.
- [ ] 6-digit email code: stored hashed, expires in 10 minutes, 5 attempts, 60-second resend cooldown.
- [ ] Login with email or mobile; password hashing with Argon2.
- [ ] Access token (15 minutes) and refresh token (30 days, rotated, stored hashed) in httpOnly, Secure, SameSite=Lax cookies.
- [ ] Forgot and reset password using a 6-digit code (no links).
- [ ] Rate limits in Redis: 5 login attempts per minute per IP and account; 3 code requests per 10 minutes.
- [ ] Send email through Mailpit in development; tests for every flow, including expired and wrong codes.

**Member B**
- [ ] Wire sign-up, code entry, login and logout to the API.
- [ ] Build the reset-password screens (request code, enter code and new password).
- [ ] Replace the demo `user` in `lib/store.tsx` with a session provider that loads `GET /api/me` and refreshes the token on a 401.
- [ ] Protect `/app`, `/mentor` and `/admin` in `src/proxy.ts` (the Next.js 16 middleware file): no session means redirect to `/login?next=`.
- [ ] Clear error messages in English and Bangla: wrong code, expired code, too many attempts, mobile already used.
- [ ] Hide the demo login buttons unless `NEXT_PUBLIC_DEMO=true`.

**Hand-offs:** A has sign-up and login working on staging by Wednesday; reset can follow on Friday.

**Done when:** a real account can be created, verified by email code, logged in and logged out on staging.

#### Week 4 (21 – 25 Dec): roles, permissions and firms

**Agree on Monday:** `GET/PUT /api/admin/roles`, `PUT /admin/roles/{id}/permissions`, `/admin/tenants` (list, create, suspend), `/tenants/{id}/members` (invite, remove); `GET /api/me` now includes `permissions[]`.

**Member A**
- [ ] Seed roles and permissions from the grid on `/admin/access`.
- [ ] A `require_permission("courses.manage")` dependency, added to every admin route.
- [ ] Tenant scoping: firm-owned rows carry `tenant_id`; a shared query helper filters by it.
- [ ] Tests proving that firm A can't read firm B's members or reports.
- [ ] `audit_log` table and a helper that every admin write calls.
- [ ] Member invitation by email; a CLI command to create the first super admin.

**Member B**
- [ ] Wire the permission grid on `/admin/access`, with optimistic toggles and undo on error.
- [ ] Wire the firm workspaces tab: create, suspend, reactivate, seat usage.
- [ ] Invite-member modal and the accept-invite page.
- [ ] A `usePermission()` hook; hide navigation items and buttons the user isn't allowed to use.
- [ ] Switch the portal role guard to real permissions.

**Hand-offs:** A ships `permissions[]` on `/api/me` by Tuesday.

**Done when:** a student is refused by admin API routes (not only hidden pages), and every admin change appears in the audit log.

#### Week 5 (28 Dec – 1 Jan): course CMS and files

**Agree on Monday:** course, module and lesson CRUD; `PUT /modules/{id}/lessons/order`; `POST /courses/{id}/transition` with `{to, publish_at}`; uploads with `POST /api/uploads/presign` then `POST /uploads/complete`; documents CRUD with versions and access level.

**Member A**
- [ ] Course, module and lesson endpoints, including reordering.
- [ ] Publishing state machine (draft → review → scheduled → published, plus unpublish), with a scheduled job that publishes at `publish_at`.
- [ ] MinIO buckets, presigned upload URLs and short-lived signed download URLs.
- [ ] Documents with versions and access levels (all students, one course, examiners, mentors).
- [ ] Audit log entries for every publish and access change; tests for invalid transitions.

**Member B**
- [ ] Wire `/admin/courses`: list, filters, create (opens the editor).
- [ ] Wire the course editor: modules, lessons, drag-to-reorder (dnd-kit), preview toggles, Bangla title fields.
- [ ] Wire the publishing tab to `transition`, including the schedule date.
- [ ] Video and file upload straight to the presigned URL, with a progress bar and retry.
- [ ] Wire `/admin/documents`: upload, folders, access level, version history.

**Hand-offs:** A has presigned uploads working by Tuesday.

**Done when:** an editor can build a course with videos and handouts and publish it on a schedule.

#### Week 6 (4 – 8 Jan): catalog, player and enrolment

**Agree on Monday:** `GET /courses` (`q`, `category`, `level`), `GET /courses/{slug}`, `POST /enrolments`, `GET /me/enrolments`, `PUT /lessons/{id}/progress`, `GET /lessons/{id}/stream`, `POST /admin/enrolments/bulk`, `GET /admin/enrolments.csv`.

**Member A**
- [ ] Catalog search: Postgres full-text for English, `pg_trgm` trigram matching for Bangla.
- [ ] Enrolment rules: preview lessons open to everyone; full lessons need an active plan (enforced next week).
- [ ] Progress and completion per lesson and course; last position for resume.
- [ ] Signed video URLs that expire quickly and carry the viewer's email for the watermark.
- [ ] Bulk enrolment and CSV export.

**Member B**
- [ ] Wire `/courses` and `/courses/[slug]`, including search, filters and empty states.
- [ ] Wire `/app/courses` and the lesson player: real video, save progress every 15 seconds, resume where the learner stopped, mark complete.
- [ ] Wire the resources tab to document downloads.
- [ ] Wire `/admin/enrolments`: filters, bulk enrol, CSV export.
- [ ] Loading skeletons on catalog and player.

**Hand-offs:** A seeds at least two full courses with real videos on staging by Wednesday.

**Done when:** a learner can find, enrol in and finish a real course, and resume a lesson where they left off.

### Phase 2: Payments

#### Week 7 (11 – 15 Jan): plans and subscriptions

**Agree on Monday:** `GET /plans`, `GET /me/subscription`, `POST /me/subscription/cancel`, `PUT /admin/plans/{id}`, firm seat endpoints; paid routes return error code `PAYWALL` (HTTP 402) when there's no active plan.

**Member A**
- [ ] Subscription statuses: active, past due, cancelled, expired; period start and end.
- [ ] A `require_active_plan` dependency on every paid route (full lessons, lab, exams, live, mentor).
- [ ] Firm seats: assign and unassign seats, block when full.
- [ ] Daily job for renewals, expiry and reminder emails.
- [ ] Tests: expired plans lose access immediately; cancelled plans keep access until the period ends.

**Member B**
- [ ] Wire `/pricing` and the plan card in settings to the API.
- [ ] Cancel-subscription flow with a clear end date.
- [ ] Global handler: any `PAYWALL` error shows the `<Paywall>` screen.
- [ ] Firm seat management in settings for firm admins (assign, unassign, seats left).

**Hand-offs:** A turns on the paywall on staging on Thursday, after B's handler is merged.

**Done when:** the API refuses paid content to users without a plan, and the UI explains why.

#### Week 8 (18 – 22 Jan): payment gateways

**Agree on Monday:** `POST /payments/checkout` with `{plan, seats, method}` returning `{redirect_url}`; `GET /payments/{id}`; webhooks at `/api/webhooks/sslcommerz`, `/bkash` and `/nagad`; admin refund, retry and mark-received endpoints.

**Member A**
- [ ] SSLCommerz sandbox: start a session, validate the payment notification with their validation API.
- [ ] bKash sandbox (tokenised checkout), then Nagad sandbox.
- [ ] Webhooks: verify each one, handle repeats safely (unique transaction ID), activate the subscription inside one database transaction.
- [ ] Refunds, retry of failed payments, manual bank-transfer confirmation.
- [ ] Invoice PDF with VAT details; a daily reconciliation report.

**Member B**
- [ ] Checkout modal: plan, seats, payment method, then redirect to the gateway.
- [ ] Return pages for success, failure and cancel, polling `GET /payments/{id}` until it settles.
- [ ] Payment history and invoice download in settings.
- [ ] Wire `/admin/billing`: payments, refund, retry, mark received, plan prices.

**Hand-offs:** A shares sandbox test accounts and test card numbers on Monday.

**Done when:** a sandbox payment activates a subscription only through the webhook, never from the browser.

#### Week 9 (25 – 29 Jan): notifications. **Milestone M1.**

**Agree on Monday:** `GET /me/notifications`, `POST /me/notifications/read-all`, `PUT /me/notification-prefs`, admin notification rules, `POST /admin/announcements`.

**Member A**
- [ ] Choose and set up the job queue (ARQ is the simpler fit for async FastAPI); add a `worker` container.
- [ ] Email through the SMTP provider, with English and Bangla templates; move sign-up codes onto the queue.
- [ ] SMS gateway adapter (a Bangladeshi provider).
- [ ] Notification rules that map events to channels and audiences; an in-app notifications table.
- [ ] Announcements sent in batches so thousands of users don't block the queue.

**Member B**
- [ ] Notification bell with unread count, mark all read, links to the related page.
- [ ] Notification preferences in settings.
- [ ] Wire `/admin/notifications`: rules and the announcement composer.
- [ ] Write the M1 demo script and run the whole journey on staging; log every bug found.

**Both:** fix M1 bugs on Thursday and Friday, then demo to the client.

**Done when (M1):** a new user can sign up, pay in sandbox, enrol, study, and receive email, SMS and in-app notices.

### Phase 3: Assessment

#### Week 10 (1 – 5 Feb): question bank and exam builder

**Agree on Monday:** question CRUD and `POST /admin/questions/import`; exam CRUD with topic mix; exam publish and close.

**Member A**
- [ ] Tables: `questions` (bilingual text, options, answer, explanation, topic, difficulty, status, source), `exams`, `exam_topic_mix`, `case_studies`.
- [ ] Question endpoints with filters and full-text search.
- [ ] Spreadsheet import (CSV or XLSX) that returns a row-by-row error report.
- [ ] Exam builder endpoints: pass mark, time, attempts, grading mode, topic mix; validation that the bank has enough questions.

**Member B**
- [ ] Wire `/admin/questions`: filters, add and edit, delete, approval status.
- [ ] Import upload with the error report shown line by line.
- [ ] Wire the exam builder on `/admin/exams`, showing "available in bank" counts live.
- [ ] Publish and close exams.

**Hand-offs:** A imports the 28 seed questions on Tuesday.

**Done when:** an examiner can build and publish an exam from the real question bank.

#### Week 11 (8 – 12 Feb): taking exams

**Agree on Monday:** `POST /exams/{id}/attempts` (returns questions without answers), `PUT /attempts/{id}/answers`, `POST /attempts/{id}/submit`, `GET /attempts/{id}/result`, `POST /attempts/{id}/events`.

**Member A**
- [ ] A new random draw for every attempt, from the exam's topics only.
- [ ] Server-side deadline; a job auto-submits attempts when time runs out.
- [ ] Automatic marking for multiple choice; per-topic breakdown in the result.
- [ ] Attempt limits per exam.
- [ ] Log tab switches and full-screen exits as attempt events.
- [ ] Make sure answers never reach the browser before submission.

**Member B**
- [ ] Wire the exam screens: intro, running, review, result.
- [ ] Autosave every answer; keep a local copy and resync if the network drops.
- [ ] Timer counts down to the server deadline (not a local clock).
- [ ] Request full screen and send focus-change events.
- [ ] Case-study layout with the fact sheet.

**Hand-offs:** none beyond the Monday contract.

**Done when:** a learner can sit a timed exam, lose the network for a minute without losing answers, and get an automatic result.

#### Week 12 (15 – 19 Feb): AI foundations and the Examiner Agent. *Language Movement Day, 21 Feb, is on the following Sunday.*

**Agree on Monday:** `POST /admin/questions/generate` returning a job ID; `GET /jobs/{id}`; the viva turn endpoint, streaming over server-sent events.

**Member A**
- [ ] Split published lessons and documents into chunks when they're published; store them with embeddings in `content_chunks` (pgvector). Choose a multilingual embedding model that handles Bangla.
- [ ] Retrieval service that returns the top passages with their source.
- [ ] Personal-data scrubber (names, phone numbers, BL numbers) applied before any model call.
- [ ] Claude client wrapper with a model and temperature per agent; log every call in `agent_runs` (prompt, output, tokens, cost, time).
- [ ] Examiner Agent: generate draft questions in a fixed JSON format, each citing its source passage; viva follow-up questions.

**Member B**
- [ ] "Generate with Examiner Agent" modal, then job progress, then the draft list.
- [ ] Draft review: see the cited source, edit, approve or reject.
- [ ] Wire the viva board screen to the streamed agent replies, with retry on error.
- [ ] Mark AI-generated content clearly wherever it appears.

**Hand-offs:** A has the streaming endpoint returning dummy text by Tuesday, so B can build the UI while the agent is finished.

**Done when:** generated questions cite the material they came from, and none is used in an exam until a person approves it.

#### Week 13 (22 – 26 Feb): Evaluation Engine and grading

**Agree on Monday:** `GET /admin/grading-queue`, `POST /admin/grading/{id}` with `{score, reason}`; per-criterion feedback fields on results.

**Member A**
- [ ] Evaluation Engine: score free-text and viva answers per rubric criterion, with a confidence value and a short reason.
- [ ] Calibration: 20 answers graded by a client examiner; measure how closely the engine agrees and tune the prompt.
- [ ] Send answers below the confidence threshold (0.75 to start) to the human queue.
- [ ] Override endpoint that requires a reason and writes to the audit log.

**Member B**
- [ ] Wire the grading queue on `/admin/exams` and the mentor review list.
- [ ] Result page shows per-criterion scores and feedback.
- [ ] Override modal with a required reason.
- [ ] A simple calibration table in `/admin/analytics` (engine score next to examiner score).

**Hand-offs:** B arranges the 20 calibration answers with the client by Monday.

**Done when:** low-confidence answers reach a person, and every override is in the audit log.

### Phase 4: Practical lab

#### Week 14 (1 – 5 Mar): case builder

**Agree on Monday:** lab case CRUD (documents, steps, options, rubric, AI settings); publish and unpublish.

**Member A**
- [ ] Tables: `lab_cases`, `lab_case_docs`, `lab_steps`, rubric and AI settings (JSON).
- [ ] Validation: rubric weights total 100, at least one step, a brief.
- [ ] Versioning: editing a published case creates a new version, so attempts in progress aren't affected.
- [ ] Endpoints with audit entries.

**Member B**
- [ ] Wire `/admin/lab` and the case builder: brief, documents, steps, rubric and AI scenario tabs.
- [ ] Autosave, validation messages, publish and unpublish.
- [ ] "Test as learner" opens the case in the learner view.

**Hand-offs:** A seeds the three existing cases on Tuesday.

**Done when:** an admin can create, publish and edit a case without breaking attempts already started.

#### Week 15 (8 – 12 Mar): Simulator Agent. *Eid ul-Fitr is expected around 10 Mar: light week.*

**Agree on Monday:** WebSocket `/ws/lab/{attempt}`: the browser sends an answer (option or text), the server streams officer text and score events.

**Member A**
- [ ] Simulator Agent with persona and strictness from the case settings, answering only from the case documents.
- [ ] Turn handling: follow-up questions on weak answers, maximum turns, end of case.
- [ ] Score each turn with the Evaluation Engine against the case rubric.
- [ ] Authenticated WebSocket; save every turn; time-outs and a cost cap per attempt.

**Member B**
- [ ] Wire the lab session to the WebSocket: streamed officer replies, typing indicator, options and free text.
- [ ] Live score panel driven by score events; audit trail.
- [ ] Reconnect without losing the conversation.
- [ ] Finish-and-save, then show the result.

**Hand-offs:** A has an echo WebSocket on staging by Monday evening.

**Done when:** a learner can complete a case against the real agent and see a per-criterion score.

#### Week 16 (15 – 19 Mar): scoring audit and AI settings. **Milestone M2.**

**Agree on Monday:** lab attempt audit endpoints; `GET/PUT /admin/ai/agents`; `GET /admin/ai/runs`.

**Member A**
- [ ] Attempt audit endpoints with full transcripts and per-turn scores.
- [ ] Flags for suspicious attempts (very fast, pasted answers).
- [ ] Admin AI settings that take effect: model, temperature, threshold, pause an agent, guardrails.
- [ ] Cost and response-time figures per agent per day.

**Member B**
- [ ] Wire the audit tab and the review modal (transcript, scores, override with reason).
- [ ] Wire `/admin/ai`: agent cards, guardrails, run log with filters.
- [ ] Beta onboarding: invite 10–20 practitioners chosen by the client; add an in-app feedback form.

**Both:** run the beta from Thursday and triage feedback.

**Done when (M2):** exams, viva and lab all run on real AI on staging, with beta users.

### Phase 5: Live classes

#### Week 17 (22 – 26 Mar): scheduling and notifications

**Agree on Monday:** live class CRUD; register and unregister; `GET /live/{id}/join` (paid users only).

**Member A**
- [ ] Zoom server-to-server app: create meetings; receive started, ended and recording-completed webhooks (verified).
- [ ] "Notify all users" when a class is scheduled, sent in batches through the queue.
- [ ] Reminder 15 minutes before each class to registered users.
- [ ] Registration counts; join links only for active plans.
- [ ] Test Whisper on two real Bangla recordings to check transcript quality early.

**Member B**
- [ ] Wire the schedule form on `/admin/live`, with the notify-all option.
- [ ] Wire `/live` and `/app/live`: reminders, registration, live-now state from the webhooks.
- [ ] Join button for paid users; calendar file (`.ics`) download.

**Hand-offs:** A shares the Zoom app credentials for staging on Monday.

**Done when:** scheduling a class notifies every user, and only subscribers can join.

#### Week 18 (29 Mar – 2 Apr): live room

**Agree on Monday:** WebSocket channels for questions, chat and raised hands; moderator actions.

**Member A**
- [ ] Channels for questions, chat and raised hands; moderator actions (answer, pin, hide).
- [ ] Attendance from Zoom participant events.
- [ ] Download the recording into storage when the class ends.

**Member B**
- [ ] Live room page: embedded Zoom meeting (or open in Zoom), questions panel, raised hand.
- [ ] Moderator view for the expert and admins.
- [ ] After the class, send attendees to the recording page.

**Hand-offs:** none beyond the Monday contract.

**Done when:** a real class runs from start to finish with questions answered live.

#### Week 19 (5 – 9 Apr): lecture pipeline

**Agree on Monday:** `GET /recordings/{id}` with transcript, notes and slides; pipeline status; `POST /recordings/{id}/regenerate`; transcript edit endpoint.

**Member A**
- [ ] Whisper transcription worker, with timestamps per segment.
- [ ] Lecture notes and slides generated from the transcript in a fixed format.
- [ ] Run the same pipeline for uploaded lesson videos.
- [ ] Pipeline status events; regenerate on request.

**Member B**
- [ ] Recording page: transcript that jumps the video when clicked, notes, slides.
- [ ] Pipeline progress in `/admin/live`, with a regenerate button.
- [ ] Transcript editor for admins to fix Bangla mistakes.
- [ ] Export notes to PDF.

**Hand-offs:** A processes one real recording by Wednesday so B has real output to style.

**Done when:** a finished class shows a transcript, notes and slides with no manual work.

### Phase 6: Mentors and community

#### Week 20 (12 – 16 Apr): mentors and tutors. *Pohela Boishakh, 14 Apr: short week.*

**Agree on Monday:** mentor assignment; reports (draft, publish); availability slots and bookings; messages between mentor and learner.

**Member A**
- [ ] Assignment with capacity, and suggestions based on the learner's weakest topic and the mentor's speciality.
- [ ] Reports: draft, publish; publishing notifies the learner and, for firm seats, the firm admin.
- [ ] "Draft from activity": summarise the learner's results into a first draft.
- [ ] Availability slots, bookings and a simple message thread.
- [ ] Nightly risk flags: no login for 10 days, falling scores.

**Member B**
- [ ] Wire `/admin/mentors`.
- [ ] Wire the whole `/mentor` portal: overview, students, report writer, reports, sessions.
- [ ] Wire `/app/mentor`: reports, booking from available slots, messages.

**Hand-offs:** none beyond the Monday contract.

**Done when:** a mentor publishes a report that reaches the learner and their firm admin.

#### Week 21 (19 – 23 Apr): community

**Agree on Monday:** groups and membership; threads, replies, votes, accepted answer; reports and moderation; live update events.

**Member A**
- [ ] Groups, membership, threads, replies, one vote per user, accepted answer.
- [ ] Reports, moderation actions and per-group post approval.
- [ ] Rate limits; a warning when a post seems to contain a phone number or BL number.
- [ ] Live updates for new replies.

**Member B**
- [ ] Wire `/app/community` and thread pages, with search and sorting.
- [ ] Posting rules per group; the warning before posting personal details.
- [ ] Wire `/admin/community`: group settings, report queue, pinning.
- [ ] New replies appear without a reload.

**Hand-offs:** none beyond the Monday contract.

**Done when:** groups work with moderation and live updates.

### Phase 7: Insights and certificates

#### Week 22 (26 – 30 Apr): dashboard and learning path

**Agree on Monday:** `GET /me/dashboard` (skills, cohort, gaps, path, trends); the mentor's student-detail endpoint.

**Member A**
- [ ] Skill score per topic from exams and labs, weighted towards recent results.
- [ ] Cohort averages (same professional group, last 90 days).
- [ ] Learning-path rules: weakest topics first, mapped to lessons, labs and exams, each with a reason.
- [ ] Recalculate nightly and right after each result.

**Member B**
- [ ] Wire the `/app` dashboard: radar, skill gaps, learning path with reasons, trends.
- [ ] Wire the mentor's student view.
- [ ] A useful dashboard for brand-new learners with no results yet.

**Hand-offs:** A seeds realistic results for 20 test learners by Tuesday.

**Done when:** a learner's dashboard changes after they sit an exam.

#### Week 23 (3 – 7 May): certificates and analytics. **Milestone M3.**

**Agree on Monday:** certificate templates, issue, revoke and reinstate; `GET /verify/{serial}` (public); analytics endpoints.

**Member A**
- [ ] Certificate PDFs in English and Bangla (WeasyPrint), with a QR code linking to verification.
- [ ] Issue rules: automatic, held for approval, merit template.
- [ ] Revoke and reinstate with a required reason; rate-limited public verification.
- [ ] Analytics: score bands, results per topic, question statistics (percent correct, discrimination), viva boards, feedback.

**Member B**
- [ ] Wire `/admin/certificates`, `/app/certificates` (download, copy verification link) and `/verify`.
- [ ] Wire `/admin/analytics` charts and tables.
- [ ] Run the feature-freeze checklist and a full regression pass on staging.

**Both:** from Friday, only bug fixes go into `main`.

**Done when (M3):** every requirement in [01-requirements-map.md](01-requirements-map.md) works on staging.

### Phase 8: Hardening and launch

#### Week 24 (10 – 14 May): security and platform admin

**Agree on Monday:** two-step verification set-up and login; active sessions and devices; API key endpoints.

**Member A**
- [ ] Two-step verification (authenticator app) required for admins and examiners.
- [ ] Device limit per account and a sessions list with sign-out.
- [ ] API keys: stored hashed, scopes, rotate, revoke; integration secrets encrypted.
- [ ] Security headers, dependency audit, and a review against the OWASP Top 10.

**Member B**
- [ ] Two-step verification set-up and login screens; sessions and devices page.
- [ ] Wire `/admin/security` and `/admin/integrations` (key shown once).
- [ ] Accessibility pass: axe checks, keyboard-only use, screen reader labels, contrast.
- [ ] Bangla pass with the client: fill every missing translation and check bilingual course content.

**Hand-offs:** none beyond the Monday contract.

**Done when:** the security checklist passes and no serious accessibility issues remain.

#### Week 25 (17 – 21 May): performance and client testing

**Agree on Monday:** the production environment variables and the launch checklist.

**Member A**
- [ ] Load test with k6 (target: 1,000 people online at once); fix slow queries and add indexes.
- [ ] Redis caching for the catalog and dashboards; a CDN in front of video.
- [ ] Daily database backups to off-server storage, and a restore drill.
- [ ] Monitoring and alerts (uptime, errors with Sentry, server resources).
- [ ] Provision the production server.

**Member B**
- [ ] Playwright end-to-end tests: sign up, pay, learn, exam, lab, join live, verify certificate.
- [ ] User acceptance testing sessions with the client; keep a triage board.
- [ ] Front-end performance (Lighthouse, bundle size, images), page titles and descriptions for search engines.
- [ ] Fix the bugs found.

**Hand-offs:** A has production ready by Thursday for a dry-run deploy.

**Done when:** the client signs off, and a database restore has been tested.

#### Week 26 (24 – 28 May): launch. **Milestone M4.**

**Member A**
- [ ] Production deploy and migrations; load the client's real content.
- [ ] Switch payment gateways to live mode; final security check.
- [ ] Launch-day watch: logs, errors, payments.

**Member B**
- [ ] Smoke test every main journey on production.
- [ ] Launch announcement by email, SMS and in-app.
- [ ] Help and FAQ pages; handover docs and a short runbook.
- [ ] Collect the post-launch fix list.

**Done when (M4):** AI Academy is live for paying users.

## If the schedule slips

Six months is tight for two people building every feature. Keep these in reserve, in this order:

1. **Use week 26 as a buffer** and launch in week 25 if things go well.
2. **Move to after launch:** self-hosted video (stay on Zoom), Bangla voice answers in the viva, question import from spreadsheets, firm-level analytics.
3. **Simplify:** start with one payment gateway (SSLCommerz handles cards and mobile wallets) and add direct bKash and Nagad after launch.

Never cut: the server-side paywall, the audit log, human review of low-confidence AI grades, or backups.

## Risks

| Risk | Impact | Response |
|---|---|---|
| Payment gateway approval takes weeks | Delays M1 | Apply for SSLCommerz, bKash and Nagad merchant accounts in week 1 |
| AI costs higher than expected | Budget | Track cost per agent from week 12; use smaller models for high-volume tasks; cache retrieval results |
| Client curriculum not ready | Exams and lab have no content | Ask the client for course content, question banks and lab cases by week 8; build with seed data until then |
| One member unavailable | Work stops on their side | Review each other's pull requests so both know both sides; keep docs current |
| Bangla transcription quality | Weak notes for Bangla classes | Test Whisper on real Bangla recordings in week 17; plan for human correction of transcripts if needed |
| Holidays (Victory Day, Eid, Pohela Boishakh) | Lost days | Already marked as short weeks above; agree on leave dates in week 1 |

## Before week 1

- Set up the shared repository, branch protection on `main`, and the issue board.
- Create staging and production subdomains.
- Apply for the payment gateway merchant accounts.
- Open accounts for the Anthropic API, SMTP, an SMS gateway and Zoom.
- Get the client's first course content and a contact for user acceptance testing.
