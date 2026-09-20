"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import ConfettiBurst from "@/components/ConfettiBurst";

const options = [
  {
    label: "I have an idea",
    detail: "Turn it into a validated problem and a clear next move.",
    icon: "💡",
    xp: "+50 XP",
  },
  {
    label: "I have a prototype",
    detail: "Audit the build, find gaps, and find real users.",
    icon: "🛠️",
    xp: "+80 XP",
  },
  {
    label: "I want to explore",
    detail: "Understand which stage matches my current progress.",
    icon: "🗺️",
    xp: "+25 XP",
  },
];

const STEPS = ["Tell us where you are", "Set your goal", "Begin journey"];

export default function OnboardingPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  function handleSelect(i: number) {
    setSelected(i);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 1000);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-50">
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 20%, rgba(167,139,250,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl">
        {/* Header */}
        <div
          className="mb-8 flex items-center justify-between animate-slide-up"
          style={{ opacity: mounted ? undefined : 0 }}
        >
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
              Student Founder
            </p>
            <h1 className="mt-2 text-3xl font-bold">Onboarding</h1>
          </div>
          <Link
            href="/"
            className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800 transition"
          >
            Home
          </Link>
        </div>

        {/* Step progress bar */}
        <div
          className="mb-8 flex items-center gap-0 animate-slide-up stagger-1"
          style={{ opacity: mounted ? undefined : 0 }}
        >
          {STEPS.map((step, i) => (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all duration-500"
                  style={{
                    background: i === 0
                      ? "linear-gradient(135deg, #22d3ee, #0891b2)"
                      : "rgba(51,65,85,0.8)",
                    boxShadow: i === 0
                      ? "0 0 12px rgba(34,211,238,0.4)"
                      : "none",
                    color: i === 0 ? "#020617" : "#64748b",
                    transform: i === 0 ? "scale(1.1)" : "scale(1)",
                  }}
                >
                  {i === 0 ? "1" : i + 1}
                </div>
                <span
                  className="text-xs hidden sm:block"
                  style={{ color: i === 0 ? "#e2e8f0" : "#475569" }}
                >
                  {step}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 mx-2 h-0.5 bg-slate-800 relative overflow-hidden">
                  {i === 0 && (
                    <div
                      className="absolute inset-y-0 left-0 bg-cyan-400 rounded-full"
                      style={{
                        width: selected !== null ? "50%" : "0%",
                        transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div
          className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl shadow-slate-950/30 animate-slide-up stagger-2"
          style={{
            opacity: mounted ? undefined : 0,
            boxShadow: "0 0 0 1px rgba(167,139,250,0.06), 0 25px 50px -12px rgba(0,0,0,0.5)",
          }}
        >
          <h2 className="text-2xl font-semibold">Tell us where you are</h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            We will guide you through the stages that match your current reality,
            without wasting time building before demand is validated.
          </p>

          {/* Options grid */}
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {options.map((option, i) => {
              const isSelected = selected === i;
              return (
                <button
                  key={option.label}
                  className="relative rounded-2xl border p-5 text-left transition-all duration-300 animate-pop-in overflow-hidden"
                  style={{
                    animationDelay: `${0.2 + i * 0.1}s`,
                    borderColor: isSelected
                      ? "rgba(34,211,238,0.6)"
                      : "rgba(51,65,85,0.8)",
                    background: isSelected
                      ? "rgba(34,211,238,0.08)"
                      : "rgba(15,23,42,0.8)",
                    boxShadow: isSelected
                      ? "0 0 20px rgba(34,211,238,0.2), inset 0 0 20px rgba(34,211,238,0.04)"
                      : "none",
                    transform: isSelected ? "scale(1.03)" : "scale(1)",
                  }}
                  onClick={() => handleSelect(i)}
                >
                  {/* Confetti burst inside card */}
                  {isSelected && <ConfettiBurst show={showConfetti} count={12} />}

                  {/* Selection ring indicator */}
                  {isSelected && (
                    <span
                      className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400 text-xs font-black text-slate-950"
                      style={{ animation: "popIn 0.3s both" }}
                    >
                      ✓
                    </span>
                  )}

                  <div
                    className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl text-2xl transition-all duration-300"
                    style={{
                      background: isSelected
                        ? "linear-gradient(135deg, rgba(34,211,238,0.3), rgba(34,211,238,0.1))"
                        : "rgba(30,41,59,0.8)",
                      boxShadow: isSelected
                        ? "0 0 12px rgba(34,211,238,0.3)"
                        : "none",
                    }}
                  >
                    {option.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white">{option.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{option.detail}</p>

                  {/* XP reward chip */}
                  <span
                    className="mt-3 inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-300"
                    style={{
                      opacity: isSelected ? 1 : 0.5,
                      transition: "opacity 0.3s",
                    }}
                  >
                    ⭐ {option.xp}
                  </span>
                </button>
              );
            })}
          </div>

          {/* CTA row */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/journey"
              className="relative rounded-full px-6 py-3 text-center font-semibold text-slate-950 transition-all duration-200 hover:scale-105"
              style={{
                background: selected !== null
                  ? "linear-gradient(135deg, #22d3ee, #06b6d4)"
                  : "rgba(34,211,238,0.5)",
                boxShadow: selected !== null
                  ? "0 0 20px rgba(34,211,238,0.4)"
                  : "none",
                animation: selected !== null ? "pulseGlow 2s ease-in-out infinite" : "none",
              }}
            >
              Continue →
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full border border-slate-700 px-6 py-3 text-center font-semibold text-slate-200 transition hover:bg-slate-800"
            >
              Skip for now
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
