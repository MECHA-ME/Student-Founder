# Student Founder — Complete Product Blueprint

**Owner:** MECHA-ME (Mindful Engineering of Cognitive Humanoids Advancement, Merging Entelligence)
**Version:** 1.0 (Implementation-ready draft)
**Date:** 2026-09-20
**Working title:** Student Founder

**One-line description:** Student Founder is an AI-guided, stage-gated platform that helps student founders and builders move from idea or prototype to a validated problem, a deployed product, and first real users—with evidence required at every step.

---

## Contents

1. Project Requirement Document (PRD): what the app is, who it is for, what problem it solves
2. Technical Requirement Document (TRD): architecture and technology stack
3. App Flow: user journeys and screens
4. Backend Schema: database tables, relationships, authentication, data storage, organization
5. Implementation Plan: step-by-step build plan (Setup → Database → Authentication → Features → Development)
6. API Specification: endpoints, request and response formats, errors, security

## How to use this document

- Read Part 1 first; it defines scope and success metrics.
- Parts 2-4 are the technical design; Part 6 is the contract between frontend and backend.
- Part 5 sequences the work and defines go/no-go gates.
- Open decisions are listed in Part 1, Section 11 and Part 2, Section 14.

## Key open decisions (summary)

- Launch jurisdiction and languages (affects data-protection and minors' consent rules)
- Whether realtime voice is required in the MVP (recommended: no; transcription only)
- Institution pricing model
- Minimum user age
- LLM, hosting, speech-to-text, and auth providers

---

# PART 1: PROJECT REQUIREMENT DOCUMENT (PRD)

## 1. Overview

- **Product:** Student Founder, an AI-guided, stage-gated platform that takes student founders and student builders from idea or prototype to a validated problem, a deployed product, and first real users.
- **Owner:** MECHA-ME
- **Version / Status:** 0.1, Draft
- **Vision:** Every student who wants to build a venture has a structured, evidence-based path from "I have an idea" to "real users are using it," with an AI coach that challenges them instead of flattering them.
- **Mission alignment:** Solves a real, high-impact problem (student ventures die from lack of validation, direction, and execution support), and every outcome is measurable.

## 2. Problem Statement

**Who is affected**
- Student founders: idea stage, no product, often non-technical.
- Student builders: working prototype (hackathon, class, or personal project), no validation.
- Institutions (colleges, E-cells, incubators, hackathon organizers): they want student ventures to succeed but lack scalable, personalized support.

**Frequency:** Nearly every student who tries to start something hits these problems. Hackathon and project cohorts produce prototypes every semester that never become businesses.

**Severity:** Months of effort are wasted on products nobody needs. Students quit or abandon projects, lose confidence, and lose time against academics and placements.

**Core problems**
1. Building before validating; tech-first habit, no method.
2. No access to real customers beyond classmates (the campus bubble).
3. Idea-to-action gap; events and content without accountability.
4. Academic pressure and time conflict; no structured way to test a venture alongside studies.
5. No zero-to-deployment guidance; students ship code they don't understand.
6. Team breakup at graduation; verbal roles and equity.
7. No credibility, so no first customers or pilots.
8. Unclear legal and IP position (college resources, contracts, registration).
9. Unaware of grants, competitions, and programs; weak pitch.
10. No safe-fail path; fear of the resume gap and lost placement.

**Why existing solutions fail**
- Incubators and accelerators: selective, cohort-timed, generic; early-stage students excluded.
- Courses and videos: information overload; no accountability or personalization.
- Mentors: inconsistent access, rarely domain-specific.
- Generic AI chat: no project memory, no stage awareness, no follow-through, tends to agree with weak ideas.
- AI app builders: fast at building, but don't check whether anyone needs what is built.

**Evidence status:** These are hypotheses until the validation plan (Section 12) completes.

## 3. Target Users

**Persona A: Student Founder**
- Has an idea, no product; may be non-technical.
- Goals: know where to start, test the idea cheaply, find a team, decide on job vs. startup.
- Frustrations: no direction, family pressure, analysis paralysis.
- Entry: Stage 0.

**Persona B: Student Builder with Prototype**
- Has a demo or repo; usually technical; often a hackathon participant.
- Goals: turn the prototype into a real product with users.
- Frustrations: no idea whether anyone needs it; unclear next steps; prototype not production-grade.
- Entry: Prototype Audit, then Stage 2.

**Persona C: Institution Admin (buyer)**
- E-cell head, faculty coordinator, incubator manager, hackathon organizer.
- Goals: measurable student venture outcomes, scalable support, reporting.
- Frustrations: events with no follow-through, no visibility into student progress.

**Persona D: Mentor (Phase 3)**
- Experienced founder or professional who reviews milestones.

**Out of scope for now:** working professionals, non-student non-technical founders, non-student social-impact founders. Add only after the student segment is validated.

## 4. Value Proposition and Differentiation

- **Evidence-gated progress:** stages unlock only when the student submits real evidence (interviews, pre-commitments, usage data). No flattery.
- **Prototype Audit:** a demo-to-business gap report for builders on day one.
- **Adversarial Reviewer:** an AI that attacks weak assumptions before the market does.
- **Zero-to-deployment track:** guided PRD → architecture → build → test → deploy, unlocked after validation.
- **Confidentiality promise:** the student's idea and code stay theirs; no training on user data.
- **Institution dashboard (Phase 2):** cohort-level progress and impact metrics.

**Positioning statement:** For student founders and builders who don't know how to turn ideas or prototypes into real ventures, Student Founder is an AI-guided execution system that requires proof at every step. Unlike courses, event programs, and AI app builders, it stops students from building the wrong thing and shows them the next concrete action.

## 5. Product Scope: 360° Support Pillars

1. Clarity and direction (readiness, goals, constraints)
2. Problem and validation
3. Solution and differentiation
4. Build and deploy (zero to production)
5. Business foundations (pricing, finance, legal and IP, team and equity)
6. Go-to-market (first customers, marketing, retention)
7. Funding and ecosystem (grants, programs, pitch)
8. Founder skills and sustainability (communication, negotiation, time management, safe-fail)

**Phasing**
- **MVP (Phase 1):** Prototype Audit; Stages 0-3 with gate engine; evidence log; Coach and Reviewer agents; interview toolkit; interview audio transcription; lightweight zero-to-deploy templates (PRD generator, architecture suggestion, deployment checklist); accountability check-ins; basic analytics.
- **Phase 2:** Full Dev agent; student-facing fix assistant; realtime voice (mock customer and pitch practice); pilot analytics; institution dashboard; subscriptions and billing.
- **Phase 3:** Legal, finance, and team tracks; Research and Outreach agents; grants database; mentor network; multilingual voice; additional segments.

## 6. Functional Requirements

Priority: P0 = MVP must-have, P1 = MVP should-have, P2 = later.

**Accounts and onboarding**
- FR-1 (P0): Sign up and log in via email and Google or GitHub.
- FR-2 (P0): Onboarding captures user type (founder or builder), education, weekly hours, budget limit, skills, goals.
- FR-3 (P0): Age and consent capture; guardian-consent flow where the law requires it.
- FR-4 (P0): Data export and account deletion.

**Projects and workspace**
- FR-5 (P0): Create and manage multiple projects; each has a stage tracker, tasks, evidence log, documents.
- FR-6 (P1): Invite co-founders or collaborators with roles.

**Prototype Audit**
- FR-7 (P0): Submit a repo link, demo link, or description.
- FR-8 (P0): System analyzes in an isolated sandbox and returns a gap report (what it does, potential users, production gaps, missing demand evidence, security flags).
- FR-9 (P0): Report converts into recommended tasks and a suggested entry stage.

**Stage 0-1: Readiness and problem**
- FR-10 (P0): Guided problem definition: who is affected, frequency, severity, current alternatives, why they fail.
- FR-11 (P0): Problem statement scoring against a rubric with specific critique.
- FR-12 (P1): Readiness and constraints mapping (time, money, skills).

**Stage 2: Validation**
- FR-13 (P0): Interview toolkit: generated interview scripts, screener questions, non-leading question checker.
- FR-14 (P0): Interview log with consent flag; upload notes or audio.
- FR-15 (P0): Audio transcription for uploaded interview recordings (consent required).
- FR-16 (P0): Synthesizer turns interviews into pain-point clusters, quotes, and willingness signals; flags bias (leading questions, friends and family).
- FR-17 (P0): Pre-commitment evidence types: waitlist, letter of intent, pilot agreement, deposit, usage data.

**Stage 3: Solution**
- FR-18 (P0): Competitor map with source links.
- FR-19 (P0): Solution validation scoring: feasibility, scalability, cost vs. impact, adoption; redesign guidance if any fails.

**Gate engine**
- FR-20 (P0): Deterministic stage state machine; progress unlocks only on rubric-passing evidence.
- FR-21 (P0): Gate results are pass, conditional, or fail, each with specific remediation tasks.
- FR-22 (P1): Human override by an authorized mentor or admin, logged.

**Agents and coaching**
- FR-23 (P0): Coach chat (Socratic, stage-aware, project-memory aware).
- FR-24 (P0): Reviewer (adversarial critique on demand and at each gate).
- FR-25 (P0): Every agent response is traceable (prompt version, model, inputs).
- FR-26 (P1): User can rate responses.

**Zero-to-deployment track (lightweight in MVP)**
- FR-27 (P1): Generate PRD from validated problem and evidence.
- FR-28 (P1): Architecture and tech-stack suggestions with trade-offs; student must choose and justify.
- FR-29 (P1): Deployment checklist and security checklist templates.
- FR-30 (P1): Build track locked until Stage 2 gate passes; sandbox for small prototypes remains open.

**Accountability**
- FR-31 (P0): Weekly check-in (progress, blockers, hours).
- FR-32 (P1): Email and in-app reminders tied to tasks and gates.

**Admin and analytics**
- FR-33 (P0): Platform admin console (users, agent runs, cost, content).
- FR-34 (P0): Product analytics for the impact metrics in Section 8.
- FR-35 (P2): Institution dashboard: cohort progress, stage funnel, outcomes.

## 7. Non-Functional Requirements

- **Security:** Tenant isolation via row-level security; MFA for admins; encryption in transit and at rest; sandboxed code analysis; audit logs; no training on user data.
- **Privacy:** Data minimization in prompts; retention limits; consent for recording; jurisdiction-specific compliance and minors' rules.
- **Performance:** Page loads under 2 seconds on mid-range mobile; chat first-token under 3 seconds; Prototype Audit result within 5 minutes.
- **Availability:** 99.5% for MVP; graceful degradation when the LLM provider fails.
- **Accessibility:** WCAG 2.1 AA baseline; mobile-first PWA.
- **Cost:** Per-stage token budgets; cost per activated user tracked from day one.
- **Observability:** Error tracking, tracing, LLM run logging, alerts.
- **LLM quality:** Evaluation suite for rubric scoring consistency, hallucination checks on cited sources, and injection tests.
- **Localization:** English at launch; architecture ready for more languages.

## 8. Success Metrics (Impact-Based)

Targets below are initial hypotheses; reset after the pilot baseline.

- **Activation:** % of signups who complete the first stage task within 7 days.
- **Time to validated problem:** median days from signup to Stage 2 gate pass (hypothesis: under 6 weeks).
- **Interviews completed per active project** (hypothesis: at least 10 within 6 weeks).
- **Stage funnel:** % reaching each gate.
- **Pre-commitments obtained** (waitlist, LOI, pilot, deposit) per project.
- **Pilot conversion:** % of validated projects with a live pilot.
- **First revenue or first paying pilot.**
- **90-day continued activity.**
- **Institution pilots signed** (target: 2-3 during MVP pilot).
- **Cost per activated user** and gross margin per institution seat.
- **Quality and safety:** thumbs-up rate, injection or safety incidents (target: zero).

## 9. Business Model and Financial Discipline

- **Revenue paths (to validate):** institution licenses (per cohort or seat); sponsor- or CSR-funded cohorts; grants; later, premium features for individuals.
- **Student access:** free tier with token budgets per stage.
- **Cost controls:** model routing, caching, per-stage budgets, monitoring cost per user.
- **Runway:** define monthly burn and runway before Phase 2; no hiring or scaling before institution willingness to pay is confirmed.
- **Pricing:** TBD after institution interviews.

## 10. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Weak problem or demand | Validate with interviews before full build |
| Students won't pay | Sell to institutions; validate willingness early |
| Legal or financial output is wrong | Vetted templates, not free-form advice; professional review |
| LLM flatters weak ideas | Evidence-gated scoring; adversarial reviewer |
| Prompt injection via audited repos | Sandbox, read-only tools, treat repo content as data |
| Data staleness (grants, programs) | Dated, source-linked, verified entries or drop the feature |
| Cost overrun | Budgets, routing, alerts |
| Retention drops at graduation | 3-6 month journey design with a clear exit outcome |
| Scope creep across 8 pillars | Phase discipline; MVP limited to Stages 0-3 |
| Crowded space | Differentiate on evidence-gating and prototype-to-business conversion |

## 11. Assumptions and Open Decisions

- Launch jurisdiction and languages: TBD.
- Is realtime voice required in the MVP? Recommended: no (transcription only).
- Institution pricing model: TBD.
- Minimum age of users: TBD (affects consent and contract features).
- LLM provider(s): provider-agnostic gateway; final selection TBD.

## 12. Validation Plan (Before and During Build)

- Interview 15-20 people: 10-12 student builders and founders (include some who quit), 3-4 faculty, E-cell, or incubator leads, 2-3 recent student founders.
- Ask about past behavior: what they did after the prototype, what stopped them, what they tried or paid to fix it.
- **Proceed if:** at least 12 of 20 describe a specific, costly stall with a failed fix attempt, and at least 2 institutions show willingness to pilot or pay.
- **Otherwise:** the problem is too weak; redesign or drop.

---

# PART 2: TECHNICAL REQUIREMENT DOCUMENT (TRD)

## 1. Purpose and Scope

Defines the architecture, technology choices, and engineering standards for the MVP (Phase 1), with notes on Phase 2 and 3 extension points.

## 2. Architecture Overview

```
[Web/PWA Client (Next.js)]
        |
[API Gateway / Backend API (FastAPI)]
   |          |            |             |
[Auth]   [Gate Engine]  [Project/Evidence  [Notification
          (state        Services]           Service]
          machine)          |
                            |
              [Agent Orchestration Service]
                 |            |            |
          [LLM Gateway]  [Tool Layer]  [Prompt/Eval Registry]
                              |
                 [Sandbox Service (isolated containers)]

[PostgreSQL + pgvector] [Redis (cache/queue)] [Object Storage]
[Worker Pool: transcription, audits, embeddings, synthesis]
[Observability: Sentry, OpenTelemetry, Langfuse, PostHog]
```

**Key principle:** the gate engine is deterministic and lives outside the LLM. Agents advise; rubrics and rules decide.

## 3. Technology Stack

- **Frontend:** Next.js + TypeScript, Tailwind CSS, mobile-first PWA. State: React Query. Forms: React Hook Form + Zod.
- **Backend API:** FastAPI (Python), Pydantic models, async I/O.
- **Agent service:** separate Python service so agent workloads scale and fail independently of the API.
- **Database:** PostgreSQL (managed; Supabase is the fastest start) with pgvector; Alembic migrations.
- **Cache and queue:** Redis; worker framework such as Celery or RQ (or a managed queue).
- **Object storage:** S3-compatible (uploads, audio, generated files), virus-scanned on upload.
- **LLM gateway:** internal provider-agnostic module with model routing, structured outputs, retries, timeouts, fallback provider, caching, per-stage token budgets.
- **Speech-to-text (MVP):** managed STT service behind an adapter; Phase 2 adds TTS and a realtime layer (WebRTC/WebSocket, e.g., LiveKit).
- **Auth:** managed auth (Supabase Auth, Clerk, or Keycloak); OAuth with Google and GitHub; JWT with role and org claims.
- **Sandbox:** container isolation (gVisor or Firecracker), no network by default, no secrets, CPU, memory, and time limits.
- **Infra and DevOps:** Docker, GitHub Actions CI/CD, Terraform (IaC), staging and production environments. Hosting: Vercel (frontend); Railway, Render, or Fly (backend), with a migration path to a major cloud when scale requires.
- **Observability:** Sentry (errors), OpenTelemetry (traces), Langfuse (LLM tracing and evals), PostHog (product analytics), uptime monitoring.
- **Testing:** Pytest, Vitest/Jest, Playwright (e2e), Semgrep/CodeQL (SAST), Trivy (containers and dependencies).

## 4. Component Specifications

### 4.1 Web client
- Pages per the App Flow document; server-side rendering for public pages; PWA for install and offline read.
- All data via API; no direct DB access.

### 4.2 Backend API
- REST with OpenAPI spec; versioned (`/v1`).
- Auth middleware validates JWT and injects user and org context into each DB session for RLS.
- Rate limiting per user and IP; request validation; idempotency keys on write endpoints that trigger agents.

### 4.3 Gate engine
- Stage state machine: locked → in_progress → submitted → passed | conditional | failed.
- Rubrics stored as versioned JSON: criteria, weights, minimum evidence types, pass threshold.
- Evaluation: rule checks first (counts, types, consent flags), then LLM-scored qualitative criteria with structured output, then final decision by rules. Result includes per-criterion score, cited evidence, remediation tasks.
- Human override recorded in audit log.

### 4.4 Agent orchestration
- Agents in MVP: Coach, Reviewer, Prototype Auditor. Supporting functions: Synthesizer, Generators (scripts, PRD, copy).
- Each agent has: system prompt (versioned), allowed tools, autonomy level, token budget, output schema.
- Autonomy levels: L0 suggest, L1 draft, L2 act with human approval, L3 autonomous (low-risk only; none in MVP except notifications).
- Agents read structured project state (stage, evidence, decisions, tasks) plus retrieved context, not raw chat history.
- Tool calling via function calling or MCP; all tool calls logged.

### 4.5 LLM gateway
- Model routing: small model for classification, summarization, extraction; stronger model for review, coaching, and rubric scoring.
- Structured outputs validated with Pydantic; retry on schema failure.
- Caching for deterministic calls; timeout and circuit breaker; provider fallback.
- Cost accounting per call written to `agent_runs`.

### 4.6 Knowledge base (RAG)
- Curated playbooks, templates, jurisdiction-specific modules; every document has source, date, and verification status.
- Chunk, embed, and store in pgvector; hybrid retrieval (keyword + vector) with metadata filters (jurisdiction, category, freshness).
- Agents cite retrieved sources; no citation, no claim on legal or funding facts.

### 4.7 Prototype Audit pipeline
1. Validate URL (allowlist of hosts such as GitHub, GitLab; size limit).
2. Worker clones repo into an isolated sandbox (shallow clone, read-only mount).
3. Static analysis: language detection, dependency scan, secret scan, SAST, structure summary, test presence.
4. Auditor agent reads a bounded, sanitized summary (never executes code; treats repo content as untrusted data).
5. Report generated as structured JSON: capabilities, potential users, production gaps, security flags, missing demand evidence, recommended tasks.
6. Sandbox destroyed; only report and metadata retained.

### 4.8 Transcription pipeline (MVP voice)
- Upload audio (with consent flag) → virus scan → worker → STT → transcript stored → synthesizer produces insights.
- Retention: audio deleted after transcript confirmation unless the student opts to keep it.

### 4.9 Notification service
- Email and in-app; templates; user-level preferences; rate caps.

## 5. Data Layer

- PostgreSQL primary with point-in-time recovery, daily backups, tested restores.
- Multi-tenancy by `org_id` and `user_id` with RLS on all tenant tables.
- pgvector HNSW indexes for embeddings; move to a dedicated vector store only if latency or scale metrics demand it.
- Redis: cache, rate limits, job queue, short-lived session data.
- Details in Part 4 (Backend Schema).

## 6. LLM and Agent Quality

- **Evaluation suite:** golden datasets for rubric scoring consistency, critique quality, and hallucination checks; run in CI on prompt or model changes.
- **Prompt versioning:** stored in DB; each run records the version.
- **Guardrails:** input and output filtering, PII minimization, refusal rules for legal or financial certainty, disclaimers with human-reviewed templates for legal and financial content.
- **Anti-sycophancy:** Reviewer prompt instructs critique first; scores require citing evidence; unsupported claims reduce scores.
- **Cost controls:** per-stage token budgets, monthly user caps, alerts on anomalies.

## 7. Security Architecture

- **Identity:** MFA required for admins and mentors; optional for students; session revocation; short-lived JWTs.
- **Authorization:** RBAC + RLS; automated cross-tenant access tests in CI.
- **Secrets:** managed secrets store; no secrets in repos; rotation policy.
- **Transport and storage:** TLS everywhere; encryption at rest for DB and storage; field-level encryption for sensitive fields.
- **Perimeter:** WAF, rate limiting, CORS restrictions, CSRF protection, strict CSP.
- **LLM-specific:** prompt injection defenses (data/instruction separation, least-privilege tools, no autonomous external actions), output sanitization before rendering, tenant-scoped retrieval.
- **Sandboxing:** no untrusted code executed outside isolated containers.
- **Supply chain:** dependency scanning, secret scanning, SAST, pinned versions, SBOM, signed builds.
- **Monitoring:** audit logs for sensitive actions, anomaly alerts, incident response runbook.
- **Privacy:** no model training on user data; retention schedule; export and delete; consent records.

## 8. Automated Bug-Fix Pipeline (Platform)

1. Detect: Sentry alerts or failing CI.
2. Triage agent groups and prioritizes issues.
3. Fix agent reproduces the issue in a sandbox and opens a pull request with a small diff and added tests.
4. CI must pass (tests, SAST, dependency checks).
5. **Human approval required** for merge, except an explicit allowlist of low-risk classes (lint, dependency patch updates).
6. Canary deploy with automatic rollback on error-rate increase.

- Guardrails: diff-size limit, required test coverage on changed code, protected branches, no direct production access.
- Phase 2: student-facing fix assistant in explain-then-fix mode.

## 9. Voice Roadmap

- **MVP:** audio upload and transcription only.
- **Phase 2:** realtime voice for mock customer interviews and pitch practice. Requirements: speech-to-speech turn latency about 1 second or less, voice activity detection, interruption handling, consent and retention rules, cost caps per session.
- **Phase 3:** multilingual voice.

## 10. DevOps

- **Environments:** local, dev, staging, production; production changes only via CI/CD.
- **CI:** lint, unit and integration tests, SAST, dependency and container scan, LLM eval subset on prompt changes.
- **CD:** automated staging deploys; production with approval and canary; database migrations reviewed, backward compatible.
- **Feature flags** for gradual rollout of agent changes.
- **SLOs:** API 99.5% availability; p95 API latency under 500 ms (non-LLM); alerting on error rate, queue depth, and LLM cost.
- **Disaster recovery:** RPO 24 hours or better, RTO 4 hours, documented restore drill.

## 11. Testing Strategy

- Unit and integration tests for API, gate engine, and RLS.
- E2E tests (Playwright) for core flows: onboarding, Prototype Audit, interview log, gate submission.
- LLM evals as described in Section 6.
- Security tests: cross-tenant access, injection test set, dependency scans, pre-launch penetration test.
- API contract tests generated from the OpenAPI spec (see Part 6).
- Load tests for chat and audit queue.

## 12. Scalability and Cost

- Stateless API and agent services; horizontal scaling; queue-based audit and transcription workers.
- Load target for MVP pilot: 500 registered users, 100 concurrent.
- Cost model: track per-user LLM, transcription, and infra cost; alert if cost per activated user exceeds a set threshold.

## 13. Integrations

- GitHub and GitLab (read-only, repo analysis), Google auth, email provider, payment provider (Phase 2), calendar (optional, Phase 2).

## 14. Technical Decisions Log and Open Items

- ADR-001: pgvector first, dedicated vector DB on evidence.
- ADR-002: deterministic gate engine; LLM advises.
- ADR-003: sandbox for all untrusted code.
- ADR-004: human approval for all bug-fix merges.
- Open: LLM provider(s), hosting provider, STT provider, auth provider, launch jurisdiction and its data-protection requirements.

---

# PART 3: APP FLOW (USER JOURNEY)

## 1. Screen Inventory

- Landing, Sign up / Log in, Onboarding
- Dashboard (all projects), Project Home (stage tracker)
- Prototype Audit (submit, status, report)
- Stage 0 Readiness, Stage 1 Problem, Stage 2 Validation (interview toolkit, interview log, insights, evidence), Stage 3 Solution (competitors, validation scores)
- Gate Submission and Result
- Build Track (PRD, architecture, checklists)
- Coach chat, Reviewer panel
- Tasks, Documents, Team
- Weekly Check-in, Notifications
- Settings (profile, privacy, consents, data export and deletion)
- Admin console (platform admin)
- Institution dashboard (Phase 2)

## 2. Global Navigation

Dashboard | Project (Stages, Tasks, Evidence, Documents, Build, Team) | Coach | Notifications | Settings.

Persistent stage progress bar; "Next best action" card on every project screen.

## 3. Flow 1: Sign-Up and Onboarding

1. User lands, sees value proposition, clicks Get Started.
2. Sign up with email or Google or GitHub; verify email.
3. Age and consent screen; if under the age threshold, guardian consent flow before continuing.
4. Choose type: "I have an idea" (founder) or "I have a prototype" (builder).
5. Short profile: education, graduation year, weekly hours, budget limit, skills, goal (venture, learning, decision on job vs. startup).
6. Create first project: title and one-line description.
7. Branch: founder → Stage 0; builder → Prototype Audit.
8. Show a "what happens next" summary and the first task.

## 4. Flow 2: Student Builder Path (Prototype Audit)

1. Submit repo link, demo link, or written description; optional notes on target users.
2. System validates URL and size; shows progress ("analyzing in isolated environment").
3. Report appears: what it does, potential users, production gaps, security flags, missing demand evidence, recommended tasks, suggested entry stage.
4. User can add evidence or correct the summary; Coach offers to walk through the report.
5. User accepts recommendations; tasks are created; user enters Stage 2 (or Stage 1 if problem definition is weak).

**Edge cases**
- Private repo: prompt for read access or paste a description.
- Oversized repo: analyze a subset and say so.
- Injection attempt detected: flag, continue with sanitized data.
- Analysis failure: retry, with manual description fallback.

## 5. Flow 3: Student Founder Path (Stage 0 to 1)

**Stage 0: Readiness**
1. Guided questions: goal, weekly hours, budget, skills, constraints, reason for starting.
2. Coach challenges vague answers; user saves a one-page commitment.
3. Task: define the problem hypothesis.

**Stage 1: Problem definition**
1. Form guided by prompts: who is affected, how often, how severe, what they use today, why that fails.
2. Reviewer scores against the rubric with specific critique; user revises until above threshold or moves forward with a "weak problem" warning.
3. Output: versioned problem statement; unlocks Stage 2 tasks.

## 6. Flow 4: Stage 2 Validation

1. Toolkit: generate interview script, screener questions, and a non-leading question checker.
2. User schedules interviews (external), adds each to the interview log (alias, segment, date, consent status).
3. After each interview: upload notes or audio (with consent confirmation) or paste text.
4. Transcription (for audio) → Synthesizer produces pain points, quotes, willingness signals, and bias flags (leading questions, friends and family, campus bubble).
5. Dashboard shows interview count, segment diversity, and pain-point clusters.
6. User adds pre-commitment evidence (waitlist signups, LOI, pilot agreement, deposit, usage data).
7. When requirements are met, "Submit for Gate" becomes available.

**Edge cases**
- Too few interviews: button locked, shows the gap.
- Mostly peers as interviewees: warning; requires outside-bubble interviews.
- No consent flag: audio rejected.
- Poor audio: transcript confidence warning.

## 7. Flow 5: Gate Evaluation

1. User submits; system runs rule checks, then Reviewer scoring per criterion, citing evidence.
2. Result screen: Pass, Conditional, or Fail with per-criterion scores and specific gaps.
3. **Pass:** next stage unlocks; celebration limited to a summary of what was proven.
4. **Conditional:** list of required additions; user can proceed in parallel on non-locked tasks.
5. **Fail:** remediation tasks generated; option to pivot the problem, refine, or archive the project with a documented "stop" decision (a valid outcome).
6. User can request human review (Phase 2).

## 8. Flow 6: Stage 3 Solution

1. Add competitors; Research assistance suggests candidates with source links; user verifies.
2. Fill differentiation statement; Reviewer challenges.
3. Complete four scores with justification: feasibility, scalability, cost vs. impact, adoption.
4. If any dimension fails, system recommends redesign paths; gate passes only when all four meet thresholds.

## 9. Flow 7: Build Track (After Stage 2 Gate)

1. System generates a PRD draft from the validated problem and evidence; user edits and approves.
2. Architecture step: system proposes 2-3 stack options with trade-offs; user chooses and writes the reasoning.
3. Setup checklist (repo, environments, CI).
4. Build in vertical slices with sprint task lists; Coach in explain-then-build mode (full copilot in Phase 2).
5. Testing and security checklist must be checked before the deployment step.
6. Deployment checklist; user records live URL and first user count as evidence for pilot stage.

## 10. Flow 8: Coach and Reviewer

- **Coach:** opens with the current stage and next action; asks questions before giving answers; can reference project state and evidence.
- **Reviewer:** invoked on any artifact ("Challenge this"); returns risks, weak assumptions, and required evidence.
- Limits shown clearly: no professional legal or financial advice; suggests templates and human review.
- Conversation history stored per project; user can rate responses.

## 11. Flow 9: Weekly Check-In and Notifications

1. Weekly prompt: progress, blockers, hours spent.
2. System updates task status and flags stalled tasks.
3. Reminders when a gate requirement is close, or when there is no activity for 7 days (first nudge, then a lighter cadence; respects user preferences).

## 12. Flow 10: Settings and Privacy

- Edit profile and notification preferences.
- View and revoke consents.
- Export project data; delete account and data (with confirmation and a clear retention statement).

## 13. Flow 11: Institution Dashboard (Phase 2)

1. Admin logs in with MFA; creates cohorts; invites students.
2. Dashboard: stage funnel, interviews completed, pilots, at-risk projects, outcome metrics.
3. Export reports; set cohort deadlines and announcements.
4. Student privacy: admins see progress metrics, not private chat content, unless the student opts in.

## 14. Global Error and Edge-Case Handling

- **LLM outage:** show status, queue the request, allow non-LLM work to continue.
- **Token budget reached:** explain, show reset time, offer non-LLM activities.
- **Session expiry:** preserve unsaved work locally and restore after login.
- **Abandonment:** gentle re-engagement and an option to pause the project.
- **Content flagged (harmful or off-mission):** refuse politely and log.

---

# PART 4: BACKEND SCHEMA

## 1. Conventions

- PostgreSQL; UUID primary keys (`gen_random_uuid()`); `created_at`, `updated_at` timestamps (timestamptz).
- Soft delete via `deleted_at` where recovery matters.
- Row-level security (RLS) enabled on all tenant tables.
- Enums implemented as Postgres enum types or check constraints.
- Embeddings: `vector(1536)` (dimension depends on the chosen embedding model).

## 2. Authentication and Authorization Model

- **Authentication:** managed auth provider; email + OAuth (Google, GitHub); email verification; MFA required for `institution_admin`, `mentor`, `platform_admin`.
- **Tokens:** short-lived JWT access tokens (about 15 minutes), rotating refresh tokens, revocation list.
- **JWT claims:** `sub` (user_id), `role`, `org_id`, `age_group`.
- **Roles:** `student`, `mentor`, `institution_admin`, `platform_admin`.
- **Access rules (summary):**
  - Student: full access to own projects and projects where they are a member.
  - Mentor: read access to assigned projects; can submit reviews; no chat access unless shared.
  - Institution admin: cohort-level aggregates and project progress within own org; no private chat content by default.
  - Platform admin: operational access with audit logging; no bulk content browsing without a logged reason.
- **RLS mechanism:** the API sets `app.user_id`, `app.org_id`, and `app.role` in the DB session; policies reference these settings.

## 3. Tables (DDL)

```sql
-- Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS vector;

-- Enums
CREATE TYPE user_role AS ENUM ('student','mentor','institution_admin','platform_admin');
CREATE TYPE user_type AS ENUM ('founder','builder');
CREATE TYPE age_group AS ENUM ('under_18','18_plus');
CREATE TYPE org_type AS ENUM ('college','e_cell','incubator','hackathon','other');
CREATE TYPE entry_type AS ENUM ('idea','prototype');
CREATE TYPE project_status AS ENUM ('active','paused','archived','stopped');
CREATE TYPE stage_status AS ENUM ('locked','in_progress','submitted','passed','conditional','failed');
CREATE TYPE task_status AS ENUM ('todo','in_progress','done','blocked','cancelled');
CREATE TYPE evidence_type AS ENUM ('interview_notes','transcript','survey','waitlist','loi','pilot_agreement','deposit','usage_metric','landing_page','link','file','other');
CREATE TYPE audit_status AS ENUM ('queued','running','completed','failed');

-- Organizations (institutions)
CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type org_type NOT NULL,
  country text,
  domain text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Users (identity linked to auth provider)
CREATE TABLE users (
  id uuid PRIMARY KEY,                       -- equals auth provider user id
  email text NOT NULL UNIQUE,
  full_name text,
  role user_role NOT NULL DEFAULT 'student',
  user_type user_type,                       -- for students
  org_id uuid REFERENCES organizations(id),
  age_group age_group,
  guardian_consent_at timestamptz,
  onboarding_completed_at timestamptz,
  last_active_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE profiles (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  institution_name text,
  program text,
  graduation_year int,
  skills text[],
  weekly_hours int,
  budget_limit numeric(12,2),
  goal text,
  preferences jsonb DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL,                        -- data_processing, recording, guardian, marketing
  version text NOT NULL,
  granted_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz
);

-- Cohorts
CREATE TABLE cohorts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id),
  name text NOT NULL,
  starts_on date,
  ends_on date,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE cohort_members (
  cohort_id uuid REFERENCES cohorts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  joined_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (cohort_id, user_id)
);

-- Projects
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES users(id),
  org_id uuid REFERENCES organizations(id),
  cohort_id uuid REFERENCES cohorts(id),
  title text NOT NULL,
  summary text,
  entry_type entry_type NOT NULL,
  current_stage_id uuid,                     -- FK added after stages table
  status project_status NOT NULL DEFAULT 'active',
  stop_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE project_members (
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'collaborator', -- owner, co_founder, collaborator, mentor
  invited_at timestamptz NOT NULL DEFAULT now(),
  accepted_at timestamptz,
  PRIMARY KEY (project_id, user_id)
);

-- Stages and gates (reference data)
CREATE TABLE stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,                 -- S0_READINESS, S1_PROBLEM, S2_VALIDATION, S3_SOLUTION, S4_BUILD...
  name text NOT NULL,
  position int NOT NULL,
  description text
);
ALTER TABLE projects ADD CONSTRAINT fk_projects_stage
  FOREIGN KEY (current_stage_id) REFERENCES stages(id);

CREATE TABLE stage_gates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_id uuid NOT NULL REFERENCES stages(id),
  version int NOT NULL,
  rubric jsonb NOT NULL,                     -- criteria, weights, required evidence types
  pass_threshold numeric(5,2) NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (stage_id, version)
);

CREATE TABLE project_stage_progress (
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  stage_id uuid REFERENCES stages(id),
  status stage_status NOT NULL DEFAULT 'locked',
  started_at timestamptz,
  passed_at timestamptz,
  PRIMARY KEY (project_id, stage_id)
);

CREATE TABLE gate_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  stage_id uuid NOT NULL REFERENCES stages(id),
  gate_id uuid NOT NULL REFERENCES stage_gates(id),
  submitted_by uuid NOT NULL REFERENCES users(id),
  result stage_status NOT NULL,              -- passed, conditional, failed
  total_score numeric(5,2),
  criteria_results jsonb NOT NULL,           -- per-criterion score, cited evidence ids, remediation
  agent_run_id uuid,
  override_by uuid REFERENCES users(id),
  override_reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Problem statements (versioned)
CREATE TABLE problem_statements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  version int NOT NULL,
  who_affected text,
  frequency text,
  severity text,
  current_alternatives text,
  why_alternatives_fail text,
  score numeric(5,2),
  critique jsonb,
  created_by uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (project_id, version)
);

-- Interviews and insights
CREATE TABLE interviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  interviewee_alias text NOT NULL,           -- no real names required
  segment text,
  outside_bubble boolean DEFAULT false,
  channel text,                              -- in_person, call, video, chat
  interviewed_on date,
  consent_confirmed boolean NOT NULL DEFAULT false,
  raw_notes text,
  file_id uuid,                              -- recording (optional)
  transcript_text text,
  transcript_confidence numeric(4,3),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE interview_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id uuid NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
  pain_points jsonb,
  quotes jsonb,
  willingness_signal text,                   -- none, weak, moderate, strong
  bias_flags jsonb,
  agent_run_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Evidence log (central to gates)
CREATE TABLE evidence_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  stage_id uuid REFERENCES stages(id),
  type evidence_type NOT NULL,
  title text NOT NULL,
  content_text text,
  source_url text,
  file_id uuid,
  interview_id uuid REFERENCES interviews(id),
  verified boolean NOT NULL DEFAULT false,
  embedding vector(1536),
  created_by uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Solution stage
CREATE TABLE competitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  url text,
  positioning text,
  strengths text,
  weaknesses text,
  source_url text,
  retrieved_at timestamptz,
  verified_by_user boolean DEFAULT false
);

CREATE TABLE solution_validations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  version int NOT NULL,
  differentiation_statement text,
  feasibility_score int, feasibility_notes text,
  scalability_score int, scalability_notes text,
  cost_impact_score int, cost_impact_notes text,
  adoption_score int, adoption_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (project_id, version)
);

-- Prototype audits
CREATE TABLE prototype_audits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  source_type text NOT NULL,                 -- repo, demo_url, description
  repo_url text,
  commit_sha text,
  description text,
  status audit_status NOT NULL DEFAULT 'queued',
  report jsonb,                              -- capabilities, users, gaps, security flags, tasks
  injection_flagged boolean DEFAULT false,
  error text,
  requested_by uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

-- Tasks and documents
CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  stage_id uuid REFERENCES stages(id),
  title text NOT NULL,
  description text,
  status task_status NOT NULL DEFAULT 'todo',
  due_date date,
  assignee_id uuid REFERENCES users(id),
  created_by_type text NOT NULL DEFAULT 'user',  -- user, system, agent
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type text NOT NULL,                        -- prd, architecture, interview_script, deploy_checklist, landing_copy
  version int NOT NULL DEFAULT 1,
  title text,
  content text NOT NULL,
  agent_run_id uuid,
  created_by uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Files
CREATE TABLE files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES users(id),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  storage_key text NOT NULL,
  mime_type text,
  size_bytes bigint,
  sha256 text,
  scan_status text NOT NULL DEFAULT 'pending', -- pending, clean, infected
  retain_until timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Conversations with agents
CREATE TABLE conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  agent_type text NOT NULL,                  -- coach, reviewer
  stage_id uuid REFERENCES stages(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role text NOT NULL,                        -- user, assistant, system
  content text NOT NULL,
  agent_run_id uuid,
  rating smallint,                           -- -1, 0, 1
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Agent observability and cost
CREATE TABLE prompt_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_type text NOT NULL,
  version int NOT NULL,
  template text NOT NULL,
  active boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (agent_type, version)
);

CREATE TABLE agent_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  agent_type text NOT NULL,
  prompt_version_id uuid REFERENCES prompt_versions(id),
  model text NOT NULL,
  status text NOT NULL,                      -- success, error, timeout, filtered
  input_tokens int,
  output_tokens int,
  cost_usd numeric(10,6),
  latency_ms int,
  trace_id text,
  tool_calls jsonb,
  error text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE usage_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  stage_id uuid REFERENCES stages(id),
  period text NOT NULL,                      -- e.g. 2026-10
  tokens_used bigint NOT NULL DEFAULT 0,
  cost_usd numeric(10,4) NOT NULL DEFAULT 0,
  token_limit bigint,
  UNIQUE (user_id, project_id, stage_id, period)
);

-- Knowledge base (RAG)
CREATE TABLE knowledge_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,                    -- playbook, legal, grant, program, template
  jurisdiction text,
  source_url text,
  content text NOT NULL,
  retrieved_at timestamptz,
  verified_at timestamptz,
  verified_by uuid REFERENCES users(id),
  expires_at timestamptz,
  active boolean NOT NULL DEFAULT true
);

CREATE TABLE knowledge_chunks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES knowledge_documents(id) ON DELETE CASCADE,
  chunk_index int NOT NULL,
  chunk_text text NOT NULL,
  embedding vector(1536),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Engagement
CREATE TABLE checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id),
  week_start date NOT NULL,
  progress text,
  blockers text,
  hours_spent numeric(5,1),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (project_id, user_id, week_start)
);

CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL,
  channel text NOT NULL DEFAULT 'in_app',    -- in_app, email
  payload jsonb,
  sent_at timestamptz,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Security and audit
CREATE TABLE audit_logs (
  id bigserial PRIMARY KEY,
  actor_id uuid,
  actor_role user_role,
  action text NOT NULL,
  entity_type text,
  entity_id uuid,
  ip inet,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
```

## 4. Indexes (Essential)

```sql
CREATE INDEX idx_projects_owner ON projects(owner_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_projects_org_cohort ON projects(org_id, cohort_id);
CREATE INDEX idx_evidence_project_stage ON evidence_items(project_id, stage_id);
CREATE INDEX idx_interviews_project ON interviews(project_id);
CREATE INDEX idx_tasks_project_status ON tasks(project_id, status);
CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at);
CREATE INDEX idx_agent_runs_project_created ON agent_runs(project_id, created_at DESC);
CREATE INDEX idx_audit_actor_created ON audit_logs(actor_id, created_at DESC);
CREATE INDEX idx_evidence_embedding ON evidence_items USING hnsw (embedding vector_cosine_ops);
CREATE INDEX idx_chunks_embedding ON knowledge_chunks USING hnsw (embedding vector_cosine_ops);
```

## 5. Row-Level Security (Examples)

```sql
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Helper: is current user a member of the project?
CREATE FUNCTION is_project_member(p uuid) RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM project_members
    WHERE project_id = p
      AND user_id = current_setting('app.user_id')::uuid
  ) OR EXISTS (
    SELECT 1 FROM projects
    WHERE id = p AND owner_id = current_setting('app.user_id')::uuid
  );
$$ LANGUAGE sql STABLE;

CREATE POLICY projects_member_access ON projects
  USING (is_project_member(id));

CREATE POLICY evidence_member_access ON evidence_items
  USING (is_project_member(project_id));

CREATE POLICY messages_member_access ON messages
  USING (EXISTS (
    SELECT 1 FROM conversations c
    WHERE c.id = messages.conversation_id
      AND is_project_member(c.project_id)
  ));
```

- Institution admin aggregate views (Phase 2) read from materialized views (`cohort_progress_mv`) containing counts and stages only, not private content.
- CI runs automated cross-tenant tests: a user from org A must never read org B rows.

## 6. Relationships (Summary)

- organizations 1—N users, cohorts, projects
- users 1—1 profiles; 1—N consents
- cohorts N—N users (cohort_members)
- projects N—N users (project_members); project 1—N: stage progress, gate submissions, problem statements, interviews, evidence, competitors, solution validations, prototype audits, tasks, documents, files, conversations, check-ins
- stages 1—N stage_gates; stages 1—N project_stage_progress
- interviews 1—N interview_insights; interviews 1—N evidence_items
- conversations 1—N messages
- agent_runs referenced by messages, gate submissions, insights, documents
- knowledge_documents 1—N knowledge_chunks

## 7. Data Storage and Retention Rules

- **Audio recordings:** deleted after transcript confirmation unless the user opts to keep; hard maximum retention set in `files.retain_until`.
- **Interviewee identity:** alias only; no real names, contacts, or sensitive personal data required.
- **Repo contents:** never stored; only report, commit SHA, and metadata retained.
- **Chat and agent runs:** retained per policy (for example 12 months); deleted on account deletion.
- **Account deletion:** hard-delete personal data within a defined window; retain only anonymized aggregates and legally required audit records.
- **Backups:** encrypted; deletion propagates on backup expiry.
- **Embeddings:** derived data, deleted with source rows.

## 8. Organization of Data (Domains)

- **Identity and tenancy:** organizations, users, profiles, consents, cohorts
- **Journey:** projects, stages, gates, progress, submissions, tasks
- **Evidence:** problem statements, interviews, insights, evidence, competitors, solution validations, prototype audits
- **Content:** documents, files, knowledge base
- **AI operations:** conversations, messages, prompt versions, agent runs, usage ledger
- **Engagement and governance:** check-ins, notifications, audit logs

## 9. Deferred Tables (Phase 2-3)

`subscriptions`, `invoices`, `institution_pilots`, `mentor_profiles`, `mentor_assignments`, `team_agreements`, `grants_programs`, `voice_sessions`, `cohort_progress_mv`.

---

# PART 5: IMPLEMENTATION PLAN

**Assumptions:** team of 3-4 engineers plus one product/design lead; estimates are planning ranges, to be adjusted after Week 2. MVP target: about 14-16 weeks to pilot-ready.

**Build order:** Project Setup → Database → Authentication → Core Platform → LLM Foundation → Features → Security → Pilot.

## Phase 0: Validation and Discovery (Weeks 0-2, runs in parallel with setup)

- Run 15-20 interviews per the validation plan; log evidence.
- Speak with 3-4 institutions about pilot and willingness to pay.
- Draft clickable wireframes for Prototype Audit and Stage 1-3 flows.
- **Go/no-go gate:** proceed only if the interview criteria in the PRD are met. If not, redesign scope.

## Step 1: Project Setup (Weeks 1-2)

- Create monorepo (frontend, backend, agent service, infra); branch protection; code standards; commit hooks.
- Set up environments (dev, staging, production), Docker, and GitHub Actions CI (lint, tests, SAST, dependency scan).
- Provision infrastructure as code (Terraform), secrets manager, domain, SSL.
- Integrate Sentry, OpenTelemetry, PostHog, Langfuse.
- Write ADRs for key decisions; set up an engineering handbook.
- **Done when:** a "hello world" deploys through CI/CD to staging with monitoring visible.

## Step 2: Database (Weeks 2-3)

- Provision PostgreSQL with pgvector; configure backups and point-in-time recovery.
- Set up Alembic migrations; implement the schema from Part 4 (identity, journey, evidence, content, AI operations).
- Seed `stages`, `stage_gates` (v1 rubrics for Stages 1-3), and reference data.
- Create indexes; write RLS policies and helper functions.
- **Done when:** migrations run cleanly; automated cross-tenant tests pass; restore drill succeeds.

## Step 3: Authentication and Authorization (Weeks 3-4)

- Integrate auth provider (email, Google, GitHub); email verification.
- Implement roles, JWT claims, and DB session settings for RLS.
- Onboarding, age and consent capture, guardian consent flow, MFA for privileged roles.
- Rate limiting, session revocation, audit logging on sensitive actions.
- Data export and deletion endpoints (initial version).
- **Done when:** all roles tested; RLS verified through the API; consent records stored.

## Step 4: Core Platform (Weeks 4-6)

- Project CRUD, project members, dashboard, project home with stage tracker.
- Tasks, documents, files (upload, scan, storage).
- Notifications (in-app, email) and weekly check-in.
- Mobile-first UI shell, navigation, design system, accessibility baseline.
- Generate the OpenAPI spec from the backend; publish a typed client for the frontend (see Part 6).
- **Done when:** a user can sign up, create a project, add tasks and files, and see the stage tracker on mobile.

## Step 5: LLM Gateway and Agent Foundation (Weeks 5-7)

- Build LLM gateway (provider abstraction, routing, structured outputs, retries, fallback, caching).
- Prompt version registry; agent_runs logging; usage ledger and token budgets.
- Agent orchestration service with tool interface and autonomy levels.
- Evaluation harness: golden datasets, CI runs on prompt changes; injection test set.
- **Done when:** a test agent runs end to end with logging, budgets, tracing, and eval results.

## Step 6: Features, Stage 0-1 (Weeks 7-8)

- Readiness and constraints flow; Coach agent with stage-aware project memory.
- Problem definition form, Reviewer scoring, versioned problem statements.
- **Done when:** a founder can complete Stage 1 with critique; scores are consistent on the eval set.

## Step 7: Features, Stage 2 Validation (Weeks 8-10)

- Interview toolkit (script generator, screener, non-leading question checker).
- Interview log with consent flags; evidence log for pre-commitments.
- Transcription pipeline (upload, scan, STT, transcript); Synthesizer with bias flags.
- Interview and evidence dashboards.
- **Done when:** a user can log interviews, transcribe audio, see insights, and add pre-commitment evidence.

## Step 8: Gate Engine (Weeks 9-11)

- Stage state machine; rubric loader; rule checks; LLM criterion scoring with cited evidence.
- Gate result screens (pass, conditional, fail) with remediation tasks; override support (admin only).
- Tests: rubric consistency, edge cases, regression suite.
- **Done when:** all three stage gates work on seeded test projects with reproducible results.

## Step 9: Prototype Audit (Weeks 10-12)

- Build sandbox service with resource, time, and network limits.
- Static analysis worker (structure, dependencies, secret scan, SAST, tests present).
- Auditor agent over sanitized summary; report generation; task suggestions.
- Injection and abuse testing; failure handling.
- **Done when:** audits of at least 20 varied sample repos complete safely; injection tests pass; report quality reviewed by the team.

## Step 10: Stage 3 and Build Track Templates (Weeks 11-13)

- Competitor mapping (manual entry with suggested candidates and source links).
- Solution validation scoring; gate wiring.
- PRD generator, architecture options with justification prompts, deployment and security checklists.
- Lock the build track until the Stage 2 gate passes.
- **Done when:** a validated project can generate a PRD and complete the checklists.

## Step 11: Security Hardening and Testing (Weeks 12-14)

- Penetration test or structured internal security review; fix findings.
- Full RLS and cross-tenant test suite; dependency and container scan cleanup.
- API contract tests from the OpenAPI spec; fuzzing on write endpoints.
- Load test (target 100 concurrent users); cost review against budgets.
- Privacy review: retention jobs, deletion flow, consent audit; jurisdiction-specific compliance check.
- Incident response runbook and on-call rota.
- **Done when:** no open high-severity findings; retention and deletion verified.

## Step 12: Platform Bug-Fix Pipeline (Weeks 13-14)

- Connect Sentry and CI failures to a triage agent and fix agent that opens pull requests.
- Enforce human approval, diff limits, and coverage requirements; canary deploy with rollback.
- **Done when:** three seeded bugs are triaged and fixed via PR with human approval and safe rollout.

## Step 13: Pilot Launch (Weeks 14-16)

- Onboard 20-30 students and 2-3 institutions; run support and feedback channels.
- Track metrics from PRD Section 8; weekly review.
- Fix critical issues; measure cost per activated user.
- **Go/no-go for Phase 2:** stage funnel healthy, at least one institution showing willingness to pay or commit to a paid pilot, cost per activated user within budget, and no safety incidents.

## Step 14: Iterate and Plan Phase 2 (Week 16+)

- Retrospective and roadmap update.
- Phase 2 backlog: Dev agent and student fix assistant, realtime voice, institution dashboard, billing.
- Revisit funding, runway, and hiring only after the go/no-go.

## Team and Responsibilities

- **Product/design lead:** user research, flows, rubrics, content.
- **Backend engineer:** API, database, auth, gate engine.
- **AI engineer:** gateway, agents, evals, prompts, sandbox pipeline.
- **Frontend engineer:** PWA, screens, accessibility.
- **Shared:** DevOps, security reviews, testing.

## Budget and Cost Controls

- Track monthly infra, LLM, and STT spend against a set ceiling.
- Per-stage token caps and per-user monthly limits; alerts at 70% and 90% of budget.
- Review unit economics at Step 13 before any scaling decision.

## Risk Checkpoints

- **Week 2:** validation go/no-go.
- **Week 7:** agent quality and cost per call acceptable.
- **Week 12:** sandbox and injection safety verified.
- **Week 14:** security review closed.
- **Week 16:** pilot metrics and institution willingness decide Phase 2.

## Definition of Done (All Features)

Code reviewed; tests passing (unit, integration, RLS where relevant); eval suite passing for any agent change; security and privacy checklist completed; monitoring and alerts in place; documentation updated.

---

# PART 6: API SPECIFICATION

Version: v1 (MVP). Phase tags: **P1** = MVP, **P2** = Phase 2, **P3** = Phase 3. The machine-readable OpenAPI 3.1 spec is generated from the FastAPI backend and is the source of truth; this section is the human-readable contract.

## 1. Conventions

- **Base URL:** `https://api.<domain>/v1`
- **Format:** JSON (UTF-8), except file uploads (direct to object storage via presigned URLs) and streaming (SSE).
- **IDs:** UUID v4. **Timestamps:** ISO 8601 UTC (`2026-10-05T09:30:00Z`).
- **Naming:** `snake_case` for fields; plural nouns for collections.
- **Versioning:** major version in URL (`/v1`). Additive changes (new optional fields, new endpoints) are non-breaking. Breaking changes ship as `/v2`.
- **Authentication:** `Authorization: Bearer <JWT>` on every endpoint except health checks and provider webhooks. Sign-up, login, OAuth, MFA, and password reset are handled by the auth provider (see Section 3).
- **Authorization:** role claims (`student`, `mentor`, `institution_admin`, `platform_admin`) plus row-level security. Requests for resources the caller cannot access return **404** (not 403) to prevent enumeration.
- **Pagination:** cursor-based. Request: `?limit=25&cursor=<opaque>`. Response: `{ "data": [...], "next_cursor": "..." | null }`. Default limit 25, max 100.
- **Filtering and sorting:** `?status=active&sort=-created_at`.
- **Idempotency:** send `Idempotency-Key: <uuid>` on POST requests that start agents, audits, gate submissions, or uploads. Replays within 24 hours return the original result.
- **Async operations:** long-running work returns **202 Accepted** with a job resource and a `status_url`. Poll the resource, or use notifications.
- **Streaming:** chat responses use Server-Sent Events (SSE) (Section 12).
- **Request tracing:** every response includes `X-Request-Id`; include it in bug reports.
- **CORS:** allowlist of the web app origins only.

## 2. Standard Response Shapes

**Success (single):**
```json
{ "data": { "id": "6f1c...", "created_at": "2026-10-05T09:30:00Z" } }
```

**Success (list):**
```json
{ "data": [ { "id": "..." } ], "next_cursor": null }
```

**Error:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "title must be between 3 and 120 characters",
    "details": [ { "field": "title", "issue": "too_short" } ],
    "request_id": "req_8a2f..."
  }
}
```

**Error codes**

| HTTP | Code | Meaning |
|---|---|---|
| 400 | BAD_REQUEST | Malformed request |
| 401 | UNAUTHENTICATED | Missing or invalid token |
| 403 | FORBIDDEN | Authenticated but not allowed (role-level) |
| 403 | CONSENT_REQUIRED | Required consent missing (e.g., recording, guardian) |
| 404 | NOT_FOUND | Resource missing or not visible to caller |
| 409 | CONFLICT | State conflict (duplicate, version mismatch) |
| 409 | STAGE_LOCKED | Stage or feature not unlocked yet |
| 413 | PAYLOAD_TOO_LARGE | File or body too large |
| 422 | VALIDATION_ERROR | Field validation failed |
| 422 | UNSAFE_CONTENT | Input blocked by safety filters |
| 429 | RATE_LIMITED | Too many requests (see `Retry-After`) |
| 429 | TOKEN_BUDGET_EXCEEDED | Per-stage or monthly AI budget reached |
| 500 | INTERNAL_ERROR | Unexpected error |
| 503 | UPSTREAM_UNAVAILABLE | LLM or speech provider unavailable; retry later |

**Rate limits (defaults):** 120 requests/min per user; 20 requests/min on agent endpoints; 10 audit submissions/hour per project. Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After` on 429.

