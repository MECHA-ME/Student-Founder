"""RLS WITH CHECK on projects.

The projects policy only has a USING clause, which governs SELECT. On INSERT,
PostgreSQL also requires the row to pass a check; using the USING expression
alone fails for inserts because is_project_member(id) looks up a row in
projects that does not exist yet. This migration rebuilds the policy so new
rows are permitted when the inserting app role owns the project (or is a
project_member row for it), while SELECTs keep the owner/member gate.

Revision ID: 0006
Revises: 0005
"""

from alembic import op

revision = "0006"
down_revision = "0005"
branch_labels = None
depends_on = None

UPGRADE = """
DROP POLICY projects_member_access ON projects;
CREATE POLICY projects_member_access ON projects
  USING (is_project_member(id))
  WITH CHECK (
    owner_id = current_setting('app.user_id')::uuid
    OR EXISTS (
      SELECT 1 FROM project_members pm
      WHERE pm.project_id = id
        AND pm.user_id = current_setting('app.user_id')::uuid
    )
  );
"""

DOWNGRADE = """
DROP POLICY projects_member_access ON projects;
CREATE POLICY projects_member_access ON projects
  USING (is_project_member(id));
"""


def upgrade() -> None:
    op.execute(UPGRADE)


def downgrade() -> None:
    op.execute(DOWNGRADE)