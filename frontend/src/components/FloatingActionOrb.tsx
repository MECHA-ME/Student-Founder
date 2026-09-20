"use client";

import { useEffect, useState } from "react";

interface FloatingActionOrbProps {
  label: string;
  onClick?: () => void;
  /** Icon emoji */
  icon?: string;
}

export default function FloatingActionOrb({
  label,
  onClick,
  icon = "⚡",
}: FloatingActionOrbProps) {
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // Delay mount animation
    const t = setTimeout(() => setMounted(true), 600);
    // Auto-expand after 3s to show label
    const t2 = setTimeout(() => setExpanded(true), 3000);
    // Collapse after brief show
    const t3 = setTimeout(() => setExpanded(false), 6000);
    return () => { clearTimeout(t); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div
      className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2"
      style={{
        opacity: mounted ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}
    >
      {/* Tooltip label */}
      <div
        className="rounded-2xl border border-slate-700 bg-slate-900/95 px-4 py-2.5 text-sm text-slate-200 backdrop-blur-sm shadow-xl max-w-[240px] text-right"
        style={{
          opacity: hovered || expanded ? 1 : 0,
          transform: hovered || expanded ? "translateY(0) scale(1)" : "translateY(6px) scale(0.95)",
          transition: "opacity 0.25s ease, transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
          pointerEvents: "none",
        }}
      >
        <p className="text-xs uppercase tracking-wider text-cyan-300 mb-0.5 font-semibold">
          Next action
        </p>
        <p className="leading-snug">{label}</p>
      </div>

      {/* Orb button */}
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex h-14 w-14 items-center justify-center rounded-2xl text-slate-950 font-bold text-xl"
        style={{
          background: "linear-gradient(135deg, #06b6d4, #22d3ee)",
          boxShadow: hovered
            ? "0 0 0 4px rgba(34,211,238,0.25), 0 8px 30px rgba(34,211,238,0.4)"
            : "0 0 0 0 transparent, 0 4px 20px rgba(34,211,238,0.3)",
          animation: mounted ? "orbFloat 3s ease-in-out infinite" : "none",
          transition: "box-shadow 0.3s ease, transform 0.2s ease",
          transform: hovered ? "scale(1.1)" : "scale(1)",
        }}
        aria-label={`Next action: ${label}`}
      >
        {/* Pulse ring */}
        <span
          className="absolute inset-0 rounded-2xl border-2 border-cyan-400"
          style={{
            animation: "orbPulseRing 2s ease-out infinite",
          }}
          aria-hidden
        />
        <span className="relative z-10">{icon}</span>
      </button>
    </div>
  );
}
