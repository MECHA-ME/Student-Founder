"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import TypewriterText from "@/components/TypewriterText";
import ConfettiBurst from "@/components/ConfettiBurst";
import GateUnlockModal from "@/components/GateUnlockModal";
import { STAGE_XP_REWARDS } from "@/lib/gamification";

type Stage = {
  code: string;
  name: string;
  status: string;
  description: string;
  tasks: string[];
};

const fallbackStages: Stage[] = [
  {
    code: "S0",
    name: "Readiness",
    status: "passed",
    description: "Clarify your constraints, goals, and weekly capacity before building.",
    tasks: ["Confirm your available hours", "List your strengths and gaps", "Set a safe-fail plan"],
  },
  {
    code: "S1",
    name: "Problem",
    status: "in_progress",
    description: "Define the real pain point and show why it is worth solving now.",
    tasks: ["Write a problem statement", "List current alternatives", "Map severity and frequency"],
  },
  {
    code: "S2",
    name: "Validation",
    status: "locked",
    description: "Gather evidence from interviews, waitlists, and usage signals.",
    tasks: ["Schedule 5 more interviews", "Review leading-question bias", "Cluster interview evidence"],
  },
  {
    code: "S3",
    name: "Solution",
    status: "locked",
    description: "Refine the product and prioritize the smallest valuable release.",
    tasks: ["Map competitors", "Define a first release", "Write the product brief"],
  },
];

type TaskState = Record<string, boolean>;

