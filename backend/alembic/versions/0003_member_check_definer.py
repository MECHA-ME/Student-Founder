"""Make is_project_member SECURITY DEFINER.

The function is called from RLS policies on projects/evidence_items/messages,
but its body also reads projects (owner check). As a plain SQL function it is
inlined into the calling query, so the inner projects read re-triggers the
projects policy -> infinite recursion ("infinite recursion detected in policy
for relation projects").

SECURITY DEFINER executes the check as the function owner (the migration role),
breaking the recursion. The function takes only a uuid, returns a boolean, and
uses no dynamic SQL, so there is no injection surface. search_path is locked to
defend against search_path hijacking.

Revision ID: 0003
Revises: 0002
"""

from alembic import op

revision = "0003"
down_revision = "0002"
branch_labels = None
depends_on = None

FUNCTION_DEFINER = """
CREATE OR REPLACE FUNCTION is_project_member(p uuid) RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM project_members
    WHERE project_id = p
      AND user_id = current_setting('app.user_id')::uuid
  ) OR EXISTS (
    SELECT 1 FROM projects
    WHERE id = p AND owner_id = current_setting('app.user_id')::uuid
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;
"""

FUNCTION_INVOKER = """
CREATE OR REPLACE FUNCTION is_project_member(p uuid) RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM project_members
    WHERE project_id = p
      AND user_id = current_setting('app.user_id')::uuid
  ) OR EXISTS (
    SELECT 1 FROM projects
    WHERE id = p AND owner_id = current_setting('app.user_id')::uuid
  );
$$ LANGUAGE sql STABLE;
"""


def upgrade() -> None:
    op.execute(FUNCTION_DEFINER)


def downgrade() -> None:
    op.execute(FUNCTION_INVOKER)
