"use client";

import { useEffect, useState } from "react";

interface GateUnlockModalProps {
  stageName: string;
  stageCode: string;
  xpReward: number;
  onClose: () => void;
}

const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  angle: (i / 24) * 360,
  distance: 80 + Math.random() * 60,
  color: ["#22d3ee", "#a78bfa", "#f59e0b", "#4ade80", "#f43f5e"][i % 5],
  size: 4 + Math.random() * 6,
  delay: Math.random() * 0.3,
}));

export default function GateUnlockModal({
  stageName,
  stageCode,
  xpReward,
  onClose,
}: GateUnlockModalProps) {
  const [phase, setPhase] = useState<"ring" | "reveal" | "done">("ring");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("reveal"), 700);
    return () => clearTimeout(t1);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "rgba(2, 6, 23, 0.92)",
        backdropFilter: "blur(12px)",
        animation: "gateOverlayIn 0.3s ease-out both",
      }}
      onClick={onClose}
      role="dialog"
      aria-modal
      aria-label={`${stageName} stage unlocked`}
    >
      <div
        className="relative flex flex-col items-center gap-6 px-8 py-10 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Expanding rings */}
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="absolute rounded-full border border-cyan-400"
            style={{
              width: 160,
              height: 160,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              animation: `gateRingExpand 1.5s ease-out ${i * 0.25}s both`,
            }}
          />
        ))}

        {/* Particle burst */}
        {PARTICLES.map((p) => (
          <span
            key={p.id}
            style={{
              position: "absolute",
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: p.color,
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%)`,
              animation: `none`,
              boxShadow: `0 0 6px ${p.color}`,
              transition: `all 0.9s cubic-bezier(0.1, 0.6, 0.3, 1) ${p.delay + 0.1}s`,
              // We animate via CSS transform manually
              marginTop: phase !== "ring"
                ? `${Math.sin((p.angle * Math.PI) / 180) * p.distance}px`
                : 0,
              marginLeft: phase !== "ring"
                ? `${Math.cos((p.angle * Math.PI) / 180) * p.distance}px`
                : 0,
              opacity: phase === "done" ? 0 : 1,
            }}
          />
        ))}

        {/* Main content */}
        <div
          style={{
            animation:
              phase === "reveal"
                ? "gateTextReveal 0.6s cubic-bezier(0.34,1.56,0.64,1) both"
                : "none",
            opacity: phase === "ring" ? 0 : 1,
          }}
        >
          {/* Gate icon */}
          <div
            className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-3xl text-5xl"
            style={{
              background: "linear-gradient(135deg, #0e7490, #22d3ee)",
              boxShadow: "0 0 40px rgba(34,211,238,0.5), 0 0 80px rgba(34,211,238,0.2)",
              animation: "badgeGlow 2s ease-in-out infinite",
            }}
          >
            🚪
          </div>

          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300 mb-2">{stageCode}</p>
          <h2 className="text-4xl font-black text-white mb-1">{stageName}</h2>
          <p className="text-slate-300 text-lg mb-2">Stage Unlocked!</p>

          {/* XP reward */}
          <div
            className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-2 mb-6"
            style={{ animation: "popIn 0.5s 0.3s both" }}
          >
            <span className="text-xl">⭐</span>
            <span className="text-amber-300 font-bold text-lg">+{xpReward} XP</span>
          </div>

          <p className="text-slate-400 text-sm mb-6 max-w-xs mx-auto">
            You&apos;ve unlocked the next stage. Keep pushing—evidence is everything.
          </p>

          <button
            onClick={onClose}
            className="rounded-full bg-cyan-400 px-8 py-3 font-bold text-slate-950 transition hover:bg-cyan-300 hover:scale-105"
            style={{ transition: "all 0.2s ease" }}
          >
            Continue journey →
          </button>
        </div>
      </div>
    </div>
  );
}