## 3. Authentication (Delegated to Auth Provider)

These flows are served by the auth provider, not the application API. The API only validates the resulting JWT.

| Flow | Notes |
|---|---|
| Sign up (email) | Email verification required |
| Log in (email, Google, GitHub) | OAuth 2.0 / OIDC |
| Token refresh | Rotating refresh tokens |
| Log out | Revokes refresh token |
| Password reset | Email link |
| MFA enroll and verify | Required for `mentor`, `institution_admin`, `platform_admin` |

**JWT claims:** `sub` (user_id), `role`, `org_id`, `age_group`, `exp` (about 15 minutes).

## 4. Users, Profile, Consents (`/me`)

| Method | Path | Description | Role | Phase |
|---|---|---|---|---|
| GET | `/me` | Current user, profile, onboarding status | any | P1 |
| PATCH | `/me` | Update name, user_type, preferences | any | P1 |
| PUT | `/me/profile` | Create or replace profile (education, weekly hours, budget, skills, goal) | student | P1 |
| POST | `/me/onboarding/complete` | Mark onboarding complete | student | P1 |
| GET | `/me/consents` | List consents | any | P1 |
| POST | `/me/consents` | Grant a consent `{type, version}` | any | P1 |
| DELETE | `/me/consents/{id}` | Revoke a consent | any | P1 |
| GET | `/me/notification-preferences` | Get preferences | any | P1 |
| PUT | `/me/notification-preferences` | Update preferences | any | P1 |
| GET | `/me/usage` | AI usage and remaining budget per stage and month | student | P1 |
| POST | `/me/sessions/revoke-all` | Revoke all other sessions | any | P1 |
| POST | `/me/export` | Request full data export (async, returns job) | any | P1 |
| DELETE | `/me` | Request account and data deletion (requires confirmation body) | any | P1 |

