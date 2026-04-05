import React, { useMemo } from "react";
import { View, Text } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants";
import { Reminder } from "../types";

interface ActivitySummaryProps {
  reminders: Reminder[];
}

function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday as start of week
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + diff);
  return d;
}

function getEndOfWeek(date: Date): Date {
  const start = getStartOfWeek(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

function calculateStreak(reminders: Reminder[]): number {
  const answered = reminders.filter((r) => r.status === "answered");
  if (answered.length === 0) return 0;

  const answeredDates = new Set(
    answered.map((r) => {
      const d = new Date(r.updated_at);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    })
  );

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 365; i++) {
    const check = new Date(today);
    check.setDate(check.getDate() - i);
    const key = `${check.getFullYear()}-${check.getMonth()}-${check.getDate()}`;
    if (answeredDates.has(key)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export default function ActivitySummary({ reminders }: ActivitySummaryProps) {
  const { completedThisWeek, totalThisWeek, streak } = useMemo(() => {
    const now = new Date();
    const weekStart = getStartOfWeek(now);
    const weekEnd = getEndOfWeek(now);

    const totalThisWeek = reminders.filter((r) => {
      const scheduled = new Date(r.scheduled_at);
      return scheduled >= weekStart && scheduled <= weekEnd;
    }).length;

    const completedThisWeek = reminders.filter((r) => {
      const updated = new Date(r.updated_at);
      return (
        r.status === "answered" && updated >= weekStart && updated <= weekEnd
      );
    }).length;

    const streak = calculateStreak(reminders);

    return { completedThisWeek, totalThisWeek, streak };
  }, [reminders]);

  if (totalThisWeek === 0) return null;

  return (
    <Animated.View entering={FadeIn} className="mx-4 mb-2">
      <View className="bg-indigo-50 rounded-2xl p-4 flex-row">
        {/* Completed */}
        <View className="flex-1 items-center">
          <Ionicons name="checkmark-circle" size={24} color="#10b981" />
          <Text className="text-lg font-bold text-gray-800 mt-1">
            {completedThisWeek}
          </Text>
          <Text className="text-xs text-gray-500">Completed</Text>
        </View>

        {/* Streak */}
        <View className="flex-1 items-center">
          <Ionicons name="flame" size={24} color="#f59e0b" />
          <Text className="text-lg font-bold text-gray-800 mt-1">
            {streak}d
          </Text>
          <Text className="text-xs text-gray-500">Streak</Text>
        </View>

        {/* This Week */}
        <View className="flex-1 items-center">
          <Ionicons name="bar-chart" size={24} color={COLORS.brand} />
          <Text className="text-lg font-bold text-gray-800 mt-1">
            {totalThisWeek}
          </Text>
          <Text className="text-xs text-gray-500">This Week</Text>
        </View>
      </View>
    </Animated.View>
  );
}
