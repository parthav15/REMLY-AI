import type { Reminder } from "../types";

export interface ReliabilityScore {
  percentage: number;
  label: string;
  answered: number;
  missed: number;
  pending: number;
}

export interface WeeklyBar {
  day: string;
  shortDay: string;
  count: number;
  isToday: boolean;
  date: Date;
}

export interface ProfileStats {
  reliability: ReliabilityScore;
  currentStreak: number;
  longestStreak: number;
  thisMonth: number;
  totalCallMinutes: number;
  mostActiveHour: string;
  weeklyActivity: WeeklyBar[];
}

function scoreLabel(pct: number): string {
  if (pct >= 90) return "Excellent";
  if (pct >= 70) return "Great";
  if (pct >= 50) return "Good";
  if (pct === 0) return "Not yet";
  return "Building";
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function daysBetween(a: Date, b: Date): number {
  const ms = startOfDay(a).getTime() - startOfDay(b).getTime();
  return Math.round(ms / 86400000);
}

function computeReliability(reminders: Reminder[]): ReliabilityScore {
  const answered = reminders.filter((r) => r.status === "answered").length;
  const missed = reminders.filter((r) => r.status === "missed").length;
  const pending = reminders.filter((r) => r.status === "pending" || r.status === "triggered").length;
  const total = answered + missed;
  const percentage = total === 0 ? 0 : Math.round((answered / total) * 100);
  return {
    percentage,
    label: scoreLabel(percentage),
    answered,
    missed,
    pending,
  };
}

function computeStreaks(reminders: Reminder[]): { current: number; longest: number } {
  const answeredDays = new Set<string>();
  for (const r of reminders) {
    if (r.status === "answered") {
      const d = startOfDay(new Date(r.scheduled_at));
      answeredDays.add(d.toISOString());
    }
  }
  if (answeredDays.size === 0) return { current: 0, longest: 0 };

  const sorted = Array.from(answeredDays)
    .map((s) => new Date(s))
    .sort((a, b) => a.getTime() - b.getTime());

  let longest = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    const gap = daysBetween(sorted[i], sorted[i - 1]);
    if (gap === 1) {
      run += 1;
      if (run > longest) longest = run;
    } else {
      run = 1;
    }
  }

  const today = startOfDay(new Date());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const latest = sorted[sorted.length - 1];
  const gapFromToday = daysBetween(today, latest);

  let current = 0;
  if (gapFromToday === 0 || gapFromToday === 1) {
    current = 1;
    for (let i = sorted.length - 2; i >= 0; i--) {
      const gap = daysBetween(sorted[i + 1], sorted[i]);
      if (gap === 1) current += 1;
      else break;
    }
  }

  return { current, longest };
}

function computeThisMonth(reminders: Reminder[]): number {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  return reminders.filter((r) => {
    const d = new Date(r.scheduled_at);
    return d.getFullYear() === y && d.getMonth() === m;
  }).length;
}

function computeMostActiveHour(reminders: Reminder[]): string {
  if (reminders.length === 0) return "—";
  const hourCounts: Record<number, number> = {};
  for (const r of reminders) {
    const h = new Date(r.scheduled_at).getHours();
    hourCounts[h] = (hourCounts[h] || 0) + 1;
  }
  let maxHour = 0;
  let maxCount = 0;
  for (const [hour, count] of Object.entries(hourCounts)) {
    if (count > maxCount) {
      maxCount = count;
      maxHour = parseInt(hour);
    }
  }
  if (maxHour === 0) return "12 AM";
  if (maxHour === 12) return "12 PM";
  if (maxHour < 12) return `${maxHour} AM`;
  return `${maxHour - 12} PM`;
}

function computeWeeklyActivity(reminders: Reminder[]): WeeklyBar[] {
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const shortNames = ["S", "M", "T", "W", "T", "F", "S"];
  const today = startOfDay(new Date());
  const todayIso = today.toISOString();
  const bars: WeeklyBar[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dayStart = startOfDay(d);
    const count = reminders.filter((r) => {
      const rd = startOfDay(new Date(r.scheduled_at));
      return rd.getTime() === dayStart.getTime();
    }).length;
    bars.push({
      day: dayNames[d.getDay()],
      shortDay: shortNames[d.getDay()],
      count,
      isToday: dayStart.toISOString() === todayIso,
      date: d,
    });
  }
  return bars;
}

export function computeProfileStats(reminders: Reminder[]): ProfileStats {
  const reliability = computeReliability(reminders);
  const { current, longest } = computeStreaks(reminders);
  const answeredMinutes = reliability.answered * 0.5;
  return {
    reliability,
    currentStreak: current,
    longestStreak: longest,
    thisMonth: computeThisMonth(reminders),
    totalCallMinutes: Math.round(answeredMinutes * 10) / 10,
    mostActiveHour: computeMostActiveHour(reminders),
    weeklyActivity: computeWeeklyActivity(reminders),
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  target: number;
}

export function computeAchievements(reminders: Reminder[], stats: ProfileStats): Achievement[] {
  const answered = stats.reliability.answered;
  const total = reminders.length;

  const hasMorning = reminders.some((r) => {
    const h = new Date(r.scheduled_at).getHours();
    return h >= 5 && h < 9;
  });
  const hasEvening = reminders.some((r) => {
    const h = new Date(r.scheduled_at).getHours();
    return h >= 21 || h < 5;
  });

  return [
    {
      id: "first_call",
      title: "First Call",
      description: "Answered your first reminder",
      icon: "trophy",
      unlocked: answered >= 1,
      progress: Math.min(answered, 1),
      target: 1,
    },
    {
      id: "early_bird",
      title: "Early Bird",
      description: "Set a reminder before 9 AM",
      icon: "sunny",
      unlocked: hasMorning,
      progress: hasMorning ? 1 : 0,
      target: 1,
    },
    {
      id: "night_owl",
      title: "Night Owl",
      description: "Set a reminder after 9 PM",
      icon: "moon",
      unlocked: hasEvening,
      progress: hasEvening ? 1 : 0,
      target: 1,
    },
    {
      id: "consistent",
      title: "Consistent",
      description: "7-day answer streak",
      icon: "flame",
      unlocked: stats.longestStreak >= 7,
      progress: Math.min(stats.longestStreak, 7),
      target: 7,
    },
    {
      id: "reliable",
      title: "Reliable",
      description: "90% answer rate (20+ calls)",
      icon: "shield-checkmark",
      unlocked: stats.reliability.percentage >= 90 && stats.reliability.answered + stats.reliability.missed >= 20,
      progress: Math.min(stats.reliability.answered + stats.reliability.missed, 20),
      target: 20,
    },
    {
      id: "veteran",
      title: "Veteran",
      description: "50 reminders created",
      icon: "medal",
      unlocked: total >= 50,
      progress: Math.min(total, 50),
      target: 50,
    },
  ];
}

export function formatMemberSince(dateJoined: string | undefined): string {
  if (!dateJoined) return "Recently joined";
  const d = new Date(dateJoined);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `Member since ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export function getUserTier(credits: number): { label: string; color: string } {
  if (credits >= 100) return { label: "VIP", color: "#7c3aed" };
  if (credits >= 50) return { label: "Pro", color: "#4f46e5" };
  return { label: "Starter", color: "#6b7280" };
}

export function getInitials(phoneNumber: string | undefined): string {
  if (!phoneNumber) return "?";
  const digits = phoneNumber.replace(/\D/g, "");
  if (digits.length < 2) return digits.toUpperCase() || "?";
  return digits.slice(-2);
}
