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
  *(code done + CI-verified 2026-09-20; live provisioned DB + restore drill still open — see below)*
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

## What we did this session (2026-09-20, late)

- **Fixed the RLS `INSERT ... RETURNING` blocker in auth** (session's main debug).
- Root cause: `INSERT INTO projects ... RETURNING id` re-triggers the policy **USING** clause when
  PostgreSQL rechecks returned rows; `is_project_member(id)` subquery can't see the just-inserted
  row in the same statement snapshot → `new row violates row-level security policy`. Proven by
  variants: WITH CHECK content is irrelevant (even `WITH CHECK (true)` + RETURNING fails; real
  WITH CHECK + no RETURNING succeeds). Earlier `current_setting` const-folding hypothesis was
  disproven via `EXPLAIN (VERBOSE, COSTS OFF)`.
- Fix (`1b97bb0`): `create_project` generates `uuid4()` id client-side, INSERTs with explicit id,
  no `RETURNING`. `Run db tests` went green.
- **Second CI failure (migrate round-trip) → root-caused and fixed.**
  - `alembic downgrade base` failed: `role "app_role" cannot be dropped because some objects
    depend on it — privileges for sequence audit_logs_id_seq`. 0005's downgrade revoked tables
    but not sequences.
  - Fix (`66d2572`): added `REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM app_role;` to the
    0005 downgrade.
  - CI `db` job tooling: split the migrate round-trip into per-stage logs (`migrate-down.log` /
    `migrate-up.log`) with `::error::DBTEST-DOWN/UP:` annotations; the prior single `&&` form
    couldn't emit a log when `downgrade base` failed (redirect only applied to the last command).
- **CI fully green** on `66d2572`: backend pytest, db (upgrade head → pytest → downgrade base →
  upgrade head), frontend lint+build, both docker image builds. RLS insert test now passes.
- Remaining for Step 3 (auth) after this: live provisioned Postgres for staging/prod + restore
  drill (Step 2 carryover); branch protection + commit hooks (Step 1 carryover).

## Current state (as of last session)

- **Working on:** Step 2 (database) — code complete and CI-verified; Step 3 (auth) is next.
- Step 2 record:
  - `backend/alembic/` — env + `0001_initial_schema` (full Part 4 DDL: 10 enums, 32 tables,
    10 indexes incl. hnsw vector indexes, RLS on projects/evidence_items/messages + member helper),
    `0002_seed_stages_gates` (S0-S4 + v1 rubrics for S1/S2/S3, threshold 70),
    `0003_member_check_definer` (SECURITY DEFINER fix — plain SQL functions inline into policies
    and recurse on the owner check; found via CI failure, fixed, green).
  - `backend/tests/test_db.py` — seeds, RLS flags, cross-tenant isolation (owner sees, outsider
    sees nothing across projects/evidence/messages). Skips locally without DATABASE_URL.
  - CI `db` job (pgvector:pg17 service): `alembic upgrade head` → pytest → `downgrade base` →
    `upgrade head`. Green on run 10 (`ef41d06`).
  - Still open for Step 2: provisioned managed Postgres for staging/prod (+pgvector, backups/PITR,
    restore drill); per-table RLS policies for remaining tenant tables land with Steps 3-4
    (core tables done; deny-by-default elsewhere).
  - Note: no local Postgres on this machine and Docker Desktop daemon is off — DB verification runs
    in CI. To run locally: install Postgres 17 + pgvector, set DATABASE_URL, `alembic upgrade head`.
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
- Commits `fcdfaec` (baseline) and `eda2abd` (Dockerfiles) pushed to
  `https://github.com/MECHA-ME/Student-Founder` (`main`). GitHub Actions CI green on both runs:
  backend pytest, frontend lint+build, and both docker image builds (`student-founder-api`,
  `student-founder-web`). Local `docker build` not run (Docker Desktop daemon off); images are
  verified through CI instead.
- What is still missing for Step 1: branch protection on `main`, commit hooks, staging/prod
  environments, monitoring (Sentry/PostHog/Langfuse).
- **Next best action:** enable branch protection on GitHub (requires repo admin click), then continue
  Step 1 (staging env + monitoring) or start Phase 0 validation interviews in parallel.

## Open decisions / risks

- Validations not yet run — Phase 0 gate determines whether scope holds (PRD Section 12).
- LLM provider, hosting, auth provider, STT provider: TBD (TRD Section 14).
- Next.js is a newer major version — read `frontend/node_modules/next/dist/docs/` before writing code.
- Launch jurisdiction / min user age unresolved (affects consent + minors' rules).

## Releases

None yet.