**Example: `PUT /me/profile`**
```json
{
  "institution_name": "Example College",
  "program": "B.Tech Computer Science",
  "graduation_year": 2027,
  "skills": ["python", "react"],
  "weekly_hours": 10,
  "budget_limit": 50.00,
  "goal": "venture"
}
```

## 5. Projects and Team

| Method | Path | Description | Role | Phase |
|---|---|---|---|---|
| POST | `/projects` | Create project | student | P1 |
| GET | `/projects` | List caller's projects (`?status=`) | student | P1 |
| GET | `/projects/{project_id}` | Project detail with current stage and next best action | member | P1 |
| PATCH | `/projects/{project_id}` | Update title, summary | owner | P1 |
| POST | `/projects/{project_id}/pause` | Pause project | owner | P1 |
| POST | `/projects/{project_id}/stop` | Stop project with `stop_reason` (documented "stop" decision) | owner | P1 |
| POST | `/projects/{project_id}/archive` | Archive | owner | P1 |
| DELETE | `/projects/{project_id}` | Soft delete | owner | P1 |
| GET | `/projects/{project_id}/members` | List members | member | P1 |
| POST | `/projects/{project_id}/members` | Invite member `{email, role}` | owner | P1 |
| PATCH | `/projects/{project_id}/members/{user_id}` | Change role | owner | P1 |
| DELETE | `/projects/{project_id}/members/{user_id}` | Remove member | owner | P1 |

