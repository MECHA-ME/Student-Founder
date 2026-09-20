"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import XPBar from "@/components/XPBar";
import StreakBadge from "@/components/StreakBadge";
import AnimatedProgressBar from "@/components/AnimatedProgressBar";
import AchievementBadge from "@/components/AchievementBadge";
import FloatingActionOrb from "@/components/FloatingActionOrb";
import { ACHIEVEMENTS, DEMO_GAME_STATE } from "@/lib/gamification";

type Stat = { label: string; value: string; icon: string; color: string };
type Project = {
  project_id: string;
  title: string;
  stage: string;
  next_best_action: string;
  evidence_count: number;
  validation_score: number;
};

const defaultStats: Stat[] = [
  { label: "Active projects", value: "03", icon: "🚀", color: "#22d3ee" },
  { label: "Interviews logged", value: "12", icon: "🎤", color: "#4ade80" },
  { label: "Gate status", value: "S1 progress", icon: "🚪", color: "#a78bfa" },
  { label: "Next action", value: "5 interviews", icon: "⚡", color: "#f59e0b" },
];

const defaultStages = [
  { name: "Readiness", status: "Passed", value: 100 },
  { name: "Problem", status: "In progress", value: 60 },
  { name: "Validation", status: "Locked", value: 15 },
  { name: "Solution", status: "Locked", value: 5 },
];

