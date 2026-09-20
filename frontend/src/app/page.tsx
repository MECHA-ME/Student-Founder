"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AnimatedProgressBar from "@/components/AnimatedProgressBar";

const pillars = [
  "Problem validation",
  "Prototype audit",
  "Stage-based coaching",
  "Deployment guidance",
];

const tasks = [
  "Interview script for hostel staff",
  "Problem statement revisions",
  "Bias check for outside-bubble feedback",
];

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 overflow-hidden">
      {/* Ambient background glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 70% 30%, rgba(34,211,238,0.07) 0%, transparent 70%), radial-gradient(ellipse 50% 30% at 20% 70%, rgba(167,139,250,0.06) 0%, transparent 70%)",
        }}
      />

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-10">
        {/* Nav */}
        <nav
          className="flex items-center justify-between animate-slide-up"
          style={{ opacity: mounted ? 1 : 0 }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl font-bold text-slate-950 text-lg"
              style={{
                background: "linear-gradient(135deg, #22d3ee, #0891b2)",
                boxShadow: "0 0 20px rgba(34,211,238,0.4)",
                animation: "badgeGlow 3s ease-in-out infinite",
              }}
            >
              S
            </div>
            <p className="text-lg font-semibold">Student Founder</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-300">
            <Link href="/dashboard" className="transition hover:text-white hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
              Dashboard
            </Link>
            <Link
              href="/"
              className="rounded-full border border-slate-700 px-4 py-2 transition hover:border-slate-500 hover:bg-slate-800"
            >
              Sign in
            </Link>
          </div>
        </nav>

        {/* Hero grid */}
        <div className="mt-18 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left – hero text */}
          <div>
            <span
              className="inline-flex rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-200 animate-slide-up stagger-1"
              style={{ opacity: mounted ? undefined : 0 }}
            >
              AI-powered venture builder
            </span>

            <h1
              className="mt-6 max-w-xl text-5xl font-black leading-tight tracking-tight text-white animate-slide-up stagger-2"
              style={{ opacity: mounted ? undefined : 0 }}
            >
              Turn your idea or prototype into a validated product.
            </h1>

            <p
              className="mt-6 max-w-xl text-lg leading-8 text-slate-300 animate-slide-up stagger-3"
              style={{ opacity: mounted ? undefined : 0 }}
            >
              Student Founder guides student builders through the evidence-first
              path from problem discovery to product validation, deployment, and
              first users.
            </p>

            <div
              className="mt-8 flex flex-wrap gap-4 animate-slide-up stagger-4"
              style={{ opacity: mounted ? undefined : 0 }}
            >
              <Link
                href="/onboarding"
                className="relative rounded-full px-6 py-3 font-semibold text-slate-950 transition-all duration-200 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #22d3ee, #06b6d4)",
                  boxShadow: "0 0 20px rgba(34,211,238,0.35)",
                }}
              >
                Start building →
              </Link>
              <Link
                href="/dashboard"
                className="rounded-full border border-slate-700 px-6 py-3 font-semibold text-white transition hover:border-slate-500 hover:bg-slate-800"
              >
                View demo
              </Link>
            </div>

            {/* Pillar badges with stagger */}
            <div
              className="mt-10 flex flex-wrap gap-3 text-sm text-slate-300"
              style={{ opacity: mounted ? undefined : 0 }}
            >
              {pillars.map((item, i) => (
                <span
                  key={item}
                  className="animate-pop-in rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 transition hover:border-cyan-500/40 hover:text-cyan-200"
                  style={{ animationDelay: `${0.5 + i * 0.08}s` }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Right – animated preview card */}
          <div
            className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-cyan-950/20 animate-slide-right stagger-3"
            style={{
              opacity: mounted ? undefined : 0,
              boxShadow:
                "0 0 0 1px rgba(34,211,238,0.08), 0 25px 50px -12px rgba(0,0,0,0.5)",
            }}
          >
            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-200">
                Current sprint
              </p>
              <h2 className="mt-4 text-2xl font-bold text-white">
                Problem validation
              </h2>
              <div className="mt-5 space-y-5">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                    <span>Interviews</span>
                    <span className="tabular-nums font-semibold text-white">12 / 15</span>
                  </div>
                  <AnimatedProgressBar value={80} color="#22d3ee" delay={800} />
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                    <span>Evidence strength</span>
                    <span className="tabular-nums font-semibold text-emerald-300">68%</span>
                  </div>
                  <AnimatedProgressBar value={68} color="#4ade80" delay={1000} />
                </div>
              </div>
            </div>

            {/* Task list */}
            <div className="mt-6 space-y-3">
              {tasks.map((item, i) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 animate-slide-up"
                  style={{ animationDelay: `${0.9 + i * 0.1}s` }}
                >
                  <span
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-xs font-bold text-slate-950"
                    style={{ animation: "taskComplete 0.4s ease-out both", animationDelay: `${1.0 + i * 0.1}s` }}
                  >
                    ✓
                  </span>
                  <span className="text-slate-200 text-sm">{item}</span>
                </div>
              ))}
            </div>

            {/* XP preview blip */}
            <div className="mt-5 flex items-center justify-between rounded-xl border border-violet-500/20 bg-violet-500/5 px-4 py-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-violet-300">XP this sprint</span>
              <span
                className="font-black text-violet-200 text-lg"
                style={{ animation: "countUp 0.6s 1.4s both" }}
              >
                +340 ⭐
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
