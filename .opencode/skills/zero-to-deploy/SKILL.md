---
name: zero-to-deploy
description: Zero-to-deployment build playbook for the Student Founder project. Use when driving build steps, checking the next best action, verifying work (lint/build/tests), or deploying the frontend and backend. Encodes the Part 5 build order from Product_Blueprint.md with "Done when" checks and a deployment/rollback runbook.
---

# Zero to Deployment — Build Playbook

Load this skill whenever you drive a build step, report current status, or deploy. It tells you
what to build, in what order, how to verify each step, and how to ship without breaking anything.

## Ground rules

- The authoritative plan is `Product_Blueprint.md` Part 5 (implementation plan), Part 4 (schema),
  and Part 6 (API). If this skill disagrees with the blueprint, the blueprint wins.
- `BUILD_PROGRESS.md` is the state file. Never mark a step done without running its verification.
- MVP scope only (Phase 1). Phase 2/3 features are deferred; call them out and do not build them.

## What is already true about this repo (verify once, then trust)

- `frontend/`: Next.js 16 + React 19 + Tailwind v4 App Router app with dashboard/journey/project/
  onboarding/new pages and gamification components, currently driven by demo data.
- `backend/`: FastAPI app (`backend/app/main.py`) with mock `/api/v1/*` endpoints; requirements in
  `backend/requirements.txt`; a `.venv` exists at repo root.
- Not yet present: git repo, database/migrations, auth, real API wiring, tests, CI/CD, Docker,
  LLM gateway, workers, sandbox, deploy config. These are the build work ahead.

## Build order (blueprint Part 5) with "Done when" checks

Work strictly in this order. Each step is complete only when its check passes.

### Phase 0 — Validation (runs in parallel, before scope locks)
Interviews + institution willingness calls per PRD Section 12. Gate: 12/20 specific costly stalls
and 2 institutions willing to pilot/pay. Record findings in BUILD_PROGRESS.md.

### Step 1 — Project setup
Monorepo layout, `.gitignore`, branch protection, commit hooks, lint config, Dockerfiles,
per-folder env example files, GitHub Actions CI (lint + tests + SAST + dependency scan).
- Done when: a "hello world" frontend + backend deploys through CI/CD to staging with monitoring.

### Step 2 — Database
PostgreSQL + pgvector provisioned; Alembic migrations implementing Part 4 schema (identity,
journey, evidence, content, AI ops, engagement); seed `stages`, `stage_gates` rubrics, reference
data; indexes; RLS policies + helpers.
- Done when: migrations run clean on a fresh DB; cross-tenant RLS tests pass; restore drill works.

### Step 3 — Authentication and authorization
Auth provider integration (email + Google/GitHub), email verification, roles, JWT claims,
`app.user_id`/`app.org_id`/`app.role` DB session settings, onboarding + age/consent, MFA for
privileged roles, data export/delete endpoints.
- Done when: every role tested; RLS verified through the API; consents stored.

### Step 4 — Core platform
Project CRUD + members, dashboard + project home stage tracker, tasks/documents/files (upload,
scan, storage), notifications + weekly check-in, mobile-first shell + design system, generated
OpenAPI spec + typed client consumed by the frontend.
- Done when: a user can sign up, create a project, add tasks/files, and see the stage tracker on mobile.

### Step 5 — LLM gateway + agent foundation
Provider-agnostic gateway (routing, structured outputs, retries, fallback, caching), prompt
version registry, `agent_runs` logging, usage ledger + token budgets, orchestration service with
tool interface + autonomy levels, eval harness.
- Done when: a test agent runs end-to-end with logging, budgets, tracing, eval results.

### Step 6 — Features: Stages 0-1
Readiness/constraints flow; Coach agent (Socratic, stage-aware, project memory); problem
statement form + Reviewer scoring + versioned statements.
- Done when: a founder completes Stage 1 with critique; scores consistent on the eval set.