**Example: `POST /projects`**
```json
// Request
{ "title": "Campus waste tracker", "summary": "Track and reduce hostel food waste", "entry_type": "prototype" }

// Response 201
{
  "data": {
    "id": "b3d2...",
    "title": "Campus waste tracker",
    "entry_type": "prototype",
    "status": "active",
    "current_stage": { "code": "S2_VALIDATION", "name": "Validation", "status": "in_progress" },
    "next_best_action": { "type": "prototype_audit", "label": "Run your Prototype Audit" },
    "created_at": "2026-10-05T09:30:00Z"
  }
}
```

## 6. Stages and Gates

| Method | Path | Description | Role | Phase |
|---|---|---|---|---|
| GET | `/stages` | Reference list of stages | any | P1 |
| GET | `/stages/{stage_code}/rubric` | Active rubric criteria (transparent to users) | any | P1 |
| GET | `/projects/{project_id}/stages` | Per-stage status for the project | member | P1 |
| GET | `/projects/{project_id}/stages/{stage_code}/readiness` | What is still missing before submission (counts, evidence types) | member | P1 |
| POST | `/projects/{project_id}/stages/{stage_code}/submit` | Submit stage for gate evaluation (async, 202) | member | P1 |
| GET | `/projects/{project_id}/gate-submissions` | History of gate submissions | member | P1 |
| GET | `/projects/{project_id}/gate-submissions/{submission_id}` | Result with per-criterion scores and remediation | member | P1 |
| POST | `/projects/{project_id}/gate-submissions/{submission_id}/override` | Human override `{result, reason}` | mentor, platform_admin | P1 (admin), P2 (mentor) |
| POST | `/projects/{project_id}/gate-submissions/{submission_id}/request-review` | Request human review | member | P2 |

