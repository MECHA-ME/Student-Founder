"use client";

import { useEffect, useState } from "react";

interface StreakBadgeProps {
  streak: number;
  className?: string;
}

export default function StreakBadge({ streak, className = "" }: StreakBadgeProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 200);
    return () => clearTimeout(t);
  }, []);

  const isHot = streak >= 3;
  const isEpic = streak >= 7;

  return (
    <div
      className={`
        flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold
        border transition-all duration-500
        ${isEpic
          ? "border-amber-500/50 bg-amber-500/10 text-amber-300"
          : isHot
          ? "border-orange-500/40 bg-orange-500/10 text-orange-300"
          : "border-slate-700 bg-slate-800/60 text-slate-400"
        }
        ${className}
      `}
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "scale(1)" : "scale(0.8)",
        transition: "opacity 0.4s ease, transform 0.4s cubic-bezier(0.34,1.56,0.64,1)",
      }}
    >
      {/* Flame icon */}
      <span
        className="text-base leading-none"
        style={{
          display: "inline-block",
          animation: isHot
            ? "streakPulse 1.5s ease-in-out infinite"
            : "none",
          filter: isEpic
            ? "drop-shadow(0 0 6px #f59e0b)"
            : isHot
            ? "drop-shadow(0 0 4px #f97316)"
            : "none",
        }}
      >
        {isEpic ? "⚡" : "🔥"}
      </span>

      <span className="tabular-nums leading-none">{streak}d</span>

      {/* Pulse ring for epic streaks */}
      {isEpic && (
        <span
          className="absolute inset-0 rounded-full border border-amber-400"
          style={{
            animation: "orbPulseRing 1.8s ease-out infinite",
          }}
        />
      )}
    </div>
  );
}
