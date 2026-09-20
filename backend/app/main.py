from fastapi import FastAPI
from pydantic import BaseModel

from app.errors import install_handlers
from app.routers import auth, me, projects

app = FastAPI(
    title="Student Founder API",
    version="0.1.0",
    description="MVP backend for the Student Founder platform.",
)

install_handlers(app)

app.include_router(auth.router)
app.include_router(me.router)
app.include_router(projects.router)


class HealthResponse(BaseModel):
    status: str
    service: str


@app.get("/healthz", response_model=HealthResponse)
def healthcheck() -> HealthResponse:
    return {"status": "ok", "service": "student-founder-api"}