**Example: submit response (202)**
```json
{
  "data": {
    "submission_id": "e91a...",
    "status": "evaluating",
    "status_url": "/v1/projects/b3d2.../gate-submissions/e91a..."
  }
}
```

**Example: gate result**
```json
{
  "data": {
    "id": "e91a...",
    "stage_code": "S2_VALIDATION",
    "result": "conditional",
    "total_score": 68.5,
    "criteria_results": [
      {
        "criterion": "interview_volume_and_diversity",
        "score": 80,
        "max": 100,
        "cited_evidence_ids": ["a1...", "a2..."],
        "feedback": "12 interviews logged; only 3 are outside your campus."
      },
      {
        "criterion": "pre_commitment",
        "score": 40,
        "max": 100,
        "cited_evidence_ids": [],
        "feedback": "No waitlist, LOI, pilot agreement, or deposit submitted."
      }
    ],
    "remediation_tasks": [
      { "title": "Get one pilot LOI from an institution", "task_id": "t77..." }
    ],
    "rubric_version": 1,
    "created_at": "2026-10-20T14:02:00Z"
  }
}
```
Errors: `409 STAGE_LOCKED` if the stage is not open; `409 CONFLICT` if a submission is already evaluating; `422` if required evidence types are absent (returned before any AI cost is incurred).

