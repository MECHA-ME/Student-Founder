# Student Founder — Build Progress

Maintained by the Ship Director assistant (`.opencode/agents/ship-director.md`). Loaded into every
session. Update after each working session: checkboxes, verification summaries, risks.

**Last updated:** 2026-09-20

## Snapshot

- **Stack:** FastAPI backend (`backend/`) + Next.js 16 / React 19 / Tailwind v4 frontend (`frontend/`).
- **Blueprint:** `Product_Blueprint.md` (PRD, TRD, schema, API, implementation plan). Source of truth.
- **Goal:** Phase 1 (MVP) Stages 0-3, Prototype Audit, gate engine, evidence, Coach/Reviewer agents,
  transcription, check-ins, admin basics — deployed to a pilot in ~14-16 weeks per blueprint Part 5.

## Build order (blueprint Part 5)

- [ ] **Phase 0 — Validation.** Interviews (15-20) + institution calls. Gate: 12/20 specific costly
  stalls and 2 institutions willing to pilot/pay. *(recommended next; runs parallel to Step 1)*
- [ ] **Step 1 — Project setup.** Git repo, `.gitignore`, lint/hooks, Dockerfiles, env examples,
  GitHub Actions CI, staging env, monitoring. `Done when:` hello-world deploys through CI/CD.
- [ ] **Step 2 — Database.** Postgres + pgvector, Alembic migrations for Part 4 schema, seed stages/
  gates, indexes, RLS. `Done when:` clean migrations + cross-tenant tests + restore drill.
- [ ] **Step 3 — Authentication.** Email + Google/GitHub, roles, JWT + RLS session settings,
  onboarding/consent, MFA for privileged roles, export/delete. `Done when:` roles tested via API.
- [ ] **Step 4 — Core platform.** Project CRUD, dashboard, tasks/documents/files, notifications,
  check-in, mobile shell, OpenAPI client. `Done when:` signup → project → tasks/files on mobile.
- [ ] **Step 5 — LLM gateway + agents.** Routing, structured outputs, retries, budgets, prompt
  registry, `agent_runs`, evals. `Done when:` a test agent runs end-to-end, logged and budgeted.
- [ ] **Step 6 — Stages 0-1 features.** Readiness, Coach, problem statement + Reviewer scoring.
- [ ] **Step 7 — Stage 2 validation.** Interview toolkit, log, transcription, Synthesizer, evidence.
- [ ] **Step 8 — Gate engine.** Deterministic state machine + rubric scoring + remediation + override.
- [ ] **Step 9 — Prototype Audit.** Sandbox, static analysis, Auditor agent, report, injection tests.
- [ ] **Step 10 — Stage 3 + build-track templates.** Competitors, solution scoring, PRD/arch/checklists.
- [ ] **Step 11 — Security + testing.** Pentest, cross-tenant suite, contract tests, load, privacy review.
- [ ] **Step 12 — Bug-fix pipeline.** Triage/fix agents with human approval + canary rollback.
- [ ] **Step 13 — Pilot launch.** 20-30 students, 2-3 institutions, metric tracking, cost per user.
- [ ] **Step 14 — Iterate + plan Phase 2.** Retro, Phase 2 backlog, funding decisions post go/no-go.

## Current state (as of last session)

- **Working on:** Step 1 (project setup) — local baseline done; remote/staging still open.
- What exists:
  - `backend/app/main.py` — FastAPI with mock `/api/v1` endpoints (`/healthz`, `/overview`, `/projects`,
    `/stages`, `/journey`) returning demo data. No DB, no auth yet.
  - `backend/tests/` — pytest suite (7 tests, all passing) + `requirements-dev.txt`.
  - `frontend/` — working Next.js app with dashboard, journey, project, onboarding, new-project pages
    and gamification components. `npm run lint` clean, `npm run build` clean, production smoke 200 on
    `/journey` and `/dashboard`. Data is still hardcoded/demo, not yet wired to the API.
  - Repo scaffolding: git repo initialized (`main`), root `.gitignore`, `backend/.env.example`,
    `frontend/.env.local.example`, `.github/workflows/ci.yml` (backend pytest + frontend lint/build).
  - `Product_Blueprint.md` — full blueprint; no implementation yet.
- Verified 2026-09-20: `pytest backend/tests` 7 passed; backend `/healthz` smoke ok; `npm run lint`
  clean (fixed 3 pre-existing errors in ConfettiBurst, GateUnlockModal, TypewriterText); `next build`
  success (8 routes); `next start` smoke 200/200.
- What is still missing for Step 1: GitHub remote + push, branch protection, commit hooks,
  Dockerfiles, staging/prod environments, monitoring (Sentry/PostHog/Langfuse).
- **Next best action:** review + initial commit, create GitHub repo + push, then continue Step 1
  (Dockerfiles, staging env) or start Phase 0 validation interviews in parallel.

## Open decisions / risks

- Validations not yet run — Phase 0 gate determines whether scope holds (PRD Section 12).
- LLM provider, hosting, auth provider, STT provider: TBD (TRD Section 14).
- Next.js is a newer major version — read `frontend/node_modules/next/dist/docs/` before writing code.
- Launch jurisdiction / min user age unresolved (affects consent + minors' rules).

## Releases

None yet.