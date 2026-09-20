// ─── XP & Level System ────────────────────────────────────────────────────────

export const LEVEL_THRESHOLDS = [0, 100, 250, 500, 900, 1400, 2100, 3000, 4200, 5800, 8000];

export function xpToLevel(xp: number): number {
  let level = 1;
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1;
    else break;
  }
  return Math.min(level, LEVEL_THRESHOLDS.length);
}

export function xpForCurrentLevel(xp: number): number {
  const level = xpToLevel(xp);
  return LEVEL_THRESHOLDS[level - 1];
}

export function xpForNextLevel(xp: number): number {
  const level = xpToLevel(xp);
  return LEVEL_THRESHOLDS[level] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
}

export function levelProgress(xp: number): number {
  const curr = xpForCurrentLevel(xp);
  const next = xpForNextLevel(xp);
  if (next === curr) return 100;
  return Math.round(((xp - curr) / (next - curr)) * 100);
}

export const LEVEL_TITLES: Record<number, string> = {
  1:  "Idea Seed",
  2:  "Problem Scout",
  3:  "Interview Rookie",
  4:  "Evidence Hunter",
  5:  "Validation Ninja",
  6:  "Solution Architect",
  7:  "Builder",
  8:  "Launch Pilot",
  9:  "Growth Hacker",
  10: "Founder",
};

// ─── Stage XP Rewards ─────────────────────────────────────────────────────────

export const STAGE_XP_REWARDS: Record<string, number> = {
  task_complete:        25,
  interview_logged:     50,
  evidence_added:       40,
  stage_passed:        200,
  outside_bubble:       75,
  bias_check:           60,
  problem_statement:    80,
  prototype_audit:      90,
  deployment_done:     300,
  first_user:          250,
  daily_login:          15,
  streak_bonus_7:      100,
  streak_bonus_30:     500,
};

// ─── Achievements ─────────────────────────────────────────────────────────────

export type Achievement = {
  id: string;
  icon: string;
  name: string;
  description: string;
  xpReward: number;
  rarity: "common" | "rare" | "epic" | "legendary";
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_interview",
    icon: "🎤",
    name: "First Voice",
    description: "Logged your first user interview",
    xpReward: 50,
    rarity: "common",
  },
  {
    id: "five_interviews",
    icon: "🗣️",
    name: "People Person",
    description: "Logged 5 interviews",
    xpReward: 100,
    rarity: "common",
  },
  {
    id: "outside_bubble",
    icon: "🌍",
    name: "Outside the Bubble",
    description: "Interviewed someone outside your campus network",
    xpReward: 150,
    rarity: "rare",
  },
  {
    id: "bias_buster",
    icon: "🧠",
    name: "Bias Buster",
    description: "Completed a bias check on your interview data",
    xpReward: 100,
    rarity: "rare",
  },
  {
    id: "gate_s1",
    icon: "🚪",
    name: "Gate Crasher S1",
    description: "Passed the Problem stage gate",
    xpReward: 200,
    rarity: "epic",
  },
  {
    id: "gate_s2",
    icon: "🏆",
    name: "Gate Crasher S2",
    description: "Passed the Validation stage gate",
    xpReward: 300,
    rarity: "epic",
  },
  {
    id: "streak_7",
    icon: "🔥",
    name: "On Fire",
    description: "7-day action streak",
    xpReward: 100,
    rarity: "rare",
  },
  {
    id: "streak_30",
    icon: "⚡",
    name: "Unstoppable",
    description: "30-day action streak",
    xpReward: 500,
    rarity: "legendary",
  },
  {
    id: "first_deploy",
    icon: "🚀",
    name: "Launched",
    description: "Deployed your first working product",
    xpReward: 300,
    rarity: "epic",
  },
  {
    id: "first_user",
    icon: "👤",
    name: "Not Just Your Mom",
    description: "Acquired your first real user outside your team",
    xpReward: 250,
    rarity: "legendary",
  },
];

export const RARITY_COLORS: Record<Achievement["rarity"], string> = {
  common:    "border-slate-600 bg-slate-800 text-slate-200",
  rare:      "border-cyan-500/50 bg-cyan-500/10 text-cyan-200",
  epic:      "border-violet-500/50 bg-violet-500/10 text-violet-200",
  legendary: "border-amber-500/50 bg-amber-500/10 text-amber-200",
};

export const RARITY_GLOW: Record<Achievement["rarity"], string> = {
  common:    "none",
  rare:      "0 0 16px rgba(34,211,238,0.3)",
  epic:      "0 0 20px rgba(167,139,250,0.35)",
  legendary: "0 0 24px rgba(245,158,11,0.4)",
};

// ─── Demo state (used when no backend) ───────────────────────────────────────

export const DEMO_GAME_STATE = {
  xp: 480,
  streak: 4,
  unlockedAchievements: ["first_interview", "five_interviews", "gate_s1"],
};