## 7. Problem, Validation, Solution

### 7.1 Problem statements

| Method | Path | Description | Phase |
|---|---|---|---|
| POST | `/projects/{project_id}/problem-statements` | Save new version | P1 |
| GET | `/projects/{project_id}/problem-statements` | List versions | P1 |
| GET | `/projects/{project_id}/problem-statements/{version}` | Get version with score and critique | P1 |
| POST | `/projects/{project_id}/problem-statements/{version}/review` | Run Reviewer scoring (agent) | P1 |

### 7.2 Interviews

| Method | Path | Description | Phase |
|---|---|---|---|
| POST | `/projects/{project_id}/interview-scripts` | Generate script and screener from problem statement | P1 |
| POST | `/projects/{project_id}/question-check` | Check a list of questions for leading or biased wording | P1 |
| POST | `/projects/{project_id}/interviews` | Log an interview | P1 |
| GET | `/projects/{project_id}/interviews` | List interviews | P1 |
| GET | `/projects/{project_id}/interviews/{interview_id}` | Detail with transcript and insights | P1 |
| PATCH | `/projects/{project_id}/interviews/{interview_id}` | Update notes, segment, consent | P1 |
| DELETE | `/projects/{project_id}/interviews/{interview_id}` | Delete interview and derived data | P1 |
| POST | `/projects/{project_id}/interviews/{interview_id}/transcribe` | Start transcription of attached audio (async; requires `consent_confirmed`) | P1 |
| POST | `/projects/{project_id}/interviews/{interview_id}/synthesize` | Generate insights (async) | P1 |
| GET | `/projects/{project_id}/interview-summary` | Cross-interview clusters, willingness signals, diversity stats | P1 |