export default function JourneyPage() {
  const [stages, setStages] = useState<Stage[]>(fallbackStages);
  const [coachMessage, setCoachMessage] = useState(
    "Your most valuable next step is to run one more outside-bubble interview and compare it against your current assumptions."
  );
  const [mounted, setMounted] = useState(false);
  const [tasksDone, setTasksDone] = useState<TaskState>({});
  const [confettiFor, setConfettiFor] = useState<string | null>(null);
  const [gateUnlock, setGateUnlock] = useState<{ stage: Stage; xp: number } | null>(null);
  const [totalXpGained, setTotalXpGained] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/v1/journey")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data?.stages)) setStages(data.stages);
        if (data?.coach_message) setCoachMessage(data.coach_message);
      })
      .catch(() => undefined);
  }, []);

  function handleTaskToggle(stageCode: string, task: string) {
    const key = `${stageCode}::${task}`;
    if (tasksDone[key]) return; // already done

    setTasksDone((prev) => ({ ...prev, [key]: true }));
    setConfettiFor(key);
    setTotalXpGained((x) => x + STAGE_XP_REWARDS.task_complete);
    setTimeout(() => setConfettiFor(null), 900);
  }

  function handleUnlockGate(stage: Stage) {
    setGateUnlock({ stage, xp: STAGE_XP_REWARDS.stage_passed });
  }

  const completedCount = Object.values(tasksDone).filter(Boolean).length;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-50">
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 30% 20%, rgba(34,211,238,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Gate unlock modal */}
      {gateUnlock && (
        <GateUnlockModal
          stageName={gateUnlock.stage.name}
          stageCode={gateUnlock.stage.code}
          xpReward={gateUnlock.xp}
          onClose={() => setGateUnlock(null)}
        />
      )}

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Header */}
        <header
          className="mb-6 flex items-center justify-between animate-slide-up"
          style={{ opacity: mounted ? undefined : 0 }}
        >
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
              Student Founder
            </p>
            <h1 className="mt-2 text-3xl font-bold">Your founder journey</h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Live XP tracker */}
            {totalXpGained > 0 && (
              <span
                className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-sm font-bold text-amber-300 animate-pop-in"
              >
                ⭐ +{totalXpGained} XP earned
              </span>
            )}
            {completedCount > 0 && (
              <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-sm font-semibold text-emerald-300 animate-pop-in">
                ✓ {completedCount} tasks done
              </span>
            )}
            <Link
              href="/dashboard"
              className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
            >
              Dashboard
            </Link>
          </div>
        </header>

        {/* Coach card with typewriter */}
        <section
          className="mb-8 rounded-3xl border border-cyan-500/20 bg-cyan-500/5 p-6 animate-slide-up stagger-1"
          style={{
            opacity: mounted ? undefined : 0,
            boxShadow: "0 0 30px rgba(34,211,238,0.06)",
          }}
        >
          <div className="flex items-start gap-3 mb-3">
            <span
              className="text-2xl"
              style={{ animation: "orbFloat 3s ease-in-out infinite" }}
            >
              🤖
            </span>
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-200 pt-1">
              Coach note
            </p>
          </div>
          <TypewriterText
            text={coachMessage}
            speed={24}
            startDelay={600}
            className="text-xl leading-8 text-white block max-w-3xl"
          />
        </section>

        {/* Stages */}
        <section className="space-y-5">
          {stages.map((stage, index) => {
            const isPassed = stage.status === "passed";
            const isCurrent = stage.status === "in_progress";
            const isLocked = stage.status === "locked";

            // Count tasks done in this stage
            const stageDoneCount = stage.tasks.filter((t) =>
              tasksDone[`${stage.code}::${t}`]
            ).length;
            const allTasksDone = stageDoneCount === stage.tasks.length;

            return (
              <article
                key={stage.code}
                className="rounded-3xl border p-6 animate-slide-up transition-all duration-300"
                style={{
                  animationDelay: `${0.2 + index * 0.12}s`,
                  opacity: mounted ? undefined : 0,
                  borderColor: isCurrent
                    ? "rgba(34,211,238,0.4)"
                    : isPassed
                    ? "rgba(74,222,128,0.2)"
                    : "rgba(51,65,85,0.5)",
                  background: isCurrent
                    ? "rgba(15,23,42,0.95)"
                    : isPassed
                    ? "rgba(15,23,42,0.7)"
                    : "rgba(15,23,42,0.4)",
                  boxShadow: isCurrent
                    ? "0 0 30px rgba(34,211,238,0.06), inset 0 0 30px rgba(34,211,238,0.02)"
                    : "none",
                  // Shimmer for locked
                  backgroundImage: isLocked
                    ? "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.02) 50%, transparent 60%)"
                    : undefined,
                  backgroundSize: isLocked ? "200% 100%" : undefined,
                  animation:
                    isLocked && mounted
                      ? `slideUp 0.5s ${0.2 + index * 0.12}s both, shimmer 4s linear infinite`
                      : mounted
                      ? `slideUp 0.5s ${0.2 + index * 0.12}s both`
                      : undefined,
                }}
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-start">
                  {/* Stage badge */}
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-bold transition-all"
                    style={{
                      background: isPassed
                        ? "linear-gradient(135deg, #4ade80, #16a34a)"
                        : isCurrent
                        ? "linear-gradient(135deg, #22d3ee, #0891b2)"
                        : "rgba(51,65,85,0.6)",
                      color: isLocked ? "#475569" : "#020617",
                      boxShadow: isPassed
                        ? "0 0 14px rgba(74,222,128,0.4)"
                        : isCurrent
                        ? "0 0 14px rgba(34,211,238,0.4)"
                        : "none",
                      animation:
                        isCurrent ? "badgeGlow 2.5s ease-in-out infinite" : "none",
                    }}
                  >
                    {isPassed ? "✓" : isLocked ? "🔒" : index + 1}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                          {stage.code}
                        </p>
                        <h2 className="mt-0.5 text-2xl font-semibold text-white">
                          {stage.name}
                        </h2>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Stage task progress */}
                        {(isCurrent || isPassed) && (
                          <span className="text-xs text-slate-400">
                            {stageDoneCount}/{stage.tasks.length} tasks
                          </span>
                        )}
                        <span
                          className="rounded-full px-3 py-1 text-xs font-medium"
                          style={{
                            background: isPassed
                              ? "rgba(74,222,128,0.1)"
                              : isCurrent
                              ? "rgba(34,211,238,0.1)"
                              : "rgba(51,65,85,0.4)",
                            color: isPassed
                              ? "#4ade80"
                              : isCurrent
                              ? "#22d3ee"
                              : "#475569",
                          }}
                        >
                          {isPassed ? "✓ Passed" : isCurrent ? "In progress" : "Locked"}
                        </span>
                      </div>
                    </div>

                    <p className="max-w-2xl text-slate-300 mb-5">{stage.description}</p>

                    {/* Task items */}
                    <div className="grid gap-3 md:grid-cols-3">
                      {stage.tasks.map((task) => {
                        const key = `${stage.code}::${task}`;
                        const done = tasksDone[key] || isPassed;
                        const isConfetti = confettiFor === key;

                        return (
                          <button
                            key={task}
                            disabled={isLocked || isPassed}
                            onClick={() => !isLocked && !isPassed && handleTaskToggle(stage.code, task)}
                            className="relative rounded-xl border px-4 py-3 text-sm text-left transition-all duration-300 overflow-hidden"
                            style={{
                              borderColor: done
                                ? "rgba(74,222,128,0.4)"
                                : isCurrent
                                ? "rgba(51,65,85,0.8)"
                                : "rgba(30,41,59,0.5)",
                              background: done
                                ? "rgba(74,222,128,0.08)"
                                : "rgba(15,23,42,0.6)",
                              color: done ? "#4ade80" : isLocked ? "#475569" : "#cbd5e1",
                              transform: done ? "scale(1)" : undefined,
                              cursor: isLocked || isPassed ? "default" : "pointer",
                            }}
                          >
                            {/* Confetti inside task card */}
                            <ConfettiBurst show={isConfetti} count={10} />

                            <div className="flex items-start gap-2">
                              <span
                                className="mt-0.5 shrink-0 transition-all duration-300"
                                style={{
                                  animation: done && !isPassed ? "taskComplete 0.4s both" : "none",
                                }}
                              >
                                {done ? "✅" : isLocked ? "🔒" : "○"}
                              </span>
                              <span className={done ? "line-through opacity-60" : ""}>{task}</span>
                            </div>

                            {/* Ping on completion */}
                            {done && !isPassed && (
                              <span
                                className="absolute inset-0 rounded-xl border-2 border-emerald-400"
                                style={{ animation: "checkPing 0.6s ease-out both" }}
                                aria-hidden
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Unlock gate button — only show for current stage when tasks done */}
                    {isCurrent && allTasksDone && (
                      <button
                        onClick={() => handleUnlockGate(stage)}
                        className="mt-5 flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold text-slate-950 transition-all hover:scale-105 animate-pop-in"
                        style={{
                          background: "linear-gradient(135deg, #22d3ee, #06b6d4)",
                          boxShadow: "0 0 20px rgba(34,211,238,0.4)",
                          animation: "pulseGlow 2s ease-in-out infinite",
                        }}
                      >
                        🚀 Unlock stage gate
                        <span className="rounded-full bg-amber-400 px-2 py-0.5 text-xs font-black text-slate-950">
                          +{STAGE_XP_REWARDS.stage_passed} XP
                        </span>
                      </button>
                    )}

                    {/* XP reward chip for active tasks */}
                    {isCurrent && !allTasksDone && (
                      <p className="mt-4 text-xs text-slate-500">
                        ⭐ +{STAGE_XP_REWARDS.task_complete} XP per task completed
                      </p>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
