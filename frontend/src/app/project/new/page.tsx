"use client";

import Link from "next/link";
import { useState } from "react";

export default function NewProjectPage() {
  const [title, setTitle] = useState("");
  const [stage, setStage] = useState("Problem Definition");

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-50">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Student Founder</p>
            <h1 className="mt-2 text-3xl font-bold">New project</h1>
          </div>
          <Link href="/dashboard" className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800">
            Back to dashboard
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl shadow-slate-950/30">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm text-slate-300">Project name</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Campus Waste Tracker"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">Current stage</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              >
                <option>Problem Definition</option>
                <option>Validation</option>
                <option>Solution</option>
                <option>Build</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">One-line description</label>
              <textarea
                rows={4}
                placeholder="Describe the problem, the user, and the intended solution..."
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              />
            </div>

            <div className="flex gap-4 pt-2">
              <button className="rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300">
                Create project
              </button>
              <Link href="/dashboard" className="rounded-full border border-slate-700 px-6 py-3 font-semibold text-slate-200 transition hover:bg-slate-800">
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
