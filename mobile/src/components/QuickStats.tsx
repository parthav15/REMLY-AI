import React, { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import AnimatedPressable from "./AnimatedPressable";
import { COLORS } from "../constants";
import { Reminder } from "../types";

interface QuickStatsProps {
  reminders: Reminder[];
  activeFilter: string | null;
  onFilterChange: (status: string | null) => void;
}

const STATUS_COLOR_MAP: Record<string, string> = {
  pending: "text-indigo-600",
  triggered: "text-amber-600",
  answered: "text-emerald-600",
  missed: "text-red-500",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  triggered: "Triggered",
  answered: "Answered",
  missed: "Missed",
};

export default function QuickStats({
  reminders,
  activeFilter,
  onFilterChange,
}: QuickStatsProps) {
  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const r of reminders) {
      map[r.status] = (map[r.status] || 0) + 1;
    }
    return map;
  }, [reminders]);

  const statuses = (
    ["pending", "triggered", "answered", "missed"] as const
  ).filter((s) => (counts[s] || 0) > 0);

  return (
    <Animated.View entering={FadeIn} className="px-4 py-2">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        {/* All chip */}
        <AnimatedPressable
          scaleValue={0.95}
          onPress={() => onFilterChange(null)}
          className={`rounded-full px-4 py-2 ${
            activeFilter === null
              ? "bg-indigo-600"
              : "bg-white border border-gray-200"
          }`}
        >
          <Text
            className={`text-sm font-medium ${
              activeFilter === null ? "text-white" : "text-gray-600"
            }`}
          >
            {reminders.length} All
          </Text>
        </AnimatedPressable>

        {/* Status chips */}
        {statuses.map((status) => {
          const isActive = activeFilter === status;
          return (
            <AnimatedPressable
              key={status}
              scaleValue={0.95}
              onPress={() => onFilterChange(status)}
              className={`rounded-full px-4 py-2 ${
                isActive
                  ? "bg-indigo-600"
                  : "bg-white border border-gray-200"
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  isActive ? "text-white" : STATUS_COLOR_MAP[status]
                }`}
              >
                {counts[status]} {STATUS_LABELS[status]}
              </Text>
            </AnimatedPressable>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
}
