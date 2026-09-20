from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(
    title="Student Founder API",
    version="0.1.0",
    description="MVP backend for the Student Founder platform.",
)


class HealthResponse(BaseModel):
    status: str
    service: str


class ProjectOverview(BaseModel):
    project_id: str
    title: str
    stage: str
    next_best_action: str
    evidence_count: int
    validation_score: int


PROJECTS = [
    {
        "project_id": "p-101",
        "title": "Campus Waste Tracker",
        "stage": "Validation",
        "next_best_action": "Conduct 5 more interviews with hostel staff",
        "evidence_count": 8,
        "validation_score": 68,
        "summary": "A lightweight system to help students and hostels track waste segregation and usage patterns.",
        "risk": "Need stronger evidence for recurring pain and willingness to pay.",
        "evidence": [
            "7 interviews completed with hostel staff",
            "2 pilot conversations with student community leads",
            "Waitlist count at 18 students",
        ],
    },
    {
        "project_id": "p-202",
        "title": "AI Study Buddy",
        "stage": "Problem Definition",
        "next_best_action": "Refine the pain point with outside-bubble interviews",
        "evidence_count": 4,
        "validation_score": 52,
        "summary": "A study assistant that adapts to a student's semester load, revision habits, and schedule.",
        "risk": "The pain point is still too broad and could overlap with existing tools.",
        "evidence": [
            "4 interviews with classmates",
            "2 feedback sessions with student mentors",
            "Problem still needs clearer differentiation",
        ],
    },
]

STAGES = [
    {
        "code": "S0",
        "name": "Readiness",
        "status": "passed",
        "description": "Clarify your constraints, goals, and weekly capacity before building.",
        "tasks": ["Confirm your available hours", "List your strengths and gaps", "Set a safe-fail plan"],
    },
    {
        "code": "S1",
        "name": "Problem",
        "status": "in_progress",
        "description": "Define the real pain point and show why it's worth solving now.",
        "tasks": ["Write a problem statement", "List current alternatives", "Map severity and frequency"],
    },
    {
        "code": "S2",
        "name": "Validation",
        "status": "locked",
        "description": "Gather evidence from interviews, waitlists, and usage signals.",
        "tasks": ["Schedule 5 more interviews", "Review leading-question bias", "Convert interviews into pain clusters"],
    },
    {
        "code": "S3",
        "name": "Solution",
        "status": "locked",
        "description": "Refine the product and prioritize the smallest valuable release.",
        "tasks": ["Map competitors", "Define a first release", "Write the product brief"],
    },
]


@app.get("/healthz", response_model=HealthResponse)
def healthcheck() -> HealthResponse:
    return {"status": "ok", "service": "student-founder-api"}


@app.get("/api/v1/overview")
def overview() -> dict:
    return {
        "user": {
            "name": "Aarav",
            "role": "student founder",
            "streak": "7 day streak",
        },
        "metrics": {
            "active_projects": 3,
            "interviews_completed": 12,
            "stage_funnel": {"S0": 100, "S1": 80, "S2": 45, "S3": 16},
        },
        "projects": PROJECTS,
    }


@app.get("/api/v1/projects")
def list_projects() -> dict:
    return {"projects": PROJECTS}


@app.get("/api/v1/projects/{project_id}")
def get_project(project_id: str) -> dict:
    project = next((item for item in PROJECTS if item["project_id"] == project_id), None)
    if project is None:
        return {"detail": "Project not found"}
    return project


@app.get("/api/v1/stages")
def stages() -> dict:
    return {"stages": STAGES}


@app.get("/api/v1/journey")
def journey() -> dict:
    return {
        "user": {"name": "Aarav", "status": "Stage 1 in progress"},
        "stages": STAGES,
        "coach_message": "Your most valuable next step is to run one more outside-bubble interview and compare it against your current assumptions.",
    }