function useCountUp(target: number, duration = 1200, delay = 0) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const start = Date.now() + delay;
    const step = () => {
      const now = Date.now();
      if (now < start) { requestAnimationFrame(step); return; }
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, delay]);
  return count;
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<Stat[]>(defaultStats);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const xp = DEMO_GAME_STATE.xp;
  const streak = DEMO_GAME_STATE.streak;
  const unlockedIds = DEMO_GAME_STATE.unlockedAchievements;
  const unlockedBadges = ACHIEVEMENTS.filter((a) => unlockedIds.includes(a.id));

  // Count-up for XP number
  const xpCount = useCountUp(xp, 1400, 400);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/v1/overview")
      .then((res) => res.json())
      .then((data) => {
        const metrics = data?.metrics ?? {};
        const stageFunnel = metrics.stage_funnel ?? {};
        setStats([
          { label: "Active projects", value: String(metrics.active_projects ?? 3).padStart(2, "0"), icon: "🚀", color: "#22d3ee" },
          { label: "Interviews logged", value: String(data?.metrics?.interviews_completed ?? 12).padStart(2, "0"), icon: "🎤", color: "#4ade80" },
          { label: "Gate status", value: `S${Math.max(1, Object.keys(stageFunnel).length)} progress`, icon: "🚪", color: "#a78bfa" },
          { label: "Next action", value: "5 interviews", icon: "⚡", color: "#f59e0b" },
        ]);
        setProjects(data?.projects ?? []);
      })
      .catch(() => {
        setProjects([
          {
            project_id: "p-101",
            title: "Campus Waste Tracker",
            stage: "Validation",
            next_best_action: "Conduct 5 more interviews with hostel staff",
            evidence_count: 8,
            validation_score: 68,
          },
          {
            project_id: "p-202",
            title: "AI Study Buddy",
            stage: "Problem Definition",
            next_best_action: "Refine the pain point with outside-bubble interviews",
            evidence_count: 4,
            validation_score: 52,
          },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const nextBestAction = useMemo(() => {
    if (!projects.length) return "Run 5 more interviews";
    return projects[0].next_best_action;
  }, [projects]);

  return (
    <main className="relative min-h-screen bg-slate-950 px-6 py-10 text-slate-50">
      {/* Ambient background */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 80% 10%, rgba(34,211,238,0.05) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 10% 80%, rgba(167,139,250,0.05) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <header
          className="mb-6 flex items-center justify-between animate-slide-up"
          style={{ opacity: mounted ? undefined : 0 }}
        >
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
              Student Founder
            </p>
            <h1 className="mt-2 text-3xl font-bold">Founder dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Streak badge */}
            <div className="relative">
              <StreakBadge streak={streak} />
            </div>

            <Link
              href="/journey"
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-950 transition-all hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #22d3ee, #06b6d4)",
                boxShadow: "0 0 14px rgba(34,211,238,0.35)",
              }}
            >
              View journey
            </Link>
            <Link
              href="/"
              className="rounded-full border border-cyan-400/40 px-4 py-2 text-sm text-cyan-200 transition hover:border-cyan-300 hover:bg-cyan-500/10"
            >
              Back to landing
            </Link>
          </div>
        </header>

        {/* XP Bar */}
        <div
          className="mb-6 rounded-2xl border border-violet-500/20 bg-violet-500/5 px-5 py-4 animate-slide-up stagger-1"
          style={{ opacity: mounted ? undefined : 0 }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs uppercase tracking-widest text-violet-300 font-semibold">
              Your progress
            </p>
            <span
              className="text-sm font-black text-amber-300"
              style={{ animation: "countUp 0.8s 0.5s both" }}
            >
              ⭐ {xpCount.toLocaleString()} XP
            </span>
          </div>
          <XPBar xp={xp} />
        </div>

        {/* Stat cards */}
        <section className="grid gap-4 md:grid-cols-4 mb-8">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg animate-slide-up transition-all duration-300 hover:scale-[1.02]"
              style={{
                animationDelay: `${0.1 + i * 0.07}s`,
                opacity: mounted ? undefined : 0,
                borderColor: `${stat.color}22`,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-slate-400">{stat.label}</p>
                <span
                  className="text-xl"
                  style={{ filter: `drop-shadow(0 0 4px ${stat.color}88)` }}
                >
                  {stat.icon}
                </span>
              </div>
              <p
                className="text-2xl font-semibold"
                style={{
                  color: stat.color,
                  animation: `countUp 0.6s ${0.3 + i * 0.1}s both`,
                }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </section>

        {/* Achievements row */}
        <section
          className="mb-8 animate-slide-up stagger-3"
          style={{ opacity: mounted ? undefined : 0 }}
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-300">
              🏆 Achievements unlocked
            </h2>
            <span className="text-xs text-slate-500">
              {unlockedBadges.length} / {ACHIEVEMENTS.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {unlockedBadges.map((badge, i) => (
              <div
                key={badge.id}
                style={{ animationDelay: `${0.4 + i * 0.08}s` }}
              >
                <AchievementBadge achievement={badge} size="md" />
              </div>
            ))}
            {/* Locked placeholders */}
            {ACHIEVEMENTS.filter((a) => !unlockedIds.includes(a.id))
              .slice(0, 4)
              .map((badge) => (
                <div
                  key={badge.id}
                  className="flex h-[76px] w-[76px] flex-col items-center justify-center gap-1 rounded-2xl border border-slate-800 bg-slate-900/50 text-slate-600"
                  title={`🔒 ${badge.name}`}
                >
                  <span className="text-2xl grayscale opacity-30">{badge.icon}</span>
                  <span className="text-[9px] uppercase tracking-wider">locked</span>
                </div>
              ))}
          </div>
        </section>

        {/* Stage progress + Next action */}
        <section className="mt-2 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div
            className="rounded-3xl border border-slate-800 bg-slate-900 p-6 animate-slide-up stagger-4"
            style={{ opacity: mounted ? undefined : 0 }}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Stage progress</h2>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 animate-pulse">
                Gate ready in 3 days
              </span>
            </div>

            <div className="space-y-5">
              {defaultStages.map((stage, index) => (
                <div key={stage.name} className="flex items-start gap-4">
                  <div
                    className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all"
                    style={{
                      background:
                        stage.status === "Passed"
                          ? "linear-gradient(135deg, #4ade80, #16a34a)"
                          : stage.status === "In progress"
                          ? "linear-gradient(135deg, #22d3ee, #0891b2)"
                          : "rgba(51,65,85,0.6)",
                      color:
                        stage.status === "Locked" ? "#475569" : "#020617",
                      boxShadow:
                        stage.status === "Passed"
                          ? "0 0 10px rgba(74,222,128,0.35)"
                          : stage.status === "In progress"
                          ? "0 0 10px rgba(34,211,238,0.35)"
                          : "none",
                    }}
                  >
                    {stage.status === "Passed" ? "✓" : index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-slate-100">{stage.name}</p>
                      <span
                        className="text-xs font-medium rounded-full px-2 py-0.5"
                        style={{
                          background:
                            stage.status === "Passed"
                              ? "rgba(74,222,128,0.1)"
                              : stage.status === "In progress"
                              ? "rgba(34,211,238,0.1)"
                              : "rgba(51,65,85,0.4)",
                          color:
                            stage.status === "Passed"
                              ? "#4ade80"
                              : stage.status === "In progress"
                              ? "#22d3ee"
                              : "#475569",
                        }}
                      >
                        {stage.status}
                      </span>
                    </div>
                    <AnimatedProgressBar
                      value={stage.value}
                      color={
                        stage.status === "Passed"
                          ? "#4ade80"
                          : stage.status === "In progress"
                          ? "#22d3ee"
                          : "#334155"
                      }
                      delay={300 + index * 150}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next action card */}
          <div
            className="rounded-3xl border border-cyan-500/20 bg-cyan-500/5 p-6 animate-slide-up stagger-5"
            style={{
              opacity: mounted ? undefined : 0,
              boxShadow: "0 0 30px rgba(34,211,238,0.06)",
            }}
          >
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-200">
              Next best action
            </p>
            <h2 className="mt-4 text-2xl font-bold text-white">
              {loading ? (
                <span className="text-slate-400 text-lg">Loading...</span>
              ) : (
                nextBestAction
              )}
            </h2>
            <p className="mt-3 text-slate-300">
              Your strongest evidence is still coming from peers. Add outsiders
              from dorms, faculty, and campus services to reduce bias and
              strengthen the gate.
            </p>

            {/* XP reward for this action */}
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5">
              <span>⭐</span>
              <span className="text-sm font-semibold text-amber-300">+75 XP on completion</span>
            </div>

            <button
              className="mt-6 w-full rounded-2xl px-5 py-3 font-semibold text-slate-950 transition-all duration-200 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #22d3ee, #06b6d4)",
                boxShadow: "0 0 20px rgba(34,211,238,0.3)",
              }}
            >
              Generate interview script ✨
            </button>
          </div>
        </section>

        {/* Projects */}
        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Projects</h2>
            <Link
              href="/project/new"
              className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
            >
              + New project
            </Link>
          </div>

          {projects.length ? (
            <div className="grid gap-5 lg:grid-cols-2">
              {projects.map((project, i) => (
                <article
                  key={project.project_id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition-all duration-300 hover:border-slate-600 hover:scale-[1.01] animate-slide-up"
                  style={{
                    animationDelay: `${0.6 + i * 0.1}s`,
                    opacity: mounted ? undefined : 0,
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white">
                      {project.title}
                    </h3>
                    <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-cyan-200 border border-cyan-500/20">
                      {project.stage}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm">{project.next_best_action}</p>

                  <div className="mt-4 space-y-3">
                    <AnimatedProgressBar
                      value={project.validation_score}
                      color="#22d3ee"
                      delay={700 + i * 100}
                      showLabel
                      label="Validation score"
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span>📋</span>
                      {project.evidence_count} evidence items
                    </span>
                    <Link
                      href={`/project/${project.project_id}`}
                      className="rounded-full px-4 py-1.5 text-sm font-medium text-slate-950 transition hover:scale-105"
                      style={{
                        background: "linear-gradient(135deg, #22d3ee, #06b6d4)",
                      }}
                    >
                      Open →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-slate-300">
              Loading your project data...
            </div>
          )}
        </section>
      </div>

      {/* Floating action orb */}
      <FloatingActionOrb label={nextBestAction} icon="⚡" />
    </main>
  );
}
