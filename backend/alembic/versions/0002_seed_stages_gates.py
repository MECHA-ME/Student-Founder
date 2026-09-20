"""Seed stages and v1 gate rubrics (draft values, per blueprint Part 4/Part 5 Step 2).

Revision ID: 0002
Revises: 0001
"""

import json

from alembic import op
from sqlalchemy import text

revision = "0002"
down_revision = "0001"
branch_labels = None
depends_on = None

STAGES = [
    ("S0_READINESS", "Readiness", 0, "Clarify constraints, goals, and weekly capacity before building."),
    ("S1_PROBLEM", "Problem", 1, "Define the real pain point and show why it is worth solving now."),
    ("S2_VALIDATION", "Validation", 2, "Gather evidence from interviews, waitlists, and usage signals."),
    ("S3_SOLUTION", "Solution", 3, "Refine the product and prioritize the smallest valuable release."),
    ("S4_BUILD", "Build", 4, "Ship the validated solution to production with real users."),
]

# v1 draft rubrics. Weights sum to 1. Thresholds are out of 100.
GATES = {
    "S1_PROBLEM": {
        "threshold": 70,
        "rubric": {
            "criteria": [
                {"key": "who_affected_clarity", "weight": 0.30,
                 "description": "Names a specific affected group, not everyone or students in general."},
                {"key": "frequency_severity", "weight": 0.25,
                 "description": "States how often the pain occurs and how severe it is."},
                {"key": "alternatives_analysis", "weight": 0.25,
                 "description": "Lists current alternatives and explains concretely why each fails."},
                {"key": "falsifiability", "weight": 0.20,
                 "description": "Makes claims that interviews or evidence could disprove."},
            ],
            "required_evidence_types": [],
            "notes": "v1 draft rubric. Scores require cited problem-statement versions.",
        },
    },
    "S2_VALIDATION": {
        "threshold": 70,
        "rubric": {
            "criteria": [
                {"key": "interview_volume_and_diversity", "weight": 0.30,
                 "description": "Enough interviews with segment diversity, including outside-bubble voices."},
                {"key": "bias_control", "weight": 0.20,
                 "description": "Non-leading questions, consent flags set, friends-and-family bias flagged."},
                {"key": "pain_point_clustering", "weight": 0.25,
                 "description": "Interviews synthesized into clusters with supporting quotes."},
                {"key": "pre_commitment", "weight": 0.25,
                 "description": "Waitlist, LOI, pilot agreement, deposit, or usage data submitted."},
            ],
            "required_evidence_types": ["interview_notes", "transcript", "waitlist", "loi",
                                       "pilot_agreement", "deposit", "usage_metric"],
            "notes": "v1 draft rubric. Rule checks (counts, types, consent) run before LLM scoring.",
        },
    },
    "S3_SOLUTION": {
        "threshold": 70,
        "rubric": {
            "criteria": [
                {"key": "feasibility", "weight": 0.25,
                 "description": "Buildable with the student constraints on record (time, skills, budget)."},
                {"key": "scalability", "weight": 0.20,
                 "description": "Can grow beyond the first users without a rewrite or linear cost explosion."},
                {"key": "cost_vs_impact", "weight": 0.20,
                 "description": "Build and running cost is justified by the pain severity and willingness signals."},
                {"key": "adoption", "weight": 0.20,
                 "description": "A credible path exists for the first users to find, try, and keep using it."},
                {"key": "differentiation", "weight": 0.15,
                 "description": "Clearly differs from mapped competitors on a dimension users care about."},
            ],
            "required_evidence_types": ["link", "file", "usage_metric", "landing_page"],
            "notes": "v1 draft rubric. Gate passes only when every scored dimension meets its minimum.",
        },
    },
}


def upgrade() -> None:
    conn = op.get_bind()
    conn.execute(
        text("INSERT INTO stages (code, name, position, description) "
             "VALUES (:code, :name, :position, :description)"),
        [{"code": c, "name": n, "position": p, "description": d} for c, n, p, d in STAGES],
    )
    for code, gate in GATES.items():
        conn.execute(
            text("INSERT INTO stage_gates (stage_id, version, rubric, pass_threshold) "
                 "SELECT id, 1, CAST(:rubric AS jsonb), :threshold FROM stages WHERE code = :code"),
            {"rubric": json.dumps(gate["rubric"]), "threshold": gate["threshold"], "code": code},
        )


def downgrade() -> None:
    conn = op.get_bind()
    conn.execute(text("DELETE FROM stage_gates WHERE version = 1"))
    conn.execute(
        text("DELETE FROM stages WHERE code IN ('S0_READINESS','S1_PROBLEM',"
             "'S2_VALIDATION','S3_SOLUTION','S4_BUILD')")
    )