**Example: `POST /projects/{id}/interviews`**
```json
{
  "interviewee_alias": "Hostel warden A",
  "segment": "hostel management",
  "outside_bubble": true,
  "channel": "in_person",
  "interviewed_on": "2026-10-08",
  "consent_confirmed": true,
  "raw_notes": "Food waste is highest on Sundays..."
}
```

### 7.3 Evidence

| Method | Path | Description | Phase |
|---|---|---|---|
| POST | `/projects/{project_id}/evidence` | Add evidence item (`type`, `title`, `content_text`, `source_url`, `file_id`) | P1 |
| GET | `/projects/{project_id}/evidence` | List (`?stage=&type=`) | P1 |
| GET | `/projects/{project_id}/evidence/{evidence_id}` | Detail | P1 |
| PATCH | `/projects/{project_id}/evidence/{evidence_id}` | Update | P1 |
| DELETE | `/projects/{project_id}/evidence/{evidence_id}` | Remove | P1 |

### 7.4 Competitors and solution validation

| Method | Path | Description | Phase |
|---|---|---|---|
| POST | `/projects/{project_id}/competitors` | Add competitor | P1 |
| GET | `/projects/{project_id}/competitors` | List | P1 |
| PATCH | `/projects/{project_id}/competitors/{competitor_id}` | Update or mark verified | P1 |
| DELETE | `/projects/{project_id}/competitors/{competitor_id}` | Remove | P1 |
| POST | `/projects/{project_id}/competitors/suggest` | AI-suggested candidates with source links (user must verify) | P3 |
| POST | `/projects/{project_id}/solution-validations` | Save scores and notes (feasibility, scalability, cost vs. impact, adoption) | P1 |
| GET | `/projects/{project_id}/solution-validations` | List versions | P1 |
| POST | `/projects/{project_id}/solution-validations/{version}/review` | Reviewer critique | P1 |

## 8. Prototype Audit

| Method | Path | Description | Phase |
|---|---|---|---|
| POST | `/projects/{project_id}/audits` | Start audit (async, 202) | P1 |
| GET | `/projects/{project_id}/audits` | List audits | P1 |
| GET | `/projects/{project_id}/audits/{audit_id}` | Status and report | P1 |
| POST | `/projects/{project_id}/audits/{audit_id}/retry` | Retry failed audit | P1 |
| POST | `/projects/{project_id}/audits/{audit_id}/accept` | Accept recommendations (creates tasks, sets suggested entry stage) | P1 |

**Example: `POST /projects/{id}/audits`**
```json
// Request (one of: repo_url | demo_url | description)
{
  "source_type": "repo",
  "repo_url": "https://github.com/example/waste-tracker",
  "notes": "Target users are hostel mess managers"
}

// Response 202
{
  "data": {
    "id": "au_91c...",
    "status": "queued",
    "status_url": "/v1/projects/b3d2.../audits/au_91c..."
  }
}
```

**Example: completed audit report**
```json
{
  "data": {
    "id": "au_91c...",
    "status": "completed",
    "commit_sha": "4be91d2",
    "injection_flagged": false,
    "report": {
      "what_it_does": "Web app for logging daily food waste by meal.",
      "potential_users": ["hostel mess managers", "college administrators"],
      "production_gaps": [
        { "area": "testing", "severity": "high", "detail": "No automated tests found." },
        { "area": "auth", "severity": "medium", "detail": "Passwords stored without a documented hashing policy." }
      ],
      "security_flags": [
        { "type": "secret", "severity": "high", "file": ".env.example", "detail": "Possible API key pattern." }
      ],
      "missing_demand_evidence": ["No user interviews", "No usage data"],
      "suggested_entry_stage": "S2_VALIDATION",
      "recommended_tasks": [
        { "title": "Interview 10 mess managers outside your campus", "stage": "S2_VALIDATION" }
      ]
    },
    "created_at": "2026-10-05T09:35:00Z",
    "completed_at": "2026-10-05T09:38:40Z"
  }
}
```
Errors: `422 UNSAFE_CONTENT` (blocked URL or content), `413 PAYLOAD_TOO_LARGE` (repo above size limit; returns guidance to submit a description or subset), `429 RATE_LIMITED`.

