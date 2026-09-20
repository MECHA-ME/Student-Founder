"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Project = {
  project_id: string;
  title: string;
  stage: string;
  next_best_action: string;
  evidence_count: number;
  validation_score: number;
  summary: string;
  risk: string;
  evidence: string[];
};

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = Array.isArray(params?.projectId) ? params.projectId[0] : params?.projectId;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;

    fetch(`http://127.0.0.1:8000/api/v1/projects/${projectId}`)
      .then((res) => res.json())
      .then((data) => {
        setProject(data);
      })
      .catch(() => {
        setProject({
          project_id: projectId,
          title: "Campus Waste Tracker",
          stage: "Validation",
          next_best_action: "Run 5 more interviews with hostel staff",
          evidence_count: 8,
          validation_score: 68,
          summary: "A lightweight system to help students and hostels track waste segregation and usage patterns.",
          risk: "Need stronger evidence for recurring pain and willingness to pay.",
          evidence: [
            "7 interviews completed with hostel staff",
            "2 pilot conversations with student community leads",
            "Waitlist count at 18 students",
          ],
        });
      })
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading) {
    return <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-50">Loading project...</main>;
  }

  if (!project) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-50">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-800 bg-slate-900 p-8">
          <h1 className="text-2xl font-bold">Project not found</h1>
          <Link href="/dashboard" className="mt-4 inline-flex rounded-full bg-cyan-400 px-5 py-3 font-medium text-slate-950">
            Return to dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-50">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Student Founder</p>
            <h1 className="mt-2 text-3xl font-bold">{project.title}</h1>
          </div>
          <Link href="/dashboard" className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800">
            Dashboard
          </Link>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-200">{project.stage}</span>
              <span className="text-sm text-slate-300">{project.validation_score}% validation score</span>
            </div>

            <p className="mt-6 text-lg leading-8 text-slate-300">{project.summary}</p>

            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <h2 className="text-lg font-semibold text-white">Next best action</h2>
              <p className="mt-2 text-slate-300">{project.next_best_action}</p>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-white">Evidence log</h2>
              <ul className="mt-4 space-y-3">
                {project.evidence.map((item) => (
                  <li key={item} className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950 p-3 text-slate-300">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400 text-xs font-bold text-slate-950">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-lg font-semibold text-white">Risk check</h2>
              <p className="mt-3 text-slate-300">{project.risk}</p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-lg font-semibold text-white">Project stats</h2>
              <div className="mt-4 space-y-4 text-sm text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Evidence items</span>
                  <span>{project.evidence_count}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Stage</span>
                  <span>{project.stage}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Last action</span>
                  <span>2 days ago</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
