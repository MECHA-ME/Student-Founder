"use client";

import { useEffect, useState } from "react";
import { xpToLevel, levelProgress, xpForNextLevel, LEVEL_TITLES } from "@/lib/gamification";

interface XPBarProps {
  xp: number;
  className?: string;
}

export default function XPBar({ xp, className = "" }: XPBarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const level = xpToLevel(xp);
  const progress = levelProgress(xp);
  const nextLevelXp = xpForNextLevel(xp);
  const title = LEVEL_TITLES[level] ?? "Founder";

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Level badge */}
      <div
        className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl font-black text-slate-950 text-sm"
        style={{
          background: "linear-gradient(135deg, #a78bfa, #7c3aed)",
          boxShadow: mounted ? "0 0 16px rgba(167,139,250,0.5)" : "none",
          transition: "box-shadow 0.6s ease",
          animation: mounted ? "badgeGlow 2.5s ease-in-out infinite" : "none",
        }}
      >
        <span className="text-white font-extrabold">{level}</span>
      </div>

      {/* XP info + bar */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-violet-300 uppercase tracking-wider">
            {title}
          </span>
          <span className="text-xs text-slate-400 tabular-nums">
            {xp.toLocaleString()} / {nextLevelXp.toLocaleString()} XP
          </span>
        </div>

        {/* Progress track */}
        <div className="h-2.5 w-full rounded-full bg-slate-800/80 overflow-hidden">
          <div
            className="h-full rounded-full relative overflow-hidden"
            style={{
              width: mounted ? `${progress}%` : "0%",
              transition: "width 1.1s cubic-bezier(0.4, 0, 0.2, 1)",
              background: "linear-gradient(90deg, #7c3aed, #a78bfa, #c4b5fd)",
              backgroundSize: "200% 100%",
              animation: mounted ? "xpShimmer 2.5s linear infinite" : "none",
            }}
          >
            {/* Inner highlight */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 100%)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