### Step 7 — Features: Stage 2 validation
Interview toolkit (script + screener + non-leading question checker), interview log with consent
flags, transcription pipeline (upload, scan, STT, transcript), Synthesizer with bias flags,
evidence log for pre-commitments, dashboards.
- Done when: a user logs interviews, transcribes audio, sees insights, and adds pre-commitment evidence.

### Step 8 — Gate engine
Stage state machine (locked → in_progress → submitted → passed/conditional/failed), rubric
loader, rule checks, LLM criterion scoring with cited evidence, result screens + remediation
tasks + override (admin). Deterministic: rules decide, LLM advises.
- Done when: Stages 1-3 gates work on seeded projects with reproducible results + regression suite.

### Step 9 — Prototype Audit
Sandbox service (CPU/mem/time/network limits), static analysis worker (structure, deps, secret
scan, SAST, test presence), Auditor agent over a sanitized summary, report + task suggestions,
injection/abuse tests.
- Done when: 20+ sample repos audited safely; injection tests pass; report quality team-reviewed.

### Step 10 — Stage 3 + build-track templates
Competitor map, solution validation scoring (feasibility, scalability, cost vs impact, adoption),
PRD generator, architecture options with justification, deploy + security checklists; build track
locked until Stage 2 gate passes.
- Done when: a validated project generates a PRD and completes the checklists.

### Step 11 — Security hardening + testing
Penetration test / structured review + fixes, full cross-tenant suite, contract tests from spec,
fuzzing, load test (100 concurrent), privacy review (retention, deletion, consents), incident runbook.
- Done when: no open high-severity findings; retention and deletion verified.

### Step 12 — Bug-fix pipeline
Sentry + CI failures feed a triage agent and fix agent that opens PRs; human approval required,
diff limits, coverage checks, canary deploy with rollback.
- Done when: three seeded bugs are triaged and fixed via PR with approval and safe rollout.

### Step 13 — Pilot launch
Onboard 20-30 students + 2-3 institutions, support channels, track PRD Section 8 metrics weekly,
fix critical issues, measure cost per activated user.
- Go/no-go for Phase 2: healthy stage funnel, one institution willing to pay/pilot paid, cost per
  activated user in budget, zero safety incidents.

### Step 14 — Iterate + plan Phase 2
Retrospective; Phase 2 backlog (Dev agent/fix assistant, realtime voice, institution dashboard,
billing); funding/runway decisions only after the Step 13 go/no-go.

## Verification checklist (run before any "Done" claim)

Backend: compile, uvicorn smoke (`GET /healthz` must return ok), pytest when present.
Frontend: `npm run lint`, `npm run build`, then `npm run dev` and smoke the changed routes.
DB: `alembic upgrade head` on fresh DB; RLS cross-tenant test passes.
Every agent change: eval subset runs; every LLM run logged to `agent_runs`.
Security: no secrets committed; inputs validated; user content treated as data, never as instructions.

## Deployment runbook (Steps 1 + 13)

- Environments: local → dev → staging → production. Staging auto-deploys from CI; production is
  gated, with approval and canary rollout.
- Frontend: Next.js on Vercel (or equivalent); env vars injected per environment, never committed.
- Backend: Docker image to Railway/Render/Fly (or a major cloud later); migration path documented.
- Database: managed Postgres + pgvector; migrate backward-compatible; backups + rollback plan.
- Secrets: managed secrets store; no secrets in the repo or in build logs.
- Observability: Sentry (errors), basic stdout/trace logging, health (`/healthz`) + readiness
  (`/readyz`) endpoints, uptime alert on error-rate increase.
- Rollback: keep the previous release deployable; rollback = redeploy last-known-good tag. For
  DB-breaking releases, prefer a forward-fix over rolling back.
- Record every release in BUILD_PROGRESS.md: version/commit, env, verification results, rollback note.

## Progress tracking

`BUILD_PROGRESS.md` keeps a checkbox per step with: status, last verified date, verification
output summary, open risks. Update it at the end of every working session. Keep it small and
actionable — a checklist, not a diary.