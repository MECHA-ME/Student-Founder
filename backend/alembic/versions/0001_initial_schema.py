"""Initial schema from Product_Blueprint Part 4.

Revision ID: 0001
Revises: None
"""

from alembic import op

revision = "0001"
down_revision = None
branch_labels = None
depends_on = None

EXTENSIONS_AND_ENUMS = """
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS vector;

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
"""

TABLES = """
CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type org_type NOT NULL,
  country text,
  domain text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE users (
  id uuid PRIMARY KEY,
  email text NOT NULL UNIQUE,
  full_name text,
  role user_role NOT NULL DEFAULT 'student',
  user_type user_type,
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
  type text NOT NULL,
  version text NOT NULL,
  granted_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz
);

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

CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES users(id),
  org_id uuid REFERENCES organizations(id),
  cohort_id uuid REFERENCES cohorts(id),
  title text NOT NULL,
  summary text,
  entry_type entry_type NOT NULL,
  current_stage_id uuid,
  status project_status NOT NULL DEFAULT 'active',
  stop_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE project_members (
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'collaborator',
  invited_at timestamptz NOT NULL DEFAULT now(),
  accepted_at timestamptz,
  PRIMARY KEY (project_id, user_id)
);

CREATE TABLE stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
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
  rubric jsonb NOT NULL,
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
  result stage_status NOT NULL,
  total_score numeric(5,2),
  criteria_results jsonb NOT NULL,
  agent_run_id uuid,
  override_by uuid REFERENCES users(id),
  override_reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

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

CREATE TABLE interviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  interviewee_alias text NOT NULL,
  segment text,
  outside_bubble boolean DEFAULT false,
  channel text,
  interviewed_on date,
  consent_confirmed boolean NOT NULL DEFAULT false,
  raw_notes text,
  file_id uuid,
  transcript_text text,
  transcript_confidence numeric(4,3),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE interview_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id uuid NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
  pain_points jsonb,
  quotes jsonb,
  willingness_signal text,
  bias_flags jsonb,
  agent_run_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

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

CREATE TABLE prototype_audits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  source_type text NOT NULL,
  repo_url text,
  commit_sha text,
  description text,
  status audit_status NOT NULL DEFAULT 'queued',
  report jsonb,
  injection_flagged boolean DEFAULT false,
  error text,
  requested_by uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  stage_id uuid REFERENCES stages(id),
  title text NOT NULL,
  description text,
  status task_status NOT NULL DEFAULT 'todo',
  due_date date,
  assignee_id uuid REFERENCES users(id),
  created_by_type text NOT NULL DEFAULT 'user',
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type text NOT NULL,
  version int NOT NULL DEFAULT 1,
  title text,
  content text NOT NULL,
  agent_run_id uuid,
  created_by uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES users(id),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  storage_key text NOT NULL,
  mime_type text,
  size_bytes bigint,
  sha256 text,
  scan_status text NOT NULL DEFAULT 'pending',
  retain_until timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  agent_type text NOT NULL,
  stage_id uuid REFERENCES stages(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role text NOT NULL,
  content text NOT NULL,
  agent_run_id uuid,
  rating smallint,
  created_at timestamptz NOT NULL DEFAULT now()
);

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
  status text NOT NULL,
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
  period text NOT NULL,
  tokens_used bigint NOT NULL DEFAULT 0,
  cost_usd numeric(10,4) NOT NULL DEFAULT 0,
  token_limit bigint,
  UNIQUE (user_id, project_id, stage_id, period)
);

CREATE TABLE knowledge_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
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
  channel text NOT NULL DEFAULT 'in_app',
  payload jsonb,
  sent_at timestamptz,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

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
"""

INDEXES = """
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
"""

# Row-level security for the core member-scoped tables (blueprint Part 4, Section 5).
# Per-table policies for the remaining tenant tables land with the features that
# use them (Steps 3-4); until then those tables are app-level access only.
RLS = """
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

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
"""

DOWNGRADE_TABLES = [
    "audit_logs", "notifications", "checkins", "knowledge_chunks", "knowledge_documents",
    "usage_ledger", "agent_runs", "prompt_versions", "messages", "conversations",
    "files", "documents", "tasks", "prototype_audits", "solution_validations",
    "competitors", "evidence_items", "interview_insights", "interviews",
    "problem_statements", "gate_submissions", "project_stage_progress", "stage_gates",
    "stages", "project_members", "projects", "cohort_members", "cohorts",
    "consents", "profiles", "users", "organizations",
]

DOWNGRADE_TYPES = [
    "audit_status", "evidence_type", "task_status", "stage_status", "project_status",
    "entry_type", "org_type", "age_group", "user_type", "user_role",
]


def upgrade() -> None:
    op.execute(EXTENSIONS_AND_ENUMS)
    op.execute(TABLES)
    op.execute(INDEXES)
    op.execute(RLS)


def downgrade() -> None:
    # CASCADE so inter-table foreign keys (e.g. projects -> stages) cannot block
    # the drop order. Policies die with their tables; the function follows.
    for table in DOWNGRADE_TABLES:
        op.execute(f"DROP TABLE IF EXISTS {table} CASCADE")
    op.execute("DROP FUNCTION IF EXISTS is_project_member(uuid)")
    for enum_type in DOWNGRADE_TYPES:
        op.execute(f"DROP TYPE IF EXISTS {enum_type}")
