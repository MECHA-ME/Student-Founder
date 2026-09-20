"use client";

import { useEffect, useState } from "react";
import { type Achievement, RARITY_COLORS, RARITY_GLOW } from "@/lib/gamification";

interface AchievementBadgeProps {
  achievement: Achievement;
  /** If true, plays the unlock animation */
  isNew?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function AchievementBadge({
  achievement,
  isNew = false,
  size = "md",
}: AchievementBadgeProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const sizeClasses = {
    sm: "p-3 rounded-xl",
    md: "p-4 rounded-2xl",
    lg: "p-5 rounded-3xl",
  };

  const iconSizes = {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-4xl",
  };

  const rarityClass = RARITY_COLORS[achievement.rarity];
  const rarityGlow  = RARITY_GLOW[achievement.rarity];

  return (
    <div
      className={`
        border ${rarityClass} ${sizeClasses[size]}
        flex flex-col items-center gap-2 text-center
        transition-all duration-300 cursor-default select-none
      `}
      style={{
        boxShadow: visible ? rarityGlow : "none",
        animation: isNew && visible ? "badgeUnlock 0.6s cubic-bezier(0.34,1.56,0.64,1) both" : "none",
        opacity: visible ? 1 : 0,
        transform: visible && !isNew ? "scale(1)" : undefined,
      }}
      title={achievement.description}
    >
      <span
        className={iconSizes[size]}
        style={{
          animation:
            isNew && visible
              ? "badgeGlow 2s ease-in-out infinite 0.6s"
              : undefined,
          display: "inline-block",
        }}
      >
        {achievement.icon}
      </span>

      {size !== "sm" && (
        <>
          <p className="text-xs font-bold leading-tight">{achievement.name}</p>
          {size === "lg" && (
            <p className="text-xs opacity-70 leading-snug max-w-[120px]">
              {achievement.description}
            </p>
          )}
        </>
      )}

      {/* Rarity pip */}
      <span
        className={`text-[9px] uppercase tracking-widest font-semibold opacity-60`}
      >
        {achievement.rarity}
      </span>
    </div>
  );
}