## 9. Tasks, Documents, Files

### 9.1 Tasks

| Method | Path | Description | Phase |
|---|---|---|---|
| POST | `/projects/{project_id}/tasks` | Create task | P1 |
| GET | `/projects/{project_id}/tasks` | List (`?status=&stage=&assignee=`) | P1 |
| PATCH | `/projects/{project_id}/tasks/{task_id}` | Update status, due date, assignee | P1 |
| DELETE | `/projects/{project_id}/tasks/{task_id}` | Delete | P1 |

### 9.2 Documents (generated and edited artifacts)

| Method | Path | Description | Phase |
|---|---|---|---|
| POST | `/projects/{project_id}/documents/generate` | Generate `{type: prd, architecture, interview_script, or deploy_checklist}` (async; `prd` and `architecture` require Stage 2 gate passed, else `409 STAGE_LOCKED`) | P1 |
| GET | `/projects/{project_id}/documents` | List (`?type=`) | P1 |
| GET | `/projects/{project_id}/documents/{document_id}` | Get | P1 |
| PATCH | `/projects/{project_id}/documents/{document_id}` | Edit (creates new version) | P1 |
| POST | `/projects/{project_id}/documents/{document_id}/review` | Reviewer critique | P1 |

### 9.3 Files (direct-to-storage upload)

| Method | Path | Description | Phase |
|---|---|---|---|
| POST | `/files/upload-url` | Request presigned upload URL `{project_id, filename, mime_type, size_bytes}` | P1 |
| POST | `/files/{file_id}/complete` | Confirm upload; triggers malware scan | P1 |
| GET | `/files/{file_id}` | Metadata and `scan_status` | P1 |
| GET | `/files/{file_id}/download-url` | Short-lived signed download URL (only if scan is clean) | P1 |
| DELETE | `/files/{file_id}` | Delete file | P1 |

Limits: audio up to 200 MB (configurable); documents up to 25 MB; allowed MIME types enforced server-side. Files are unavailable for download or processing until `scan_status = clean`.

## 10. Agents and Conversations

| Method | Path | Description | Phase |
|---|---|---|---|
| POST | `/projects/{project_id}/conversations` | Create conversation `{agent_type: coach or reviewer, stage_code?}` | P1 |
| GET | `/projects/{project_id}/conversations` | List | P1 |
| GET | `/conversations/{conversation_id}/messages` | Message history (paginated) | P1 |
| POST | `/conversations/{conversation_id}/messages` | Send message; response streams via SSE (`Accept: text/event-stream`) or returns JSON | P1 |
| POST | `/messages/{message_id}/rating` | Rate `{rating: -1, 0, or 1, comment?}` | P1 |
| POST | `/projects/{project_id}/review` | One-shot Reviewer critique of an artifact `{artifact_type, artifact_id}` | P1 |
| GET | `/projects/{project_id}/next-best-action` | Current recommended next action | P1 |
| POST | `/projects/{project_id}/dev/scaffold` | Dev agent scaffold and code assistance (explain-then-build) | P2 |
| POST | `/projects/{project_id}/dev/fix-assistant` | Student-facing bug analysis with root-cause explanation | P2 |
| POST | `/voice/sessions` | Start realtime voice session (mock customer, pitch practice) | P2 |

**Example: send message**
```json
// Request
{ "content": "Is my problem statement specific enough?", "context": { "artifact_type": "problem_statement", "artifact_id": "ps_3..." } }
```

## 11. Check-Ins, Notifications, Analytics

| Method | Path | Description | Phase |
|---|---|---|---|
| POST | `/projects/{project_id}/checkins` | Submit weekly check-in `{week_start, progress, blockers, hours_spent}` | P1 |
| GET | `/projects/{project_id}/checkins` | List | P1 |
| GET | `/notifications` | List (`?unread=true`) | P1 |
| PATCH | `/notifications/{id}/read` | Mark read | P1 |
| POST | `/notifications/read-all` | Mark all read | P1 |
| POST | `/events` | Product analytics events (client-side, allowlisted event names only) | P1 |

## 12. Streaming Protocol (SSE)

`POST /conversations/{id}/messages` with `Accept: text/event-stream` returns:

```
event: message.start
data: {"message_id":"m_81...","agent_run_id":"ar_5c..."}

event: message.delta
data: {"text":"Your problem statement names who is affected, but not how often..."}

event: message.delta
data: {"text":" Add a frequency, for example 'every weekday lunch'."}

event: message.end
data: {"finish_reason":"stop","usage":{"input_tokens":812,"output_tokens":164}}
```

Error events: `event: error` with `data: {"code":"TOKEN_BUDGET_EXCEEDED","message":"..."}`. Clients should fall back to non-streaming and show remaining budget from `/me/usage`. Sanitize and escape all model output before rendering.

## 13. Organizations and Institution Endpoints

| Method | Path | Description | Role | Phase |
|---|---|---|---|---|
| GET | `/orgs/{org_id}` | Organization detail | org member | P2 |
| POST | `/orgs/{org_id}/cohorts` | Create cohort | institution_admin | P2 |
| GET | `/orgs/{org_id}/cohorts` | List cohorts | institution_admin | P2 |
| POST | `/orgs/{org_id}/cohorts/{cohort_id}/invites` | Invite students (bulk) | institution_admin | P2 |
| GET | `/orgs/{org_id}/cohorts/{cohort_id}/progress` | Stage funnel, interviews completed, pilots, at-risk projects (aggregates only) | institution_admin | P2 |
| GET | `/orgs/{org_id}/cohorts/{cohort_id}/report` | Exportable report (CSV/JSON) | institution_admin | P2 |

Privacy rule: these endpoints return counts and stage data only. Private chat content and evidence text are never exposed unless the student opts in per project.

## 14. Platform Admin

| Method | Path | Description | Role | Phase |
|---|---|---|---|---|
| GET | `/admin/users` | Search users (audited) | platform_admin | P1 |
| GET | `/admin/agent-runs` | Agent runs with cost, latency, status | platform_admin | P1 |
| GET | `/admin/usage` | Cost and token usage by day, agent, model | platform_admin | P1 |
| GET | `/admin/prompt-versions` | List prompt versions | platform_admin | P1 |
| POST | `/admin/prompt-versions` | Create version (inactive by default) | platform_admin | P1 |
| POST | `/admin/prompt-versions/{id}/activate` | Activate version (requires passing eval run) | platform_admin | P1 |
| GET | `/admin/stage-gates` | List rubrics | platform_admin | P1 |
| POST | `/admin/stage-gates` | Create new rubric version | platform_admin | P1 |
| GET | `/admin/knowledge-documents` | List knowledge documents | platform_admin | P1 |
| POST | `/admin/knowledge-documents` | Add document (triggers chunking and embedding) | platform_admin | P1 |
| POST | `/admin/knowledge-documents/{id}/verify` | Mark verified with date | platform_admin | P1 |
| GET | `/admin/audit-logs` | Query audit log | platform_admin | P1 |
| POST | `/admin/users/{id}/suspend` | Suspend account | platform_admin | P1 |

All admin endpoints require MFA-verified sessions and write to `audit_logs`.

## 15. Health and Webhooks

| Method | Path | Description |
|---|---|---|
| GET | `/healthz` | Liveness (no auth) |
| GET | `/readyz` | Readiness: DB, Redis, storage, queue (no auth, minimal output) |
| POST | `/webhooks/auth` | Auth provider events (user created, deleted); signature verified |
| POST | `/webhooks/sentry` | Error events feeding the bug-fix pipeline; signature verified |
| POST | `/webhooks/github` | Repository events for audits (optional); signature verified |
| POST | `/webhooks/stt` | Speech-to-text completion callback; signature verified |

Webhook endpoints verify HMAC signatures, reject replays (timestamp window), and are not exposed to the browser.

## 16. Role and Permission Matrix (Summary)

| Resource | student | mentor | institution_admin | platform_admin |
|---|---|---|---|---|
| Own projects (CRUD) | Yes | No | No | Audited access |
| Assigned projects | Member role | Read, review | Aggregates only | Audited access |
| Chat content | Own | Only if shared | No (unless opted in) | No (only with logged reason) |
| Gate override | No | Yes (P2) | No | Yes |
| Cohort progress | No | No | Yes (own org) | Yes |
| Prompts, rubrics, knowledge base | No | No | No | Yes |

## 17. Security Requirements for the API

- Validate JWT signature, expiry, and audience on every request; inject `app.user_id`, `app.org_id`, `app.role` into the DB session for RLS.
- Strict input validation (Pydantic), maximum body sizes, and URL allowlists for repo and demo links.
- Never accept user-provided prompts as system instructions; user content is always passed as data.
- Sanitize model output before returning or rendering; strip active content.
- Per-user and per-IP rate limits; separate stricter limits for agent, audit, and upload endpoints.
- Signed, short-lived URLs for file access; no public buckets.
- Log all privileged and sensitive actions in `audit_logs` (overrides, exports, deletions, admin access).
- Return generic errors for auth failures; no user enumeration.

## 18. Testing and Delivery

- **OpenAPI-first contract tests:** generate tests from the spec (e.g., Schemathesis) in CI; fail builds on spec drift.
- **Typed client:** generate the TypeScript client for the frontend from the OpenAPI spec.
- **Test data:** seeded projects covering each stage and gate outcome.
- **Security tests:** cross-tenant access, IDOR checks on every `{id}` path, injection test set for agent endpoints, upload abuse tests.
- **Deprecation policy:** minimum 90 days' notice before removing any field or endpoint.
- **Changelog:** maintain `API_CHANGELOG.md` with every release.

---

*End of document.*
