# Requirements map

The client's Module 13 requirements, mapped to the screens that implement them. Paths are routes in the running app.

## AI Mentor & Tutor
Mentor and tutor roles, mentor assignment, and text-based performance and training reports.

| Feature | Where |
|---|---|
| Assign mentors and tutors, capacity, add new | `/admin/mentors` |
| Mentor portal overview and at-risk learners | `/mentor` |
| Student list, filters | `/mentor/students` |
| Write a text report (with "draft from activity"), report history | `/mentor/students/[id]` |
| All reports, reports due | `/mentor/reports` |
| Session requests, confirmations, availability | `/mentor/sessions` |
| Student view: mentor, reports, book a session, messages | `/app/mentor` |

## AI Course Management
Master scheduling, CMS, document management, enrolment, content publishing control, and live and video class control.

| Feature | Where |
|---|---|
| Course list, create course (opens a blank editor) | `/admin/courses` → `/admin/courses/new` |
| CMS editor: modules, lessons, reorder, free previews, Bangla title | `/admin/courses/[slug]` (Content and Details tabs) |
| Publishing workflow draft → review → scheduled → published | `/admin/courses/[slug]` (Publishing tab) |
| Master schedule (week calendar, filters, clash warning) | `/admin/schedule` |
| Document management (folders, upload, access level, versions) | `/admin/documents` |
| Enrolments (filter by plan, bulk enrol, CSV export) | `/admin/enrolments` |
| Live class control (schedule, go live, end) and the video library | `/admin/live` |
| Learner side: catalog, course page, player | `/courses`, `/courses/[slug]`, `/app/courses`, `/app/learn/[slug]` |

## AI Practical Lab & Simulator
Case builder, AI scenario configuration, and attempt and scoring audit.

| Feature | Where |
|---|---|
| Case builder: brief, documents, steps, options, rubric, publish/unpublish | `/admin/lab/[id]`, new case at `/admin/lab/new` |
| AI scenario configuration: persona, strictness, variation, grounding | `/admin/lab/[id]` (AI scenario tab) |
| Attempt and scoring audit with override and reason | `/admin/lab` (audit tab) |
| Learner simulation with live rubric scoring and audit trail | `/app/lab`, `/app/lab/[id]` |
| Playable sample on the landing page | `/` |

## AI Assessment & Examination
MCQ, quiz, mock and final exams, question bank, exam generator and builder, grading control, feedback analytics, case studies, and viva-board performance analytics.

| Feature | Where |
|---|---|
| Question bank (28 questions across 6 topics), add question, AI-generated drafts with approval | `/admin/questions` |
| Exam builder (topic mix, timing, pass mark, attempts, grading mode) | `/admin/exams` |
| Grading control and the human review queue | `/admin/exams` (grading tab) |
| Results, question analysis, viva board, feedback analytics | `/admin/analytics` |
| Take an exam: timer, flags, navigator, auto-submit. Each exam draws only from its own topics (e.g. the valuation final uses valuation questions only) | `/app/exams/[id]` |
| Case study: scenario and fact sheet with questions written for it (ceramics duty stack) | `/app/exams/case-ceramics` |
| Viva board with the Examiner Agent | `/app/exams/viva-board` |
| Result page with per-topic feedback and answer review | end of any exam |

## AI Performance Dashboard
Student dashboards, weakness and skill-gap analytics, and a personalised learning path.

`/app`: progress, skill radar against the cohort, skill gaps, a learning path reordered from results, weekly hours, score trend and recent results.

## AI Community Forum
Specialised groups for importers, C&F agents, tax practitioners and other professional groups.

| Feature | Where |
|---|---|
| Groups, join or leave, threads, search, sort, ask a question | `/app/community` |
| Thread with replies, upvotes, accepted answer, report | `/app/community/[thread]` |
| Group settings, moderation queue, pinning | `/admin/community` |

## Certification
Certificate templates, issuance control and revocation.

| Feature | Where |
|---|---|
| Issued list, issue pending, revoke with reason, reinstate | `/admin/certificates` |
| Templates and issuance rules | `/admin/certificates` (tabs) |
| Learner certificates, copy verification link | `/app/certificates` |
| Public verification by serial | `/verify` |

## Academy Platform Admin
Global RBAC and tenant control, subscription and billing, payment, security policies, notifications, and API key and integration management.

| Feature | Where |
|---|---|
| Role-permission matrix, firm workspaces (tenants) | `/admin/access` |
| Payments, refunds, retries, plan prices | `/admin/billing` |
| Security policies, password and session rules, audit log | `/admin/security` |
| Notification rules per event and channel, announcements | `/admin/notifications` |
| API keys (shown once, rotate, revoke), integrations | `/admin/integrations` |

## Expert-Led Live Class
Live classes by subject-matter experts, with every user notified of scheduled sessions. AI transcription, auto-generated lecture notes and slides are produced on the shared AI pipeline.

| Feature | Where |
|---|---|
| Public schedule and reminders | `/live` |
| Learner list, live room (captions, building notes, Q&A) | `/app/live`, `/app/live/[id]` |
| Recording with transcript, notes and slides | `/app/live/gir3-deep` |
| Scheduling with "notify all users", pipeline progress | `/admin/live` |

## AI Architecture
A multi-agent framework combining an Examiner Agent, a Simulator Agent and an Evaluation Engine.

`/admin/ai` covers the agent cards (model, temperature, confidence threshold, pause), guardrails and the run log. The landing page explains the framework to visitors.

## Paid platform note
Paid features are wrapped in `<Paywall>` (`src/components/shell/portal.tsx`). Users without a plan see preview lessons only. The FAQ on `/pricing` states that curriculum is authored by the academy's experts (Clause 9.3).
